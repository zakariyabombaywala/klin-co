"use client";

import { fontVariables } from "@/lib/fonts";
import { headScript } from "@/lib/head-script";
import "./globals.css";

/** Last-resort error page, shown when the root layout itself fails. */
export default function GlobalError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <html lang="en" data-theme="light" className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: headScript }} />
        <title>Something went wrong | Kiln &amp; Co.</title>
      </head>
      <body className="grid min-h-dvh place-items-center px-4">
        <main className="grid max-w-lg justify-items-center gap-5 text-center" role="alert">
          <p className="font-serif text-6xl text-primary" aria-hidden="true">
            500
          </p>
          <h1 className="text-4xl text-fg">Something cracked in the firing</h1>
          <p className="text-fg-muted">The studio site hit an unexpected error. Please try again in a moment.</p>
          {error.digest ? <p className="text-xs text-fg-muted">Reference: {error.digest}</p> : null}
          <div className="flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => retry()}
              className="inline-flex h-11 items-center rounded-sm bg-primary px-5 text-sm font-medium text-primary-fg hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              Try again
            </button>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- a full reload is wanted after a root layout failure */}
            <a
              href="/"
              className="inline-flex h-11 items-center rounded-sm border border-line-strong bg-surface px-5 text-sm font-medium text-fg hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              Go to the home page
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
