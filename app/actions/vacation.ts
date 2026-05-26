"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";

export async function createPlanFromDeal(dealId: string, dealTitle: string) {
  const supabase = await supabaseServer();
  if (!supabase) throw new Error("Supabase not configured");

  const { data, error } = await supabase
    .from("vacation_plans")
    .insert({ deal_id: dealId, name: dealTitle })
    .select("id")
    .single();

  if (error || !data) throw new Error(error?.message ?? "Failed to create plan");

  revalidatePath("/mijn-vakantie");
  redirect(`/mijn-vakantie/${data.id}`);
}

export async function createBlankPlan(name: string) {
  const supabase = await supabaseServer();
  if (!supabase) throw new Error("Supabase not configured");

  const { data, error } = await supabase
    .from("vacation_plans")
    .insert({ name })
    .select("id")
    .single();

  if (error || !data) throw new Error(error?.message ?? "Failed to create plan");

  revalidatePath("/mijn-vakantie");
  redirect(`/mijn-vakantie/${data.id}`);
}

export async function deletePlan(planId: string) {
  const supabase = await supabaseServer();
  if (!supabase) throw new Error("Supabase not configured");

  const { error } = await supabase.from("vacation_plans").delete().eq("id", planId);
  if (error) throw new Error(error.message);

  revalidatePath("/mijn-vakantie");
  redirect("/mijn-vakantie");
}

export interface AddActivityInput {
  planId: string;
  name: string;
  location?: string;
  url?: string;
  pricePerPerson?: number;
  currency?: string;
  notes?: string;
}

export async function addActivity(input: AddActivityInput) {
  const supabase = await supabaseServer();
  if (!supabase) throw new Error("Supabase not configured");

  const { error } = await supabase.from("vacation_activities").insert({
    vacation_plan_id: input.planId,
    name: input.name,
    location: input.location || null,
    url: input.url || null,
    price_per_person: input.pricePerPerson ?? null,
    currency: input.currency || "EUR",
    notes: input.notes || null,
  });

  if (error) throw new Error(error.message);
  revalidatePath(`/mijn-vakantie/${input.planId}`);
}

export async function toggleActivityReserved(activityId: string, planId: string, isReserved: boolean) {
  const supabase = await supabaseServer();
  if (!supabase) throw new Error("Supabase not configured");

  const { error } = await supabase
    .from("vacation_activities")
    .update({ is_reserved: isReserved })
    .eq("id", activityId);

  if (error) throw new Error(error.message);
  revalidatePath(`/mijn-vakantie/${planId}`);
}

export async function deleteActivity(activityId: string, planId: string) {
  const supabase = await supabaseServer();
  if (!supabase) throw new Error("Supabase not configured");

  const { error } = await supabase.from("vacation_activities").delete().eq("id", activityId);
  if (error) throw new Error(error.message);

  revalidatePath(`/mijn-vakantie/${planId}`);
}
