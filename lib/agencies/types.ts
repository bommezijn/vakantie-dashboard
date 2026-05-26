import type { Deal, Provider } from "@/types/deal";
import type { SearchQuery } from "@/types/search";

export interface AgencyAdapter {
  provider: Provider;
  label: string;
  homepage: string;
  buildSearchUrl(query: SearchQuery): string;
  search(query: SearchQuery, signal: AbortSignal): Promise<Deal[]>;
}
