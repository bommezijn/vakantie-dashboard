"use client";

import { useMemo } from "react";
import { useQueryStates } from "nuqs";
import { SiteHeader } from "@/components/layout/site-header";
import { StatsBar } from "@/components/layout/stats-bar";
import { FilterSidebar } from "@/components/filters/filter-sidebar";
import { DealList } from "@/components/deals/deal-list";
import { DealDetailSheet } from "@/components/deals/deal-detail-sheet";
import { AddDealLinkForm } from "@/components/deals/add-deal-link-form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { applyFilters, sortDeals } from "@/lib/filters";
import { filterParsers } from "@/lib/search-params";
import type { Rates } from "@/lib/currency";
import type { Deal } from "@/types/deal";

interface DashboardShellProps {
  deals: Deal[];
  rates: Rates;
}

export function DashboardShell({ deals, rates }: DashboardShellProps) {
  const [state] = useQueryStates(filterParsers);

  const filtered = useMemo(
    () =>
      sortDeals(
        applyFilters(deals, {
          maxBudget: state.budget,
          keywords: state.keywords,
          providers: state.providers,
          countries: state.countries,
          showOverBudget: state.showOverBudget,
        }),
        state.sort
      ),
    [deals, state]
  );

  const withinBudget = useMemo(
    () => deals.filter((d) => d.pricePerPerson <= state.budget).length,
    [deals, state.budget]
  );

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <div className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 gap-4 px-4 py-4 lg:grid-cols-[320px_1fr] lg:px-6">
        <aside className="lg:sticky lg:top-4 lg:h-[calc(100vh-6rem)]">
          <ScrollArea className="lg:h-full">
            <FilterSidebar deals={deals} />
          </ScrollArea>
        </aside>
        <main className="flex flex-col gap-4">
          <AddDealLinkForm />
          <StatsBar
            deals={deals}
            filteredCount={filtered.length}
            withinBudget={withinBudget}
          />
          <DealList deals={filtered} travelers={state.travelers} maxBudget={state.budget} />
        </main>
      </div>
      <DealDetailSheet deals={deals} travelers={state.travelers} rates={rates} />
    </div>
  );
}
