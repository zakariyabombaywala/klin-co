/**
 * Builds every row the seed writes, as plain data. Deterministic for a given
 * `seed` and `now`, and free of I/O, so it can be unit-tested and loaded into
 * a local Postgres before a real Supabase project exists.
 */
import { randomUUID } from "node:crypto";
import { computeTotals, type PricingDiscount, type ShippingMethod } from "../../src/lib/pricing.ts";
import { GLAZES, categories, collections, products, type ProductSeed } from "./catalog.ts";
import { contactMessages, firstNames, hiddenReviews, lastNames, reviewPool } from "./content.ts";

const DAY = 24 * 60 * 60 * 1000;

export type Role = "customer" | "admin" | "demo_admin";
export type OrderStatus = "pending" | "paid" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";

export interface PersonPlan {
  key: string;
  email: string;
  fullName: string;
  role: Role;
  /** "owner" and "demo" passwords come from env; customers get a random one. */
  password: "owner" | "demo" | "random";
  createdAt: string;
}

export interface ImagePlan {
  id: string;
  productId: string;
  productSlug: string;
  /** Index into the product's photos in seed/photos.json. */
  photoIndex: number;
  position: number;
}

export interface VariantPlan {
  id: string;
  productId: string;
  sku: string;
  title: string;
  options: Record<string, string>;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  position: number;
  /** Image this variant shows when selected (photoIndex into the product's images). */
  photoIndex: number;
}

export interface OrderItemPlan {
  productId: string;
  productSlug: string;
  productTitle: string;
  variantId: string;
  variantTitle: string;
  sku: string;
  unitPrice: number;
  quantity: number;
}

export interface OrderPlan {
  id: string;
  userKey: string | null;
  email: string;
  status: OrderStatus;
  createdAt: string;
  paidAt: string;
  subtotal: number;
  discountTotal: number;
  shippingTotal: number;
  taxTotal: number;
  total: number;
  discountCode: string | null;
  shippingMethod: ShippingMethod;
  shippingAddress: Record<string, string>;
  trackingNumber: string | null;
  trackingCarrier: string | null;
  items: OrderItemPlan[];
  history: { status: OrderStatus; note: string; at: string }[];
}

export interface ReviewPlan {
  id: string;
  productId: string;
  userKey: string | null;
  authorName: string;
  rating: number;
  title: string;
  body: string;
  verified: boolean;
  status: "pending" | "approved" | "hidden";
  createdAt: string;
}

export interface SeedPlan {
  people: PersonPlan[];
  categories: { id: string; slug: string; name: string; description: string; position: number }[];
  collections: {
    id: string;
    slug: string;
    name: string;
    tagline: string;
    description: string;
    position: number;
    isFeatured: boolean;
  }[];
  products: {
    id: string;
    slug: string;
    title: string;
    subtitle: string;
    description: string;
    materials: string;
    care: string;
    categoryId: string;
    basePrice: number;
    compareAtPrice: number | null;
    isFeatured: boolean;
    seoTitle: string;
    seoDescription: string;
    createdAt: string;
    publishedAt: string;
  }[];
  images: ImagePlan[];
  variants: VariantPlan[];
  collectionProducts: { collectionId: string; productId: string; position: number }[];
  discountCodes: {
    code: string;
    description: string;
    type: PricingDiscount["type"];
    value: number;
    minOrderCents: number;
    expiresAt: string | null;
    timesUsed: number;
  }[];
  orders: OrderPlan[];
  reviews: ReviewPlan[];
  newsletter: { email: string; source: string; createdAt: string }[];
  contactMessages: {
    name: string;
    email: string;
    subject: string;
    message: string;
    status: "new" | "read" | "archived";
    createdAt: string;
  }[];
  stockNotifications: { variantId: string; email: string; createdAt: string }[];
}

/** mulberry32: small, fast, deterministic PRNG. */
function createRng(seed: number) {
  let a = seed >>> 0;
  const next = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return {
    next,
    int: (min: number, max: number) => min + Math.floor(next() * (max - min + 1)),
    pick: <T>(items: readonly T[]): T => {
      const item = items[Math.floor(next() * items.length)];
      if (item === undefined) throw new Error("pick from empty list");
      return item;
    },
    chance: (p: number) => next() < p,
  };
}

