export type Provider =
  | "TUI"
  | "Sunweb"
  | "Corendon"
  | "ByJune"
  | "Prijsvrij"
  | "Vakantiediscounter";

export type DealType =
  | "villa"
  | "appartement"
  | "hotel"
  | "aparthotel"
  | "all-inclusive";

export type Catering = "logies" | "ontbijt" | "halfpension" | "all-inclusive";

export interface DealRatings {
  sun: number;
  food: number;
  culture: number;
  pool: number;
}

export interface Deal {
  id: string;
  title: string;
  destination: string;
  country: string;
  region: string;
  provider: Provider;
  providerUrl: string;
  type: DealType;
  pricePerPerson: number;
  duration: number;
  startDate: string;
  flightTime: string;
  inclusions: string[];
  catering: Catering;
  ratings: DealRatings;
  rating: number;
  keywords: string[];
  description: string;
  highlights: string[];
  source?: "curated" | "user";
  imageUrl?: string | null;
  /** How the deal entered the system. Lets the UI badge per-source. */
  createdVia?: "curated" | "bookmarklet" | "link-paste" | "manual";
  /** True when the current user owns the deal — controls whether the
   *  delete action shows. Set in the server-side mapper. */
  ownedByMe?: boolean;
}

export type SortKey =
  | "price-asc"
  | "price-desc"
  | "rating-desc"
  | "flight-asc"
  | "duration-desc";

export interface FilterState {
  maxBudget: number;
  travelers: number;
  keywords: string[];
  providers: string[];
  countries: string[];
  showOverBudget: boolean;
  sortBy: SortKey;
  source: "all" | "user" | "agency";
}
