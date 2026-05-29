# Vakantieplanner

Modulair dashboard om vakantiedeals centraal te vergelijken, filteren en plannen.
Bouwt op Next.js 15 (App Router), TypeScript, Tailwind v4 + shadcn/ui, en Supabase.

## Stack

- **Next.js 15** met App Router, RSC, TypeScript
- **Tailwind v4** + **shadcn/ui** (new-york style, neutral base) met custom palet
- **Supabase** (Postgres) voor opslag — gratis tier, geen accounts vereist
- **nuqs** voor shareable filter URLs (state in search params)
- Deployment: **Vercel** met custom domain

## Lokaal draaien

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

Zonder `.env.local` valt de app terug op de seed-deals uit [data/seed-deals.ts](data/seed-deals.ts) — handig voor demo en development zonder DB.

## Supabase setup

1. Maak een gratis project op [supabase.com](https://supabase.com) (EU regio Frankfurt aanbevolen).
2. Run [db/schema.sql](db/schema.sql) in de SQL editor (maakt `deals` tabel + RLS).
3. Kopieer `.env.example` naar `.env.local` en vul de keys in.
4. Seed de DB: `pnpm tsx db/seed.ts`

## Project structuur

```
app/                # Next.js App Router (pages, layout, globals.css)
components/
  layout/           # DashboardShell, SiteHeader, StatsBar
  filters/          # Modulaire filter widgets (elk eigen nuqs hook)
  deals/            # DealCard, DealList, DealDetailSheet
  ui/               # shadcn componenten
lib/
  filters.ts        # Pure applyFilters + sortDeals
  search-params.ts  # nuqs parsers
  supabase/         # Browser + server clients
  data.ts           # getDeals() — Supabase met seed fallback
data/               # seed-deals + keyword-categories
db/                 # Supabase schema + seed script
types/              # Deal interface
```

## Secrets

- `.env*.local` zit in `.gitignore` — NOOIT committen
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` mag in client bundle + Vercel (RLS beschermt data)
- `SUPABASE_SERVICE_ROLE_KEY` is **server-only** en alleen voor het lokale seed script
- Voor elke commit: `git status` checken op afwezigheid `.env*`

## Deploy

Import de repo op Vercel, voeg toe:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Daarna `vakantieplanner.bomm.app` koppelen via DNS: `CNAME vakantieplanner → cname.vercel-dns.com`.