function skuFor(product: ProductSeed, glaze: string | undefined, size: string | undefined): string {
  const base = product.slug
    .split("-")
    .map((part) => part.slice(0, 3))
    .join("")
    .toUpperCase()
    .slice(0, 9);
  const glazeCode = glaze ? glaze.slice(0, 3).toUpperCase() : "STD";
  const sizeCode = size ? size.replace(/[^0-9]/g, "").slice(0, 3) || size.slice(0, 1).toUpperCase() : "";
  return [base, glazeCode, sizeCode].filter(Boolean).join("-");
}

function variantTitle(glaze: string | undefined, size: string | undefined): string {
  return [glaze, size].filter(Boolean).join(" / ") || "Standard";
}

const addresses: Record<string, string>[] = [
  { line1: "214 Alder Street", city: "Portland", region: "OR", postal_code: "97205" },
  { line1: "88 Pine Avenue", line2: "Apt 3B", city: "Seattle", region: "WA", postal_code: "98101" },
  { line1: "1450 Mission Street", city: "San Francisco", region: "CA", postal_code: "94103" },
  { line1: "37 Elm Court", city: "Austin", region: "TX", postal_code: "78704" },
  { line1: "502 Lake Shore Drive", line2: "Unit 12", city: "Chicago", region: "IL", postal_code: "60611" },
  { line1: "19 Water Street", city: "Brooklyn", region: "NY", postal_code: "11201" },
  { line1: "730 Spruce Lane", city: "Denver", region: "CO", postal_code: "80206" },
  { line1: "61 Harbor Road", city: "Portland", region: "ME", postal_code: "04101" },
];

