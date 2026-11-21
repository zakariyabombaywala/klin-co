import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StoreShell } from "@/components/layout/store-shell";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <StoreShell>
      <section className="container-page grid place-items-center py-20 text-center sm:py-28">
        <div className="grid max-w-lg justify-items-center gap-5">
          <p className="font-serif text-6xl text-primary" aria-hidden="true">
            404
          </p>
          <h1 className="text-4xl text-fg">This piece didn’t make it out of the kiln</h1>
          <p className="text-fg-muted">
            The page you’re looking for has moved, sold out for good, or never existed. Let’s get you back to the
            shelves.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild>
              <Link href="/shop">Browse the shop</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/">Go to the home page</Link>
            </Button>
          </div>
        </div>
      </section>
    </StoreShell>
  );
}
