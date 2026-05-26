import "server-only";
import { sunwebAdapter } from "@/lib/agencies/sunweb";
import { tuiAdapter } from "@/lib/agencies/tui";
import { corendonAdapter } from "@/lib/agencies/corendon";
import { byJuneAdapter } from "@/lib/agencies/byjune";
import { prijsvrijAdapter } from "@/lib/agencies/prijsvrij";
import { vakantiediscounterAdapter } from "@/lib/agencies/vakantiediscounter";
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

const SEARCH_TIMEOUT_MS = 5_000;

export async function runAgencySearch(
  query: SearchQuery
): Promise<SearchResponse> {
  const results = await Promise.all(agencies.map((a) => runOne(a, query)));

  const deals: Deal[] = results.flatMap((r) => r.deals);
  const agencyResults: AgencyResult[] = results.map((r) => r.result);

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

  try {
    const deals = await adapter.search(query, controller.signal);
    return {
      deals,
      result: {
        provider: adapter.provider,
        status: "ok",
        count: deals.length,
        durationMs: Date.now() - started,
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
      },
    };
  } finally {
    clearTimeout(timer);
  }
}

export function agencyByProvider(provider: string): AgencyAdapter | undefined {
  return agencies.find((a) => a.provider === provider);
}
