"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Heart, Mail, PackageSearch, RefreshCw, Search, ShoppingBag, Trash2 } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { IconButton } from "@/components/ui/icon-button";
import { Input, Textarea } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import { ProductGallery } from "@/components/ui/product-gallery";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { RadioGroup } from "@/components/ui/radio-group";
import { RatingInput } from "@/components/ui/rating-input";
import { Select } from "@/components/ui/select";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { EmptyState, ErrorState } from "@/components/ui/states";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/toast-store";
import { Tooltip } from "@/components/ui/tooltip";

export function ButtonDemos() {
  const [loading, setLoading] = useState(false);
  const [liked, setLiked] = useState(false);

  const simulate = () => {
    setLoading(true);
    window.setTimeout(() => setLoading(false), 1500);
  };

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
        <Button variant="destructive">
          <Trash2 aria-hidden="true" />
          Destructive
        </Button>
        <Button variant="inverse">Inverse</Button>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
        <Button disabled>Disabled</Button>
        <Button loading={loading} loadingText="Adding to cart" onClick={simulate}>
          <ShoppingBag aria-hidden="true" />
          {loading ? "Adding" : "Add to cart (click me)"}
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <IconButton label="Search" icon={<Search />} />
        <IconButton label="Search" icon={<Search />} variant="secondary" />
        <IconButton label="Search" icon={<Search />} variant="primary" />
        <IconButton label="Cart, 3 items" icon={<ShoppingBag />} count={3} />
        <Tooltip content={liked ? "Remove from wishlist" : "Save to wishlist"}>
          <IconButton
            label={liked ? "Remove from wishlist" : "Save to wishlist"}
            aria-pressed={liked}
            onClick={() => setLiked((v) => !v)}
            icon={<Heart className={liked ? "fill-current text-danger" : undefined} />}
            variant="secondary"
          />
        </Tooltip>
        <IconButton label="Loading" icon={<Search />} loading variant="secondary" />
      </div>
    </div>
  );
}

const glazeOptions = [
  { value: "oat", label: "Speckled oat" },
  { value: "sage", label: "Sage celadon" },
  { value: "clay", label: "Raw terracotta" },
  { value: "charcoal", label: "Charcoal matte", disabled: true },
];

export function FormDemos() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [glaze, setGlaze] = useState("oat");
  const [shipping, setShipping] = useState("standard");
  const [price, setPrice] = useState([2000, 12000]);
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [inStock, setInStock] = useState(true);
  const [newsletter, setNewsletter] = useState(false);

  const emailError =
    submitted && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "Enter an email address like name@example.com" : undefined;

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <form
        className="grid content-start gap-5"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          setSubmitted(true);
          if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) toast.success("Looks good", "That email address is valid.");
        }}
      >
        <Field label="Email" hint="We'll send your order confirmation here." error={emailError} required>
          <Input
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leading={<Mail aria-hidden="true" />}
          />
        </Field>
        <Field label="Order note" hint="Optional. Gift message or delivery instructions.">
          <Textarea placeholder="Please leave with the neighbour at number 12" />
        </Field>
        <Field label="Glaze">
          <Select options={glazeOptions} value={glaze} onValueChange={setGlaze} />
        </Field>
        <Field label="Disabled input">
          <Input disabled value="Not editable" readOnly />
        </Field>
        <div>
          <Button type="submit">Validate email</Button>
        </div>
      </form>

      <div className="grid content-start gap-6">
        <RadioGroup
          legend="Shipping method"
          appearance="card"
          value={shipping}
          onValueChange={setShipping}
          options={[
            { value: "standard", label: "Standard, 3–5 business days", description: "Free over $75, otherwise $6" },
            { value: "express", label: "Express, 1–2 business days", description: "$18" },
          ]}
        />
        <div className="grid gap-3">
          <Checkbox label="In stock only" checked={inStock} onCheckedChange={(v) => setInStock(v === true)} />
          <Checkbox label="Partially selected" checked="indeterminate" />
          <Checkbox label="Disabled option" disabled />
        </div>
        <Switch
          label="Email me about new glazes"
          description="One short note a month, no more."
          checked={newsletter}
          onCheckedChange={setNewsletter}
        />
        <div className="grid gap-3">
          <p className="text-sm font-medium text-fg" id="price-label">
            Price range: {formatPrice(price[0] ?? 0)} – {formatPrice(price[1] ?? 0)}
          </p>
          <Slider
            aria-labelledby="price-label"
            min={0}
            max={16000}
            step={500}
            minStepsBetweenThumbs={1}
            value={price}
            onValueChange={setPrice}
            thumbLabels={["Minimum price", "Maximum price"]}
            formatValue={formatPrice}
          />
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <QuantityStepper value={qty} onChange={setQty} max={4} label="Quantity" />
          <QuantityStepper value={qty} onChange={setQty} max={4} label="Quantity (small)" size="sm" />
          <span className="text-sm text-fg-muted">Max 4 (stock limit)</span>
        </div>
        <RatingInput label="Your rating" value={rating} onChange={setRating} />
      </div>
    </div>
  );
}

