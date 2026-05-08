CREATE EXTENSION IF NOT EXISTS citext;

CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  first_name    TEXT NOT NULL,
  email         CITEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  car           TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN NOT NULL DEFAULT false;

CREATE TABLE IF NOT EXISTS cruises (
  id          SERIAL PRIMARY KEY,
  event_date  DATE NOT NULL,
  name        TEXT NOT NULL,
  subtitle    TEXT,
  route       TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'open',
  spots_left  INTEGER,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE cruises ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE cruises ADD COLUMN IF NOT EXISTS distance_km INTEGER;
ALTER TABLE cruises ADD COLUMN IF NOT EXISTS duration    TEXT;
ALTER TABLE cruises ADD COLUMN IF NOT EXISTS start_time  TEXT;
ALTER TABLE cruises ADD COLUMN IF NOT EXISTS start_place TEXT;
ALTER TABLE cruises ADD COLUMN IF NOT EXISTS itinerary   JSONB;
ALTER TABLE cruises ADD COLUMN IF NOT EXISTS included    JSONB;

CREATE INDEX IF NOT EXISTS cruises_event_date_idx ON cruises (event_date);

CREATE TABLE IF NOT EXISTS cruise_registrations (
  id          SERIAL PRIMARY KEY,
  cruise_id   INTEGER NOT NULL REFERENCES cruises(id) ON DELETE CASCADE,
  user_id     INTEGER NOT NULL REFERENCES users(id)   ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (cruise_id, user_id)
);

CREATE INDEX IF NOT EXISTS reg_user_idx   ON cruise_registrations (user_id);
CREATE INDEX IF NOT EXISTS reg_cruise_idx ON cruise_registrations (cruise_id);
