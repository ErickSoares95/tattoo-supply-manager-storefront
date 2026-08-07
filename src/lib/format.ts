export function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

/** Splits "1.234,56" into ["1.234", "56"] for the price-int/price-decimal styling split. */
export function splitPrice(value: number): [string, string] {
  const [intPart, decimalPart] = value.toFixed(2).split(".");
  return [intPart, decimalPart];
}

export function stars(rating: number): string {
  const full = Math.round(rating);
  return "★".repeat(full) + "☆".repeat(5 - full);
}

export function discountPercent(price: number, oldPrice: number): number {
  return Math.round(100 * (1 - price / oldPrice));
}
