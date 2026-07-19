-- ============================================================================
-- Plugged In Charging — Supabase schema
-- Paste this into your Supabase project's SQL Editor and run it.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. STATIONS
-- ---------------------------------------------------------------------------
create table if not exists public.stations (
  id                 uuid primary key default gen_random_uuid(),
  name               text not null,
  address            text,
  latitude           double precision not null,
  longitude          double precision not null,
  hours              text,
  terminal_id        text,
  total_slots        integer not null default 8,
  available_batteries integer not null default 0,
  empty_slots        integer not null default 0,
  last_updated       timestamptz not null default now()
);

-- Keep last_updated fresh on any change to a station row.
create or replace function public.touch_last_updated()
returns trigger language plpgsql as $$
begin
  new.last_updated = now();
  return new;
end;
$$;

drop trigger if exists trg_stations_touch on public.stations;
create trigger trg_stations_touch
  before update on public.stations
  for each row execute function public.touch_last_updated();

-- ---------------------------------------------------------------------------
-- 2. SUPPORT TICKETS (from the Contact Us form)
-- ---------------------------------------------------------------------------
create table if not exists public.support_tickets (
  id          uuid primary key default gen_random_uuid(),
  name        text,
  email       text,
  message     text not null,
  user_agent  text,
  status      text not null default 'new',
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 3. ROW LEVEL SECURITY
-- ---------------------------------------------------------------------------
alter table public.stations       enable row level security;
alter table public.support_tickets enable row level security;

-- Stations: anyone (anon) may READ. This is public locator data.
drop policy if exists "stations_public_read" on public.stations;
create policy "stations_public_read"
  on public.stations for select
  using (true);

-- Support tickets: anyone may INSERT (submit the form) but NOBODY can read
-- them from the client. Read them in the Supabase dashboard / with the
-- service_role key on a backend.
drop policy if exists "tickets_public_insert" on public.support_tickets;
create policy "tickets_public_insert"
  on public.support_tickets for insert
  with check (true);

-- ---------------------------------------------------------------------------
-- 4. ADMIN WRITES TO STATIONS
-- ---------------------------------------------------------------------------
-- The /admin screen signs in with Supabase Auth (email/password). Only a
-- signed-in user may insert/update/delete stations; anonymous visitors
-- still get read-only access via the policy in §3.
--
-- There is no public sign-up screen in the app. Create the admin account
-- in the Supabase Dashboard: Authentication > Users > Add user.
drop policy if exists "stations_admin_write" on public.stations;
create policy "stations_admin_write"
  on public.stations for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ---------------------------------------------------------------------------
-- 5. REALTIME
-- ---------------------------------------------------------------------------
-- Let clients subscribe to live battery/slot count changes.
alter publication supabase_realtime add table public.stations;

-- ---------------------------------------------------------------------------
-- 6. SEED DATA — the four current 8-bank stations
-- ---------------------------------------------------------------------------
insert into public.stations
  (name, address, latitude, longitude, hours, terminal_id, total_slots, available_batteries, empty_slots)
values
  ('The View Clermont', '2601 Clermont National Drive, Clermont, FL 34711', 28.5560419, -81.7058031, 'See venue for hours', 'HW-0001', 8, 6, 2),
  ('Mullet''s Sports Bar', '736 W Montrose Street, Clermont, FL 34711', 28.5556446, -81.7675447, 'See venue for hours', 'HW-0002', 8, 2, 6),
  ('Crooked Can Brewing Company', '1600 Crooked Can Loop, Minneola, FL 34715', 28.579278, -81.743056, 'See venue for hours', 'HW-0003', 8, 4, 4),
  ('Pups Pub Clermont', '898 W Montrose Street, Clermont, FL 34711', 28.5554544, -81.7701869, 'See venue for hours', 'HW-0004', 8, 5, 3)
on conflict do nothing;
