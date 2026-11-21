"use client";

import { useId, useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/cn";

export interface RatingInputProps {
  value: number;
  onChange: (value: number) => void;
  /** Group label, e.g. "Your rating". */
  label: string;
  name?: string;
  invalid?: boolean;
  describedBy?: string;
}

const ratingWords = ["", "Poor", "Fair", "Good", "Very good", "Excellent"];

/** Interactive 1–5 star picker built on native radio inputs for full keyboard support. */
export function RatingInput({ value, onChange, label, name, invalid, describedBy }: RatingInputProps) {
  const groupId = useId();
  const [hovered, setHovered] = useState(0);
  const shown = hovered || value;

  return (
    <fieldset aria-describedby={describedBy} aria-invalid={invalid || undefined}>
      <legend className="mb-1.5 text-sm font-medium text-fg">{label}</legend>
      <div className="flex items-center gap-3">
        <div className="flex" onMouseLeave={() => setHovered(0)}>
          {[1, 2, 3, 4, 5].map((star) => (
            <label key={star} className="cursor-pointer p-0.5" onMouseEnter={() => setHovered(star)}>
              <input
                type="radio"
                className="peer sr-only"
                name={name ?? `rating-${groupId}`}
                value={star}
                checked={value === star}
                onChange={() => onChange(star)}
              />
              <span className="sr-only">
                {star} {star === 1 ? "star" : "stars"}, {ratingWords[star]}
              </span>
              <Star
                aria-hidden="true"
                className={cn(
                  "size-7 rounded-xs transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring",
                  star <= shown ? "fill-current text-amber-500" : "text-line-strong",
                )}
              />
            </label>
          ))}
        </div>
        <span className="min-w-20 text-sm text-fg-muted" aria-hidden="true">
          {ratingWords[shown]}
        </span>
      </div>
    </fieldset>
  );
}
