import { describe, expect, it } from "vitest";
import { cn } from "./cn";
import { variants } from "./variants";

describe("cn", () => {
  it("joins truthy classes and flattens arrays", () => {
    expect(cn("a", false, null, undefined, "", ["b", ["c", false]])).toBe("a b c");
  });
});

describe("variants", () => {
  const button = variants({
    base: "btn",
    variants: { tone: { primary: "bg-primary", ghost: "bg-transparent" }, size: { sm: "h-8", md: "h-10" } },
    defaults: { tone: "primary", size: "md" },
  });

  it("applies defaults", () => {
    expect(button()).toBe("btn bg-primary h-10");
  });

  it("applies chosen variants and extra classes", () => {
    expect(button({ tone: "ghost", size: "sm" }, "w-full")).toBe("btn bg-transparent h-8 w-full");
  });
});
