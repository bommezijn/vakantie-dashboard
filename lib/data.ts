import "server-only";
import { seedDeals } from "@/data/seed-deals";
import { supabaseServer } from "@/lib/supabase/server";
import type { Database } from "@/types/database";
import type { Deal, DealRatings } from "@/types/deal";

type DealRow = Database["public"]["Tables"]["deals"]["Row"];

export async function getDeals(): Promise<Deal[]> {
  const supabase = await supabaseServer();
  if (!supabase) return seedDeals;

  // Single round-trip — fetch deals and current user in parallel so we can
  // mark `ownedByMe` for the delete-button UI without a second auth call.
  const [{ data, error }, { data: userData }] = await Promise.all([
    supabase.from("deals").select("*").order("price_per_person", { ascending: true }),
    supabase.auth.getUser(),
  ]);

  if (error || !data) return seedDeals;

  const myId = userData.user?.id ?? null;
  return data.map((row) => rowToDeal(row, myId));
}

// Runtime trust: provider/type/catering string columns are constrained at write-time
// (seed script + future INSERT policy) to the literal unions in types/deal.ts.
function rowToDeal(row: DealRow, currentUserId: string | null): Deal {
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
    createdVia: (row.created_via ?? "manual") as Deal["createdVia"],
    ownedByMe: currentUserId !== null && row.submitted_by === currentUserId,
  };
}
