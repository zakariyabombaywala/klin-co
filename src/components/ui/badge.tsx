import type { ComponentProps } from "react";
import { variants } from "@/lib/variants";

export const badgeStyles = variants({
  base: "inline-flex items-center gap-1 rounded-xs font-medium whitespace-nowrap [&_svg]:size-3.5",
  variants: {
    tone: {
      neutral: "bg-surface-sunken text-fg",
      clay: "bg-clay-100 text-clay-800 dark:bg-clay-900 dark:text-clay-100",
      success: "bg-success-bg text-success-strong",
      warning: "bg-warning-bg text-warning-strong",
      danger: "bg-danger-bg text-danger-strong",
      outline: "border border-line-strong text-fg",
      inverse: "bg-inverse text-inverse-fg",
    },
    size: {
      sm: "px-1.5 py-0.5 text-xs",
      md: "px-2 py-1 text-xs tracking-wide uppercase",
    },
  },
  defaults: { tone: "neutral", size: "md" },
});

export interface BadgeProps extends ComponentProps<"span"> {
  tone?: "neutral" | "clay" | "success" | "warning" | "danger" | "outline" | "inverse";
  size?: "sm" | "md";
}

/** Small status label: "Sale", "New", "Only 3 left", "Verified purchase". */
export function Badge({ tone, size, className, ...props }: BadgeProps) {
  return <span className={badgeStyles({ tone, size }, className)} {...props} />;
}
