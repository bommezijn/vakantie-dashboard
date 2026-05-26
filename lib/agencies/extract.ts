import "server-only";
import type { Deal, Provider } from "@/types/deal";
import { normalizeImageUrl } from "@/lib/agencies/scraper";

/**
 * Best-effort: walk JSON-LD blocks looking for entries that look like
 * a vacation offer / hotel / package. Most NL travel sites publish
 * Hotel + AggregateOffer at the product-detail level; search pages
 * sometimes publish ItemList with embedded offers.
 *
 * Returns whatever we could confidently extract. Unknown shapes are skipped —
 * we don't try to be clever, we'd rather return nothing than wrong data.
 */
export function extractDealsFromJsonLd(
  blocks: unknown[],
  provider: Provider,
  country: string,
  searchUrl: string
): Deal[] {
  const deals: Deal[] = [];

  for (const block of blocks) {
    if (!block || typeof block !== "object") continue;
    const node = block as Record<string, unknown>;
    const type = normalizeType(node["@type"]);

    // ItemList: travel search results commonly use this with an array
    // of ListItems pointing at Hotel/Product items.
    if (type.includes("ItemList") && Array.isArray(node.itemListElement)) {
      for (const item of node.itemListElement) {
        if (!item || typeof item !== "object") continue;
        const li = item as Record<string, unknown>;
        const target = (li.item ?? li) as Record<string, unknown>;
        const deal = tryToDeal(target, provider, country, searchUrl);
        if (deal) deals.push(deal);
      }
      continue;
    }

    // Direct Hotel / Product / TouristTrip / LodgingBusiness
    const deal = tryToDeal(node, provider, country, searchUrl);
    if (deal) deals.push(deal);
  }

  return dedupe(deals);
}

function normalizeType(raw: unknown): string[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.map(String);
  return [String(raw)];
}

function tryToDeal(
  node: Record<string, unknown>,
  provider: Provider,
  country: string,
  searchUrl: string
): Deal | null {
  const types = normalizeType(node["@type"]);
  const isVacationLike = types.some((t) =>
    /Hotel|Product|TouristTrip|TouristProduct|LodgingBusiness|Resort/i.test(t)
  );
  if (!isVacationLike) return null;

  const name = pickString(node, ["name", "title"]);
  if (!name) return null;

  const url = pickString(node, ["url", "@id"]);
  if (!url) return null;

  const price = pickPrice(node);
  if (price == null) return null;

  const description = pickString(node, ["description"]) ?? "";
  const image = normalizeImageUrl(pickImageUrl(node));
  const region = pickRegion(node) ?? "—";

  // Synthetic ID — we never persist these, they live for the lifetime of the
  // request so the React keys are stable enough.
  const id = `live-${provider.toLowerCase()}-${hash(url)}`;

  return {
    id,
    title: name,
    destination: region,
    country,
    region,
    provider,
    providerUrl: url.startsWith("http") ? url : new URL(url, searchUrl).toString(),
    type: "hotel",
    pricePerPerson: price,
    duration: 7,
    startDate: "2026-07-01",
    flightTime: "—",
    inclusions: [],
    catering: "logies",
    ratings: { sun: 3, food: 3, culture: 3, pool: 3 },
    rating: pickRating(node) ?? 0,
    keywords: [],
    description,
    highlights: [],
    source: "user", // live results aren't curated; reuse the user-deal accent styling
    imageUrl: image,
  };
}

function pickString(node: Record<string, unknown>, keys: string[]): string | null {
  for (const k of keys) {
    const v = node[k];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return null;
}

function pickPrice(node: Record<string, unknown>): number | null {
  const offers = node.offers;
  const candidates: unknown[] = [];
  if (Array.isArray(offers)) candidates.push(...offers);
  else if (offers) candidates.push(offers);
  candidates.push(node);

  for (const c of candidates) {
    if (!c || typeof c !== "object") continue;
    const obj = c as Record<string, unknown>;
    const raw = obj.lowPrice ?? obj.price ?? obj.priceSpecification;
    const n = coercePrice(raw);
    if (n != null) return n;
  }
  return null;
}

function coercePrice(raw: unknown): number | null {
  if (typeof raw === "number" && Number.isFinite(raw) && raw > 0) return Math.round(raw);
  if (typeof raw === "string") {
    const cleaned = raw.replace(/[^\d.,]/g, "").replace(",", ".");
    const n = parseFloat(cleaned);
    if (Number.isFinite(n) && n > 0) return Math.round(n);
  }
  if (raw && typeof raw === "object") {
    const obj = raw as Record<string, unknown>;
    return coercePrice(obj.price ?? obj.value);
  }
  return null;
}

function pickRating(node: Record<string, unknown>): number | null {
  const ar = node.aggregateRating;
  if (!ar || typeof ar !== "object") return null;
  const v = (ar as Record<string, unknown>).ratingValue;
  if (typeof v === "number") return v;
  if (typeof v === "string") {
    const n = parseFloat(v.replace(",", "."));
    if (Number.isFinite(n)) return n;
  }
  return null;
}

function pickImageUrl(node: Record<string, unknown>): string | null {
  const img = node.image;
  if (typeof img === "string") return img;
  if (Array.isArray(img) && img.length > 0) {
    const first = img[0];
    if (typeof first === "string") return first;
    if (first && typeof first === "object") {
      return (first as Record<string, unknown>).url as string | null;
    }
  }
  if (img && typeof img === "object") {
    return (img as Record<string, unknown>).url as string | null;
  }
  return null;
}

function pickRegion(node: Record<string, unknown>): string | null {
  const addr = node.address;
  if (addr && typeof addr === "object") {
    const a = addr as Record<string, unknown>;
    return (
      pickString(a, ["addressLocality", "addressRegion"]) ?? null
    );
  }
  return pickString(node, ["addressLocality", "addressRegion"]);
}

function hash(s: string): string {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h).toString(36);
}

function dedupe(deals: Deal[]): Deal[] {
  const seen = new Set<string>();
  return deals.filter((d) => {
    if (seen.has(d.providerUrl)) return false;
    seen.add(d.providerUrl);
    return true;
  });
}
