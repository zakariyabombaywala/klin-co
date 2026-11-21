/*
 * Outline social glyphs drawn to match Lucide's 24px grid and stroke weight.
 * (Lucide no longer ships brand icons.) Paths adapted from Lucide v0 (ISC licence).
 */

interface IconProps {
  className?: string;
}

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function InstagramIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <path d="M17.5 6.5h.01" />
    </svg>
  );
}

export function FacebookIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

export function PinterestIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="12" r="10" />
      <path d="M10.5 21.5 12.6 13" />
      <path d="M9.4 14.2c-.7-.8-1-1.7-1-2.8 0-2.6 2-4.4 4.4-4.4 2.3 0 3.8 1.5 3.8 3.6 0 2.4-1.2 4.2-3 4.2-1 0-1.6-.8-1.4-1.7l.6-2.4" />
    </svg>
  );
}
