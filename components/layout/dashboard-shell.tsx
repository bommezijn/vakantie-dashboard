"use client";

import { useMemo } from "react";
import { useQueryStates } from "nuqs";
import type { Deal } from "@/types/deal";
import { SiteHeader } from "@/components/layout/site-header";
import { StatsBar } from "@/components/layout/stats-bar";
import { FilterSidebar } from "@/components/filters/filter-sidebar";
import { DealList } from "@/components/deals/deal-list";
import { DealDetailSheet } from "@/components/deals/deal-detail-sheet";
import { AddDealLinkForm } from "@/components/deals/add-deal-link-form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SearchHero } from "@/components/search/search-hero";
import { WelcomeState } from "@/components/search/welcome-state";
import { AgencyStatus } from "@/components/search/agency-status";
import { applyFilters, sortDeals } from "@/lib/filters";
import { filterParsers } from "@/lib/search-params";
import type { Rates } from "@/lib/currency";
import type { SearchResponse } from "@/types/search";

const NO_DEALS: Deal[] = [];

interface DashboardShellProps {
  initialResponse: SearchResponse | null;
  rates: Rates;
}

export function DashboardShell({ initialResponse, rates }: DashboardShellProps) {
  const [state] = useQueryStates(filterParsers);

  const deals = initialResponse?.deals ?? NO_DEALS;

  const filtered = useMemo(
    () =>
      sortDeals(
        applyFilters(deals, {
          maxBudget: state.budget,
          keywords: state.keywords,
          providers: state.providers,
          countries: state.countries,
          showOverBudget: state.showOverBudget,
          source: state.source,
        }),
        state.sort
      ),
    [deals, state]
  );

  const withinBudget = useMemo(
    () => deals.filter((d) => d.pricePerPerson <= state.budget).length,
    [deals, state.budget]
  );

  const filteredUserDealCount = useMemo(
    () =>
      applyFilters(deals, {
        maxBudget: state.budget,
        keywords: state.keywords,
        providers: state.providers,
        countries: state.countries,
        showOverBudget: state.showOverBudget,
        source: "user",
      }).length,
    [deals, state.budget, state.keywords, state.providers, state.countries, state.showOverBudget]
  );

  const hasSearched = state.searched && initialResponse !== null;

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <div className="mx-auto w-full max-w-7xl flex-1 space-y-4 px-4 py-4 lg:px-6">
        <SearchHero
          initial={{
            countries: state.countries,
            travelers: state.travelers,
            maxBudget: state.budget,
          }}
          compact={hasSearched}
        />

        {!hasSearched ? (
          <WelcomeState />
        ) : (
          <>
            {initialResponse && (
              <AgencyStatus agencies={initialResponse.agencies} />
            )}
            <AddDealLinkForm />
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[300px_1fr]">
              <aside className="lg:sticky lg:top-4 lg:h-[calc(100vh-6rem)]">
                <ScrollArea className="lg:h-full">
                  <FilterSidebar deals={deals} filteredUserDealCount={filteredUserDealCount} />
                </ScrollArea>
              </aside>
              <main className="flex flex-col gap-4">
                <StatsBar
                  deals={deals}
                  filteredCount={filtered.length}
                  withinBudget={withinBudget}
                />
                <DealList
                  deals={filtered}
                  travelers={state.travelers}
                  maxBudget={state.budget}
                />
              </main>
            </div>
          </>
        )}
      </div>
      <DealDetailSheet deals={deals} travelers={state.travelers} rates={rates} />
    </div>
  );
}
