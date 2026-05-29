import "server-only";
import { cache } from "react";
import { seedDeals } from "@/data/seed-deals";
import { supabaseServer } from "@/lib/supabase/server";
import type { Database } from "@/types/database";
import type { Deal, DealRatings } from "@/types/deal";

type DealRow = Database["public"]["Tables"]["deals"]["Row"];

/**
 * Alleen user-submitted deals — wordt door runAgencySearch onvoorwaardelijk
 * meegestuurd zodat eigen deals altijd zichtbaar zijn, ongeacht of de
 * geselecteerde agency/country/budget filters matchen. Een eigen deal die je
 * net toevoegde mag niet onzichtbaar zijn omdat de country casing afwijkt.
 */
export async function getUserSubmittedDeals(): Promise<Deal[]> {
  const supabase = await supabaseServer();
  if (!supabase) return [];

  const [{ data, error }, { data: userData }] = await Promise.all([
    supabase
      .from("deals")
      .select("*")
      .eq("source", "user")
      .order("created_at", { ascending: false }),
    supabase.auth.getUser(),
  ]);

  if (error || !data) return [];
  const myId = userData.user?.id ?? null;
  return data.map((row) => rowToDeal(row, myId));
}

// Per-request gememoïseerd met React cache(): één zoekopdracht roept dit via
// filterSeedForProvider 6× aan (één per reisbureau-adapter). Zonder cache zou
// dat 6 identieke Supabase round-trips zijn; nu delen ze allemaal één fetch
// binnen dezelfde request. Cross-request live caching gebeurt op fetch-niveau
// in lib/agencies/scraper.ts (next.revalidate) — getDeals leest auth-cookies
// en kan daarom niet globaal via unstable_cache gecached worden.
export const getDeals = cache(async (): Promise<Deal[]> => {
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
});

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
