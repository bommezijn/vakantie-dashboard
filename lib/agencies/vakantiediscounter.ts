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

export const vakantiediscounterAdapter: AgencyAdapter = {
  provider: "Vakantiediscounter",
  label: "Vakantiediscounter",
  homepage: "https://www.vakantiediscounter.nl",

  buildSearchUrl(query: SearchQuery): string {
    const params = new URLSearchParams();
    params.set("personen", String(query.travelers));
    params.set("luchthaven", "AMS");
    params.set("maand", "juli-2026");
    if (query.maxBudget) params.set("budget", String(query.maxBudget));

    if (query.countries.length === 1) {
      const slug = COUNTRY_SLUG[query.countries[0]];
      if (slug)
        return `https://www.vakantiediscounter.nl/vakantie/${slug}/?${params}`;
    }
    return `https://www.vakantiediscounter.nl/vakantie/?${params}`;
  },

  async search(query: SearchQuery) {
    return filterSeedForProvider("Vakantiediscounter", query);
  },
};
