"use client";

import { createContext, useContext, useId, type ComponentProps, type ReactNode } from "react";
import { Label as LabelPrimitive } from "radix-ui";
import { CircleAlert } from "lucide-react";
import { cn } from "@/lib/cn";

interface FieldContextValue {
  id: string;
  hintId?: string;
  errorId?: string;
  invalid: boolean;
  required: boolean;
}

const FieldContext = createContext<FieldContextValue | null>(null);

/**
 * Returns the ARIA wiring for the control inside a <Field>. Controls call this
 * so label, hint and error stay connected without manual ids.
 */
export function useField() {
  const ctx = useContext(FieldContext);
  if (!ctx) return null;
  const describedBy = [ctx.errorId, ctx.hintId].filter(Boolean).join(" ") || undefined;
  return {
    id: ctx.id,
    "aria-describedby": describedBy,
    "aria-invalid": ctx.invalid || undefined,
    "aria-required": ctx.required || undefined,
  };
}

export interface FieldProps {
  label: ReactNode;
  children: ReactNode;
  hint?: ReactNode;
  /** Error message. When set, the control is marked aria-invalid and the message is linked to it. */
  error?: string;
  required?: boolean;
  /** Visually hide the label but keep it for assistive tech. */
  hideLabel?: boolean;
  id?: string;
  className?: string;
}

/**
 * Wraps a single form control with a label, optional hint and error message.
 * Input, Textarea and Select pick up the ids automatically.
 */
export function Field({ label, children, hint, error, required = false, hideLabel, id, className }: FieldProps) {
  const autoId = useId();
  const controlId = id ?? `field-${autoId}`;
  const hintId = hint ? `${controlId}-hint` : undefined;
  const errorId = error ? `${controlId}-error` : undefined;

  return (
    <FieldContext.Provider value={{ id: controlId, hintId, errorId, invalid: Boolean(error), required }}>
      <div className={cn("flex flex-col gap-1.5", className)}>
        <Label htmlFor={controlId} className={hideLabel ? "sr-only" : undefined}>
          {label}
          {required ? (
            <span className="text-fg-muted" aria-hidden="true">
              {" "}
              *
            </span>
          ) : null}
        </Label>
        {children}
        {hint ? (
          <p id={hintId} className={error ? "sr-only" : "text-sm text-fg-muted"}>
            {hint}
          </p>
        ) : null}
        {error ? (
          <p id={errorId} className="flex items-start gap-1.5 text-sm text-danger">
            <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
            {error}
          </p>
        ) : null}
      </div>
    </FieldContext.Provider>
  );
}

export function Label({ className, ...props }: ComponentProps<typeof LabelPrimitive.Root>) {
  return <LabelPrimitive.Root className={cn("text-sm font-medium text-fg", className)} {...props} />;
}
