import jwt from 'jsonwebtoken';
import { q } from '../db.js';

export function authRequired(req, res, next) {
  const token = req.cookies?.dc_token;
  if (!token) return res.status(401).json({ error: 'Pole sisse logitud.' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.sub;
    next();
  } catch {
    res.clearCookie('dc_token', { path: '/' });
    return res.status(401).json({ error: 'Sessioon aegunud.' });
  }
}

export async function adminRequired(req, res, next) {
  if (!req.userId) return res.status(401).json({ error: 'Pole sisse logitud.' });
  try {
    const { rows } = await q('SELECT is_admin FROM users WHERE id = $1', [req.userId]);
    if (!rows.length || !rows[0].is_admin) {
      return res.status(403).json({ error: 'Administraatoriõigused puuduvad.' });
    }
    next();
  } catch (e) {
    next(e);
  }
}
