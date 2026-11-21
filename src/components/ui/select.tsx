"use client";

import type { ComponentProps, ReactNode } from "react";
import { Select as SelectPrimitive } from "radix-ui";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";
import { controlBase } from "./input";
import { useField } from "./field";

export interface SelectOption {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

export interface SelectProps extends Omit<ComponentProps<typeof SelectPrimitive.Root>, "children"> {
  options: SelectOption[];
  placeholder?: string;
  /** Accessible name when the select is not inside a <Field>. */
  "aria-label"?: string;
  className?: string;
  size?: "sm" | "md";
  id?: string;
}

/** Styled, accessible single select built on Radix Select. */
export function Select({
  options,
  placeholder,
  className,
  size = "md",
  id,
  "aria-label": ariaLabel,
  ...props
}: SelectProps) {
  const field = useField();
  return (
    <SelectPrimitive.Root {...props}>
      <SelectPrimitive.Trigger
        {...field}
        id={id ?? field?.id}
        aria-label={ariaLabel}
        className={cn(
          controlBase,
          "inline-flex items-center justify-between gap-2 text-left data-placeholder:text-fg-muted",
          size === "sm" ? "h-9 px-3 text-sm" : "h-11 px-3.5",
          className,
        )}
      >
        <SelectPrimitive.Value placeholder={placeholder} />
        <SelectPrimitive.Icon>
          <ChevronDown aria-hidden="true" className="size-4 text-fg-muted" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          position="popper"
          sideOffset={6}
          className="z-50 max-h-(--radix-select-content-available-height) min-w-(--radix-select-trigger-width) overflow-hidden rounded-md border border-line bg-surface p-1 shadow-lg data-[state=closed]:animate-pop-out data-[state=open]:animate-pop-in"
        >
          <SelectPrimitive.Viewport>
            {options.map((option) => (
              <SelectPrimitive.Item
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                className="relative flex cursor-default items-center rounded-xs py-2 pr-3 pl-8 text-sm text-fg outline-none select-none data-disabled:opacity-50 data-highlighted:bg-surface-muted"
              >
                <SelectPrimitive.ItemIndicator className="absolute left-2 inline-flex">
                  <Check aria-hidden="true" className="size-4 text-primary" />
                </SelectPrimitive.ItemIndicator>
                <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}
