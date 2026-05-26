import type { Deal } from "@/types/deal";
import type { SearchQuery } from "@/types/search";
import type { AgencyAdapter } from "@/lib/agencies/types";
import { filterSeedForProvider } from "@/lib/agencies/seed-filter";

export const byJuneAdapter: AgencyAdapter = {
  provider: "ByJune",
  label: "ByJune",
  homepage: "https://byjune.nl",

  buildSearchUrl(query: SearchQuery): string {
    const params = new URLSearchParams();
    params.set("guests", String(query.travelers));
    if (query.maxBudget) params.set("budget", String(query.maxBudget));
    if (query.countries.length > 0) {
      params.set("destinations", query.countries.join(","));
    }
    return `https://byjune.nl/zomer-2026?${params}`;
  },

  async search(query: SearchQuery): Promise<Deal[]> {
    return filterSeedForProvider("ByJune", query);
  },
};
