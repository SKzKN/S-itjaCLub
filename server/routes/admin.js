import { Router } from 'express';
import { z } from 'zod';
import { q } from '../db.js';
import { authRequired, adminRequired } from '../middleware/auth.js';

export const adminRouter = Router();

adminRouter.use(authRequired, adminRequired);

const intParam = (s) => {
  const n = Number.parseInt(s, 10);
  return Number.isInteger(n) && n > 0 ? n : null;
};

const ItineraryStep = z.object({
  time:  z.string().trim().max(200),
  place: z.string().trim().max(200),
  note:  z.string().trim().max(400).optional().nullable(),
});

const CruiseInput = z.object({
  event_date:  z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Kuupäev peab olema YYYY-MM-DD vormis.'),
  name:        z.string().trim().min(1).max(200),
  subtitle:    z.string().trim().max(200).optional().nullable(),
  route:       z.string().trim().min(1).max(500),
  status:      z.enum(['open', 'full', 'closed']).optional(),
  spots_left:  z.number().int().min(0).optional().nullable(),
  distance_km: z.number().int().min(0).optional().nullable(),
  duration:    z.string().trim().max(80).optional().nullable(),
  start_time:  z.string().trim().max(20).optional().nullable(),
  start_place: z.string().trim().max(200).optional().nullable(),
  description: z.string().trim().max(4000).optional().nullable(),
  itinerary:   z.array(ItineraryStep).optional().nullable(),
  included:    z.array(z.string().trim().max(200)).optional().nullable(),
  price:       z.string().trim().max(100).optional().nullable(),
});

const cruiseValues = (c) => [
  c.event_date,
  c.name,
  c.subtitle?.length ? c.subtitle : null,
  c.route,
  c.status || 'open',
  c.spots_left ?? null,
  c.distance_km ?? null,
  c.duration?.length ? c.duration : null,
  c.start_time?.length ? c.start_time : null,
  c.start_place?.length ? c.start_place : null,
  c.description?.length ? c.description : null,
  c.itinerary?.length ? JSON.stringify(c.itinerary) : null,
  c.included?.length  ? JSON.stringify(c.included)  : null,
  c.price?.length     ? c.price                     : null,
];

// ── Cruises (admin sees all, including past) ───────────────────────────
adminRouter.get('/cruises', async (_req, res) => {
  const { rows } = await q(
    `SELECT c.id,
            TO_CHAR(c.event_date, 'YYYY-MM-DD') AS event_date,
            EXTRACT(DAY   FROM c.event_date)::int AS day,
            EXTRACT(MONTH FROM c.event_date)::int AS month,
            EXTRACT(YEAR  FROM c.event_date)::int AS year,
            c.name, c.subtitle, c.route, c.status, c.spots_left,
            c.distance_km, c.duration,
            c.event_date < CURRENT_DATE AS is_past,
            (SELECT COUNT(*)::int FROM cruise_registrations WHERE cruise_id = c.id) AS participants
     FROM cruises c
     ORDER BY c.event_date DESC`
  );
  res.json({ cruises: rows });
});

adminRouter.post('/cruises', async (req, res) => {
  const parsed = CruiseInput.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0]?.message || 'Vigane sisestus.' });
  const c = parsed.data;
  const { rows } = await q(
    `INSERT INTO cruises
        (event_date, name, subtitle, route, status, spots_left,
         distance_km, duration, start_time, start_place, description, itinerary, included, price)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
     RETURNING id`,
    cruiseValues(c)
  );
  res.status(201).json({ id: rows[0].id });
});

adminRouter.put('/cruises/:id', async (req, res) => {
  const id = intParam(req.params.id);
  if (!id) return res.status(400).json({ error: 'Vigane ID.' });
  const parsed = CruiseInput.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0]?.message || 'Vigane sisestus.' });
  const c = parsed.data;
  const r = await q(
    `UPDATE cruises SET
        event_date  = $1, name        = $2, subtitle   = $3, route      = $4,
        status      = $5, spots_left  = $6, distance_km = $7, duration   = $8,
        start_time  = $9, start_place = $10, description = $11,
        itinerary   = $12, included    = $13, price       = $14
     WHERE id = $15`,
    [...cruiseValues(c), id]
  );
  if (!r.rowCount) return res.status(404).json({ error: 'Sõitu ei leitud.' });
  res.json({ ok: true });
});

adminRouter.delete('/cruises/:id', async (req, res) => {
  const id = intParam(req.params.id);
  if (!id) return res.status(400).json({ error: 'Vigane ID.' });
  const r = await q('DELETE FROM cruises WHERE id = $1', [id]);
  if (!r.rowCount) return res.status(404).json({ error: 'Sõitu ei leitud.' });
  res.json({ ok: true });
});

// ── Participants for a single cruise ───────────────────────────────────
adminRouter.get('/cruises/:id/participants', async (req, res) => {
  const id = intParam(req.params.id);
  if (!id) return res.status(400).json({ error: 'Vigane ID.' });
  const { rows } = await q(
    `SELECT u.id, u.first_name, u.email, u.car,
            r.created_at AS registered_at
     FROM cruise_registrations r
     JOIN users u ON u.id = r.user_id
     WHERE r.cruise_id = $1
     ORDER BY r.created_at ASC`,
    [id]
  );
  res.json({ participants: rows });
});

// ── Contact submissions ────────────────────────────────────────────────
adminRouter.get('/contact-submissions', async (_req, res) => {
  const { rows } = await q(
    'SELECT id, name, email, subject, message, created_at FROM contact_submissions ORDER BY created_at DESC'
  );
  res.json({ submissions: rows });
});

// ── Users list ─────────────────────────────────────────────────────────
adminRouter.get('/users', async (_req, res) => {
  const { rows } = await q(
    `SELECT u.id, u.first_name, u.email, u.car, u.is_admin, u.created_at,
            (SELECT COUNT(*)::int FROM cruise_registrations WHERE user_id = u.id) AS registrations
     FROM users u
     ORDER BY u.created_at DESC`
  );
  res.json({ users: rows });
});
