import { describe, expect, it } from "vitest";
import { FREE_SHIPPING_THRESHOLD, computeTotals, discountAmount, type PricingDiscount } from "./pricing";

const welcome10: PricingDiscount = { code: "WELCOME10", type: "percentage", value: 10, minOrderCents: 0 };
const clay20: PricingDiscount = { code: "CLAY20", type: "percentage", value: 20, minOrderCents: 10000 };
const freeship: PricingDiscount = { code: "FREESHIP", type: "free_shipping", value: 0, minOrderCents: 4000 };
const fifteenOff: PricingDiscount = { code: "STUDIO15", type: "fixed", value: 1500, minOrderCents: 0 };

describe("computeTotals", () => {
  it("charges standard shipping and tax below the free-shipping threshold", () => {
    const totals = computeTotals({ lines: [{ unitPrice: 3200, quantity: 1 }] });
    expect(totals).toEqual({
      subtotal: 3200,
      discount: 0,
      shipping: 600,
      tax: 256,
      total: 4056,
      freeShippingRemaining: 4300,
      discountApplied: false,
    });
  });

  it("ships free at exactly the threshold", () => {
    const totals = computeTotals({ lines: [{ unitPrice: FREE_SHIPPING_THRESHOLD, quantity: 1 }] });
    expect(totals.shipping).toBe(0);
    expect(totals.freeShippingRemaining).toBe(0);
  });

  it("measures the threshold after discounts", () => {
    const totals = computeTotals({ lines: [{ unitPrice: 8000, quantity: 1 }], discount: welcome10 });
    expect(totals.discount).toBe(800);
    expect(totals.shipping).toBe(600);
    expect(totals.freeShippingRemaining).toBe(300);
  });

  it("always charges express", () => {
    expect(computeTotals({ lines: [{ unitPrice: 20000, quantity: 1 }], shippingMethod: "express" }).shipping).toBe(
      1800,
    );
  });

  it("ignores codes below their minimum", () => {
    const totals = computeTotals({ lines: [{ unitPrice: 5000, quantity: 1 }], discount: clay20 });
    expect(totals.discount).toBe(0);
    expect(totals.discountApplied).toBe(false);
  });

  it("applies free-shipping codes to standard shipping once the minimum is met", () => {
    expect(computeTotals({ lines: [{ unitPrice: 4200, quantity: 1 }], discount: freeship }).shipping).toBe(0);
    expect(computeTotals({ lines: [{ unitPrice: 3000, quantity: 1 }], discount: freeship }).shipping).toBe(600);
    expect(
      computeTotals({ lines: [{ unitPrice: 4200, quantity: 1 }], discount: freeship, shippingMethod: "express" })
        .shipping,
    ).toBe(1800);
  });

  it("taxes the discounted merchandise total", () => {
    const totals = computeTotals({ lines: [{ unitPrice: 6000, quantity: 2 }], discount: clay20 });
    expect(totals).toMatchObject({ subtotal: 12000, discount: 2400, shipping: 0, tax: 768, total: 10368 });
  });

  it("returns zeros for an empty cart", () => {
    expect(computeTotals({ lines: [] })).toMatchObject({ subtotal: 0, shipping: 0, tax: 0, total: 0 });
  });
});

describe("discountAmount", () => {
  it("never discounts more than the subtotal", () => {
    expect(discountAmount(1000, fifteenOff)).toBe(1000);
    expect(discountAmount(5000, fifteenOff)).toBe(1500);
  });

  it("rounds percentage discounts to the nearest cent", () => {
    expect(discountAmount(3333, welcome10)).toBe(333);
    expect(discountAmount(3335, welcome10)).toBe(334);
  });
});
