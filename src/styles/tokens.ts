/**
 * Design tokens as data, for the /styleguide page and automated checks.
 * The CSS in src/app/globals.css is what the app uses; tokens.test.ts fails if
 * the two drift apart, and checks every contrast pair below against WCAG AA.
 */

export const scaleSteps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;
export type ScaleStep = (typeof scaleSteps)[number];

export const palette = {
  clay: {
    50: "#fbf4f0",
    100: "#f6e5dc",
    200: "#ecc9b8",
    300: "#dfa68c",
    400: "#d08262",
    500: "#bf6443",
    600: "#a34f32",
    700: "#863f29",
    800: "#6c3424",
    900: "#582c20",
  },
  stone: {
    50: "#f7f5f2",
    100: "#efebe6",
    200: "#e0dad2",
    300: "#c9c1b6",
    400: "#a69c8f",
    500: "#857b6f",
    600: "#6a6157",
    700: "#544d45",
    800: "#3d3833",
    900: "#2a2622",
  },
  cream: {
    50: "#fdfbf7",
    100: "#faf5ec",
    200: "#f3ead9",
    300: "#ebdcc2",
    400: "#dfc9a3",
    500: "#cfb282",
    600: "#b8945c",
    700: "#977645",
    800: "#765c37",
    900: "#5c482c",
  },
  charcoal: {
    50: "#f4f3f2",
    100: "#e3e1de",
    200: "#c7c3be",
    300: "#a29d97",
    400: "#7b766f",
    500: "#5d5953",
    600: "#47443f",
    700: "#35322e",
    800: "#262421",
    900: "#1b1917",
  },
  sage: {
    50: "#f3f6f1",
    100: "#e3ebdf",
    200: "#c7d6c0",
    300: "#a2bb98",
    400: "#7f9d74",
    500: "#628259",
    600: "#4d6846",
    700: "#3e5439",
    800: "#33442f",
    900: "#2b3828",
  },
  amber: {
    50: "#fdf7eb",
    100: "#faeccb",
    200: "#f4d693",
    300: "#ecbc5b",
    400: "#e3a135",
    500: "#cf861e",
    600: "#ac6716",
    700: "#8a4f16",
    800: "#713f18",
    900: "#5e3518",
  },
  brick: {
    50: "#fcf3f2",
    100: "#f9e2df",
    200: "#f2c5bf",
    300: "#e69c92",
    400: "#d66e60",
    500: "#c24a3b",
    600: "#a6372b",
    700: "#8a2d24",
    800: "#722822",
    900: "#5f2520",
  },
} as const satisfies Record<string, Record<ScaleStep, string>>;

export type PaletteName = keyof typeof palette;

export const paletteRoles: Record<PaletteName, string> = {
  clay: "Primary: buttons, links, focus",
  stone: "Text and borders (light)",
  cream: "Light backgrounds",
  charcoal: "Dark theme surfaces",
  sage: "Success, in stock",
  amber: "Low stock, warnings, stars",
  brick: "Errors, sale prices",
};

/** A palette reference like "clay-600", or a literal hex. */
export type TokenRef = `${PaletteName}-${ScaleStep}` | `#${string}`;

export const semanticTokens = [
  "background",
  "surface",
  "surface-muted",
  "surface-sunken",
  "fg",
  "fg-muted",
  "line",
  "line-strong",
  "primary",
  "primary-hover",
  "primary-fg",
  "link",
  "ring",
  "success",
  "success-bg",
  "success-strong",
  "warning",
  "warning-bg",
  "warning-strong",
  "danger",
  "danger-bg",
  "danger-strong",
  "danger-solid",
  "danger-solid-fg",
  "inverse",
  "inverse-fg",
] as const;
export type SemanticToken = (typeof semanticTokens)[number];

