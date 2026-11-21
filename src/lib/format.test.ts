import { describe, expect, it } from "vitest";
import { discountPercent, formatPrice, pluralize } from "./format";

describe("formatPrice", () => {
  it("drops cents for whole-dollar amounts", () => {
    expect(formatPrice(4800)).toBe("$48");
    expect(formatPrice(0)).toBe("$0");
  });

  it("shows cents when the amount has them", () => {
    expect(formatPrice(4850)).toBe("$48.50");
    expect(formatPrice(5)).toBe("$0.05");
  });

  it("can always show cents (order summaries)", () => {
    expect(formatPrice(4800, { alwaysShowCents: true })).toBe("$48.00");
  });

  it("adds thousands separators", () => {
    expect(formatPrice(123456)).toBe("$1,234.56");
  });

  it("rounds fractional cents", () => {
    expect(formatPrice(1999.6)).toBe("$20");
  });

  it("formats negative amounts (discount lines)", () => {
    expect(formatPrice(-500)).toBe("-$5");
  });

  it("rejects non-finite input", () => {
    expect(() => formatPrice(Number.NaN)).toThrow(RangeError);
  });
});

describe("discountPercent", () => {
  it("rounds down so we never overstate a saving", () => {
    expect(discountPercent(3600, 4800)).toBe(25);
    expect(discountPercent(3333, 4000)).toBe(16);
  });

  it("returns 0 when there is no real discount", () => {
    expect(discountPercent(4800, null)).toBe(0);
    expect(discountPercent(4800, 4800)).toBe(0);
    expect(discountPercent(4800, 3000)).toBe(0);
  });
});

describe("pluralize", () => {
  it("chooses singular or plural", () => {
    expect(pluralize(1, "review")).toBe("1 review");
    expect(pluralize(0, "review")).toBe("0 reviews");
    expect(pluralize(1200, "piece")).toBe("1,200 pieces");
  });
});
