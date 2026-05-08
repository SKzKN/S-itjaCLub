import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { q } from '../db.js';
import { authRequired } from '../middleware/auth.js';

export const authRouter = Router();

const RegisterSchema = z.object({
  firstName: z.string().trim().min(1, 'Eesnimi on kohustuslik.').max(80),
  email:     z.string().trim().email('Vigane e-posti aadress.').max(200),
  password:  z.string().min(8, 'Parool peab olema vähemalt 8 tähemärki.').max(200),
  car:       z.string().trim().max(200).optional().nullable(),
});

const LoginSchema = z.object({
  email:    z.string().trim().email('Vigane e-posti aadress.').max(200),
  password: z.string().min(1).max(200),
});

const cookieOpts = () => ({
  httpOnly: true,
  secure:   process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge:   1000 * 60 * 60 * 24 * 30,
  path:     '/',
});

const issueToken = (user) =>
  jwt.sign({ sub: user.id, name: user.first_name }, process.env.JWT_SECRET, { expiresIn: '30d' });

const publicUser = (u) => ({
  id: u.id,
  firstName: u.first_name,
  email: u.email,
  car: u.car,
  isAdmin: !!u.is_admin,
});

authRouter.post('/register', async (req, res) => {
  const parsed = RegisterSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message || 'Vigane sisestus.' });
  }
  const { firstName, email, password, car } = parsed.data;

  const exists = await q('SELECT 1 FROM users WHERE email = $1', [email]);
  if (exists.rowCount) {
    return res.status(409).json({ error: 'Selle e-postiga konto on juba olemas.' });
  }

  const hash = await bcrypt.hash(password, 12);
  const { rows } = await q(
    `INSERT INTO users (first_name, email, password_hash, car)
     VALUES ($1, $2, $3, $4)
     RETURNING id, first_name, email, car, is_admin`,
    [firstName, email, hash, car?.length ? car : null]
  );
  const user = rows[0];
  res.cookie('dc_token', issueToken(user), cookieOpts());
  res.status(201).json({ user: publicUser(user) });
});

authRouter.post('/login', async (req, res) => {
  const parsed = LoginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Vigane sisestus.' });
  const { email, password } = parsed.data;

  const { rows } = await q(
    'SELECT id, first_name, email, password_hash, car, is_admin FROM users WHERE email = $1',
    [email]
  );
  const user = rows[0];
  const ok = user ? await bcrypt.compare(password, user.password_hash) : false;
  if (!ok) return res.status(401).json({ error: 'Vale e-post või parool.' });

  res.cookie('dc_token', issueToken(user), cookieOpts());
  res.json({ user: publicUser(user) });
});

authRouter.post('/logout', (_req, res) => {
  res.clearCookie('dc_token', { path: '/' });
  res.json({ ok: true });
});

authRouter.get('/me', authRequired, async (req, res) => {
  const { rows } = await q(
    'SELECT id, first_name, email, car, is_admin FROM users WHERE id = $1',
    [req.userId]
  );
  if (!rows.length) return res.status(404).json({ error: 'Kasutajat ei leitud.' });
  res.json({ user: publicUser(rows[0]) });
});
