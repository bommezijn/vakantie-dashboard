import type { Deal } from "@/types/deal";
import type { SearchQuery } from "@/types/search";
import type { AgencyAdapter } from "@/lib/agencies/types";
import { filterSeedForProvider } from "@/lib/agencies/seed-filter";

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

export const sunwebAdapter: AgencyAdapter = {
  provider: "Sunweb",
  label: "Sunweb",
  homepage: "https://www.sunweb.nl",

  buildSearchUrl(query: SearchQuery): string {
    const params = new URLSearchParams();
    params.set("personen", String(query.travelers));
    params.set("vertrek", "amsterdam");
    params.set("vertrekmaand", "2026-07");
    if (query.maxBudget) params.set("maxprijs", String(query.maxBudget));

    if (query.countries.length === 1) {
      const slug = COUNTRY_SLUG[query.countries[0]];
      if (slug) return `https://www.sunweb.nl/vakantie/${slug}?${params}`;
    }
    return `https://www.sunweb.nl/zoeken?${params}`;
  },

  async search(query: SearchQuery, _signal: AbortSignal): Promise<Deal[]> {
    return filterSeedForProvider("Sunweb", query);
  },
};
