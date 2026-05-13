import { Router } from 'express';
import { q } from '../db.js';
import { authRequired } from '../middleware/auth.js';
import { sendEmail, cruiseConfirmationEmail } from '../lib/email.js';

export const cruisesRouter = Router();

const intParam = (s) => {
  const n = Number.parseInt(s, 10);
  return Number.isInteger(n) && n > 0 ? n : null;
};

// ── Listing ────────────────────────────────────────────────────────────
// GET /api/cruises?period=upcoming|past|all  (default: upcoming)
cruisesRouter.get('/', async (req, res) => {
  const period = String(req.query.period || 'upcoming').toLowerCase();
  let where = 'WHERE event_date >= CURRENT_DATE';
  let order = 'event_date ASC';
  if (period === 'past') { where = 'WHERE event_date < CURRENT_DATE'; order = 'event_date DESC'; }
  else if (period === 'all') { where = ''; order = 'event_date DESC'; }

  const { rows } = await q(
    `SELECT id,
            TO_CHAR(event_date, 'YYYY-MM-DD') AS event_date,
            EXTRACT(DAY   FROM event_date)::int AS day,
            EXTRACT(MONTH FROM event_date)::int AS month,
            EXTRACT(YEAR  FROM event_date)::int AS year,
            name, subtitle, route, status, spots_left,
            distance_km, duration,
            event_date < CURRENT_DATE AS is_past
     FROM cruises ${where}
     ORDER BY ${order}`
  );
  res.json({ cruises: rows });
});

// ── My registrations (specific path BEFORE /:id) ───────────────────────
cruisesRouter.get('/registrations/mine', authRequired, async (req, res) => {
  const { rows } = await q(
    `SELECT c.id,
            TO_CHAR(c.event_date, 'YYYY-MM-DD') AS event_date,
            EXTRACT(DAY   FROM c.event_date)::int AS day,
            EXTRACT(MONTH FROM c.event_date)::int AS month,
            EXTRACT(YEAR  FROM c.event_date)::int AS year,
            c.name, c.subtitle, c.route, c.status, c.spots_left,
            c.distance_km, c.duration,
            c.event_date < CURRENT_DATE AS is_past,
            r.created_at AS registered_at
     FROM cruise_registrations r
     JOIN cruises c ON c.id = r.cruise_id
     WHERE r.user_id = $1
     ORDER BY c.event_date DESC`,
    [req.userId]
  );
  res.json({ cruises: rows });
});

// ── Cruise detail ──────────────────────────────────────────────────────
cruisesRouter.get('/:id', async (req, res) => {
  const id = intParam(req.params.id);
  if (!id) return res.status(400).json({ error: 'Vigane ID.' });
  const { rows } = await q(
    `SELECT id,
            TO_CHAR(event_date, 'YYYY-MM-DD') AS event_date,
            EXTRACT(DAY   FROM event_date)::int AS day,
            EXTRACT(MONTH FROM event_date)::int AS month,
            EXTRACT(YEAR  FROM event_date)::int AS year,
            name, subtitle, route, status, spots_left,
            description, distance_km, duration, start_time, start_place,
            itinerary, included, price,
            event_date < CURRENT_DATE AS is_past
     FROM cruises
     WHERE id = $1`,
    [id]
  );
  if (!rows.length) return res.status(404).json({ error: 'Sõitu ei leitud.' });
  res.json({ cruise: rows[0] });
});

// ── Is the current user registered? ────────────────────────────────────
cruisesRouter.get('/:id/registration', authRequired, async (req, res) => {
  const id = intParam(req.params.id);
  if (!id) return res.status(400).json({ error: 'Vigane ID.' });
  const { rows } = await q(
    'SELECT 1 FROM cruise_registrations WHERE cruise_id = $1 AND user_id = $2',
    [id, req.userId]
  );
  res.json({ registered: rows.length > 0 });
});

// ── Register for cruise ────────────────────────────────────────────────
cruisesRouter.post('/:id/register', authRequired, async (req, res) => {
  const id = intParam(req.params.id);
  if (!id) return res.status(400).json({ error: 'Vigane ID.' });

  const { rows: cruiseRows } = await q(
    `SELECT id,
            TO_CHAR(event_date, 'YYYY-MM-DD') AS event_date,
            EXTRACT(DAY   FROM event_date)::int AS day,
            EXTRACT(MONTH FROM event_date)::int AS month,
            EXTRACT(YEAR  FROM event_date)::int AS year,
            name, subtitle, route, status, spots_left, start_time, start_place,
            event_date < CURRENT_DATE AS is_past
     FROM cruises WHERE id = $1`,
    [id]
  );
  if (!cruiseRows.length) return res.status(404).json({ error: 'Sõitu ei leitud.' });
  const cruise = cruiseRows[0];

  if (cruise.is_past) return res.status(409).json({ error: 'Sõit on möödas.' });
  if (cruise.status === 'closed') return res.status(409).json({ error: 'Registreerimine on suletud.' });
  if (cruise.status === 'full' || cruise.spots_left === 0) {
    return res.status(409).json({ error: 'Sõit on täis.' });
  }

  const { rows: userRows } = await q(
    'SELECT id, first_name, email FROM users WHERE id = $1',
    [req.userId]
  );
  if (!userRows.length) return res.status(401).json({ error: 'Kasutajat ei leitud.' });
  const user = userRows[0];

  try {
    await q(
      'INSERT INTO cruise_registrations (cruise_id, user_id) VALUES ($1, $2)',
      [id, req.userId]
    );
  } catch (e) {
    if (e.code === '23505') {
      return res.status(409).json({ error: 'Oled juba sellele sõidule registreeritud.' });
    }
    throw e;
  }

  // If the cruise tracks remaining spots, decrement and flip to 'full' at zero.
  if (typeof cruise.spots_left === 'number' && cruise.spots_left > 0) {
    await q(
      `UPDATE cruises
         SET spots_left = spots_left - 1,
             status = CASE WHEN spots_left - 1 <= 0 THEN 'full' ELSE status END
       WHERE id = $1`,
      [id]
    );
  }

  // Send confirmation email (best effort).
  try {
    const msg = cruiseConfirmationEmail({ user, cruise });
    await sendEmail({ to: user.email, ...msg });
  } catch (e) {
    console.error('confirmation email failed:', e?.message || e);
  }

  res.status(201).json({ ok: true, registered: true });
});

// ── Cancel registration ────────────────────────────────────────────────
cruisesRouter.delete('/:id/register', authRequired, async (req, res) => {
  const id = intParam(req.params.id);
  if (!id) return res.status(400).json({ error: 'Vigane ID.' });

  const r = await q(
    'DELETE FROM cruise_registrations WHERE cruise_id = $1 AND user_id = $2',
    [id, req.userId]
  );
  if (!r.rowCount) return res.status(404).json({ error: 'Registreering puudub.' });

  // Free a spot back up if the cruise tracks them.
  await q(
    `UPDATE cruises
       SET spots_left = COALESCE(spots_left, 0) + 1,
           status = CASE WHEN status = 'full' THEN 'open' ELSE status END
     WHERE id = $1 AND spots_left IS NOT NULL`,
    [id]
  );

  res.json({ ok: true, registered: false });
});
