import type { ComponentProps } from "react";
import { Slot } from "radix-ui";
import { variants } from "@/lib/variants";
import { Spinner } from "./spinner";

export const buttonStyles = variants({
  base: [
    "relative inline-flex shrink-0 items-center justify-center gap-2 rounded-sm font-medium whitespace-nowrap select-none",
    "transition-[background-color,color,border-color,box-shadow,transform] duration-150",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
    "disabled:pointer-events-none disabled:opacity-55 aria-disabled:pointer-events-none aria-disabled:opacity-55",
    "active:translate-y-px [&_svg]:size-4 [&_svg]:shrink-0",
  ],
  variants: {
    variant: {
      primary: "bg-primary text-primary-fg shadow-xs hover:bg-primary-hover",
      secondary: "border border-line-strong bg-surface text-fg hover:border-fg hover:bg-surface-muted",
      ghost: "text-fg hover:bg-surface-muted",
      link: "h-auto! px-0! text-link underline decoration-1 underline-offset-4 hover:decoration-2 active:translate-y-0",
      destructive: "bg-danger-solid text-danger-solid-fg shadow-xs hover:opacity-90",
      inverse: "bg-inverse text-inverse-fg hover:opacity-90",
    },
    size: {
      sm: "h-9 px-3 text-sm",
      md: "h-11 px-5 text-sm",
      lg: "h-12 px-6 text-base",
    },
    width: {
      auto: "",
      full: "w-full",
    },
  },
  defaults: { variant: "primary", size: "md", width: "auto" },
});

export interface ButtonProps extends ComponentProps<"button"> {
  variant?: "primary" | "secondary" | "ghost" | "link" | "destructive" | "inverse";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  /** Shows a spinner, disables the button and sets aria-busy. */
  loading?: boolean;
  /** Text announced to screen readers while loading, e.g. "Adding to cart". */
  loadingText?: string;
  /** Render the child element (e.g. a Next.js Link) with button styles. */
  asChild?: boolean;
}

/**
 * The primary action element. Use `asChild` with a `<Link>` for navigation
 * so links stay links.
 */
export function Button({
  variant,
  size,
  fullWidth,
  loading = false,
  loadingText,
  asChild = false,
  className,
  children,
  disabled,
  type = "button",
  ...props
}: ButtonProps) {
  const classes = buttonStyles({ variant, size, width: fullWidth ? "full" : "auto" }, className);

  if (asChild) {
    return (
      <Slot.Root className={classes} {...props}>
        {children}
      </Slot.Root>
    );
  }

  return (
    <button type={type} className={classes} disabled={disabled || loading} aria-busy={loading || undefined} {...props}>
      {loading ? (
        <>
          <span className="absolute inset-0 grid place-items-center">
            <Spinner />
          </span>
          <span className="invisible inline-flex items-center gap-2">{children}</span>
          {loadingText ? (
            <span className="sr-only" role="status">
              {loadingText}
            </span>
          ) : null}
        </>
      ) : (
        children
      )}
    </button>
  );
}
