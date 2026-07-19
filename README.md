# Plugged In Charging

A mobile-first **PWA station locator** for Plugged In Charging's power-bank rental kiosks. Users scan a QR at a venue, open the app in their browser (no app store), find nearby stations, check battery availability, and get directions.

## Tech stack

- **Vite + React** (PWA via `vite-plugin-pwa`)
- **Tailwind CSS v4** (brand theme in `src/index.css`)
- **Leaflet + react-leaflet** with OpenStreetMap tiles (tile provider is one config line — `src/config.js`)
- **Supabase** (Postgres + Row Level Security) for stations & support tickets
- **GitHub Pages** hosting via GitHub Actions

The app runs on **mock data** until Supabase is configured, so you can develop with zero backend setup.

## Local development

```bash
npm install
npm run dev      # http://localhost:5173  (admin at /admin, passcode: changeme)
npm run build    # production build -> dist/
npm run preview  # preview the production build
```

## Configuration

Copy `.env.example` to `.env` and fill in:

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_ADMIN_PASSCODE=...
```

The Supabase anon key is safe to expose in the client — data is protected by RLS, not by hiding the key. **Never** put the `service_role` key in a `VITE_` variable.

## Supabase setup

1. Create a project at [supabase.com](https://supabase.com).
2. Open the SQL Editor and run [`supabase/schema.sql`](supabase/schema.sql). It creates the `stations` and `support_tickets` tables, RLS policies, realtime, and seeds the current stations.
3. Copy the Project URL + anon key into `.env` (local) and into the GitHub repo secrets (for deploys).

## Deployment (GitHub Pages)

Pushing to `main` triggers [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which builds and deploys to GitHub Pages.

One-time setup on the repo:

1. **Settings → Pages → Build and deployment → Source: GitHub Actions.**
2. **Settings → Secrets and variables → Actions** → add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

The site serves at `https://<owner>.github.io/plugged-in-charging/`. The base path is set in `vite.config.js` (`PROD_BASE`) — keep it in sync with the repo name. For a custom domain (served at root), set `PROD_BASE = "/"` and `pathSegmentsToKeep = 0` in `public/404.html`.

## Project structure

```
src/
  components/   Header, BottomNav, MapView, StationSheet, ContactModal
  hooks/        useStations (Supabase + realtime), useGeolocation
  lib/          availability (status colors), navigation (maps deep links)
  pages/        MapPage, admin/AdminPage
  supabase/     client + row<->object mappers
  data/         mockStations (dev fallback)
  config.js     brand, map center, tiles, contact info
supabase/schema.sql   run this in Supabase
```

## Known follow-ups before launch

- Replace the client-side admin passcode with **Supabase Auth** + a write RLS policy (see `supabase/schema.sql` §4).
- Wire the hardware API → a **Supabase Edge Function** to update live battery/slot counts.
- Fill in real venue hours and business contact details in `src/config.js`.
