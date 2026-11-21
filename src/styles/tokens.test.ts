import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  contrastPairs,
  contrastRatio,
  palette,
  resolveToken,
  scaleSteps,
  semanticTokens,
  themes,
  type PaletteName,
} from "./tokens";

const css = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8");

function block(selector: string): string {
  const start = css.indexOf(`${selector} {`);
  if (start === -1) throw new Error(`No "${selector}" block in globals.css`);
  return css.slice(start, css.indexOf("}", start));
}

function cssVar(source: string, name: string): string | undefined {
  return source.match(new RegExp(`--${name}:\\s*([^;]+);`))?.[1]?.trim();
}

/** Turns `var(--color-clay-600)` / `var(--color-white)` into a TokenRef-style value. */
function normalise(value: string | undefined): string | undefined {
  if (!value) return value;
  if (value === "var(--color-white)") return "#ffffff";
  return value.match(/^var\(--color-([a-z]+-\d+)\)$/)?.[1] ?? value;
}

describe("design tokens", () => {
  it("globals.css palette matches tokens.ts", () => {
    for (const name of Object.keys(palette) as PaletteName[]) {
      for (const step of scaleSteps) {
        expect(cssVar(css, `color-${name}-${step}`), `${name}-${step}`).toBe(palette[name][step]);
      }
    }
  });

  it.each([
    ["light", ":root"],
    ["dark", '[data-theme="dark"]'],
  ] as const)("globals.css %s semantic tokens match tokens.ts", (theme, selector) => {
    const source = block(selector);
    for (const token of semanticTokens) {
      expect(normalise(cssVar(source, token)), `${theme} --${token}`).toBe(themes[theme][token]);
    }
  });

  describe.each(["light", "dark"] as const)("%s theme contrast (WCAG AA)", (theme) => {
    it.each(contrastPairs.map((p) => [p.label, p] as const))("%s", (_label, pair) => {
      const ratio = contrastRatio(resolveToken(themes[theme][pair.fg]), resolveToken(themes[theme][pair.bg]));
      expect(ratio).toBeGreaterThanOrEqual(pair.min);
    });
  });

  it("computes known contrast ratios", () => {
    expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(21, 5);
    expect(contrastRatio("#ffffff", "#ffffff")).toBeCloseTo(1, 5);
  });
});
