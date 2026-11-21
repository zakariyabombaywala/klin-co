import { describe, expect, it } from "vitest";
import { getPageTokens } from "./pagination";

describe("getPageTokens", () => {
  it("lists every page when there are few", () => {
    expect(getPageTokens(2, 5)).toEqual([1, 2, 3, 4, 5]);
  });

  it("collapses both ends around the current page", () => {
    expect(getPageTokens(6, 12)).toEqual([1, "ellipsis-start", 5, 6, 7, "ellipsis-end", 12]);
  });

  it("collapses only the far end near the start", () => {
    expect(getPageTokens(2, 12)).toEqual([1, 2, 3, "ellipsis-end", 12]);
  });

  it("collapses only the near end at the last page", () => {
    expect(getPageTokens(12, 12)).toEqual([1, "ellipsis-start", 11, 12]);
  });

  it("clamps out-of-range pages and handles empty results", () => {
    expect(getPageTokens(99, 3)).toEqual([1, 2, 3]);
    expect(getPageTokens(1, 0)).toEqual([]);
  });
});
