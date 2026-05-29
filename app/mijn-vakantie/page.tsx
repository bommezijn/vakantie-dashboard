import Link from "next/link";
import { Plane, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SiteHeader } from "@/components/layout/site-header";
import { supabaseServer } from "@/lib/supabase/server";
import { NewPlanButton } from "@/components/vacation/new-plan-button";

export const dynamic = "force-dynamic";

export default async function MijnVakantieIndexPage() {
  const supabase = await supabaseServer();

  const plans =
    supabase
      ? (
          await supabase
            .from("vacation_plans")
            .select("id, name, created_at, deal_id, deals(country, region)")
            .order("created_at", { ascending: false })
        ).data ?? []
      : [];

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6 lg:px-6">
        <div className="mb-6 flex items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">Mijn vakantieplannen</h1>
            <p className="text-sm text-muted-foreground">
              {plans.length === 0
                ? "Nog geen plannen aangemaakt."
                : `${plans.length} plan${plans.length === 1 ? "" : "nen"}`}
            </p>
          </div>
          <NewPlanButton />
        </div>

        {plans.length === 0 ? (
          <Card className="flex flex-col items-center gap-4 p-10 text-center">
            <div className="grid size-12 place-items-center rounded-full bg-muted">
              <Plane className="size-5 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium">Nog geen plannen</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Selecteer een deal op het dashboard en klik &quot;Maak dit mijn vakantie&quot;,
                <br />
                of start een leeg plan.
              </p>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline">
                <Link href="/">
                  <Plus className="mr-1 size-4" />
                  Naar dashboard
                </Link>
              </Button>
              <NewPlanButton />
            </div>
          </Card>
        ) : (
          <div className="grid gap-3">
            {plans.map((p) => {
              const deal = Array.isArray(p.deals) ? p.deals[0] : p.deals;
              return (
                <Link key={p.id} href={`/mijn-vakantie/${p.id}`} className="block">
                  <Card className="flex items-center justify-between p-4 transition-all hover:-translate-y-0.5 hover:shadow-md">
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold">{p.name}</h3>
                      <div className="mt-1 flex items-center gap-2">
                        {deal?.region && (
                          <Badge variant="outline" className="text-[10px]">
                            {deal.region}
                          </Badge>
                        )}
                        {deal?.country && (
                          <Badge variant="secondary" className="text-[10px]">
                            {deal.country}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {p.created_at?.slice(0, 10)}
                    </span>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
