import { Heart, Search, ShoppingBag, UserRound } from "lucide-react";
import { mainNav } from "@/lib/site";
import { Logo } from "@/components/brand/logo";
import { IconButton } from "@/components/ui/icon-button";
import { DesktopNavLinks } from "./nav-links";
import { MobileNav } from "./mobile-nav";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-background/90 backdrop-blur-md supports-[backdrop-filter]:bg-background/80">
      <div className="container-page flex h-16 items-center gap-2 lg:h-18">
        <div className="flex flex-1 items-center gap-1 lg:flex-none">
          <MobileNav />
          <Logo className="ml-1 lg:ml-0" />
        </div>

        <nav aria-label="Main" className="hidden flex-1 justify-center lg:flex">
          <DesktopNavLinks links={mainNav} />
        </nav>

        <div className="flex items-center justify-end gap-0.5">
          <IconButton href="/search" label="Search" icon={<Search />} />
          <IconButton href="/wishlist" label="Wishlist" icon={<Heart />} className="max-sm:hidden" />
          <IconButton href="/account" label="Account" icon={<UserRound />} className="max-sm:hidden" />
          <ThemeToggle className="max-sm:hidden" />
          <IconButton href="/cart" label="Cart" icon={<ShoppingBag />} />
        </div>
      </div>
    </header>
  );
}
