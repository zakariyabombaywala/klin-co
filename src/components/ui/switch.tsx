"use client";

import { useId, type ComponentProps, type ReactNode } from "react";
import { Switch as SwitchPrimitive } from "radix-ui";
import { cn } from "@/lib/cn";

export interface SwitchProps extends ComponentProps<typeof SwitchPrimitive.Root> {
  label: ReactNode;
  description?: ReactNode;
}

export function Switch({ label, description, className, id, ...props }: SwitchProps) {
  const autoId = useId();
  const controlId = id ?? `switch-${autoId}`;
  const descriptionId = description ? `${controlId}-description` : undefined;
  return (
    <div className={cn("flex items-start justify-between gap-4", className)}>
      <div className="grid gap-0.5">
        <label htmlFor={controlId} className="cursor-pointer text-sm text-fg">
          {label}
        </label>
        {description ? (
          <p id={descriptionId} className="text-sm text-fg-muted">
            {description}
          </p>
        ) : null}
      </div>
      <SwitchPrimitive.Root
        id={controlId}
        aria-describedby={descriptionId}
        className="relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border border-line-strong bg-surface-sunken transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-primary data-[state=checked]:bg-primary"
        {...props}
      >
        <SwitchPrimitive.Thumb className="block size-4.5 translate-x-0.5 rounded-full bg-fg-muted shadow-sm transition-transform duration-150 data-[state=checked]:translate-x-[1.3rem] data-[state=checked]:bg-primary-fg" />
      </SwitchPrimitive.Root>
    </div>
  );
}
