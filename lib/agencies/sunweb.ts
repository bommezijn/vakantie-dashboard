import type { SearchQuery } from "@/types/search";
import type { AgencyAdapter, AgencySearchOutput } from "@/lib/agencies/types";
import { liveOrSeed } from "@/lib/agencies/live-search";

// Sunweb gebruikt interne numerieke IDs per land — geen slugs. Mapping
// gevonden door handmatig zoeken op sunweb.nl en de Country[0]=X uit de URL
// te kopiëren. Onbekende landen worden weggelaten — Sunweb toont dan
// alle landen die binnen de andere filters passen.
const COUNTRY_ID: Record<string, number> = {
  Bulgarije: 4,
  Egypte: 11,
  Griekenland: 16,
  Italie: 20,
  Oostenrijk: 2,
  Portugal: 27,
  Spanje: 12,
  Tunesie: 28,
  Turkije: 29,
};

// Synthetische volwassen-geboortedatum — Sunweb berekent leeftijden hieruit
// voor de prijsbepaling. Een vaste datum in 1996 = altijd volwassen prijs.
const ADULT_DOB = "1996-05-26";

const DEPARTURE_DATE = "2026-07-01";
const DURATION_RANGE = "8-11";

// Mapping van onze DealType (uit types/deal.ts) naar Sunweb's AccommodationType
// codes. Voor "all-inclusive" gebruiken we HOTEL + Mealplan=AI (zie hieronder).
const ACCOMMODATION_TYPE: Record<string, string> = {
  hotel: "HOTEL",
  appartement: "APARTMENT",
  aparthotel: "APARTHOTEL",
  villa: "HOTEL", // Sunweb categoriseert villa's onder hotels
};

// Mapping voor catering — Sunweb gebruikt:
//   AI = all-inclusive, UA = ultra all-inclusive, HP = half-pension,
//   FB = volpension, OB = ontbijt, RO = logies
const MEALPLAN: Record<string, string> = {
  "all-inclusive": "AI",
  halfpension: "HP",
  ontbijt: "OB",
  logies: "RO",
};

export const sunwebAdapter: AgencyAdapter = {
  provider: "Sunweb",
  label: "Sunweb",
  homepage: "https://www.sunweb.nl",

  /**
   * Bouwt een URL in het echte Sunweb-formaat zoals te zien na een handmatige
   * zoekopdracht. Vierkante haken blijven letterlijk (Sunweb accepteert beide,
   * maar zonder encoding is de URL leesbaar in logs en de adresbalk).
   *
   * Voorbeeld output voor 4 reizigers + Turkije + hotel + all-inclusive:
   *   /vakantie/zoeken?Country[0]=29&Duration[0]=8-11
   *     &Participants[0][0]=1996-05-26&Participants[0][1]=1996-05-26
   *     &Participants[1][0]=1996-05-26&Participants[1][1]=1996-05-26
   *     &AccommodationType[0]=HOTEL&Mealplan[0]=AI
   *     &DepartureDate=2026-07-01&TransportType=Flight
   *     &limit=10&offset=0&sort=Popularity&autoLoad=false
   */
  buildSearchUrl(query: SearchQuery): string {
    const parts: string[] = [];

    // Land — eerst zodat het de eerste param is (consistent met Sunweb output)
    query.countries.forEach((country, i) => {
      const id = COUNTRY_ID[country];
      if (id) parts.push(`Country[${i}]=${id}`);
    });

    parts.push(`Duration[0]=${DURATION_RANGE}`);

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

    // Optionele filters — alleen toevoegen als de keyword-zoekopdracht
    // expliciet een type of catering noemt (uitbreidbaar zodra we de
    // SearchQuery type uitbreiden met accommodationType/mealplan velden).
    for (const kw of query.keywords) {
      const accomCode = ACCOMMODATION_TYPE[kw.toLowerCase()];
      if (accomCode) parts.push(`AccommodationType[0]=${accomCode}`);
      const mealCode = MEALPLAN[kw.toLowerCase()];
      if (mealCode) parts.push(`Mealplan[0]=${mealCode}`);
    }

    parts.push(`DepartureDate=${DEPARTURE_DATE}`);
    parts.push("TransportType=Flight");
    parts.push("limit=10");
    parts.push("offset=0");
    parts.push("sort=Popularity");
    parts.push("autoLoad=false");

    return `https://www.sunweb.nl/vakantie/zoeken?${parts.join("&")}`;
  },

  async search(query: SearchQuery, signal: AbortSignal): Promise<AgencySearchOutput> {
    return liveOrSeed("Sunweb", query, this.buildSearchUrl(query), signal);
  },
};
