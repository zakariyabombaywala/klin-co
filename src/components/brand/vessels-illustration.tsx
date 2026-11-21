import { cn } from "@/lib/cn";

/**
 * Decorative still life of three studio pieces (bud vase, mug, bowl) drawn in
 * the brand palette. Used where a photo would be too heavy or is not available.
 */
export function VesselsIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 480 400" role="presentation" aria-hidden="true" className={cn("h-auto w-full", className)}>
      <defs>
        <pattern id="speckle" width="18" height="18" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="4" r="0.9" fill="#2a2622" opacity="0.22" />
          <circle cx="12" cy="9" r="0.7" fill="#2a2622" opacity="0.18" />
          <circle cx="7" cy="15" r="0.6" fill="#2a2622" opacity="0.2" />
        </pattern>
      </defs>

      {/* table line and soft shadows */}
      <ellipse cx="128" cy="338" rx="70" ry="9" fill="#2a2622" opacity="0.08" />
      <ellipse cx="262" cy="340" rx="64" ry="8" fill="#2a2622" opacity="0.08" />
      <ellipse cx="378" cy="338" rx="78" ry="8" fill="#2a2622" opacity="0.08" />

      {/* tall bud vase: clay body, cream dip at the lip */}
      <path
        d="M110 92c0-8 36-8 36 0v20c0 14 34 36 34 104 0 64-22 118-52 118s-52-54-52-118c0-68 34-90 34-104z"
        fill="#bf6443"
      />
      <path d="M110 92c0-8 36-8 36 0v20c0 8 10 18 18 32H92c8-14 18-24 18-32z" fill="#f3ead9" />
      <path
        d="M110 92c0-8 36-8 36 0v20c0 14 34 36 34 104 0 64-22 118-52 118s-52-54-52-118c0-68 34-90 34-104z"
        fill="url(#speckle)"
      />
      <path d="M92 144c10 6 62 6 72 0" stroke="#863f29" strokeWidth="2" fill="none" opacity="0.4" />

      {/* mug: sage glaze, raw foot */}
      <path
        d="M306 236c14 0 30 10 30 32s-16 32-30 32"
        stroke="#4d6846"
        strokeWidth="12"
        fill="none"
        strokeLinecap="round"
      />
      <rect x="208" y="214" width="104" height="124" rx="18" fill="#628259" />
      <rect x="208" y="214" width="104" height="124" rx="18" fill="url(#speckle)" />
      <path d="M208 314h104v6c0 10-8 18-18 18h-68c-10 0-18-8-18-18z" fill="#dfc9a3" />
      <ellipse cx="260" cy="216" rx="52" ry="7" fill="#4d6846" />

      {/* low bowl: oat glaze with a clay rim */}
      <path d="M300 280h156c0 34-34 58-78 58s-78-24-78-58z" fill="#ebdcc2" />
      <path d="M300 280h156c0 34-34 58-78 58s-78-24-78-58z" fill="url(#speckle)" />
      <ellipse cx="378" cy="280" rx="78" ry="10" fill="#a34f32" />
      <ellipse cx="378" cy="280" rx="70" ry="6" fill="#863f29" />

      {/* a sprig in the vase */}
      <path d="M128 92c-2-24 4-46 20-66" stroke="#4d6846" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M140 46c10-6 22-4 28 2-10 6-20 6-28-2z" fill="#7f9d74" />
      <path d="M134 66c-10-8-22-8-30-2 8 8 20 8 30 2z" fill="#7f9d74" />
    </svg>
  );
}
