"use client";

import { useId, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/cn";

export interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  /** Usually the available stock. Increase is disabled at this value. */
  max?: number;
  /** Accessible label for the number field, e.g. "Quantity for Speckled Mug". */
  label?: string;
  size?: "sm" | "md";
  disabled?: boolean;
  className?: string;
}

export function clampQuantity(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(Math.max(Math.round(value), min), Math.max(min, max));
}

/** A "− [n] +" control that never lets the value leave [min, max]. */
export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  label = "Quantity",
  size = "md",
  disabled = false,
  className,
}: QuantityStepperProps) {
  const id = useId();
  // While typing, the field holds a free-form draft; it is committed on blur or Enter.
  const [draft, setDraft] = useState<string | null>(null);

  const commit = (next: number) => {
    const clamped = clampQuantity(next, min, max);
    setDraft(null);
    if (clamped !== value) onChange(clamped);
  };

  const atMin = value <= min;
  const atMax = value >= max;
  const buttonClass = cn(
    "grid place-items-center text-fg transition-colors hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-40",
    "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring",
    size === "sm" ? "w-8 [&_svg]:size-3.5" : "w-10 [&_svg]:size-4",
  );

  return (
    <div
      className={cn(
        "inline-flex items-stretch overflow-hidden rounded-sm border border-line-strong bg-surface",
        size === "sm" ? "h-9" : "h-11",
        disabled && "opacity-60",
        className,
      )}
    >
      <button
        type="button"
        className={buttonClass}
        onClick={() => commit(value - 1)}
        disabled={disabled || atMin}
        aria-label={`Decrease ${label.toLowerCase()}`}
        aria-controls={id}
      >
        <Minus aria-hidden="true" />
      </button>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        id={id}
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        value={draft ?? String(value)}
        disabled={disabled}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => {
          if (draft !== null) commit(Number.parseInt(draft, 10));
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && draft !== null) {
            e.preventDefault();
            commit(Number.parseInt(draft, 10));
          }
        }}
        className={cn(
          "border-x border-line bg-transparent text-center text-sm font-medium text-fg tabular-nums",
          "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring",
          size === "sm" ? "w-9" : "w-11",
        )}
      />
      <button
        type="button"
        className={buttonClass}
        onClick={() => commit(value + 1)}
        disabled={disabled || atMax}
        aria-label={`Increase ${label.toLowerCase()}`}
        aria-controls={id}
      >
        <Plus aria-hidden="true" />
      </button>
    </div>
  );
}
