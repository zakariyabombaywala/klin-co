"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";
import { cn } from "@/lib/cn";

export interface GalleryImage {
  url: string;
  alt: string;
}

export interface ProductGalleryProps {
  images: GalleryImage[];
  /** Jump to this image, e.g. when the shopper picks a variant with its own photo. */
  focusIndex?: number;
  className?: string;
}

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Product photos with thumbnails. Swipe on touch screens (native scroll
 * snapping), hover to zoom on desktop, arrow buttons and thumbnails for
 * keyboard users.
 */
export function ProductGallery({ images, focusIndex, className }: ProductGalleryProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);

  const goTo = useCallback((index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.max(0, Math.min(index, track.children.length - 1));
    track.scrollTo({ left: clamped * track.clientWidth, behavior: prefersReducedMotion() ? "auto" : "smooth" });
    setActive(clamped);
  }, []);

  useEffect(() => {
    if (focusIndex !== undefined && focusIndex >= 0) goTo(focusIndex);
  }, [focusIndex, goTo]);

  const onScroll = () => {
    const track = trackRef.current;
    if (!track || track.clientWidth === 0) return;
    const index = Math.round(track.scrollLeft / track.clientWidth);
    if (index !== active) setActive(index);
  };

  const onZoomMove = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setZoom({
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    });
  };

  if (images.length === 0) {
    return (
      <div
        className={cn("grid aspect-4/5 w-full place-items-center rounded-md bg-surface-muted text-fg-muted", className)}
      >
        <div className="flex flex-col items-center gap-2 text-sm">
          <ImageOff aria-hidden="true" className="size-8" />
          No photos for this piece yet
        </div>
      </div>
    );
  }

  const multiple = images.length > 1;

  return (
    <div className={cn("flex flex-col gap-3 lg:flex-row-reverse lg:items-start lg:gap-4", className)}>
      <div className="relative min-w-0 flex-1">
        <div
          ref={trackRef}
          onScroll={onScroll}
          role="region"
          aria-roledescription="carousel"
          aria-label="Product photos"
          className="flex snap-x snap-mandatory [scrollbar-width:none] overflow-x-auto overscroll-x-contain rounded-md bg-surface-muted [&::-webkit-scrollbar]:hidden"
        >
          {images.map((image, index) => (
            <div
              key={image.url}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${images.length}`}
              className="relative aspect-4/5 w-full shrink-0 snap-center overflow-hidden"
              onMouseMove={index === active ? onZoomMove : undefined}
              onMouseLeave={() => setZoom(null)}
            >
              <Image
                src={image.url}
                alt={image.alt}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                loading={index === 0 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : undefined}
                className={cn(
                  "object-cover transition-transform duration-200 ease-out pointer-fine:cursor-zoom-in",
                  zoom && index === active && "pointer-fine:scale-200",
                )}
                style={zoom && index === active ? { transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
              />
            </div>
          ))}
        </div>

        {multiple ? (
          <>
            <button
              type="button"
              onClick={() => goTo(active - 1)}
              disabled={active === 0}
              aria-label="Previous photo"
              className="absolute top-1/2 left-3 hidden size-10 -translate-y-1/2 place-items-center rounded-full bg-surface/90 text-fg shadow-sm backdrop-blur-sm transition-opacity hover:bg-surface focus-visible:outline-2 focus-visible:outline-ring disabled:opacity-0 sm:grid"
            >
              <ChevronLeft aria-hidden="true" className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => goTo(active + 1)}
              disabled={active === images.length - 1}
              aria-label="Next photo"
              className="absolute top-1/2 right-3 hidden size-10 -translate-y-1/2 place-items-center rounded-full bg-surface/90 text-fg shadow-sm backdrop-blur-sm transition-opacity hover:bg-surface focus-visible:outline-2 focus-visible:outline-ring disabled:opacity-0 sm:grid"
            >
              <ChevronRight aria-hidden="true" className="size-5" />
            </button>
            <p className="sr-only" aria-live="polite">
              Photo {active + 1} of {images.length}
            </p>
          </>
        ) : null}
      </div>

      {multiple ? (
        <ul
          aria-label="Choose a photo"
          className="flex [scrollbar-width:thin] gap-2 overflow-x-auto pb-1 lg:w-20 lg:flex-col lg:overflow-visible lg:pb-0"
        >
          {images.map((image, index) => (
            <li key={image.url} className="shrink-0">
              <button
                type="button"
                onClick={() => goTo(index)}
                aria-label={`Show photo ${index + 1}: ${image.alt}`}
                aria-current={index === active ? "true" : undefined}
                className={cn(
                  "relative block aspect-square w-16 overflow-hidden rounded-sm border-2 bg-surface-muted transition-colors lg:w-20",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                  index === active ? "border-fg" : "border-transparent hover:border-line-strong",
                )}
              >
                <Image src={image.url} alt="" fill sizes="80px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
