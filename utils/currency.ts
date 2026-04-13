/**
 * Formats a numeric value as currency.
 * Defaults to Peruvian Soles (PEN) and es-PE locale.
 *
 * @param amount The value to format
 * @param currency The currency code (e.g., 'PEN', 'USD')
 * @param locale The locale for formatting (default 'es-PE')
 * @returns Formatted currency string
 */
export function formatCurrency(
  amount: number | string,
  currency = 'PEN',
  locale = 'es-PE'
): string {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount
  const safeAmount = isNaN(numericAmount) || numericAmount === null || numericAmount === undefined ? 0 : numericAmount

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(safeAmount)
}
