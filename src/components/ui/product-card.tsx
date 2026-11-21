import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/cn";
import { Badge } from "./badge";
import { PriceTag } from "./price-tag";
import { Rating } from "./rating";

export interface ProductCardImage {
  url: string;
  alt: string;
}

export interface ProductCardData {
  slug: string;
  title: string;
  /** e.g. "Speckled oat glaze" or "3 glazes". */
  subtitle?: string;
  image?: ProductCardImage | null;
  /** Shown on hover (desktop) for a second angle. */
  hoverImage?: ProductCardImage | null;
  /** Lowest variant price in cents. */
  price: number;
  compareAtPrice?: number | null;
  /** True when variants have different prices. */
  priceVaries?: boolean;
  rating?: number | null;
  reviewCount?: number;
  /** Total stock across variants. */
  stock: number;
  isNew?: boolean;
}

export interface ProductCardProps {
  product: ProductCardData;
  layout?: "grid" | "list";
  /** Optional overlay action such as a wishlist button. Rendered above the card link. */
  action?: ReactNode;
  /** Pass true for cards in the first visible row so the image loads eagerly (LCP). */
  priority?: boolean;
  /** `sizes` hint for next/image, matched to the grid it lives in. */
  sizes?: string;
  className?: string;
  headingLevel?: "h2" | "h3";
}

const LOW_STOCK_THRESHOLD = 5;

export function stockStatus(stock: number): "sold-out" | "low" | "in-stock" {
  if (stock <= 0) return "sold-out";
  if (stock <= LOW_STOCK_THRESHOLD) return "low";
  return "in-stock";
}

/**
 * Product tile used in grids, carousels and search. The whole card is
 * clickable through a stretched title link, so there is a single tab stop
 * per product (plus the optional action).
 */
export function ProductCard({
  product,
  layout = "grid",
  action,
  priority = false,
  sizes = "(min-width: 1280px) 300px, (min-width: 768px) 33vw, 50vw",
  className,
  headingLevel = "h3",
}: ProductCardProps) {
  const Heading = headingLevel;
  const status = stockStatus(product.stock);
  const onSale = typeof product.compareAtPrice === "number" && product.compareAtPrice > product.price;
  const href = `/products/${product.slug}`;

  return (
    <article
      className={cn(
        "group relative flex",
        layout === "grid"
          ? "flex-col gap-3"
          : "flex-row items-center gap-4 rounded-md border border-line bg-surface p-3 sm:gap-6",
        className,
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-md bg-surface-muted",
          layout === "grid" ? "aspect-4/5 w-full" : "aspect-square w-28 shrink-0 sm:w-40",
        )}
      >
        {product.image ? (
          <>
            <Image
              src={product.image.url}
              alt={product.image.alt}
              fill
              sizes={layout === "grid" ? sizes : "160px"}
              loading={priority ? "eager" : "lazy"}
              fetchPriority={priority ? "high" : undefined}
              className={cn(
                "object-cover transition-[opacity,transform] duration-500 ease-out group-hover:scale-[1.03]",
                product.hoverImage && "group-hover:opacity-0",
                status === "sold-out" && "opacity-70",
              )}
            />
            {product.hoverImage ? (
              <Image
                src={product.hoverImage.url}
                alt=""
                fill
                sizes={layout === "grid" ? sizes : "160px"}
                className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
            ) : null}
          </>
        ) : (
          <div className="absolute inset-0 grid place-items-center text-fg-muted">
            <ImageOff aria-hidden="true" className="size-8" />
            <span className="sr-only">No photo available</span>
          </div>
        )}

        <div className="absolute top-2 left-2 flex flex-col items-start gap-1">
          {status === "sold-out" ? (
            <Badge tone="inverse">Sold out</Badge>
          ) : onSale ? (
            <Badge tone="danger">Sale</Badge>
          ) : product.isNew ? (
            <Badge tone="clay">New</Badge>
          ) : null}
        </div>
        {action && layout === "grid" ? <div className="absolute top-2 right-2 z-10">{action}</div> : null}
      </div>

      <div className={cn("flex min-w-0 flex-1 flex-col gap-1", layout === "list" && "gap-1.5")}>
        <Heading className={cn("font-sans text-base font-medium text-fg", layout === "list" && "sm:text-lg")}>
          <Link
            href={href}
            className="rounded-xs after:absolute after:inset-0 after:rounded-md focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-ring"
          >
            {product.title}
          </Link>
        </Heading>
        {product.subtitle ? <p className="text-sm text-fg-muted">{product.subtitle}</p> : null}
        <PriceTag price={product.price} compareAtPrice={product.compareAtPrice} from={product.priceVaries} size="sm" />
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          {product.rating && product.reviewCount ? (
            <Rating value={product.rating} count={product.reviewCount} size="sm" />
          ) : null}
          {status === "low" ? (
            <span className="text-sm font-medium text-warning">Only {product.stock} left</span>
          ) : null}
        </div>
      </div>
      {action && layout === "list" ? <div className="relative z-10 shrink-0">{action}</div> : null}
    </article>
  );
}

export function ProductCardSkeleton({ layout = "grid" }: { layout?: "grid" | "list" }) {
  if (layout === "list") {
    return (
      <div aria-hidden="true" className="flex items-center gap-4 rounded-md border border-line bg-surface p-3 sm:gap-6">
        <div className="aspect-square w-28 shrink-0 animate-pulse rounded-md bg-surface-sunken motion-reduce:animate-none sm:w-40" />
        <div className="grid flex-1 gap-2">
          <div className="h-5 w-2/3 animate-pulse rounded-xs bg-surface-sunken motion-reduce:animate-none" />
          <div className="h-4 w-1/3 animate-pulse rounded-xs bg-surface-sunken motion-reduce:animate-none" />
        </div>
      </div>
    );
  }
  return (
    <div aria-hidden="true" className="flex flex-col gap-3">
      <div className="aspect-4/5 w-full animate-pulse rounded-md bg-surface-sunken motion-reduce:animate-none" />
      <div className="h-5 w-3/4 animate-pulse rounded-xs bg-surface-sunken motion-reduce:animate-none" />
      <div className="h-4 w-1/3 animate-pulse rounded-xs bg-surface-sunken motion-reduce:animate-none" />
    </div>
  );
}
