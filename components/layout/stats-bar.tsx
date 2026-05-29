"use client";

import { Card } from "@/components/ui/card";
import { formatPrice } from "@/lib/format";
import type { Deal } from "@/types/deal";

interface StatsBarProps {
  deals: Deal[];
  filteredCount: number;
  withinBudget: number;
}

export function StatsBar({ deals, filteredCount, withinBudget }: StatsBarProps) {
  const cheapest = deals.reduce(
    (min, d) => (d.pricePerPerson < min.pricePerPerson ? d : min),
    deals[0]
  );

  const stats: Array<{ label: string; value: string }> = [
    { label: "Deals", value: String(deals.length) },
    { label: "Binnen budget", value: String(withinBudget) },
    { label: "Goedkoopste", value: cheapest ? formatPrice(cheapest.pricePerPerson) : "—" },
    { label: "Resultaten", value: String(filteredCount) },
  ];

  return (
    <Card className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-4">
      {stats.map((s) => (
        <div key={s.label} className="flex flex-col gap-0.5">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            {s.label}
          </p>
          <p className="text-2xl font-semibold tabular-nums">{s.value}</p>
        </div>
      ))}
    </Card>
  );
}
