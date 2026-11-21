import { cn } from "@/lib/cn";
import { discountPercent, formatPrice } from "@/lib/format";

export interface PriceTagProps {
  /** Current price in cents. */
  price: number;
  /** Original price in cents. Shown struck through when higher than `price`. */
  compareAtPrice?: number | null;
  /** Lowest price of a range, e.g. "From $28" for products with variants. */
  from?: boolean;
  size?: "sm" | "md" | "lg";
  /** Show a "Save 20%" note after the price. */
  showSavings?: boolean;
  className?: string;
}

const sizeClass = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-2xl",
} as const;

/** Price with optional sale state. Screen readers hear "Sale price $36, was $48". */
export function PriceTag({ price, compareAtPrice, from, size = "md", showSavings, className }: PriceTagProps) {
  const onSale = typeof compareAtPrice === "number" && compareAtPrice > price;
  const savings = onSale ? discountPercent(price, compareAtPrice) : 0;

  return (
    <p className={cn("flex flex-wrap items-baseline gap-x-2 gap-y-0.5", sizeClass[size], className)}>
      {onSale ? (
        <>
          <span className="font-semibold text-danger tabular-nums">
            <span className="sr-only">Sale price </span>
            {from ? "From " : null}
            {formatPrice(price)}
          </span>
          <s className="text-[0.875em] text-fg-muted tabular-nums">
            <span className="sr-only">, was </span>
            {formatPrice(compareAtPrice)}
          </s>
          {showSavings && savings > 0 ? <span className="text-sm font-medium text-danger">Save {savings}%</span> : null}
        </>
      ) : (
        <span className="font-semibold text-fg tabular-nums">
          {from ? "From " : null}
          {formatPrice(price)}
        </span>
      )}
    </p>
  );
}
