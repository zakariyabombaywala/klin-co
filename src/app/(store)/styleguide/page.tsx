import type { Metadata } from "next";
import { Suspense, type ReactNode } from "react";
import { Inbox } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Pagination } from "@/components/ui/pagination";
import { PriceTag } from "@/components/ui/price-tag";
import { ProductCard, ProductCardSkeleton, type ProductCardData } from "@/components/ui/product-card";
import { Rating } from "@/components/ui/rating";
import { EmptyState, Skeleton } from "@/components/ui/states";
import {
  contrastPairs,
  contrastRatio,
  palette,
  paletteRoles,
  resolveToken,
  scaleSteps,
  themes,
  type PaletteName,
} from "@/styles/tokens";
import {
  ButtonDemos,
  DisclosureDemos,
  FormDemos,
  GalleryDemo,
  OverlayDemos,
  PaginationDemo,
  StateDemos,
} from "./interactive-demos";

export const metadata: Metadata = {
  title: "Design system",
  description: "Tokens, typography and every UI component used across the Kiln & Co. store.",
  robots: { index: false, follow: false },
};

const sections = [
  { id: "colour", label: "Colour" },
  { id: "contrast", label: "Contrast" },
  { id: "type", label: "Typography" },
  { id: "spacing", label: "Spacing & radius" },
  { id: "buttons", label: "Buttons" },
  { id: "forms", label: "Form controls" },
  { id: "badges", label: "Badges & pricing" },
  { id: "cards", label: "Product cards" },
  { id: "navigation", label: "Navigation" },
  { id: "disclosure", label: "Tabs & accordion" },
  { id: "overlays", label: "Dialogs, drawers, toasts" },
  { id: "states", label: "Loading, empty, error" },
];

const typeScale = [
  { name: "6xl", px: 60, className: "text-6xl font-serif" },
  { name: "5xl", px: 48, className: "text-5xl font-serif" },
  { name: "4xl", px: 36, className: "text-4xl font-serif" },
  { name: "3xl", px: 30, className: "text-3xl font-serif" },
  { name: "2xl", px: 24, className: "text-2xl font-serif" },
  { name: "xl", px: 20, className: "text-xl" },
  { name: "lg", px: 18, className: "text-lg" },
  { name: "base", px: 16, className: "text-base" },
  { name: "sm", px: 14, className: "text-sm" },
  { name: "xs", px: 12, className: "text-xs" },
];

const spacing = [1, 2, 3, 4, 6, 8, 12, 16, 24];

const sampleProducts: ProductCardData[] = [
  {
    slug: "speckled-oat-mug",
    title: "Speckled Oat Mug",
    subtitle: "3 glazes",
    price: 3200,
    priceVaries: true,
    rating: 4.7,
    reviewCount: 38,
    stock: 24,
    isNew: true,
  },
  {
    slug: "sage-serving-bowl",
    title: "Sage Serving Bowl",
    subtitle: "Celadon glaze",
    price: 5400,
    compareAtPrice: 6800,
    rating: 4.4,
    reviewCount: 12,
    stock: 3,
  },
  {
    slug: "charcoal-bud-vase",
    title: "Charcoal Bud Vase",
    subtitle: "Matte black",
    price: 4200,
    rating: 5,
    reviewCount: 6,
    stock: 0,
  },
];

function Section({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className="scroll-mt-28 border-t border-line py-12 first:border-t-0 first:pt-0"
    >
      <h2 id={`${id}-heading`} className="text-3xl text-fg">
        {title}
      </h2>
      {description ? <p className="mt-2 max-w-2xl text-fg-muted">{description}</p> : null}
      <div className="mt-8">{children}</div>
    </section>
  );
}

function Demo({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-3">
      <h3 className="font-sans text-xs font-semibold tracking-wide text-fg-muted uppercase">{label}</h3>
      <div className="rounded-md border border-line bg-surface p-5 sm:p-6">{children}</div>
    </div>
  );
}

