/**
 * Turns a SeedPlan into database rows (snake_case, in foreign-key order).
 * Shared by the real seed (supabase-js) and the schema test (PGlite), so the
 * test proves the exact rows the seed writes satisfy every constraint.
 */
import type { SeedPlan } from "./plan.ts";

export interface ResolvedImage {
  url: string;
  alt: string;
  storagePath: string | null;
  width: number | null;
  height: number | null;
}

export interface RowContext {
  /** Auth user id for each person key. */
  userIds: Map<string, string>;
  /** Uploaded photo for a product image, or null when no photo is available. */
  imageFor: (productSlug: string, photoIndex: number) => ResolvedImage | null;
}

export type TableRows = { table: string; rows: Record<string, unknown>[] };

export function toTableRows(plan: SeedPlan, ctx: RowContext): TableRows[] {
  const userId = (key: string | null) => {
    if (key === null) return null;
    const id = ctx.userIds.get(key);
    if (!id) throw new Error(`No auth user for ${key}`);
    return id;
  };

  const imageRows: Record<string, unknown>[] = [];
  const imageIdByPhoto = new Map<string, string>(); // productId|photoIndex -> image id
  for (const image of plan.images) {
    const resolved = ctx.imageFor(image.productSlug, image.photoIndex);
    if (!resolved) continue;
    imageIdByPhoto.set(`${image.productId}|${image.photoIndex}`, image.id);
    imageRows.push({
      id: image.id,
      product_id: image.productId,
      url: resolved.url,
      storage_path: resolved.storagePath,
      alt: resolved.alt,
      position: image.position,
      width: resolved.width,
      height: resolved.height,
    });
  }

  return [
    {
      table: "categories",
      rows: plan.categories.map((c) => ({
        id: c.id,
        slug: c.slug,
        name: c.name,
        description: c.description,
        position: c.position,
      })),
    },
    {
      table: "collections",
      rows: plan.collections.map((c) => ({
        id: c.id,
        slug: c.slug,
        name: c.name,
        tagline: c.tagline,
        description: c.description,
        position: c.position,
        is_featured: c.isFeatured,
        seo_title: `${c.name}: handmade ceramics`,
        seo_description: c.description.slice(0, 165),
      })),
    },
    {
      table: "products",
      rows: plan.products.map((p) => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        subtitle: p.subtitle,
        description: p.description,
        materials: p.materials,
        care: p.care,
        category_id: p.categoryId,
        base_price: p.basePrice,
        compare_at_price: p.compareAtPrice,
        status: "published",
        is_featured: p.isFeatured,
        seo_title: p.seoTitle,
        seo_description: p.seoDescription,
        published_at: p.publishedAt,
        created_at: p.createdAt,
      })),
    },
    { table: "product_images", rows: imageRows },
    {
      table: "product_variants",
      rows: plan.variants.map((v) => ({
        id: v.id,
        product_id: v.productId,
        sku: v.sku,
        title: v.title,
        options: v.options,
        price: v.price,
        compare_at_price: v.compareAtPrice,
        stock: v.stock,
        position: v.position,
        image_id: imageIdByPhoto.get(`${v.productId}|${v.photoIndex}`) ?? null,
      })),
    },
    {
      table: "collection_products",
      rows: plan.collectionProducts.map((cp) => ({
        collection_id: cp.collectionId,
        product_id: cp.productId,
        position: cp.position,
      })),
    },
    {
      table: "discount_codes",
      rows: plan.discountCodes.map((d) => ({
        code: d.code,
        description: d.description,
        type: d.type,
        value: d.value,
        min_order_cents: d.minOrderCents,
        expires_at: d.expiresAt,
        times_used: d.timesUsed,
      })),
    },
    {
      table: "orders",
      rows: plan.orders.map((o) => ({
        id: o.id,
        user_id: userId(o.userKey),
        email: o.email,
        status: o.status,
        subtotal: o.subtotal,
        discount_total: o.discountTotal,
        shipping_total: o.shippingTotal,
        tax_total: o.taxTotal,
        total: o.total,
        discount_code: o.discountCode,
        shipping_method: o.shippingMethod,
        shipping_address: o.shippingAddress,
        stripe_session_id: `cs_test_seed_${o.id.replaceAll("-", "").slice(0, 24)}`,
        tracking_number: o.trackingNumber,
        tracking_carrier: o.trackingCarrier,
        paid_at: o.paidAt,
        created_at: o.createdAt,
        updated_at: o.history.at(-1)?.at ?? o.createdAt,
      })),
    },
    {
      table: "order_items",
      rows: plan.orders.flatMap((o) =>
        o.items.map((i) => ({
          order_id: o.id,
          product_id: i.productId,
          variant_id: i.variantId,
          product_title: i.productTitle,
          product_slug: i.productSlug,
          variant_title: i.variantTitle,
          sku: i.sku,
          image_url: ctx.imageFor(i.productSlug, 0)?.url ?? null,
          unit_price: i.unitPrice,
          quantity: i.quantity,
          line_total: i.unitPrice * i.quantity,
        })),
      ),
    },
    {
      // The orders trigger writes a "now" timeline row on insert; the seed
      // replaces those with this back-dated history.
      table: "order_status_history",
      rows: plan.orders.flatMap((o) =>
        o.history.map((h) => ({
          order_id: o.id,
          status: h.status,
          note: h.note,
          created_by: h.status === "paid" ? null : userId("owner"),
          created_at: h.at,
        })),
      ),
    },
    {
      table: "reviews",
      rows: plan.reviews.map((r) => ({
        id: r.id,
        product_id: r.productId,
        user_id: userId(r.userKey),
        author_name: r.authorName,
        rating: r.rating,
        title: r.title,
        body: r.body,
        verified: r.verified,
        status: r.status,
        created_at: r.createdAt,
        updated_at: r.createdAt,
      })),
    },
    {
      table: "newsletter_subscribers",
      rows: plan.newsletter.map((n) => ({ email: n.email, source: n.source, created_at: n.createdAt })),
    },
    {
      table: "contact_messages",
      rows: plan.contactMessages.map((m) => ({
        name: m.name,
        email: m.email,
        subject: m.subject,
        message: m.message,
        status: m.status,
        created_at: m.createdAt,
      })),
    },
    {
      table: "stock_notifications",
      rows: plan.stockNotifications.map((s) => ({
        variant_id: s.variantId,
        email: s.email,
        created_at: s.createdAt,
      })),
    },
  ];
}
