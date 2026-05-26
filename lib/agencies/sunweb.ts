import type { SearchQuery } from "@/types/search";
import type { AgencyAdapter, AgencySearchOutput } from "@/lib/agencies/types";
import { liveOrSeed } from "@/lib/agencies/live-search";

// Sunweb gebruikt interne numerieke IDs per land — geen slugs. Deze mapping
// is groeiend; ontbrekende landen worden gewoon weggelaten, Sunweb toont
// dan alle landen die binnen de andere filters passen.
//
// Hoe nieuwe IDs vinden: doe een handmatige zoekopdracht op sunweb.nl en
// kopieer de Country[0]=X uit de URL.
const COUNTRY_ID: Record<string, number> = {
  Griekenland: 16,
  // TODO: aanvullen voor Turkije, Spanje, Portugal, Italië, Kroatië, Cyprus, etc.
};

// Synthetische volwassen-geboortedatum — Sunweb berekent leeftijden hieruit
// voor de prijsbepaling. Een vaste datum in 1996 = altijd volwassen prijs.
const ADULT_DOB = "1996-05-26";

const DEPARTURE_DATE = "2026-07-01";
const DURATION_RANGE = "8-11";

export const sunwebAdapter: AgencyAdapter = {
  provider: "Sunweb",
  label: "Sunweb",
  homepage: "https://www.sunweb.nl",

  /**
   * Bouwt een URL in het echte Sunweb-formaat zoals te zien na een handmatige
   * zoekopdracht. Vierkante haken blijven letterlijk (Sunweb verwacht ze
   * onge-encoded) dus we bouwen de query-string handmatig in plaats van via
   * URLSearchParams (die [ en ] encodeert naar %5B/%5D).
   *
   * Voorbeeld output voor 4 reizigers + Griekenland:
   *   /vakantie/zoeken?DepartureDate[0]=2026-07-01&Duration[0]=8-11
   *     &Participants[0][0]=1996-05-26&Participants[0][1]=1996-05-26
   *     &Participants[1][0]=1996-05-26&Participants[1][1]=1996-05-26
   *     &TransportType[0]=Flight&Country[0]=16
   */
  buildSearchUrl(query: SearchQuery): string {
    const parts: string[] = [
      "isFirstUserRequest=false",
      "autoLoad=false",
      `DepartureDate[0]=${DEPARTURE_DATE}`,
      `Duration[0]=${DURATION_RANGE}`,
    ];

    // Verdeel reizigers over kamers van max 2 personen (typisch package-deal patroon).
    const total = Math.max(1, query.travelers);
    const roomSize = 2;
    const roomCount = Math.ceil(total / roomSize);
    let remaining = total;
    for (let room = 0; room < roomCount; room++) {
      const inRoom = Math.min(roomSize, remaining);
      for (let person = 0; person < inRoom; person++) {
        parts.push(`Participants[${room}][${person}]=${ADULT_DOB}`);
      }
      remaining -= inRoom;
    }

    parts.push("TransportType[0]=Flight");

    query.countries.forEach((country, i) => {
      const id = COUNTRY_ID[country];
      if (id) parts.push(`Country[${i}]=${id}`);
    });

    return `https://www.sunweb.nl/vakantie/zoeken?${parts.join("&")}`;
  },

  async search(query: SearchQuery, signal: AbortSignal): Promise<AgencySearchOutput> {
    return liveOrSeed("Sunweb", query, this.buildSearchUrl(query), signal);
  },
};
