import { getDeals } from "@/lib/data";
import type { Deal, Provider } from "@/types/deal";
import type { SearchQuery } from "@/types/search";

export async function filterSeedForProvider(
  provider: Provider,
  query: SearchQuery
): Promise<Deal[]> {
  const all = await getDeals();
  return all
    .filter((d) => d.provider === provider)
    .filter((d) => {
      if (query.countries.length > 0 && !query.countries.includes(d.country)) {
        return false;
      }
      if (d.pricePerPerson > query.maxBudget * 1.25) {
        return false;
      }
      return true;
    });
}
