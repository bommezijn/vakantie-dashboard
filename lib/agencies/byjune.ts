import type { SearchQuery } from "@/types/search";
import type { AgencyAdapter, AgencySearchOutput } from "@/lib/agencies/types";
import { liveOrSeed } from "@/lib/agencies/live-search";

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

  async search(query: SearchQuery, signal: AbortSignal): Promise<AgencySearchOutput> {
    return liveOrSeed("ByJune", query, this.buildSearchUrl(query), signal);
  },
};
