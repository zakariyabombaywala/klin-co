"use client";

import type { ComponentProps } from "react";
import { Slider as SliderPrimitive } from "radix-ui";
import { cn } from "@/lib/cn";

export interface SliderProps extends ComponentProps<typeof SliderPrimitive.Root> {
  /** Accessible names for each thumb, e.g. ["Minimum price", "Maximum price"]. */
  thumbLabels: string[];
  /** Formats a value for aria-valuetext, e.g. cents to "$40". */
  formatValue?: (value: number) => string;
}

/** Range slider. Pass two values for a min/max range. */
export function Slider({ thumbLabels, formatValue, className, value, defaultValue, ...props }: SliderProps) {
  const values = value ?? defaultValue ?? [0];
  return (
    <SliderPrimitive.Root
      value={value}
      defaultValue={defaultValue}
      className={cn("relative flex h-6 w-full touch-none items-center select-none", className)}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-1.5 grow overflow-hidden rounded-full bg-surface-sunken">
        <SliderPrimitive.Range className="absolute h-full bg-primary" />
      </SliderPrimitive.Track>
      {values.map((v, i) => (
        <SliderPrimitive.Thumb
          key={thumbLabels[i] ?? i}
          aria-label={thumbLabels[i]}
          aria-valuetext={formatValue ? formatValue(v) : undefined}
          className="block size-5 rounded-full border-2 border-primary bg-surface shadow-sm transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        />
      ))}
    </SliderPrimitive.Root>
  );
}
