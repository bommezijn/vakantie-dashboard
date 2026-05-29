"use client";

import { useTransition } from "react";
import Link from "next/link";
import { ChevronLeft, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { deletePlan } from "@/app/actions/vacation";
import type { Database } from "@/types/database";

type Plan = Database["public"]["Tables"]["vacation_plans"]["Row"];

interface PlanHeaderProps {
  plan: Plan;
  dealCountry?: string;
  dealRegion?: string;
}

export function PlanHeader({ plan, dealCountry, dealRegion }: PlanHeaderProps) {
  const [isPending, startTransition] = useTransition();

  function onDelete() {
    if (!confirm(`Plan "${plan.name}" en alle activiteiten verwijderen?`)) return;
    startTransition(async () => {
      try {
        await deletePlan(plan.id);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Verwijderen mislukt");
      }
    });
  }

  return (
    <div className="flex flex-wrap items-start justify-between gap-3 border-b pb-4">
      <div className="min-w-0 flex-1">
        <Link
          href="/mijn-vakantie"
          className="mb-2 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="size-3" />
          Alle plannen
        </Link>
        <h1 className="text-2xl font-bold leading-tight">{plan.name}</h1>
        {(dealRegion || dealCountry) && (
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            {dealRegion && <Badge variant="outline">{dealRegion}</Badge>}
            {dealCountry && <Badge variant="secondary">{dealCountry}</Badge>}
          </p>
        )}
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onDelete}
        disabled={isPending}
        className="text-muted-foreground hover:text-destructive"
      >
        <Trash2 className="mr-1 size-4" />
        Verwijder plan
      </Button>
    </div>
  );
}
