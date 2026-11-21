"use client";

import { CreditCard, X } from "lucide-react";
import { BANNER_STORAGE_KEY } from "@/lib/head-script";

/**
 * Sitewide notice that this is a demo. Dismissal is remembered in
 * localStorage and applied before paint by the head script.
 */
export function DemoBanner() {
  const dismiss = () => {
    document.documentElement.setAttribute("data-demo-banner", "hidden");
    try {
      localStorage.setItem(BANNER_STORAGE_KEY, "hidden");
    } catch {
      // Storage unavailable: the banner stays hidden until the next page load.
    }
    document.getElementById("main")?.focus({ preventScroll: true });
  };

  return (
    <aside data-demo-banner-root aria-label="Demo store notice" className="bg-inverse text-inverse-fg">
      <div className="container-page flex items-center gap-3 py-2">
        <CreditCard aria-hidden="true" className="hidden size-4 shrink-0 sm:block" />
        <p className="flex-1 text-xs leading-snug sm:text-sm">
          <strong className="font-semibold">This is a demo store.</strong> Use test card{" "}
          <span className="font-medium whitespace-nowrap tabular-nums">4242 4242 4242 4242</span>, any future date, any
          CVC. No real orders are placed.
        </p>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss demo notice"
          className="-mr-2 grid size-9 shrink-0 place-items-center rounded-sm transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-current"
        >
          <X aria-hidden="true" className="size-4" />
        </button>
      </div>
    </aside>
  );
}
