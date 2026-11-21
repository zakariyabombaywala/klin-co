/**
 * Store pricing rules, shared by the cart, checkout (server-side re-pricing)
 * and the seed script. All amounts are integer cents.
 *
 * Kept dependency-free with relative imports only, so the seed script can
 * run it directly under Node.
 */

/** Standard shipping is free once merchandise (after discounts) reaches this. */
export const FREE_SHIPPING_THRESHOLD = 7500;

export const SHIPPING_RATES = {
  standard: 600,
  express: 1800,
} as const;

export type ShippingMethod = keyof typeof SHIPPING_RATES;

/** Flat sales-tax estimate shown in the cart. */
export const TAX_RATE = 0.08;

export interface PricingLine {
  unitPrice: number;
  quantity: number;
}

export interface PricingDiscount {
  code: string;
  type: "percentage" | "fixed" | "free_shipping";
  /** Percent for percentage codes, cents for fixed codes. */
  value: number;
  minOrderCents: number;
}

export interface Totals {
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  /** Cents still needed for free standard shipping (0 once reached). */
  freeShippingRemaining: number;
  /** Whether the discount passed was actually applied (minimum met). */
  discountApplied: boolean;
}

export function subtotalOf(lines: PricingLine[]): number {
  return lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);
}

export function discountAmount(subtotal: number, discount: PricingDiscount | null | undefined): number {
  if (!discount || subtotal < discount.minOrderCents) return 0;
  switch (discount.type) {
    case "percentage":
      return Math.round((subtotal * Math.min(Math.max(discount.value, 0), 100)) / 100);
    case "fixed":
      return Math.min(Math.max(discount.value, 0), subtotal);
    case "free_shipping":
      return 0;
  }
}

export function computeTotals({
  lines,
  discount,
  shippingMethod = "standard",
}: {
  lines: PricingLine[];
  discount?: PricingDiscount | null;
  shippingMethod?: ShippingMethod;
}): Totals {
  const subtotal = subtotalOf(lines);
  const discountApplied = Boolean(discount) && subtotal >= (discount?.minOrderCents ?? 0);
  const discountTotal = discountAmount(subtotal, discount);
  const merchandise = subtotal - discountTotal;

  const freeStandard =
    merchandise >= FREE_SHIPPING_THRESHOLD || (discountApplied && discount?.type === "free_shipping");
  let shipping = 0;
  if (subtotal > 0) {
    shipping = shippingMethod === "express" ? SHIPPING_RATES.express : freeStandard ? 0 : SHIPPING_RATES.standard;
  }

  const tax = Math.round(merchandise * TAX_RATE);
  return {
    subtotal,
    discount: discountTotal,
    shipping,
    tax,
    total: merchandise + shipping + tax,
    freeShippingRemaining: Math.max(FREE_SHIPPING_THRESHOLD - merchandise, 0),
    discountApplied,
  };
}
