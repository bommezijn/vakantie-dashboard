import type { Deal } from "@/types/deal";
import type { SearchQuery } from "@/types/search";
import type { AgencyAdapter } from "@/lib/agencies/types";
import { filterSeedForProvider } from "@/lib/agencies/seed-filter";

const COUNTRY_PATH: Record<string, string> = {
  Turkije: "turkije",
  Griekenland: "griekenland",
  Spanje: "spanje",
  Portugal: "portugal",
  Italie: "italie",
  Kroatie: "kroatie",
  Cyprus: "cyprus",
  Egypte: "egypte",
  Bulgarije: "bulgarije",
};

export const tuiAdapter: AgencyAdapter = {
  provider: "TUI",
  label: "TUI",
  homepage: "https://www.tui.nl",

  buildSearchUrl(query: SearchQuery): string {
    const params = new URLSearchParams();
    params.set("adults", String(query.travelers));
    params.set("departure", "AMS");
    params.set("departureMonth", "2026-07");
    if (query.maxBudget) params.set("maxPrice", String(query.maxBudget));

    if (query.countries.length === 1) {
      const slug = COUNTRY_PATH[query.countries[0]];
      if (slug) return `https://www.tui.nl/zonvakantie/${slug}/?${params}`;
    }
    return `https://www.tui.nl/zonvakantie/zoeken/?${params}`;
  },

  async search(query: SearchQuery, _signal: AbortSignal): Promise<Deal[]> {
    return filterSeedForProvider("TUI", query);
  },
};
