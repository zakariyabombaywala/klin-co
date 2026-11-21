"use client";

import { useId, type ComponentProps, type ReactNode } from "react";
import { RadioGroup as RadioPrimitive } from "radix-ui";
import { cn } from "@/lib/cn";

export interface RadioOption {
  value: string;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
}

export interface RadioGroupProps extends ComponentProps<typeof RadioPrimitive.Root> {
  options: RadioOption[];
  /** Visible group label, used as the group's accessible name. */
  legend?: ReactNode;
  /** "card" renders bordered, full-width options (e.g. shipping methods). */
  appearance?: "plain" | "card";
}

export function RadioGroup({ options, legend, appearance = "plain", className, ...props }: RadioGroupProps) {
  const autoId = useId();
  const legendId = legend ? `radio-legend-${autoId}` : undefined;
  return (
    <div className={cn("grid gap-2", className)}>
      {legend ? (
        <p id={legendId} className="text-sm font-medium text-fg">
          {legend}
        </p>
      ) : null}
      <RadioPrimitive.Root aria-labelledby={legendId} className="grid gap-2" {...props}>
        {options.map((option) => {
          const itemId = `radio-${autoId}-${option.value}`;
          return (
            <label
              key={option.value}
              htmlFor={itemId}
              className={cn(
                "flex cursor-pointer items-start gap-3 text-sm text-fg has-disabled:cursor-not-allowed has-disabled:opacity-60",
                appearance === "card" &&
                  "rounded-sm border border-line-strong bg-surface p-4 transition-colors hover:border-fg has-data-[state=checked]:border-primary has-data-[state=checked]:bg-surface-muted",
              )}
            >
              <RadioPrimitive.Item
                id={itemId}
                value={option.value}
                disabled={option.disabled}
                className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border border-line-strong bg-surface transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring data-[state=checked]:border-primary"
              >
                <RadioPrimitive.Indicator className="size-2.5 rounded-full bg-primary" />
              </RadioPrimitive.Item>
              <span className="grid gap-0.5">
                <span>{option.label}</span>
                {option.description ? <span className="text-fg-muted">{option.description}</span> : null}
              </span>
            </label>
          );
        })}
      </RadioPrimitive.Root>
    </div>
  );
}
