"use client";

import { useId, type ComponentProps, type ReactNode } from "react";
import { Checkbox as CheckboxPrimitive } from "radix-ui";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/cn";

export interface CheckboxProps extends ComponentProps<typeof CheckboxPrimitive.Root> {
  label: ReactNode;
  description?: ReactNode;
}

export function Checkbox({ label, description, className, id, ...props }: CheckboxProps) {
  const autoId = useId();
  const controlId = id ?? `checkbox-${autoId}`;
  const descriptionId = description ? `${controlId}-description` : undefined;
  return (
    <div className={cn("flex items-start gap-3", className)}>
      <CheckboxPrimitive.Root
        id={controlId}
        aria-describedby={descriptionId}
        className="peer mt-0.5 grid size-5 shrink-0 place-items-center rounded-xs border border-line-strong bg-surface text-primary-fg transition-colors hover:border-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary"
        {...props}
      >
        <CheckboxPrimitive.Indicator>
          {props.checked === "indeterminate" ? (
            <Minus aria-hidden="true" className="size-3.5" />
          ) : (
            <Check aria-hidden="true" className="size-3.5" />
          )}
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      <div className="grid gap-0.5">
        <label
          htmlFor={controlId}
          className="cursor-pointer text-sm text-fg peer-disabled:cursor-not-allowed peer-disabled:opacity-60"
        >
          {label}
        </label>
        {description ? (
          <p id={descriptionId} className="text-sm text-fg-muted">
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}
