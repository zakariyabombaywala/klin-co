"use client";

import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { useField } from "./field";

export const controlBase = [
  "w-full rounded-sm border border-line-strong bg-surface text-base text-fg placeholder:text-fg-muted",
  "transition-[border-color,box-shadow] duration-150",
  "hover:border-fg",
  "focus-visible:border-primary focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring",
  "disabled:cursor-not-allowed disabled:bg-surface-muted disabled:opacity-60",
  "aria-invalid:border-danger aria-invalid:hover:border-danger",
];

export interface InputProps extends ComponentProps<"input"> {
  /** Icon or text shown inside the field, before the value. */
  leading?: ReactNode;
  /** Icon button shown inside the field, after the value. */
  trailing?: ReactNode;
  inputSize?: "sm" | "md";
}

/**
 * Text input. Place inside <Field> for a label, hint and error message;
 * ARIA attributes are wired automatically.
 */
export function Input({ className, leading, trailing, inputSize = "md", ...props }: InputProps) {
  const field = useField();
  const sizeClass = inputSize === "sm" ? "h-9 px-3 text-sm" : "h-11 px-3.5";
  const input = (
    <input
      {...field}
      {...props}
      className={cn(controlBase, sizeClass, leading ? "pl-10" : null, trailing ? "pr-11" : null, className)}
    />
  );

  if (!leading && !trailing) return input;

  return (
    <div className="relative">
      {leading ? (
        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-fg-muted [&_svg]:size-4">
          {leading}
        </span>
      ) : null}
      {input}
      {trailing ? <span className="absolute inset-y-0 right-1 flex items-center">{trailing}</span> : null}
    </div>
  );
}

export function Textarea({ className, rows = 4, ...props }: ComponentProps<"textarea">) {
  const field = useField();
  return (
    <textarea
      rows={rows}
      {...field}
      {...props}
      className={cn(controlBase, "min-h-24 resize-y px-3.5 py-2.5 leading-relaxed", className)}
    />
  );
}
