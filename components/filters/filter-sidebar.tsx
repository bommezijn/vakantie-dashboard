"use client";

import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BudgetSlider } from "@/components/filters/budget-slider";
import { TravelersToggle } from "@/components/filters/travelers-toggle";
import { KeywordFilters } from "@/components/filters/keyword-filters";
import { ProviderFilter } from "@/components/filters/provider-filter";
import { CountryFilter } from "@/components/filters/country-filter";
import { SortSelect } from "@/components/filters/sort-select";
import { OverBudgetToggle } from "@/components/filters/over-budget-toggle";
import { ResetFilters } from "@/components/filters/reset-filters";
import { uniqueCountries, uniqueProviders } from "@/lib/filters";
import type { Deal } from "@/types/deal";

interface FilterSidebarProps {
  deals: Deal[];
}

export function FilterSidebar({ deals }: FilterSidebarProps) {
  const providers = useMemo(() => uniqueProviders(deals), [deals]);
  const countries = useMemo(() => uniqueCountries(deals), [deals]);

  return (
    <Card className="space-y-5 p-4">
      <SortSelect />
      <Separator />
      <BudgetSlider />
      <TravelersToggle />
      <Separator />
      <KeywordFilters />
      <Separator />
      <ProviderFilter providers={providers} />
      <CountryFilter countries={countries} />
      <Separator />
      <OverBudgetToggle />
      <ResetFilters />
    </Card>
  );
}
