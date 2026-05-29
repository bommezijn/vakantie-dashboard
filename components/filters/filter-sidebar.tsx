"use client";

import { useMemo } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { KeywordFilters } from "@/components/filters/keyword-filters";
import { ProviderFilter } from "@/components/filters/provider-filter";
import { SortSelect } from "@/components/filters/sort-select";
import { OverBudgetToggle } from "@/components/filters/over-budget-toggle";
import { ResetFilters } from "@/components/filters/reset-filters";
import { uniqueProviders } from "@/lib/filters";
import type { Deal } from "@/types/deal";

interface FilterSidebarProps {
  deals: Deal[];
}

export function FilterSidebar({ deals }: FilterSidebarProps) {
  const providers = useMemo(() => uniqueProviders(deals), [deals]);

  return (
    <Card className="space-y-4 p-4">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <SlidersHorizontal className="size-4 text-muted-foreground" />
        Verfijn resultaten
      </div>
      <Separator />
      <SortSelect />
      <Separator />
      <KeywordFilters />
      <Separator />
      <ProviderFilter providers={providers} />
      <Separator />
      <OverBudgetToggle />
      <ResetFilters />
    </Card>
  );
}
