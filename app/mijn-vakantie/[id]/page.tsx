import Image from "next/image";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/layout/site-header";
import { PlanHeader } from "@/components/vacation/plan-header";
import { ActivityList } from "@/components/vacation/activity-list";
import { ActivityFormDialog } from "@/components/vacation/activity-form-dialog";
import { supabaseServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function VakantiePlanPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await supabaseServer();
  if (!supabase) notFound();

  const { data: plan } = await supabase
    .from("vacation_plans")
    .select("*, deals(country, region, image_url, title)")
    .eq("id", id)
    .maybeSingle();

  if (!plan) notFound();

  const { data: activities } = await supabase
    .from("vacation_activities")
    .select("*")
    .eq("vacation_plan_id", id)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  const deal = Array.isArray(plan.deals) ? plan.deals[0] : plan.deals;
  const rawHero = deal?.image_url ?? null;
  const heroImage = rawHero?.startsWith("//") ? `https:${rawHero}` : rawHero;

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      {/* Hero banner — only shown when the linked deal has an image */}
      {heroImage && (
        <div className="relative h-48 w-full overflow-hidden sm:h-64">
          <Image
            src={heroImage}
            alt={deal?.title ?? plan.name}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/30 to-background" />
        </div>
      )}

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6 lg:px-6">
        <PlanHeader
          plan={plan}
          dealCountry={deal?.country ?? undefined}
          dealRegion={deal?.region ?? undefined}
        />

        <div className="mt-8 flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Activiteiten
            {activities && activities.length > 0 && (
              <span className="ml-2 rounded-full bg-[#e8fd94] px-2 py-0.5 text-[#1a2d5a]">
                {activities.length}
              </span>
            )}
          </h2>
          <ActivityFormDialog planId={id} />
        </div>

        <div className="mt-4">
          <ActivityList activities={activities ?? []} planId={id} />
        </div>
      </main>
    </div>
  );
}
