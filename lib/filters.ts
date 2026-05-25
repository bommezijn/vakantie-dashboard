import type { Deal, FilterState, SortKey } from "@/types/deal";
import { parseFlightTime } from "@/lib/format";

export function applyFilters(
  deals: Deal[],
  state: Pick<
    FilterState,
    "maxBudget" | "keywords" | "providers" | "countries" | "showOverBudget"
  >
): Deal[] {
  return deals.filter((d) => {
    if (!state.showOverBudget && d.pricePerPerson > state.maxBudget) return false;
    if (state.keywords.length > 0 && !state.keywords.every((k) => d.keywords.includes(k)))
      return false;
    if (state.providers.length > 0 && !state.providers.includes(d.provider)) return false;
    if (state.countries.length > 0 && !state.countries.includes(d.country)) return false;
    return true;
  });
}

export function sortDeals(deals: Deal[], sortBy: SortKey): Deal[] {
  const sorted = deals.slice();
  switch (sortBy) {
    case "price-asc":
      return sorted.sort((a, b) => a.pricePerPerson - b.pricePerPerson);
    case "price-desc":
      return sorted.sort((a, b) => b.pricePerPerson - a.pricePerPerson);
    case "rating-desc":
      return sorted.sort((a, b) => b.rating - a.rating);
    case "flight-asc":
      return sorted.sort(
        (a, b) => parseFlightTime(a.flightTime) - parseFlightTime(b.flightTime)
      );
    case "duration-desc":
      return sorted.sort((a, b) => b.duration - a.duration);
    default:
      return sorted;
  }
}

export function uniqueProviders(deals: Deal[]): string[] {
  return Array.from(new Set(deals.map((d) => d.provider))).sort();
}

export function uniqueCountries(deals: Deal[]): string[] {
  return Array.from(new Set(deals.map((d) => d.country))).sort();
}
