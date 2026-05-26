import type { Deal } from "@/types/deal";
import type { SearchQuery } from "@/types/search";
import type { AgencyAdapter } from "@/lib/agencies/types";
import { filterSeedForProvider } from "@/lib/agencies/seed-filter";

const COUNTRY_SLUG: Record<string, string> = {
  Turkije: "turkije",
  Griekenland: "griekenland",
  Spanje: "spanje",
  Egypte: "egypte",
  Bulgarije: "bulgarije",
  Cyprus: "cyprus",
  Portugal: "portugal",
};

export const corendonAdapter: AgencyAdapter = {
  provider: "Corendon",
  label: "Corendon",
  homepage: "https://www.corendon.nl",

  buildSearchUrl(query: SearchQuery): string {
    const params = new URLSearchParams();
    params.set("personen", String(query.travelers));
    params.set("vertrekluchthaven", "AMS");
    params.set("vertrekmaand", "07-2026");
    if (query.maxBudget) params.set("budget", String(query.maxBudget));

    if (query.countries.length === 1) {
      const slug = COUNTRY_SLUG[query.countries[0]];
      if (slug) return `https://www.corendon.nl/zomer/${slug}?${params}`;
    }
    return `https://www.corendon.nl/zoeken?${params}`;
  },

  async search(query: SearchQuery, _signal: AbortSignal): Promise<Deal[]> {
    return filterSeedForProvider("Corendon", query);
  },
};
