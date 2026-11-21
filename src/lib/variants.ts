import { cn, type ClassValue } from "./cn";

type VariantConfig = Record<string, Record<string, ClassValue>>;

type VariantProps<V extends VariantConfig> = {
  [K in keyof V]?: keyof V[K];
};

interface VariantOptions<V extends VariantConfig> {
  base?: ClassValue;
  variants: V;
  defaults: { [K in keyof V]: keyof V[K] };
}

/**
 * A small, typed variant helper: maps variant props to class names.
 *
 * const button = variants({
 *   base: "inline-flex",
 *   variants: { size: { sm: "h-8", md: "h-10" } },
 *   defaults: { size: "md" },
 * });
 * button({ size: "sm" }) // "inline-flex h-8"
 */
export function variants<V extends VariantConfig>(options: VariantOptions<V>) {
  return (props: VariantProps<V> = {}, ...extra: ClassValue[]): string => {
    const classes: ClassValue[] = [options.base];
    for (const key of Object.keys(options.variants) as (keyof V)[]) {
      const chosen = props[key] ?? options.defaults[key];
      classes.push(options.variants[key]?.[chosen as string]);
    }
    return cn(...classes, ...extra);
  };
}

export type { VariantProps };
