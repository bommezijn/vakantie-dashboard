import type { SearchQuery } from "@/types/search";
import type { AgencyAdapter, AgencySearchOutput } from "@/lib/agencies/types";
import { liveOrSeed } from "@/lib/agencies/live-search";

const COUNTRY_SLUG: Record<string, string> = {
  Turkije: "turkije",
  Griekenland: "griekenland",
  Spanje: "spanje",
  Portugal: "portugal",
  Bulgarije: "bulgarije",
  Italie: "italie",
  Kroatie: "kroatie",
  Cyprus: "cyprus",
  Egypte: "egypte",
  Albanie: "albanie",
  Montenegro: "montenegro",
};

export const prijsvrijAdapter: AgencyAdapter = {
  provider: "Prijsvrij",
  label: "Prijsvrij",
  homepage: "https://www.prijsvrij.nl",

  buildSearchUrl(query: SearchQuery): string {
    const params = new URLSearchParams();
    params.set("personen", String(query.travelers));
    params.set("vertrekluchthaven", "AMS");
    params.set("vertrekmaand", "2026-07");
    if (query.maxBudget) params.set("maxprijs", String(query.maxBudget));

    if (query.countries.length === 1) {
      const slug = COUNTRY_SLUG[query.countries[0]];
      if (slug) return `https://www.prijsvrij.nl/reizen/${slug}/?${params}`;
    }
    return `https://www.prijsvrij.nl/reizen/?${params}`;
  },

  async search(query: SearchQuery, signal: AbortSignal): Promise<AgencySearchOutput> {
    return liveOrSeed("Prijsvrij", query, this.buildSearchUrl(query), signal);
  },
};