export function buildSeedPlan({ now = new Date(), seed = 20261122 }: { now?: Date; seed?: number } = {}): SeedPlan {
  const rng = createRng(seed);
  const at = (daysAgo: number, hour = 10) => {
    const d = new Date(now.getTime() - daysAgo * DAY);
    d.setUTCHours(hour, rng.int(0, 59), rng.int(0, 59), 0);
    return d.toISOString();
  };

  // ---------------------------------------------------------------- People
  const customerNames = [
    "Maya Chen",
    "Jonah Okafor",
    "Priya Patel",
    "Theo Brooks",
    "Rosa Alvarez",
    "Sam Lindqvist",
    "Grace Mensah",
    "Felix Bauer",
  ];
  const people: PersonPlan[] = [
    {
      key: "owner",
      email: "owner@kilnandco.test",
      fullName: "Studio Owner",
      role: "admin",
      password: "owner",
      createdAt: at(365),
    },
    {
      key: "demo",
      email: "demo-admin@kilnandco.test",
      fullName: "Demo Admin",
      role: "demo_admin",
      password: "demo",
      createdAt: at(365),
    },
    ...customerNames.map((fullName, i) => ({
      key: `customer-${i + 1}`,
      email: `${fullName.toLowerCase().replace(/[^a-z]+/g, ".")}@example.com`,
      fullName,
      role: "customer" as const,
      password: "random" as const,
      createdAt: at(rng.int(70, 300)),
    })),
  ];
  const customers = people.filter((p) => p.role === "customer");

  // ---------------------------------------------------------------- Catalogue
  const categoryRows = categories.map((c, i) => ({ id: randomUUID(), ...c, position: i }));
  const categoryId = new Map(categoryRows.map((c) => [c.slug, c.id]));

  const productRows: SeedPlan["products"] = [];
  const images: ImagePlan[] = [];
  const variants: VariantPlan[] = [];

  for (const product of products) {
    const id = randomUUID();
    const catId = categoryId.get(product.category);
    if (!catId) throw new Error(`Unknown category ${product.category} for ${product.slug}`);
    const prices = product.variants.map((v) => v.price);
    const created = at(product.addedDaysAgo, 9);
    productRows.push({
      id,
      slug: product.slug,
      title: product.title,
      subtitle: product.subtitle,
      description: product.description.join("\n\n"),
      materials: product.materials,
      care: product.care,
      categoryId: catId,
      basePrice: Math.min(...prices),
      compareAtPrice: null,
      isFeatured: Boolean(product.featured),
      seoTitle: `${product.title}, handmade stoneware`.slice(0, 70),
      seoDescription: (product.description[0] ?? product.subtitle).slice(0, 165),
      createdAt: created,
      publishedAt: created,
    });

    // Up to three photos per product; distinct glazes map to distinct photos.
    const glazeOrder = [...new Set(product.variants.map((v) => v.glaze ?? "standard"))];
    const photoCount = Math.min(3, Math.max(2, glazeOrder.length));
    for (let i = 0; i < photoCount; i++) {
      images.push({ id: randomUUID(), productId: id, productSlug: product.slug, photoIndex: i, position: i });
    }

    product.variants.forEach((v, position) => {
      const glaze = v.glaze === "mixed" ? "Mixed glazes" : v.glaze ? GLAZES[v.glaze] : undefined;
      const options: Record<string, string> = {};
      if (glaze) options.glaze = glaze;
      if (v.size) options.size = v.size;
      variants.push({
        id: randomUUID(),
        productId: id,
        sku: skuFor(product, v.glaze, v.size),
        title: variantTitle(glaze, v.size),
        options,
        price: v.price,
        compareAtPrice: v.compareAtPrice ?? null,
        stock: v.stock,
        position,
        photoIndex: glazeOrder.indexOf(v.glaze ?? "standard") % photoCount,
      });
    });
  }
  const productBySlug = new Map(productRows.map((p) => [p.slug, p]));

  const collectionRows = collections.map((c, i) => ({
    id: randomUUID(),
    slug: c.slug,
    name: c.name,
    tagline: c.tagline,
    description: c.description,
    position: i,
    isFeatured: c.featured,
  }));
  const collectionProducts = collections.flatMap((c, i) =>
    c.products.map((slug, position) => {
      const product = productBySlug.get(slug);
      const collection = collectionRows[i];
      if (!product || !collection) throw new Error(`Collection ${c.slug} references unknown product ${slug}`);
      return { collectionId: collection.id, productId: product.id, position };
    }),
  );

  // ---------------------------------------------------------------- Discounts
  const discountCodes: SeedPlan["discountCodes"] = [
    {
      code: "WELCOME10",
      description: "10% off your first order",
      type: "percentage",
      value: 10,
      minOrderCents: 0,
      expiresAt: null,
      timesUsed: 0,
    },
    {
      code: "FREESHIP",
      description: "Free standard shipping on orders over $40",
      type: "free_shipping",
      value: 0,
      minOrderCents: 4000,
      expiresAt: null,
      timesUsed: 0,
    },
    {
      code: "CLAY20",
      description: "20% off orders of $100 or more",
      type: "percentage",
      value: 20,
      minOrderCents: 10000,
      expiresAt: new Date(now.getTime() + 90 * DAY).toISOString(),
      timesUsed: 0,
    },
    {
      code: "SUMMER15",
      description: "$15 off orders over $90 (summer sale, ended)",
      type: "fixed",
      value: 1500,
      minOrderCents: 9000,
      expiresAt: new Date(now.getTime() - 30 * DAY).toISOString(),
      timesUsed: 0,
    },
  ];
  const codeByName = new Map(discountCodes.map((d) => [d.code, d]));

  // ---------------------------------------------------------------- Orders
  const sellable = variants.filter((v) => v.stock > 0);
  const productById = new Map(productRows.map((p) => [p.id, p]));
  const orders: OrderPlan[] = [];
  const purchases = new Map<string, Set<string>>(); // userKey -> productIds

  // Spread across 60 days, busier recently, so every status and the
  // today / 7-day / 30-day dashboard figures all have data.
  const orderDays = [58, 55, 51, 47, 44, 40, 37, 33, 30, 27, 24, 21, 18, 15, 13, 11, 9, 7, 6, 4, 3, 2, 1, 0, 0];
  orderDays.forEach((daysAgo, index) => {
    const isGuest = rng.chance(0.28);
    const customer = isGuest ? null : rng.pick(customers);
    const guestName = `${rng.pick(firstNames)} ${rng.pick(lastNames)}`;
    const fullName = customer?.fullName ?? guestName;
    const email = customer?.email ?? `${guestName.toLowerCase().replace(/[^a-z]+/g, ".")}@example.com`;

    const lineCount = rng.int(1, 3);
    const items: OrderItemPlan[] = [];
    const used = new Set<string>();
    while (items.length < lineCount) {
      const variant = rng.pick(sellable);
      if (used.has(variant.id)) continue;
      used.add(variant.id);
      const product = productById.get(variant.productId);
      if (!product) continue;
      items.push({
        productId: product.id,
        productSlug: product.slug,
        productTitle: product.title,
        variantId: variant.id,
        variantTitle: variant.title,
        sku: variant.sku,
        unitPrice: variant.price,
        quantity: rng.chance(0.25) ? 2 : 1,
      });
    }

    const subtotal = items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
    const codeName =
      subtotal >= 10000 && rng.chance(0.5)
        ? "CLAY20"
        : rng.chance(0.25)
          ? "WELCOME10"
          : rng.chance(0.15)
            ? "FREESHIP"
            : null;
    const code = codeName ? codeByName.get(codeName) : undefined;
    const shippingMethod: ShippingMethod = rng.chance(0.2) ? "express" : "standard";
    const totals = computeTotals({
      lines: items,
      shippingMethod,
      discount: code
        ? { code: code.code, type: code.type, value: code.value, minOrderCents: code.minOrderCents }
        : null,
    });
    const appliedCode = code && totals.discountApplied ? code : undefined;
    if (appliedCode) appliedCode.timesUsed += 1;

    let status: OrderStatus;
    if (index === 3) status = "refunded";
    else if (index === 8) status = "cancelled";
    else if (daysAgo >= 12) status = "delivered";
    else if (daysAgo >= 5) status = "shipped";
    else if (daysAgo >= 2) status = "processing";
    else status = "paid";

    const placed = at(daysAgo, rng.int(8, 21));
    const step = (days: number) =>
      new Date(new Date(placed).getTime() + days * DAY + rng.int(1, 6) * 3600_000).toISOString();
    const tracking =
      ["shipped", "delivered"].includes(status) || status === "refunded"
        ? `9400${rng.int(100000000, 999999999)}${rng.int(10000, 99999)}`
        : null;

    const history: OrderPlan["history"] = [{ status: "paid", note: "Payment received.", at: placed }];
    if (status === "cancelled") {
      history.push({ status: "cancelled", note: "Cancelled at the customer's request before packing.", at: step(0.2) });
    } else if (status !== "paid") {
      history.push({ status: "processing", note: "Being packed in the studio.", at: step(1) });
      if (["shipped", "delivered", "refunded"].includes(status)) {
        history.push({ status: "shipped", note: `Shipped with USPS, tracking ${tracking}.`, at: step(2) });
      }
      if (["delivered", "refunded"].includes(status)) {
        history.push({ status: "delivered", note: "Delivered.", at: step(5) });
      }
      if (status === "refunded") {
        history.push({ status: "refunded", note: "Refunded in full: piece arrived cracked in transit.", at: step(7) });
      }
    }

    if (customer && ["delivered", "shipped"].includes(status)) {
      const set = purchases.get(customer.key) ?? new Set<string>();
      for (const item of items) set.add(item.productId);
      purchases.set(customer.key, set);
    }

    orders.push({
      id: randomUUID(),
      userKey: customer?.key ?? null,
      email,
      status,
      createdAt: placed,
      paidAt: placed,
      subtotal: totals.subtotal,
      discountTotal: totals.discount,
      shippingTotal: totals.shipping,
      taxTotal: totals.tax,
      total: totals.total,
      discountCode: appliedCode?.code ?? null,
      shippingMethod,
      shippingAddress: { name: fullName, country: "US", ...rng.pick(addresses) },
      trackingNumber: tracking,
      trackingCarrier: tracking ? "USPS" : null,
      items,
      history,
    });
  });

  // ---------------------------------------------------------------- Reviews (120)
  const reviews: ReviewPlan[] = [];
  const taken = new Set<string>(); // productId|title
  const usedAuthors = new Set<string>(); // productId|author

  const addReview = (
    product: SeedPlan["products"][number],
    userKey: string | null,
    authorName: string,
    verified: boolean,
  ) => {
    const category = products.find((p) => p.slug === product.slug)?.category ?? "";
    const pool = reviewPool(category);
    // Ratings skew positive, as they do for small studios with repeat customers.
    const roll = rng.next();
    const wanted = roll < 0.56 ? 5 : roll < 0.84 ? 4 : roll < 0.94 ? 3 : roll < 0.985 ? 2 : 1;
    const candidates = pool.filter((r) => r.rating === wanted && !taken.has(`${product.id}|${r.title}`));
    const fallback = pool.filter((r) => !taken.has(`${product.id}|${r.title}`));
    const copy = candidates.length ? rng.pick(candidates) : fallback.length ? rng.pick(fallback) : null;
    if (!copy || usedAuthors.has(`${product.id}|${authorName}`)) return false;
    taken.add(`${product.id}|${copy.title}`);
    usedAuthors.add(`${product.id}|${authorName}`);
    reviews.push({
      id: randomUUID(),
      productId: product.id,
      userKey,
      authorName,
      rating: copy.rating,
      title: copy.title,
      body: copy.body,
      verified,
      status: "approved",
      createdAt: at(rng.int(1, 180), rng.int(8, 22)),
    });
    return true;
  };

  // Signed-in customers review some of what they received (verified purchases).
  for (const [userKey, productIds] of purchases) {
    const person = people.find((p) => p.key === userKey);
    if (!person) continue;
    const short = `${person.fullName.split(" ")[0]} ${person.fullName.split(" ")[1]?.[0] ?? ""}.`;
    for (const productId of productIds) {
      const product = productById.get(productId);
      if (product && rng.chance(0.6)) addReview(product, userKey, short, true);
    }
  }

  // Featured pieces collect more reviews than the rest.
  const weighted = productRows.flatMap((p) => (p.isFeatured ? [p, p, p, p] : [p, p]));
  let guard = 0;
  const visibleTarget = 120 - hiddenReviews.length;
  while (reviews.length < visibleTarget && guard++ < 5000) {
    const product = rng.pick(weighted);
    addReview(product, null, `${rng.pick(firstNames)} ${rng.pick(lastNames)[0]}.`, rng.chance(0.7));
  }

  // A few reviews waiting for moderation, and two the studio hid.
  reviews.slice(-4).forEach((r) => {
    r.status = "pending";
    r.createdAt = at(rng.int(0, 3), rng.int(8, 22));
  });
  hiddenReviews.forEach((copy, i) => {
    const product = productRows[i * 7];
    if (!product) return;
    reviews.push({
      id: randomUUID(),
      productId: product.id,
      userKey: null,
      authorName: `${rng.pick(firstNames)} ${rng.pick(lastNames)[0]}.`,
      rating: copy.rating,
      title: copy.title,
      body: copy.body,
      verified: false,
      status: "hidden",
      createdAt: at(rng.int(10, 60)),
    });
  });

  // ---------------------------------------------------------------- Inbox
  const newsletter = Array.from({ length: 14 }, (_, i) => {
    const name = `${firstNames[(i * 5) % firstNames.length]}.${lastNames[(i * 3) % lastNames.length]}`;
    return {
      email: `${name.toLowerCase().replace(/[^a-z.]+/g, "")}@example.com`,
      source: i % 3 === 0 ? "home" : "footer",
      createdAt: at(rng.int(0, 120)),
    };
  });

  const soldOut = variants.filter((v) => v.stock === 0);
  const stockNotifications = soldOut.flatMap((variant, i) =>
    [0, 1].map((j) => ({
      variantId: variant.id,
      email: `${firstNames[(i * 4 + j * 9) % firstNames.length]?.toLowerCase()}.${lastNames[(i + j * 5) % lastNames.length]?.toLowerCase().replace(/[^a-z]/g, "")}@example.com`,
      createdAt: at(rng.int(1, 30)),
    })),
  );

  return {
    people,
    categories: categoryRows,
    collections: collectionRows,
    products: productRows,
    images,
    variants,
    collectionProducts,
    discountCodes,
    orders,
    reviews,
    newsletter,
    contactMessages: contactMessages.map(({ daysAgo, ...m }) => ({ ...m, createdAt: at(daysAgo, 14) })),
    stockNotifications,
  };
}