export function OverlayDemos() {
  return (
    <div className="flex flex-wrap gap-3">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="secondary">Open dialog</Button>
        </DialogTrigger>
        <DialogContent title="Remove this address?" description="You can add it again later from your account.">
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary">Keep address</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button variant="destructive" onClick={() => toast.success("Address removed")}>
                Remove
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="secondary">Open drawer</Button>
        </SheetTrigger>
        <SheetContent
          title="Your cart"
          description="2 items"
          footer={
            <SheetClose asChild>
              <Button fullWidth>Continue shopping</Button>
            </SheetClose>
          }
        >
          <p className="text-sm text-fg-muted">
            The drawer traps focus, closes on Escape or overlay click, and returns focus to the button that opened it.
          </p>
        </SheetContent>
      </Sheet>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="secondary">Bottom sheet</Button>
        </SheetTrigger>
        <SheetContent side="bottom" title="Filters">
          <p className="text-sm text-fg-muted">Used for filters on small screens.</p>
        </SheetContent>
      </Sheet>

      <Button variant="secondary" onClick={() => toast.success("Added to cart", "Speckled Oat Mug × 1")}>
        Success toast
      </Button>
      <Button
        variant="secondary"
        onClick={() => toast.error("Couldn't apply code", "CLAY20 needs an order of $100 or more.")}
      >
        Error toast
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast({
            title: "Saved for later",
            tone: "info",
            action: { label: "Undo", onClick: () => toast.info("Moved back to cart") },
          })
        }
      >
        Toast with action
      </Button>
    </div>
  );
}

export function DisclosureDemos() {
  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
      <Tabs defaultValue="description">
        <TabsList aria-label="Product details">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="care">Materials & care</TabsTrigger>
          <TabsTrigger value="shipping">Shipping & returns</TabsTrigger>
        </TabsList>
        <TabsContent value="description">
          <p className="text-fg-muted">
            Thrown from a speckled buff stoneware and dipped in our oat glaze, which breaks to a toasty brown on the
            rim.
          </p>
        </TabsContent>
        <TabsContent value="care">
          <p className="text-fg-muted">Dishwasher and microwave safe. Avoid sudden temperature changes.</p>
        </TabsContent>
        <TabsContent value="shipping">
          <p className="text-fg-muted">
            Ships in 2 business days, wrapped in recycled paper. Free returns within 30 days.
          </p>
        </TabsContent>
      </Tabs>

      <Accordion type="single" collapsible defaultValue="q1">
        <AccordionItem value="q1">
          <AccordionTrigger>Is everything food safe?</AccordionTrigger>
          <AccordionContent>Yes. All our glazes are lead-free and tested for food use.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="q2">
          <AccordionTrigger>Why does my mug look different from the photo?</AccordionTrigger>
          <AccordionContent>
            Each piece is glazed by hand and fired in a gas kiln, so speckles and colour vary slightly.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="q3">
          <AccordionTrigger>Do you ship internationally?</AccordionTrigger>
          <AccordionContent>We currently ship within the United States and Canada.</AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

export function GalleryDemo() {
  return (
    <div className="max-w-xl">
      <ProductGallery images={[]} />
    </div>
  );
}

export function StateDemos() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <EmptyState
        headingLevel="h3"
        icon={<PackageSearch aria-hidden="true" />}
        title="No pieces match those filters"
        description="Try a wider price range or a different glaze."
        action={
          <Button variant="secondary" onClick={() => toast.info("Filters cleared", "In the shop this resets the URL.")}>
            Clear filters
          </Button>
        }
      />
      <ErrorState
        headingLevel="h3"
        title="We couldn’t load your orders"
        description="Check your connection and try again."
        action={
          <Button variant="secondary" onClick={() => toast.info("Retrying", "In the app this refetches the data.")}>
            <RefreshCw aria-hidden="true" />
            Try again
          </Button>
        }
      />
    </div>
  );
}

/** Reads ?page= so the demo pagination reflects the page you clicked. */
export function PaginationDemo() {
  const params = useSearchParams();
  const page = Math.min(Math.max(Number(params.get("page")) || 5, 1), 12);
  return <Pagination page={page} totalPages={12} hrefForPage={(p) => `/styleguide?page=${p}#navigation`} />;
}
