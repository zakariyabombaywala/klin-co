// @vitest-environment node
import { describe, expect, it } from "vitest";
import { computeTotals } from "../../src/lib/pricing.ts";
import { createTestDb, createUser } from "../../supabase/tests/pglite.ts";
import { buildSeedPlan } from "./plan.ts";
import { toTableRows } from "./rows.ts";

const now = new Date("2026-11-22T12:00:00Z");
const plan = buildSeedPlan({ now });

describe("seed plan", () => {
  it("matches the brief: 6 categories, 4 collections, 40 products with 2–4 variants", () => {
    expect(plan.categories).toHaveLength(6);
    expect(plan.collections).toHaveLength(4);
    expect(plan.products).toHaveLength(40);
    for (const product of plan.products) {
      const count = plan.variants.filter((v) => v.productId === product.id).length;
      expect(count, product.slug).toBeGreaterThanOrEqual(2);
      expect(count, product.slug).toBeLessThanOrEqual(4);
    }
  });

  it("prices everything between $18 and $160", () => {
    const prices = plan.variants.map((v) => v.price);
    expect(Math.min(...prices)).toBe(1800);
    expect(Math.max(...prices)).toBe(16000);
  });

  it("includes sale, low-stock and sold-out pieces", () => {
    const stockByProduct = new Map<string, number>();
    for (const v of plan.variants) stockByProduct.set(v.productId, (stockByProduct.get(v.productId) ?? 0) + v.stock);
    const stocks = [...stockByProduct.values()];
    expect(plan.variants.filter((v) => v.compareAtPrice !== null).length).toBeGreaterThan(5);
    expect(stocks.filter((s) => s > 0 && s <= 5).length).toBeGreaterThanOrEqual(3);
    expect(stocks.filter((s) => s === 0).length).toBeGreaterThanOrEqual(1);
  });

  it("has unique slugs and SKUs", () => {
    expect(new Set(plan.products.map((p) => p.slug)).size).toBe(40);
    expect(new Set(plan.variants.map((v) => v.sku)).size).toBe(plan.variants.length);
  });

  it("has 120 reviews, mostly approved, some pending and hidden", () => {
    expect(plan.reviews).toHaveLength(120);
    expect(plan.reviews.filter((r) => r.status === "pending")).toHaveLength(4);
    expect(plan.reviews.filter((r) => r.status === "hidden")).toHaveLength(2);
    expect(plan.reviews.some((r) => r.userKey !== null && r.verified)).toBe(true);
  });

  it("has 25 orders over the last 60 days with totals from the pricing rules", () => {
    expect(plan.orders).toHaveLength(25);
    const oldest = Math.min(...plan.orders.map((o) => new Date(o.createdAt).getTime()));
    expect(now.getTime() - oldest).toBeLessThanOrEqual(61 * 24 * 3600_000);
    for (const order of plan.orders) {
      const recomputed = computeTotals({ lines: order.items, shippingMethod: order.shippingMethod });
      expect(order.subtotal).toBe(recomputed.subtotal);
      expect(order.total).toBe(order.subtotal - order.discountTotal + order.shippingTotal + order.taxTotal);
      expect(order.history[0]?.status).toBe("paid");
      expect(order.history.at(-1)?.status).toBe(order.status);
    }
    const statuses = new Set(plan.orders.map((o) => o.status));
    for (const s of ["delivered", "shipped", "processing", "refunded", "cancelled"]) expect(statuses).toContain(s);
  });

  it("has the discount codes from the brief, plus an expired fixed-amount code", () => {
    expect(plan.discountCodes.map((d) => d.code)).toEqual(["WELCOME10", "FREESHIP", "CLAY20", "SUMMER15"]);
  });

  it("is deterministic for a given seed and date (apart from ids)", () => {
    const again = buildSeedPlan({ now });
    expect(again.orders.map((o) => [o.createdAt, o.total])).toEqual(plan.orders.map((o) => [o.createdAt, o.total]));
    expect(again.reviews.map((r) => r.title)).toEqual(plan.reviews.map((r) => r.title));
  });

  it("satisfies every database constraint when loaded", async () => {
    const db = await createTestDb();
    const userIds = new Map<string, string>();
    for (const person of plan.people) {
      const id = await createUser(db, person.email, person.fullName);
      userIds.set(person.key, id);
      await db.query(`update profiles set role = $1 where id = $2`, [person.role, id]);
    }

    const tables = toTableRows(plan, {
      userIds,
      imageFor: (slug, photoIndex) => ({
        url: `https://example.supabase.co/storage/v1/object/public/product-images/products/${slug}/${photoIndex + 1}.jpg`,
        alt: `${slug} photo ${photoIndex + 1}`,
        storagePath: `products/${slug}/${photoIndex + 1}.jpg`,
        width: 1600,
        height: 2000,
      }),
    });

    for (const { table, rows } of tables) {
      if (table === "order_status_history") {
        await db.query(`delete from order_status_history`);
      }
      for (const row of rows) {
        const columns = Object.keys(row);
        const values = columns.map((c) => {
          const v = row[c];
          return v !== null && typeof v === "object" ? JSON.stringify(v) : v;
        });
        const placeholders = columns.map((_, i) => `$${i + 1}`).join(", ");
        await db.query(`insert into public.${table} (${columns.join(", ")}) values (${placeholders})`, values);
      }
    }

    const counts = await db.query<{ t: string; n: number }>(`
      select 'products' t, count(*)::int n from products union all
      select 'reviews', count(*)::int from reviews union all
      select 'orders', count(*)::int from orders union all
      select 'history', count(*)::int from order_status_history union all
      select 'cards', count(*)::int from product_cards where image_url is not null`);
    const byName = Object.fromEntries(counts.rows.map((r) => [r.t, r.n]));
    expect(byName).toMatchObject({ products: 40, reviews: 120, orders: 25, cards: 40 });
    expect(byName.history).toBe(plan.orders.reduce((n, o) => n + o.history.length, 0));

    const numbers = await db.query<{ order_number: string }>(`select order_number from orders order by created_at`);
    expect(numbers.rows[0]?.order_number).toBe("KC-10001");
  }, 120_000);
});
