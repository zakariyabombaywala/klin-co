"use client";

import Link from "next/link";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function StoreError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <section className="container-page grid place-items-center py-20 text-center sm:py-28" role="alert">
      <div className="grid max-w-lg justify-items-center gap-5">
        <p className="font-serif text-6xl text-primary" aria-hidden="true">
          500
        </p>
        <h1 className="text-4xl text-fg">Something cracked in the firing</h1>
        <p className="text-fg-muted">
          We couldn’t load this page. It’s on our side, not yours. Try again, and if it keeps happening, drop us a line.
        </p>
        {error.digest ? <p className="text-xs text-fg-muted">Reference: {error.digest}</p> : null}
        <div className="flex flex-wrap justify-center gap-3">
          <Button onClick={() => retry()}>
            <RefreshCw aria-hidden="true" />
            Try again
          </Button>
          <Button asChild variant="secondary">
            <Link href="/contact">Contact us</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