export const themes: Record<"light" | "dark", Record<SemanticToken, TokenRef>> = {
  light: {
    background: "cream-50",
    surface: "#ffffff",
    "surface-muted": "cream-100",
    "surface-sunken": "stone-100",
    fg: "stone-900",
    "fg-muted": "stone-600",
    line: "stone-200",
    "line-strong": "stone-500",
    primary: "clay-600",
    "primary-hover": "clay-700",
    "primary-fg": "#ffffff",
    link: "clay-700",
    ring: "clay-500",
    success: "sage-700",
    "success-bg": "sage-100",
    "success-strong": "sage-800",
    warning: "amber-700",
    "warning-bg": "amber-100",
    "warning-strong": "amber-800",
    danger: "brick-600",
    "danger-bg": "brick-100",
    "danger-strong": "brick-700",
    "danger-solid": "brick-600",
    "danger-solid-fg": "#ffffff",
    inverse: "stone-900",
    "inverse-fg": "cream-50",
  },
  dark: {
    background: "charcoal-900",
    surface: "charcoal-800",
    "surface-muted": "charcoal-700",
    "surface-sunken": "charcoal-900",
    fg: "cream-100",
    "fg-muted": "charcoal-200",
    line: "charcoal-700",
    "line-strong": "charcoal-400",
    primary: "clay-400",
    "primary-hover": "clay-300",
    "primary-fg": "charcoal-900",
    link: "clay-300",
    ring: "clay-400",
    success: "sage-300",
    "success-bg": "sage-900",
    "success-strong": "sage-200",
    warning: "amber-300",
    "warning-bg": "amber-900",
    "warning-strong": "amber-200",
    danger: "brick-300",
    "danger-bg": "brick-900",
    "danger-strong": "brick-200",
    "danger-solid": "brick-400",
    "danger-solid-fg": "charcoal-900",
    inverse: "cream-100",
    "inverse-fg": "charcoal-900",
  },
};

export interface ContrastPair {
  label: string;
  fg: SemanticToken;
  bg: SemanticToken;
  /** 4.5 for body text, 3 for large text and UI component boundaries (WCAG 1.4.11). */
  min: 4.5 | 3;
}

/** Every foreground/background combination the UI actually uses. */
export const contrastPairs: ContrastPair[] = [
  { label: "Body text on page", fg: "fg", bg: "background", min: 4.5 },
  { label: "Body text on card", fg: "fg", bg: "surface", min: 4.5 },
  { label: "Body text on muted panel", fg: "fg", bg: "surface-muted", min: 4.5 },
  { label: "Secondary text on page", fg: "fg-muted", bg: "background", min: 4.5 },
  { label: "Secondary text on card", fg: "fg-muted", bg: "surface", min: 4.5 },
  { label: "Secondary text on muted panel", fg: "fg-muted", bg: "surface-muted", min: 4.5 },
  { label: "Secondary text on sunken panel", fg: "fg-muted", bg: "surface-sunken", min: 4.5 },
  { label: "Primary button label", fg: "primary-fg", bg: "primary", min: 4.5 },
  { label: "Primary button hover", fg: "primary-fg", bg: "primary-hover", min: 4.5 },
  { label: "Link on page", fg: "link", bg: "background", min: 4.5 },
  { label: "Link on card", fg: "link", bg: "surface", min: 4.5 },
  { label: "Link on muted panel", fg: "link", bg: "surface-muted", min: 4.5 },
  { label: "Input border on card", fg: "line-strong", bg: "surface", min: 3 },
  { label: "Input border on page", fg: "line-strong", bg: "background", min: 3 },
  { label: "Focus ring on page", fg: "ring", bg: "background", min: 3 },
  { label: "Focus ring on card", fg: "ring", bg: "surface", min: 3 },
  { label: "Success text", fg: "success", bg: "background", min: 4.5 },
  { label: "Success badge", fg: "success-strong", bg: "success-bg", min: 4.5 },
  { label: "Warning text", fg: "warning", bg: "background", min: 4.5 },
  { label: "Warning text on card", fg: "warning", bg: "surface", min: 4.5 },
  { label: "Warning badge", fg: "warning-strong", bg: "warning-bg", min: 4.5 },
  { label: "Error / sale text", fg: "danger", bg: "background", min: 4.5 },
  { label: "Error / sale text on card", fg: "danger", bg: "surface", min: 4.5 },
  { label: "Danger badge", fg: "danger-strong", bg: "danger-bg", min: 4.5 },
  { label: "Destructive button", fg: "danger-solid-fg", bg: "danger-solid", min: 4.5 },
  { label: "Inverse (banner, tooltip)", fg: "inverse-fg", bg: "inverse", min: 4.5 },
];

export function resolveToken(ref: TokenRef): string {
  if (ref.startsWith("#")) return ref;
  const [name, step] = ref.split("-") as [PaletteName, string];
  return palette[name][Number(step) as ScaleStep];
}

function channel(hex: string, offset: number): number {
  const value = Number.parseInt(hex.slice(offset, offset + 2), 16) / 255;
  return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

export function relativeLuminance(hex: string): number {
  return 0.2126 * channel(hex, 1) + 0.7152 * channel(hex, 3) + 0.0722 * channel(hex, 5);
}

/** WCAG 2.1 contrast ratio between two #rrggbb colours (1–21). */
export function contrastRatio(a: string, b: string): number {
  const [light, dark] = [relativeLuminance(a), relativeLuminance(b)].sort((x, y) => y - x) as [number, number];
  return (light + 0.05) / (dark + 0.05);
}
