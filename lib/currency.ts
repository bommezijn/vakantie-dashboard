// Country (NL spelling, matches seed-deals.ts) → ISO 4217 currency code.
// EUR-zone destinations are excluded — they map to EUR and don't need a secondary price.
// Bulgarije/Kroatië adopted EUR — omit. Frankfurter doesn't carry ALL/EGP/MAD/TND/RSD/BAM/MKD,
// so listing them is harmless (convertFromEur returns null → secondary line hidden).
const NON_EUR_COUNTRY_CURRENCY: Record<string, string> = {
  Turkije: "TRY",
  "Verenigd Koninkrijk": "GBP",
  Zwitserland: "CHF",
  Noorwegen: "NOK",
  Zweden: "SEK",
  Denemarken: "DKK",
  Polen: "PLN",
  Tsjechië: "CZK",
  Hongarije: "HUF",
  Roemenië: "RON",
  IJsland: "ISK",
};

export type Rates = Record<string, number>;

export function currencyForCountry(country: string): string | null {
  return NON_EUR_COUNTRY_CURRENCY[country] ?? null;
}

export async function getRates(): Promise<Rates> {
  try {
    const res = await fetch("https://api.frankfurter.dev/v1/latest?base=EUR", {
      next: { revalidate: 86400 },
    });
    if (!res.ok) return {};
    const json = (await res.json()) as { rates?: Rates };
    return json.rates ?? {};
  } catch {
    return {};
  }
}

export function convertFromEur(amountEur: number, currency: string, rates: Rates): number | null {
  const rate = rates[currency];
  if (typeof rate !== "number") return null;
  return amountEur * rate;
}
