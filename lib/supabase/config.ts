// Of Supabase überhaupt geconfigureerd is. De NEXT_PUBLIC_* vars worden bij de
// build inlined, dus deze constante is bruikbaar in zowel server- als client-
// componenten zonder runtime-call. Gebruikt om de "voeg toe / mijn vakantie"
// flows netjes uit te schakelen wanneer er geen database gekoppeld is (bv. een
// Vercel-deploy zonder env vars) i.p.v. de gebruiker een harde error te tonen.
export const SUPABASE_CONFIGURED =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** Vriendelijke melding die de UI toont wanneer er geen database is. */
export const NO_DATABASE_MESSAGE =
  "Toevoegen en vakantieplannen vereisen een gekoppelde database. Deze omgeving heeft er (nog) geen.";
