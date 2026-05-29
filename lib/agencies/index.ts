import "server-only";
import { sunwebAdapter } from "@/lib/agencies/sunweb";
import { tuiAdapter } from "@/lib/agencies/tui";
import { corendonAdapter } from "@/lib/agencies/corendon";
import { byJuneAdapter } from "@/lib/agencies/byjune";
import { prijsvrijAdapter } from "@/lib/agencies/prijsvrij";
import { vakantiediscounterAdapter } from "@/lib/agencies/vakantiediscounter";
import { getUserSubmittedDeals } from "@/lib/data";
import type { AgencyAdapter } from "@/lib/agencies/types";
import type { Deal } from "@/types/deal";
import type {
  AgencyResult,
  SearchQuery,
  SearchResponse,
} from "@/types/search";

export const agencies: AgencyAdapter[] = [
  sunwebAdapter,
  tuiAdapter,
  corendonAdapter,
  byJuneAdapter,
  prijsvrijAdapter,
  vakantiediscounterAdapter,
];

const SEARCH_TIMEOUT_MS = 8_000;

export async function runAgencySearch(
  query: SearchQuery
): Promise<SearchResponse> {
  // Parallel: alle agencies + alle eigen deals tegelijk.
  const [agencyOutputs, userDeals] = await Promise.all([
    Promise.all(agencies.map((a) => runOne(a, query))),
    getUserSubmittedDeals(),
  ]);

  // Eigen deals worden ALTIJD getoond, ongeacht agency-filter, country-casing
  // of budget — anders ben je je net-toegevoegde deal kwijt achter de filters.
  // De client-side applyFilters/sortDeals doet het uiteindelijke weergave-filter.
  // Dedupe via deal-id in geval een toekomstige live scrape hetzelfde item raakt.
  const seen = new Set<string>();
  const deals: Deal[] = [];
  for (const r of agencyOutputs) {
    for (const d of r.deals) {
      if (!seen.has(d.id)) {
        seen.add(d.id);
        deals.push(d);
      }
    }
  }
  for (const d of userDeals) {
    if (!seen.has(d.id)) {
      seen.add(d.id);
      deals.push(d);
    }
  }

  const agencyResults: AgencyResult[] = agencyOutputs.map((r) => r.result);
  // Zichtbare "Eigen" entry in de AgencyStatus zodat de user kan zien hoeveel
  // van zijn eigen deals in de huidige weergave zitten.
  if (userDeals.length > 0) {
    agencyResults.push({
      provider: "Eigen",
      status: "ok",
      count: userDeals.length,
      durationMs: 0,
      message: "Eigen toegevoegd via bookmarklet / link / handmatig",
    });
  }

  deals.sort((a, b) => a.pricePerPerson - b.pricePerPerson);

  return { deals, agencies: agencyResults, query };
}

async function runOne(
  adapter: AgencyAdapter,
  query: SearchQuery
): Promise<{ deals: Deal[]; result: AgencyResult }> {
  const started = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), SEARCH_TIMEOUT_MS);
  const searchUrl = safeBuildUrl(adapter, query);

  try {
    const output = await adapter.search(query, controller.signal);
    const status = output.fallback ? "fallback" : "ok";
    return {
      deals: output.deals,
      result: {
        provider: adapter.provider,
        status,
        count: output.deals.length,
        durationMs: Date.now() - started,
        message: output.message,
        searchUrl,
      },
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return {
      deals: [],
      result: {
        provider: adapter.provider,
        status: "error",
        count: 0,
        durationMs: Date.now() - started,
        message,
        searchUrl,
      },
    };
  } finally {
    clearTimeout(timer);
  }
}

function safeBuildUrl(adapter: AgencyAdapter, query: SearchQuery): string | undefined {
  try {
    return adapter.buildSearchUrl(query);
  } catch {
    return adapter.homepage;
  }
}

export function agencyByProvider(provider: string): AgencyAdapter | undefined {
  return agencies.find((a) => a.provider === provider);
}
