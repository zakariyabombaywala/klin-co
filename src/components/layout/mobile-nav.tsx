"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, Menu, Search, UserRound } from "lucide-react";
import { mainNav, site } from "@/lib/site";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { iconButtonStyles } from "@/components/ui/icon-button";
import { MobileNavLinks } from "./nav-links";
import { ThemeSegmented } from "./theme-toggle";

const secondaryLinks = [
  { label: "Search", href: "/search", icon: Search },
  { label: "Wishlist", href: "/wishlist", icon: Heart },
  { label: "Account", href: "/account", icon: UserRound },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className={iconButtonStyles({ variant: "ghost", size: "md" }, "lg:hidden")} aria-label="Open menu">
        <Menu aria-hidden="true" />
      </SheetTrigger>
      <SheetContent side="left" title="Menu" description={site.tagline}>
        <nav aria-label="Main">
          <MobileNavLinks links={mainNav} onNavigate={close} />
        </nav>
        <ul className="mt-6 grid gap-1 border-t border-line pt-6">
          {secondaryLinks.map(({ label, href, icon: Icon }) => (
            <li key={href}>
              <Link
                href={href}
                onClick={close}
                className="flex items-center gap-3 rounded-sm px-3 py-3 text-base text-fg transition-colors hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-ring"
              >
                <Icon aria-hidden="true" className="size-5 text-fg-muted" />
                {label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-6 grid gap-2 border-t border-line pt-6">
          <p className="px-1 text-sm font-medium text-fg-muted">Theme</p>
          <ThemeSegmented />
        </div>
      </SheetContent>
    </Sheet>
  );
}
