import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool } from '../db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const schemaPath = path.join(__dirname, '..', 'schema.sql');

export async function initDb() {
  const schema = await fs.readFile(schemaPath, 'utf8');
  await pool.query(schema);

  // Promote a user to admin via env var. Safe to run on every boot.
  const adminEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  if (adminEmail) {
    const r = await pool.query(
      'UPDATE users SET is_admin = true WHERE email = $1 AND is_admin = false',
      [adminEmail]
    );
    if (r.rowCount) console.log('promoted ' + adminEmail + ' to admin');
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  initDb()
    .then(() => pool.end())
    .catch((e) => { console.error(e); process.exit(1); });
}
