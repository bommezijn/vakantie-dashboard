-- Vakantieplanner schema voor Supabase Postgres
-- ⚠️  Superseded by tracked migrations — see `mcp__supabase__list_migrations`.
-- This file is kept for GitHub-lezers context only; do NOT re-apply.
-- Current authoritative migrations:
--   0001_initial_deals_schema
--   0002_revoke_rls_auto_enable_execute
--   0003_vacation_plans_and_activities
--   0004_user_submitted_deals_columns_and_policies

create table if not exists public.deals (
  id text primary key,
  title text not null,
  destination text not null,
  country text not null,
  region text not null,
  provider text not null,
  provider_url text not null,
  type text not null,
  price_per_person integer not null,
  duration integer not null,
  start_date date not null,
  flight_time text not null,
  inclusions text[] not null default '{}',
  catering text not null,
  ratings jsonb not null,
  rating numeric(3,1) not null,
  keywords text[] not null default '{}',
  description text not null,
  highlights text[] not null default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists deals_price_idx    on public.deals (price_per_person);
create index if not exists deals_provider_idx on public.deals (provider);
create index if not exists deals_country_idx  on public.deals (country);
create index if not exists deals_keywords_gin on public.deals using gin (keywords);

alter table public.deals enable row level security;

drop policy if exists "deals are public read" on public.deals;
create policy "deals are public read"
  on public.deals for select
  to anon, authenticated
  using (true);
-- Geen INSERT/UPDATE/DELETE policy → anon kan niet schrijven.
-- Seeden via service_role (lokaal, niet in Vercel).
