import type { Deal, Provider } from "@/types/deal";

export interface SearchQuery {
  countries: string[];
  travelers: number;
  maxBudget: number;
  keywords: string[];
}

export type AgencyStatus = "ok" | "fallback" | "error" | "skipped";

export interface AgencyResult {
  provider: Provider;
  status: AgencyStatus;
  count: number;
  durationMs: number;
  message?: string;
  /** The URL the adapter searched on — surfaced to the UI so the user can
   *  open the provider's own search page when live scraping fails. */
  searchUrl?: string;
}

export interface SearchResponse {
  deals: Deal[];
  agencies: AgencyResult[];
  query: SearchQuery;
}