export default function StyleguidePage() {
  return (
    <div className="container-page py-10 lg:py-14">
      <header className="max-w-2xl">
        <p className="text-sm font-medium tracking-wide text-link uppercase">Design system</p>
        <h1 className="mt-2 text-5xl text-fg">Kiln &amp; Co. styleguide</h1>
        <p className="mt-4 text-lg text-fg-muted">
          Every token and component used in the store, in one place. Switch the theme in the header to check each one in
          dark mode.
        </p>
      </header>

      <div className="mt-10 grid gap-10 lg:grid-cols-[200px_1fr] lg:gap-12">
        <nav aria-label="Styleguide sections" className="lg:sticky lg:top-24 lg:self-start">
          <ul className="flex flex-wrap gap-2 lg:grid lg:gap-0.5">
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="block rounded-sm border border-line px-3 py-1.5 text-sm text-fg-muted transition-colors hover:bg-surface-muted hover:text-fg focus-visible:outline-2 focus-visible:outline-ring lg:border-0 lg:px-2"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="min-w-0">
          <Section
            id="colour"
            title="Colour"
            description="Seven scales from 50 to 900. Components never use raw scale values for text; they use the semantic tokens below, which switch with the theme."
          >
            <div className="grid gap-6">
              {(Object.keys(palette) as PaletteName[]).map((name) => (
                <div key={name}>
                  <div className="mb-2 flex flex-wrap items-baseline gap-x-3">
                    <h3 className="font-sans text-base font-semibold text-fg capitalize">{name}</h3>
                    <p className="text-sm text-fg-muted">{paletteRoles[name]}</p>
                  </div>
                  <ul className="grid grid-cols-5 gap-1.5 sm:grid-cols-10">
                    {scaleSteps.map((step) => {
                      const hex = palette[name][step];
                      return (
                        <li key={step} className="grid gap-1">
                          <span
                            className="block h-12 rounded-xs border border-black/5"
                            style={{ backgroundColor: hex }}
                          />
                          <span className="text-xs font-medium text-fg">{step}</span>
                          <span className="text-xs text-fg-muted uppercase tabular-nums">{hex.slice(1)}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </Section>

          <Section
            id="contrast"
            title="Contrast"
            description="Every text and border pairing in both themes, checked against WCAG 2.1 AA (4.5:1 for text, 3:1 for input borders and focus rings). The same check runs in the unit tests."
          >
            <div className="overflow-x-auto rounded-md border border-line">
              <table className="w-full min-w-xl text-left text-sm">
                <caption className="sr-only">Contrast ratios for semantic colour pairs</caption>
                <thead className="bg-surface-muted text-fg">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-semibold">
                      Pairing
                    </th>
                    <th scope="col" className="px-4 py-3 font-semibold">
                      Light
                    </th>
                    <th scope="col" className="px-4 py-3 font-semibold">
                      Dark
                    </th>
                    <th scope="col" className="px-4 py-3 font-semibold">
                      Needs
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line bg-surface">
                  {contrastPairs.map((pair) => (
                    <tr key={pair.label}>
                      <th scope="row" className="px-4 py-2.5 font-normal text-fg">
                        {pair.label}
                      </th>
                      {(["light", "dark"] as const).map((theme) => {
                        const fg = resolveToken(themes[theme][pair.fg]);
                        const bg = resolveToken(themes[theme][pair.bg]);
                        const ratio = contrastRatio(fg, bg);
                        return (
                          <td key={theme} className="px-4 py-2.5">
                            <span className="inline-flex items-center gap-2">
                              <span
                                aria-hidden="true"
                                className="grid h-7 w-10 place-items-center rounded-xs border border-black/10 text-xs font-semibold"
                                style={{ backgroundColor: bg, color: fg }}
                              >
                                Aa
                              </span>
                              <span className="text-fg tabular-nums">{ratio.toFixed(2)}:1</span>
                            </span>
                          </td>
                        );
                      })}
                      <td className="px-4 py-2.5 text-fg-muted tabular-nums">{pair.min}:1</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          <Section
            id="type"
            title="Typography"
            description="Fraunces (variable, soft optical sizes) for headings, Inter for body and interface text. Both are self-hosted through next/font, with size-adjusted fallbacks so text doesn't shift as fonts load."
          >
            <ul className="grid gap-4">
              {typeScale.map((t) => (
                <li
                  key={t.name}
                  className="grid items-baseline gap-1 border-b border-line pb-4 sm:grid-cols-[120px_1fr] sm:gap-6"
                >
                  <span className="text-sm text-fg-muted tabular-nums">
                    {t.name} · {t.px}px
                  </span>
                  <span className={`${t.className} truncate text-fg`}>Made slowly, used daily</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <Demo label="Body copy">
                <p className="text-base leading-relaxed text-fg">
                  Every piece starts as a ball of speckled stoneware on the wheel. It dries for a week, is bisque fired,
                  dipped in glaze by hand and fired again to 1,240°C.
                </p>
                <p className="mt-3 text-sm text-fg-muted">
                  Secondary text is used for supporting details and captions.
                </p>
              </Demo>
              <Demo label="Links & emphasis">
                <p className="text-fg">
                  Read about{" "}
                  <a href="#type" className="text-link underline underline-offset-4 hover:decoration-2">
                    how we fire our glazes
                  </a>
                  , or browse <strong className="font-semibold">this week’s new pieces</strong>.
                </p>
              </Demo>
            </div>
          </Section>

          <Section
            id="spacing"
            title="Spacing, radius & shadow"
            description="A 4px grid. Content sits in a 1280px container with 16px gutters on mobile. Inputs and buttons use a 6px radius, cards 12px."
          >
            <div className="grid gap-8 md:grid-cols-2">
              <Demo label="Spacing scale (×4px)">
                <ul className="grid gap-2">
                  {spacing.map((s) => (
                    <li key={s} className="flex items-center gap-3 text-sm text-fg-muted">
                      <span className="w-12 tabular-nums">{s * 4}px</span>
                      <span className="h-3 rounded-xs bg-primary" style={{ width: `${s * 4}px` }} />
                    </li>
                  ))}
                </ul>
              </Demo>
              <Demo label="Radius & shadow">
                <div className="grid grid-cols-2 gap-4 text-sm text-fg-muted">
                  <div className="grid h-20 place-items-center rounded-sm border border-line bg-surface-muted">
                    sm · 6px
                  </div>
                  <div className="grid h-20 place-items-center rounded-md border border-line bg-surface-muted">
                    md · 12px
                  </div>
                  <div className="grid h-20 place-items-center rounded-md bg-surface shadow-sm">shadow-sm</div>
                  <div className="grid h-20 place-items-center rounded-md bg-surface shadow-lg">shadow-lg</div>
                </div>
              </Demo>
            </div>
          </Section>

          <Section
            id="buttons"
            title="Buttons"
            description="Primary for the main action on a screen, secondary for alternatives, ghost for toolbars, link for inline actions, destructive for removal. Loading buttons keep their width and announce progress."
          >
            <Demo label="Variants, sizes and states">
              <ButtonDemos />
            </Demo>
          </Section>

          <Section
            id="forms"
            title="Form controls"
            description="Labels sit above fields. Hints and errors are linked to their input with aria-describedby, and invalid fields are marked aria-invalid. Submit the empty email field to see the error state."
          >
            <Demo label="Inputs, choice controls, slider, stepper, rating">
              <FormDemos />
            </Demo>
          </Section>

          <Section id="badges" title="Badges, prices & ratings">
            <div className="grid gap-6 md:grid-cols-3">
              <Demo label="Badges">
                <div className="flex flex-wrap gap-2">
                  <Badge>Neutral</Badge>
                  <Badge tone="clay">New</Badge>
                  <Badge tone="success">In stock</Badge>
                  <Badge tone="warning">Only 3 left</Badge>
                  <Badge tone="danger">Sale</Badge>
                  <Badge tone="inverse">Sold out</Badge>
                  <Badge tone="outline">Outline</Badge>
                  <Badge tone="success" size="sm">
                    Verified purchase
                  </Badge>
                </div>
              </Demo>
              <Demo label="Price tag">
                <div className="grid gap-3">
                  <PriceTag price={4800} />
                  <PriceTag price={3600} compareAtPrice={4800} showSavings />
                  <PriceTag price={2800} from />
                  <PriceTag price={12850} compareAtPrice={16000} size="lg" />
                </div>
              </Demo>
              <Demo label="Rating">
                <div className="grid gap-3">
                  <Rating value={4.7} count={38} />
                  <Rating value={3.5} count={4} size="sm" />
                  <Rating value={5} size="lg" />
                </div>
              </Demo>
            </div>
          </Section>

          <Section
            id="cards"
            title="Product cards & gallery"
            description="Cards show sale, new, low-stock and sold-out states. The whole card is one link. Catalogue photography is loaded in the next build phase; until then the image slot shows its empty state."
          >
            <div className="grid gap-8">
              <Demo label="Grid layout">
                <ul className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3">
                  {sampleProducts.map((product) => (
                    <li key={product.slug}>
                      <ProductCard product={product} />
                    </li>
                  ))}
                </ul>
              </Demo>
              <Demo label="List layout">
                <ul className="grid gap-3">
                  {sampleProducts.slice(0, 2).map((product) => (
                    <li key={product.slug}>
                      <ProductCard product={product} layout="list" />
                    </li>
                  ))}
                </ul>
              </Demo>
              <Demo label="Gallery (empty state)">
                <GalleryDemo />
              </Demo>
            </div>
          </Section>

          <Section id="navigation" title="Navigation">
            <div className="grid gap-6">
              <Demo label="Breadcrumbs">
                <Breadcrumbs
                  items={[
                    { label: "Home", href: "/" },
                    { label: "Shop", href: "/shop" },
                    { label: "Mugs", href: "/shop?category=mugs" },
                    { label: "Speckled Oat Mug" },
                  ]}
                />
              </Demo>
              <Demo label="Pagination (page 5 of 12)">
                <Suspense
                  fallback={
                    <Pagination page={5} totalPages={12} hrefForPage={(p) => `/styleguide?page=${p}#navigation`} />
                  }
                >
                  <PaginationDemo />
                </Suspense>
              </Demo>
            </div>
          </Section>

          <Section
            id="disclosure"
            title="Tabs & accordion"
            description="Arrow keys move between tabs; Enter or Space toggles accordion items."
          >
            <Demo label="Product detail tabs and FAQ accordion">
              <DisclosureDemos />
            </Demo>
          </Section>

          <Section
            id="overlays"
            title="Dialogs, drawers & toasts"
            description="Overlays trap focus and restore it on close. Toasts are announced politely; errors are announced immediately and stay longer."
          >
            <Demo label="Try them">
              <OverlayDemos />
            </Demo>
          </Section>

          <Section
            id="states"
            title="Loading, empty & error states"
            description="Every async view has all three. Skeletons match the shape of what they replace to avoid layout shift."
          >
            <div className="grid gap-6">
              <Demo label="Skeletons">
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  <ProductCardSkeleton />
                  <ProductCardSkeleton />
                  <div className="col-span-2 grid content-start gap-3">
                    <Skeleton className="h-8 w-2/3" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-11 w-40" />
                  </div>
                </div>
              </Demo>
              <StateDemos />
              <EmptyState headingLevel="h3" icon={<Inbox aria-hidden="true" />} title="No messages yet" />
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}
