import { Fraunces, Inter } from "next/font/google";

/**
 * Brand fonts, defined once so the root layout and global-error page share
 * the same font files and stylesheet (a second definition makes Next preload
 * an extra stylesheet that normal pages never use).
 */
export const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["opsz", "SOFT"],
  display: "swap",
});

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const fontVariables = `${fraunces.variable} ${inter.variable}`;
