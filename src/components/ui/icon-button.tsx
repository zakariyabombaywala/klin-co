import type { ComponentProps, ReactNode } from "react";
import Link from "next/link";
import { variants } from "@/lib/variants";
import { Spinner } from "./spinner";

export const iconButtonStyles = variants({
  base: [
    "relative inline-flex shrink-0 items-center justify-center rounded-sm transition-colors duration-150",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
    "disabled:pointer-events-none disabled:opacity-55",
  ],
  variants: {
    variant: {
      ghost: "text-fg hover:bg-surface-muted",
      secondary: "border border-line-strong bg-surface text-fg hover:bg-surface-muted",
      primary: "bg-primary text-primary-fg hover:bg-primary-hover",
      overlay: "bg-surface/90 text-fg shadow-sm backdrop-blur-sm hover:bg-surface",
    },
    size: {
      sm: "size-9 [&_svg]:size-4",
      md: "size-11 [&_svg]:size-5",
    },
  },
  defaults: { variant: "ghost", size: "md" },
});

export interface IconButtonProps extends Omit<ComponentProps<"button">, "children"> {
  /** Accessible name. Required because the button has no visible text. */
  label: string;
  icon: ReactNode;
  variant?: "ghost" | "secondary" | "primary" | "overlay";
  size?: "sm" | "md";
  loading?: boolean;
  /** Render as a Next.js link instead of a button. */
  href?: string;
  prefetch?: boolean;
  /** Optional small count bubble, e.g. cart items. */
  count?: number;
}

export function IconButton({
  label,
  icon,
  variant,
  size,
  loading,
  href,
  prefetch,
  count,
  className,
  type = "button",
  disabled,
  ...props
}: IconButtonProps) {
  const classes = iconButtonStyles({ variant, size }, className);
  const content = (
    <>
      {loading ? <Spinner /> : icon}
      {count !== undefined && count > 0 ? (
        <span
          aria-hidden="true"
          className="absolute -top-0.5 -right-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-xs font-semibold text-primary-fg tabular-nums"
        >
          {count > 99 ? "99+" : count}
        </span>
      ) : null}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes} aria-label={label} prefetch={prefetch}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      aria-label={label}
      aria-busy={loading || undefined}
      disabled={disabled || loading}
      {...props}
    >
      {content}
    </button>
  );
}
