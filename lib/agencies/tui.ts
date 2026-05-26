import type { SearchQuery } from "@/types/search";
import type { AgencyAdapter, AgencySearchOutput } from "@/lib/agencies/types";
import { liveOrSeed } from "@/lib/agencies/live-search";

// TUI gebruikt /reizen/{land-slug}/ als canonieke URL. Filters (datum, prijs,
// type) zitten in client-side state, niet in de URL. We kunnen dus geen
// search-state via URL meegeven.
const COUNTRY_SLUG: Record<string, string> = {
  Turkije: "turkije",
  Griekenland: "griekenland",
  Spanje: "spanje",
  Portugal: "portugal",
  Italie: "italie",
  Kroatie: "kroatie",
  Cyprus: "cyprus",
  Egypte: "egypte",
  Bulgarije: "bulgarije",
  Albanie: "albanie",
  Tunesie: "tunesie",
  Oostenrijk: "oostenrijk",
};

export const tuiAdapter: AgencyAdapter = {
  provider: "TUI",
  label: "TUI",
  homepage: "https://www.tui.nl",

  /**
   * TUI is een SPA met server-side WAF (geeft 403 op alle non-browser
   * requests, ook met realistische UA). Deze URL is bedoeld voor de
   * "Open zoekpagina" knop — de gebruiker opent hem in zijn eigen browser
   * waar de bot-protection doorgelaten wordt.
   *
   * Voor één land → land-specifieke pagina. Anders → zoek-homepage.
   */
  buildSearchUrl(query: SearchQuery): string {
    if (query.countries.length === 1) {
      const slug = COUNTRY_SLUG[query.countries[0]];
      if (slug) return `https://www.tui.nl/reizen/${slug}/`;
    }
    return "https://www.tui.nl/zonvakanties/";
  },

  async search(query: SearchQuery, signal: AbortSignal): Promise<AgencySearchOutput> {
    return liveOrSeed("TUI", query, this.buildSearchUrl(query), signal);
  },
};
