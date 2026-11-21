import Link from "next/link";
import { cn } from "@/lib/cn";

/** The Kiln & Co. mark: an arched kiln with its firing door. */
export function KilnMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M5 20.5V11a7 7 0 0 1 14 0v9.5" />
      <path d="M3 20.5h18" />
      <path d="M10 20.5v-3.5a2 2 0 0 1 4 0v3.5" />
      <path d="M9.5 8.5c.8-1 1.6-1.5 2.5-1.5s1.7.5 2.5 1.5" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center gap-2 rounded-xs text-fg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring",
        className,
      )}
    >
      <KilnMark className="size-7 text-primary" />
      <span className="font-serif text-xl font-medium tracking-tight whitespace-nowrap sm:text-2xl">
        Kiln <span className="text-primary">&amp;</span> Co.
      </span>
      <span className="sr-only">, home</span>
    </Link>
  );
}
