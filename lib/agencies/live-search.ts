import "server-only";
import type { Provider } from "@/types/deal";
import type { SearchQuery } from "@/types/search";
import { fetchHtml, extractJsonLd } from "@/lib/agencies/scraper";
import { extractDealsFromJsonLd } from "@/lib/agencies/extract";
import { filterSeedForProvider } from "@/lib/agencies/seed-filter";
import type { AgencySearchOutput } from "@/lib/agencies/types";

/**
 * Standard "try live, fall back to seed" flow used by every adapter.
 *
 * Live attempt:
 *  1. Fetch search URL with a real browser UA.
 *  2. Parse JSON-LD blocks.
 *  3. If we extracted at least one deal → return them as `ok`.
 *
 * Fallback (any failure: 403, timeout, no JSON-LD, no extractable deals):
 *  → return seed-data filtered for this provider, marked as `fallback`.
 *
 * The reason for always returning *something* is UX — searches should never
 * come back empty just because TUI's WAF blocked us. The seed gives the user
 * realistic-looking options, and the UI surfaces the "Open zoekpagina" CTA
 * via the agency result so they can also dig further on the provider's site.
 */
export async function liveOrSeed(
  provider: Provider,
  query: SearchQuery,
  searchUrl: string,
  signal: AbortSignal
): Promise<AgencySearchOutput> {
  try {
    const html = await fetchHtml(searchUrl, signal);
    const blocks = extractJsonLd(html);
    const country = query.countries[0] ?? "";
    const live = extractDealsFromJsonLd(blocks, provider, country, searchUrl);

    if (live.length > 0) {
      // Apply the same budget tolerance as the seed filter so unrealistic prices
      // don't pollute the result. (Live data is noisy.)
      const filtered = live.filter(
        (d) => d.pricePerPerson <= query.maxBudget * 1.5
      );
      if (filtered.length > 0) return { deals: filtered };
    }

    // Live fetch worked but yielded no usable deals — common for SPA sites
    // that render results client-side. Fall back gracefully.
    return {
      deals: await filterSeedForProvider(provider, query),
      fallback: true,
      message: "live: 0 resultaten in JSON-LD",
    };
  } catch (err) {
    const reason = err instanceof Error ? err.message : "fetch failed";
    return {
      deals: await filterSeedForProvider(provider, query),
      fallback: true,
      message: `live: ${reason}`,
    };
  }
}
