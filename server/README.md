# Drivers Club API

Node/Express + Postgres backend powering authentication, cruise registrations, email confirmations, and the admin panel.

## Endpoints

| Method | Path                                       | Auth   | Body                                   | Returns                       |
| ------ | ------------------------------------------ | ------ | -------------------------------------- | ----------------------------- |
| GET    | `/api/health`                              | —      | —                                      | `{ ok: true }`                |
| POST   | `/api/auth/register`                       | —      | `{ firstName, email, password, car? }` | `{ user }` + sets cookie      |
| POST   | `/api/auth/login`                          | —      | `{ email, password }`                  | `{ user }` + sets cookie      |
| POST   | `/api/auth/logout`                         | —      | —                                      | `{ ok: true }`                |
| GET    | `/api/auth/me`                             | user   | —                                      | `{ user }` (incl. `isAdmin`)  |
| GET    | `/api/cruises?period=upcoming\|past\|all`  | —      | —                                      | `{ cruises: [...] }`          |
| GET    | `/api/cruises/:id`                         | —      | —                                      | `{ cruise }`                  |
| GET    | `/api/cruises/:id/registration`            | user   | —                                      | `{ registered }`              |
| POST   | `/api/cruises/:id/register`                | user   | —                                      | `{ ok }` + sends email        |
| DELETE | `/api/cruises/:id/register`                | user   | —                                      | `{ ok }`                      |
| GET    | `/api/cruises/registrations/mine`          | user   | —                                      | `{ cruises: [...] }`          |
| GET    | `/api/admin/cruises`                       | admin  | —                                      | `{ cruises: [...] }`          |
| POST   | `/api/admin/cruises`                       | admin  | cruise fields                          | `{ id }`                      |
| PUT    | `/api/admin/cruises/:id`                   | admin  | cruise fields                          | `{ ok }`                      |
| DELETE | `/api/admin/cruises/:id`                   | admin  | —                                      | `{ ok }`                      |
| GET    | `/api/admin/cruises/:id/participants`      | admin  | —                                      | `{ participants: [...] }`     |
| GET    | `/api/admin/users`                         | admin  | —                                      | `{ users: [...] }`            |

Auth uses an httpOnly JWT cookie `dc_token` (30-day TTL). All `/api/auth/*` routes are rate-limited (50 req / 15 min / IP).

## Required environment variables

| Var                | Required              | Description                                                                                  |
| ------------------ | --------------------- | -------------------------------------------------------------------------------------------- |
| `DATABASE_URL`     | yes                   | Postgres connection string. Render's managed Postgres works out of the box.                  |
| `JWT_SECRET`       | yes                   | Long random string used to sign session JWTs.                                                |
| `ALLOWED_ORIGINS`  | yes (in production)   | Comma-separated list of frontend origins allowed to call the API (e.g. `https://driversclub.ee`). |
| `NODE_ENV`         | recommended           | `production` enables secure cookies + sslmode for Postgres.                                  |
| `PORT`             | optional              | Defaults to `3001`. Render sets this automatically.                                          |
| `ADMIN_EMAIL`      | optional              | Email of the user who should be promoted to admin on every boot. They must register first.   |
| `RESEND_API_KEY`   | optional (recommended)| Resend API key for sending real confirmation emails. Without it, emails log to the console.  |
| `FROM_EMAIL`       | optional              | `From:` address. Defaults to `Drivers Club <onboarding@resend.dev>` (Resend's test sender).  |

## Deploy to Render (Blueprint)

1. Push the repo to GitHub.
2. In Render → **New** → **Blueprint** → connect the repo. Render reads [`render.yaml`](render.yaml) and provisions:
   - `drivers-club-db` (Postgres, free plan)
   - `drivers-club-api` (Web Service, free plan, Node)
3. Fill in the env vars marked `sync: false` in `render.yaml`:
   - `ALLOWED_ORIGINS` — your frontend's URL(s).
   - `RESEND_API_KEY` — get one at <https://resend.com>. Skip if you want to send no email yet.
   - `FROM_EMAIL` — use `Drivers Club <onboarding@resend.dev>` until you verify your own domain.
   - `ADMIN_EMAIL` — leave blank for now; set it after you register your admin account (next section).

`JWT_SECRET` is auto-generated by Render. `DATABASE_URL` is wired automatically.

The schema is created on every boot via `initDb()`, so there's no separate migration step.

## Bootstrapping the first admin

1. After deploy, visit your frontend's `/liitu.html` and register normally with the email you want to be the admin.
2. In Render, set `ADMIN_EMAIL` on the API service to that email and trigger a manual deploy (or hit "Restart" on the service).
3. On boot, `initDb` flips `is_admin = true` for that user. They can now access `/admin.html`.

To demote someone, run this directly against the database (Render → service → Shell):

```sql
UPDATE users SET is_admin = false WHERE email = 'them@example.com';
```

## Pointing the frontend at the API

Each HTML page has a meta tag controlling which backend it talks to:

```html
<meta name="dc-api-base" content="https://drivers-club-api.onrender.com">
```

Set this on every page in the frontend (`index.html`, `liitu.html`, `logi-sisse.html`, `minu-konto.html`, `soit.html`, `admin.html`) before deploying the static site. If the meta tag is empty, the client falls back to `http://localhost:3001` for local dev.

## Email setup (Resend)

The user-facing flow expects a confirmation email after registering for a cruise. Two options:

- **Quick start** — leave `RESEND_API_KEY` unset. Confirmations are logged to the server console. Useful for staging.
- **Production** — sign up at <https://resend.com>, create an API key, and add `RESEND_API_KEY` to Render. To send `From:` your own domain, verify the domain in Resend's dashboard and set `FROM_EMAIL="Drivers Club <hello@your-domain.ee>"`. Until then, leave `FROM_EMAIL` unset to use Resend's `onboarding@resend.dev` test sender.

## Local development

```sh
cd server
cp .env.example .env
# edit .env: set DATABASE_URL (a local Postgres) and JWT_SECRET
npm install
npm run dev
```

Server listens on `http://localhost:3001`. Schema runs automatically on first boot. The cruises table starts empty — log in as your admin and create events via `/admin.html`.
