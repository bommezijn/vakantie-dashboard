import { Suspense } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { runAgencySearch } from "@/lib/agencies";
import { getRates } from "@/lib/currency";
import { DEFAULT_BUDGET, DEFAULT_TRAVELERS } from "@/lib/defaults";
import type { Rates } from "@/lib/currency";
import type { SearchResponse } from "@/types/search";

type PageSearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function Home({
  searchParams,
}: {
  searchParams: PageSearchParams;
}) {
  const params = await searchParams;
  const searched = params.searched === "true" || params.searched === "1";

  let response: SearchResponse | null = null;
  let rates: Rates = {};

  if (searched) {
    [response, rates] = await Promise.all([
      runAgencySearch({
        countries: parseList(params.countries),
        travelers: parseNumber(params.travelers, DEFAULT_TRAVELERS),
        maxBudget: parseNumber(params.budget, DEFAULT_BUDGET),
        keywords: parseList(params.keywords),
      }),
      getRates(),
    ]);
  }

  return (
    <Suspense>
      <DashboardShell initialResponse={response} rates={rates} />
    </Suspense>
  );
}

function parseList(value: string | string[] | undefined): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return value.split(",").filter(Boolean);
}

function parseNumber(value: string | string[] | undefined, fallback: number): number {
  if (!value) return fallback;
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = parseInt(raw, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}
