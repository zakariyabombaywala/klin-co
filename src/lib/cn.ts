export type ClassValue = string | number | false | null | undefined | ClassValue[];

/**
 * Joins class names, skipping falsy values. Nested arrays are flattened.
 *
 * Note: this does not resolve Tailwind conflicts. Components expose
 * variant props for anything visual; `className` is meant for layout
 * extras (margins, width, grid placement).
 */
export function cn(...inputs: ClassValue[]): string {
  const out: string[] = [];
  for (const input of inputs) {
    if (!input) continue;
    if (Array.isArray(input)) {
      const nested = cn(...input);
      if (nested) out.push(nested);
    } else {
      out.push(String(input));
    }
  }
  return out.join(" ");
}
