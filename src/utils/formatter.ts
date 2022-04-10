/**
 * Retorna string formatada para moeda
 * @param value
 * @param locale
 * @param currency
 * @param decimalDigits
 * @returns
 */
export function currencyFormat(
  value: number | string,
  locale: string,
  currency: "BRL" | "USD" | "EUR",
  decimalDigits: number = 2
): string {
  const maxDecimalDigits = 4;
  const price = typeof value === "string" ? Number(value) : value;

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits:
      decimalDigits > maxDecimalDigits ? maxDecimalDigits : decimalDigits,
    maximumFractionDigits: maxDecimalDigits,
  }).format(price);
}
