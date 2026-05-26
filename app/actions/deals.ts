"use server";

import { revalidatePath } from "next/cache";
import { supabaseServer } from "@/lib/supabase/server";

export interface CreateUserDealInput {
  title: string;
  description: string;
  destination: string;
  country: string;
  region: string;
  provider: string;
  providerUrl: string;
  type: string;
  catering: string;
  pricePerPerson: number;
  duration: number;
  startDate: string;
  flightTime: string;
  imageUrl?: string;
  /** How the deal was added — drives the badge in the UI. */
  createdVia?: "bookmarklet" | "link-paste" | "manual";
}

export async function createUserDeal(input: CreateUserDealInput) {
  const supabase = await supabaseServer();
  if (!supabase) throw new Error("Supabase not configured");

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user)
    throw new Error(
      "Geen actieve sessie — zorg dat anoniem inloggen is ingeschakeld in het Supabase-dashboard (Authentication → Providers → Anonymous)"
    );

  const id = `user-${userData.user.id.slice(0, 8)}-${Date.now()}`;

  const { error } = await supabase.from("deals").insert({
    id,
    title: input.title,
    description: input.description,
    destination: input.destination,
    country: input.country,
    region: input.region,
    provider: input.provider,
    provider_url: input.providerUrl,
    type: input.type,
    catering: input.catering,
    price_per_person: input.pricePerPerson,
    duration: input.duration,
    start_date: input.startDate,
    flight_time: input.flightTime,
    image_url: input.imageUrl || null,
    rating: 0,
    ratings: { sun: 3, food: 3, culture: 3, pool: 3 },
    inclusions: [],
    keywords: [],
    highlights: [],
    source: "user",
    submitted_by: userData.user.id,
    created_via: input.createdVia ?? "manual",
  });

  if (error) throw new Error(error.message);

  revalidatePath("/");
  return { id };
}

export async function deleteUserDeal(id: string) {
  const supabase = await supabaseServer();
  if (!supabase) throw new Error("Supabase not configured");

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error("Niet ingelogd");

  // RLS-policy "users can delete their own deals" filtert al op
  // source='user' AND submitted_by=auth.uid(), maar we voegen de eq()
  // filters expliciet toe als extra veiligheid (defense in depth).
  const { error, count } = await supabase
    .from("deals")
    .delete({ count: "exact" })
    .eq("id", id)
    .eq("source", "user")
    .eq("submitted_by", userData.user.id);

  if (error) throw new Error(error.message);
  if (count === 0)
    throw new Error("Deal niet gevonden of niet door jou aangemaakt");

  revalidatePath("/");
  return { id };
}
