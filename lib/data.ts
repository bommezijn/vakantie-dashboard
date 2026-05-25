import "server-only";
import { seedDeals } from "@/data/seed-deals";
import { supabaseServer } from "@/lib/supabase/server";
import type { Deal } from "@/types/deal";

export async function getDeals(): Promise<Deal[]> {
  if (!supabaseServer) return seedDeals;

  const { data, error } = await supabaseServer
    .from("deals")
    .select("*")
    .order("price_per_person", { ascending: true });

  if (error || !data) return seedDeals;

  return data.map(rowToDeal);
}

type DealRow = {
  id: string;
  title: string;
  destination: string;
  country: string;
  region: string;
  provider: Deal["provider"];
  provider_url: string;
  type: Deal["type"];
  price_per_person: number;
  duration: number;
  start_date: string;
  flight_time: string;
  inclusions: string[];
  catering: Deal["catering"];
  ratings: Deal["ratings"];
  rating: number;
  keywords: string[];
  description: string;
  highlights: string[];
};

function rowToDeal(row: DealRow): Deal {
  return {
    id: row.id,
    title: row.title,
    destination: row.destination,
    country: row.country,
    region: row.region,
    provider: row.provider,
    providerUrl: row.provider_url,
    type: row.type,
    pricePerPerson: row.price_per_person,
    duration: row.duration,
    startDate: row.start_date,
    flightTime: row.flight_time,
    inclusions: row.inclusions,
    catering: row.catering,
    ratings: row.ratings,
    rating: Number(row.rating),
    keywords: row.keywords,
    description: row.description,
    highlights: row.highlights,
  };
}
