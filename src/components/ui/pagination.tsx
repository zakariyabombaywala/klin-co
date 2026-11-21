import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";

export type PageToken = number | "ellipsis-start" | "ellipsis-end";

/**
 * Page numbers to show, always including first, last and `siblings` pages on
 * each side of the current page: [1, "ellipsis-start", 4, 5, 6, "ellipsis-end", 12].
 */
export function getPageTokens(current: number, total: number, siblings = 1): PageToken[] {
  if (total <= 0) return [];
  const page = Math.min(Math.max(current, 1), total);
  // first + last + current + 2*siblings + 2 ellipses
  if (total <= 5 + siblings * 2) return Array.from({ length: total }, (_, i) => i + 1);

  const start = Math.max(page - siblings, 2);
  const end = Math.min(page + siblings, total - 1);
  const tokens: PageToken[] = [1];
  if (start > 2) tokens.push("ellipsis-start");
  for (let p = start; p <= end; p++) tokens.push(p);
  if (end < total - 1) tokens.push("ellipsis-end");
  tokens.push(total);
  return tokens;
}

export interface PaginationProps {
  page: number;
  totalPages: number;
  /** Builds the URL for a page so pagination works without JavaScript and keeps filters. */
  hrefForPage: (page: number) => string;
  className?: string;
}

const itemClass =
  "inline-grid h-10 min-w-10 place-items-center rounded-sm px-3 text-sm tabular-nums transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

export function Pagination({ page, totalPages, hrefForPage, className }: PaginationProps) {
  if (totalPages <= 1) return null;
  const tokens = getPageTokens(page, totalPages);
  const prev = page > 1 ? page - 1 : null;
  const next = page < totalPages ? page + 1 : null;

  return (
    <nav aria-label="Pagination" className={className}>
      <ul className="flex flex-wrap items-center justify-center gap-1">
        <li>
          {prev ? (
            <Link href={hrefForPage(prev)} className={cn(itemClass, "gap-1 hover:bg-surface-muted")} rel="prev">
              <ChevronLeft aria-hidden="true" className="size-4" />
              <span>Previous</span>
            </Link>
          ) : (
            <span aria-disabled="true" className={cn(itemClass, "gap-1 text-fg-muted opacity-60")}>
              <ChevronLeft aria-hidden="true" className="size-4" />
              <span>Previous</span>
            </span>
          )}
        </li>
        {tokens.map((token) =>
          typeof token === "number" ? (
            <li key={token} className="hidden sm:block">
              <Link
                href={hrefForPage(token)}
                aria-current={token === page ? "page" : undefined}
                aria-label={`Page ${token}`}
                className={cn(
                  itemClass,
                  token === page ? "bg-inverse font-semibold text-inverse-fg" : "text-fg hover:bg-surface-muted",
                )}
              >
                {token}
              </Link>
            </li>
          ) : (
            <li key={token} aria-hidden="true" className="hidden px-1 text-fg-muted sm:block">
              …
            </li>
          ),
        )}
        <li className="px-2 text-sm text-fg-muted sm:hidden" aria-hidden="true">
          {page} / {totalPages}
        </li>
        <li>
          {next ? (
            <Link href={hrefForPage(next)} className={cn(itemClass, "gap-1 hover:bg-surface-muted")} rel="next">
              <span>Next</span>
              <ChevronRight aria-hidden="true" className="size-4" />
            </Link>
          ) : (
            <span aria-disabled="true" className={cn(itemClass, "gap-1 text-fg-muted opacity-60")}>
              <span>Next</span>
              <ChevronRight aria-hidden="true" className="size-4" />
            </span>
          )}
        </li>
      </ul>
    </nav>
  );
}
