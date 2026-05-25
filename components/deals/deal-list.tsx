"use client";

import { DealCard } from "@/components/deals/deal-card";
import { EmptyState } from "@/components/deals/empty-state";
import type { Deal } from "@/types/deal";

interface DealListProps {
  deals: Deal[];
  travelers: number;
  maxBudget: number;
}

export function DealList({ deals, travelers, maxBudget }: DealListProps) {
  if (deals.length === 0) return <EmptyState />;

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {deals.map((deal) => (
        <DealCard
          key={deal.id}
          deal={deal}
          travelers={travelers}
          maxBudget={maxBudget}
        />
      ))}
    </div>
  );
}
