import "server-only";
import { seedDeals } from "@/data/seed-deals";
import { supabaseServer } from "@/lib/supabase/server";
import type { Database } from "@/types/database";
import type { Deal, DealRatings } from "@/types/deal";

type DealRow = Database["public"]["Tables"]["deals"]["Row"];

export async function getDeals(): Promise<Deal[]> {
  const supabase = await supabaseServer();
  if (!supabase) return seedDeals;

  const { data, error } = await supabase
    .from("deals")
    .select("*")
    .order("price_per_person", { ascending: true });

  if (error || !data) return seedDeals;

  return data.map(rowToDeal);
}

// Runtime trust: provider/type/catering string columns are constrained at write-time
// (seed script + future INSERT policy) to the literal unions in types/deal.ts.
function rowToDeal(row: DealRow): Deal {
  return {
    id: row.id,
    title: row.title,
    destination: row.destination,
    country: row.country,
    region: row.region,
    provider: row.provider as Deal["provider"],
    providerUrl: row.provider_url,
    type: row.type as Deal["type"],
    pricePerPerson: row.price_per_person,
    duration: row.duration,
    startDate: row.start_date,
    flightTime: row.flight_time,
    inclusions: row.inclusions,
    catering: row.catering as Deal["catering"],
    ratings: row.ratings as unknown as DealRatings,
    rating: Number(row.rating),
    keywords: row.keywords,
    description: row.description,
    highlights: row.highlights,
    source: (row.source ?? "curated") as Deal["source"],
    imageUrl: row.image_url ?? null,
  };
}
