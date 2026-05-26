# Hand-off — Vakantieplanner

Dit bestand documenteert de staat van het project en de geprioriteerde volgende stappen, en bevat onderaan een **kant-en-klaar prompt** om in een nieuwe Claude Code sessie te plakken.

---

## Huidige staat

**Repo:** `bommezijn/vakantie-dashboard`
**Branch:** `dev` (gepushed naar `origin/dev`)
**Lokale dir:** `C:\Users\Nathan\Documents\Development\test`

### Wat werkt
- Next.js 15 App Router + TypeScript + Tailwind v4 + shadcn/ui (handmatig, niet via CLI vanwege Node 25 / zod ESM bug)
- Custom OKLCH palet: `#2b438d` primary, `#e8fd94` accent, `#94adff` secondary in [app/globals.css](app/globals.css)
- Two-column dashboard, modulaire filters via `nuqs` (URL search params, shareable)
- DealCard + DealDetailSheet (rechter overlay desktop, fullscreen mobile)
- Supabase Postgres met `deals` tabel (RLS aan, public read-only policy) — geseed met 31 deals
- App leest live uit Supabase (`lib/data.ts` met fallback naar [data/seed-deals.ts](data/seed-deals.ts))
- Lokale build groen (`pnpm build`), dev server clean (`pnpm dev`)

### Wat nog open staat
1. **Vercel deploy** + custom domain `vakantieplanner.bomm.app`
2. **GitHub Pages uitzetten** zodra Vercel draait
3. **PR + merge `dev` → `main`** zodra Vercel verified is
4. **Database verbeteringen** (niet kritiek):
   - Migratie-files via `apply_migration` MCP tool i.p.v. één losse `schema.sql`
   - TypeScript types regenereren met `generate_typescript_types` MCP tool → vervang handmatige `DealRow` type in [lib/data.ts](lib/data.ts)
   - `get_advisors` runnen voor security/perf checks
5. **Toekomstige features** (planning, geen scope nu):
   - Vakantieplan + activiteiten feature (deal selecteren als "vakantie", activiteiten toevoegen)
   - Valuta conversie via `frankfurter.app` (gratis, geen key)
   - Link-extractie (URL → Open Graph metadata → nieuwe deal)
   - Accounts/sync via Supabase Auth
   - PDF/email uploads naar Supabase Storage

---

## Beschikbare tooling in nieuwe sessies

**Supabase MCP** is geauthenticeerd (project scope in [.mcp.json](.mcp.json) → `https://mcp.supabase.com/mcp?project_ref=eguuzyspduqgvpvbjuat`).
Tools die direct beschikbaar zijn:
- `mcp__supabase__list_tables` — schema inspectie
- `mcp__supabase__execute_sql` — ad-hoc queries (SELECT)
- `mcp__supabase__apply_migration` — DDL changes met versie-tracking
- `mcp__supabase__generate_typescript_types` — types uit DB schema
- `mcp__supabase__get_advisors` — security + performance audits
- `mcp__supabase__get_logs` — debugging
- `mcp__supabase__list_migrations` / `mcp__supabase__list_extensions`

**Project skill** beschikbaar: `supabase` skill met SSR / RLS / Auth best practices.

---

## Credentials

`.env.local` is lokaal aangemaakt en in `.gitignore`. Bevat:
- `NEXT_PUBLIC_SUPABASE_URL` (publiek, project URL)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (publishable key `sb_publishable_...`)
- `SUPABASE_SERVICE_ROLE_KEY` (secret key `sb_secret_...` — alleen voor lokaal seed script)

Voor Vercel: zet **alleen** de twee `NEXT_PUBLIC_*` vars. NOOIT de secret key in Vercel.

---

## Kritieke bestanden

| Bestand | Doel |
|---|---|
| [app/page.tsx](app/page.tsx) | RSC entry, `getDeals()` server-side fetch |
| [lib/data.ts](lib/data.ts) | Supabase query met seed fallback, row→Deal mapper |
| [lib/supabase/server.ts](lib/supabase/server.ts) | Server client (RSC) |
| [lib/supabase/client.ts](lib/supabase/client.ts) | Browser client (voor toekomstige mutations) |
| [lib/filters.ts](lib/filters.ts) | Pure `applyFilters` + `sortDeals` |
| [lib/search-params.ts](lib/search-params.ts) | nuqs parsers (één per filter) |
| [components/layout/dashboard-shell.tsx](components/layout/dashboard-shell.tsx) | Two-column shell |
| [components/filters/filter-sidebar.tsx](components/filters/filter-sidebar.tsx) | Sidebar — import-lijst van filter widgets |
| [components/deals/deal-card.tsx](components/deals/deal-card.tsx) | At-a-glance kaart |
| [components/deals/deal-detail-sheet.tsx](components/deals/deal-detail-sheet.tsx) | Rechter overlay |
| [db/schema.sql](db/schema.sql) | Initial schema (al toegepast) |
| [db/seed.ts](db/seed.ts) | Seed script (al gedraaid) |
| [types/deal.ts](types/deal.ts) | Deal interface (handmatig) |

---

## Prompt voor nieuwe Claude Code sessie

Open een nieuwe sessie in deze repo en plak het volgende:

> Ik werk aan `vakantieplanner` op branch `dev`. Status: Next.js 15 + Supabase staat live, 31 deals in DB, lokaal werkend. Zie [HANDOFF.md](HANDOFF.md) voor volledige context. Supabase MCP is geauthenticeerd (project scope, zie [.mcp.json](.mcp.json)) — gebruik `mcp__supabase__*` tools voor DB werk.
>
> **Mijn doel deze sessie:** _\[kies één:]_
>
> - **A) Vercel deploy.** Help me het project op Vercel deployen en `vakantieplanner.bomm.app` koppelen via DNS. Daarna GitHub Pages uit en `dev` → `main` mergen.
> - **B) DB-best-practices.** Run `get_advisors` voor security/perf checks, regenereer TypeScript types via MCP en vervang de handmatige `DealRow` in `lib/data.ts`, en migreer de losse `schema.sql` naar `apply_migration` met versie-tracking.
> - **C) Vakantieplan feature.** Bouw bovenop het bestaande dashboard de "mijn vakantieplan" feature: deal selecteren als vakantie, activiteiten toevoegen (naam/locatie/URL/optionele prijs/reservering). Schema-design eerst via Supabase MCP, daarna UI met shadcn Sheet of dialog.
> - **D) Valuta conversie.** Voeg currency conversion toe: per land detecteren welke valuta gebruikelijk is, exchange rates van `frankfurter.app` (gratis, geen key), tonen in detail sheet als secondary price.
> - **E) Link-extractie.** Maak een Next.js API route die een URL accepteert, Open Graph metadata fetcht, en als nieuwe deal in Supabase opslaat. UI: input field bovenaan dashboard met "Voeg vakantie toe via link".
> - **F) Anders:** _\[beschrijf]_

> Begin met een korte exploratie (lees `HANDOFF.md` + relevante files), bevestig je begrip, en stel zo nodig 1-2 vragen voordat je begint. Houd de bestaande architectuur en custom palet intact.
