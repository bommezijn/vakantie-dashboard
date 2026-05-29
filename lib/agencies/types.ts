import type { Deal, Provider } from "@/types/deal";
import type { SearchQuery } from "@/types/search";

export interface AgencySearchOutput {
  deals: Deal[];
  /** true when we couldn't get live data and the deals come from the seed cache. */
  fallback?: boolean;
  /** Optional human-readable hint about why we fell back (e.g. "HTTP 403"). */
  message?: string;
}

export interface AgencyAdapter {
  provider: Provider;
  label: string;
  homepage: string;
  buildSearchUrl(query: SearchQuery): string;
  search(query: SearchQuery, signal: AbortSignal): Promise<AgencySearchOutput>;
}
