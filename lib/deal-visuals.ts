import type { Deal } from "@/types/deal";

/**
 * Visuele fallback voor deals zonder eigen afbeelding (alle curated seed-deals).
 * In plaats van een lege kaart krijgt elke bestemming een herkenbare gradient +
 * vlag, deterministisch op land. Geeft de lijst kleur zonder externe foto's of
 * netwerk-afhankelijkheid.
 */
interface CountryVisual {
  /** Tailwind gradient utility classes (from-/via-/to-). */
  gradient: string;
  emoji: string;
}

const COUNTRY_VISUAL: Record<string, CountryVisual> = {
  Turkije: { gradient: "from-rose-400 via-orange-300 to-amber-200", emoji: "🇹🇷" },
  Griekenland: { gradient: "from-sky-400 via-cyan-300 to-blue-200", emoji: "🇬🇷" },
  Spanje: { gradient: "from-amber-400 via-orange-300 to-red-300", emoji: "🇪🇸" },
  Portugal: { gradient: "from-emerald-400 via-teal-300 to-cyan-200", emoji: "🇵🇹" },
  Italie: { gradient: "from-green-400 via-lime-300 to-emerald-200", emoji: "🇮🇹" },
  Kroatie: { gradient: "from-blue-400 via-sky-300 to-indigo-200", emoji: "🇭🇷" },
  Bulgarije: { gradient: "from-teal-400 via-emerald-300 to-green-200", emoji: "🇧🇬" },
  Cyprus: { gradient: "from-cyan-400 via-sky-300 to-teal-200", emoji: "🇨🇾" },
  Egypte: { gradient: "from-yellow-400 via-amber-300 to-orange-200", emoji: "🇪🇬" },
  Albanie: { gradient: "from-red-400 via-rose-300 to-orange-200", emoji: "🇦🇱" },
  Montenegro: { gradient: "from-indigo-400 via-blue-300 to-sky-200", emoji: "🇲🇪" },
  Tunesie: { gradient: "from-orange-400 via-amber-300 to-yellow-200", emoji: "🇹🇳" },
  Oostenrijk: { gradient: "from-slate-400 via-sky-300 to-blue-200", emoji: "🇦🇹" },
};

const DEFAULT_VISUAL: CountryVisual = {
  gradient: "from-[#94adff] via-sky-300 to-[#e8fd94]",
  emoji: "🏖️",
};

const TYPE_EMOJI: Record<Deal["type"], string> = {
  villa: "🏡",
  appartement: "🏢",
  hotel: "🏨",
  aparthotel: "🏬",
  "all-inclusive": "🍹",
};

export function visualForCountry(country: string): CountryVisual {
  return COUNTRY_VISUAL[country] ?? DEFAULT_VISUAL;
}

export function emojiForType(type: Deal["type"]): string {
  return TYPE_EMOJI[type] ?? "🏖️";
}

/** Normaliseer protocol-relatieve (//cdn...) URLs naar https:// voor next/image. */
export function normalizeImageUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  return url.startsWith("//") ? `https:${url}` : url;
}
