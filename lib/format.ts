export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatLocal(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat("nl-NL", {
      style: "currency",
      currency,
      maximumFractionDigits: amount < 10 ? 2 : 0,
    }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency}`;
  }
}

export function parseFlightTime(t: string): number {
  const m = t.match(/(\d+)h\s*(\d+)?/);
  return m ? parseInt(m[1], 10) * 60 + (parseInt(m[2] ?? "0", 10) || 0) : 999;
}
