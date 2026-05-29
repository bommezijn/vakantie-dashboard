// Seed script voor Supabase. Run met: pnpm tsx db/seed.ts
// Vereist .env.local met SUPABASE_SERVICE_ROLE_KEY (NOOIT committen).
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { seedDeals } from "../data/seed-deals";

config({ path: ".env.local" });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false },
});

const rows = seedDeals.map((d) => ({
  id: d.id,
  title: d.title,
  destination: d.destination,
  country: d.country,
  region: d.region,
  provider: d.provider,
  provider_url: d.providerUrl,
  type: d.type,
  price_per_person: d.pricePerPerson,
  duration: d.duration,
  start_date: d.startDate,
  flight_time: d.flightTime,
  inclusions: d.inclusions,
  catering: d.catering,
  ratings: d.ratings,
  rating: d.rating,
  keywords: d.keywords,
  description: d.description,
  highlights: d.highlights,
}));

async function main() {
  const { error, count } = await supabase
    .from("deals")
    .upsert(rows, { onConflict: "id", count: "exact" });

  if (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  }

  console.log(`Seeded ${count ?? rows.length} deals.`);
}

main();
