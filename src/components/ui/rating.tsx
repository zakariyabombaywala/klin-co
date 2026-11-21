import { Star } from "lucide-react";
import { cn } from "@/lib/cn";
import { pluralize } from "@/lib/format";

export interface RatingProps {
  /** Average rating, 0–5. Decimals render as partially filled stars. */
  value: number;
  /** Number of reviews. Shown in brackets after the stars when provided. */
  count?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const starSize = { sm: "size-3.5", md: "size-4", lg: "size-5" } as const;

/** Read-only star rating. Announced as "Rated 4.6 out of 5, 38 reviews". */
export function Rating({ value, count, size = "md", className }: RatingProps) {
  const clamped = Math.max(0, Math.min(5, value));
  const label = `Rated ${clamped.toFixed(1)} out of 5${count !== undefined ? `, ${pluralize(count, "review")}` : ""}`;

  return (
    <div className={cn("inline-flex items-center gap-1.5", className)} role="img" aria-label={label}>
      <span className="relative inline-flex" aria-hidden="true">
        <span className="flex text-line-strong">
          {Array.from({ length: 5 }, (_, i) => (
            <Star key={i} className={starSize[size]} />
          ))}
        </span>
        <span
          className="absolute inset-0 flex overflow-hidden text-amber-500"
          style={{ width: `${(clamped / 5) * 100}%` }}
        >
          {Array.from({ length: 5 }, (_, i) => (
            <Star key={i} className={cn(starSize[size], "shrink-0 fill-current")} />
          ))}
        </span>
      </span>
      {count !== undefined ? (
        <span aria-hidden="true" className="text-sm text-fg-muted tabular-nums">
          ({count})
        </span>
      ) : null}
    </div>
  );
}
