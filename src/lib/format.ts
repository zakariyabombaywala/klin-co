const currencyFormatters = new Map<string, Intl.NumberFormat>();

function getFormatter(currency: string, showCents: boolean): Intl.NumberFormat {
  const key = `${currency}:${showCents}`;
  let formatter = currencyFormatters.get(key);
  if (!formatter) {
    formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: showCents ? 2 : 0,
      maximumFractionDigits: showCents ? 2 : 0,
    });
    currencyFormatters.set(key, formatter);
  }
  return formatter;
}

/**
 * Formats an integer amount of cents as a currency string.
 * Whole-dollar amounts drop the cents by default ($48 rather than $48.00).
 */
export function formatPrice(
  cents: number,
  { currency = "USD", alwaysShowCents = false }: { currency?: string; alwaysShowCents?: boolean } = {},
): string {
  if (!Number.isFinite(cents)) {
    throw new RangeError(`formatPrice expected a finite number of cents, received ${cents}`);
  }
  const rounded = Math.round(cents);
  const showCents = alwaysShowCents || rounded % 100 !== 0;
  return getFormatter(currency, showCents).format(rounded / 100);
}

/** Percentage saved between a compare-at price and the current price, rounded down. */
export function discountPercent(priceCents: number, compareAtCents: number | null | undefined): number {
  if (!compareAtCents || compareAtCents <= priceCents || compareAtCents <= 0) return 0;
  return Math.floor(((compareAtCents - priceCents) / compareAtCents) * 100);
}

/** "1 review", "12 reviews" */
export function pluralize(count: number, singular: string, plural = `${singular}s`): string {
  return `${count.toLocaleString("en-US")} ${count === 1 ? singular : plural}`;
}
