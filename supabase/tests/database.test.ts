// @vitest-environment node
import type { PGlite } from "@electric-sql/pglite";
import { beforeAll, describe, expect, it } from "vitest";
import { as, createTestDb, createUser } from "./pglite";

let db: PGlite;
const ids = {} as {
  admin: string;
  demo: string;
  alice: string;
  bob: string;
  category: string;
  mug: string;
  draft: string;
  mugOat: string;
  mugSage: string;
  draftVariant: string;
};

async function one<T>(promise: Promise<{ rows: T[] }>): Promise<T> {
  const { rows } = await promise;
  if (!rows[0]) throw new Error("expected a row");
  return rows[0];
}

beforeAll(async () => {
  db = await createTestDb();
  ids.admin = await createUser(db, "owner@kilnandco.test", "Studio Owner");
  ids.demo = await createUser(db, "demo-admin@kilnandco.test", "Demo Admin");
  ids.alice = await createUser(db, "alice@example.com", "Alice Moreno");
  ids.bob = await createUser(db, "bob@example.com");
  await db.query(`update public.profiles set role = 'admin' where id = $1`, [ids.admin]);
  await db.query(`update public.profiles set role = 'demo_admin' where id = $1`, [ids.demo]);

  ids.category = (
    await one(db.query<{ id: string }>(`insert into categories (slug, name) values ('mugs', 'Mugs') returning id`))
  ).id;
  ids.mug = (
    await one(
      db.query<{ id: string }>(
        `insert into products (slug, title, description, materials, category_id, base_price, status)
         values ('speckled-mug', 'Speckled Mug', 'A wheel-thrown mug with a speckled oat glaze.', 'Stoneware', $1, 3200, 'published')
         returning id`,
        [ids.category],
      ),
    )
  ).id;
  ids.draft = (
    await one(
      db.query<{ id: string }>(
        `insert into products (slug, title, base_price, status) values ('secret-vase', 'Secret Vase', 9000, 'draft') returning id`,
      ),
    )
  ).id;
  ids.mugOat = (
    await one(
      db.query<{ id: string }>(
        `insert into product_variants (product_id, sku, title, options, price, stock)
         values ($1, 'MUG-OAT', 'Oat', '{"glaze":"Oat","size":"12 oz"}', 3200, 5) returning id`,
        [ids.mug],
      ),
    )
  ).id;
  ids.mugSage = (
    await one(
      db.query<{ id: string }>(
        `insert into product_variants (product_id, sku, title, options, price, compare_at_price, stock)
         values ($1, 'MUG-SAGE', 'Sage', '{"glaze":"Sage","size":"12 oz"}', 2800, 3600, 1) returning id`,
        [ids.mug],
      ),
    )
  ).id;
  ids.draftVariant = (
    await one(
      db.query<{ id: string }>(
        `insert into product_variants (product_id, sku, title, price, stock) values ($1, 'VASE-1', 'Default', 9000, 3) returning id`,
        [ids.draft],
      ),
    )
  ).id;
  await db.query(
    `insert into product_images (product_id, url, alt, position) values
    ($1, 'https://img.test/mug-1.jpg', 'Speckled mug on linen', 0),
    ($1, 'https://img.test/mug-2.jpg', 'Mug from above', 1)`,
    [ids.mug],
  );

  await db.exec(`
    insert into discount_codes (code, type, value, min_order_cents) values ('WELCOME10', 'percentage', 10, 0);
    insert into discount_codes (code, type, value, min_order_cents) values ('CLAY20', 'percentage', 20, 10000);
    insert into discount_codes (code, type, value, expires_at) values ('OLDCODE', 'fixed', 500, now() - interval '1 day');
  `);
}, 60_000);

function checkoutPayload(overrides: { session?: string; userId?: string | null; qty?: number; variant?: string } = {}) {
  const qty = overrides.qty ?? 2;
  return {
    order: {
      email: "alice@example.com",
      user_id: overrides.userId === undefined ? ids.alice : overrides.userId,
      stripe_session_id: overrides.session ?? "cs_test_1",
      subtotal: 3200 * qty,
      discount_total: 640,
      shipping_total: 0,
      tax_total: 0,
      total: 3200 * qty - 640,
      discount_code: "welcome10",
      shipping_method: "standard",
      shipping_address: {
        name: "Alice Moreno",
        line1: "1 Kiln Lane",
        city: "Portland",
        postal_code: "97201",
        country: "US",
      },
    },
    items: [
      {
        variant_id: overrides.variant ?? ids.mugOat,
        product_id: ids.mug,
        product_title: "Speckled Mug",
        product_slug: "speckled-mug",
        variant_title: "Oat",
        sku: "MUG-OAT",
        unit_price: 3200,
        quantity: qty,
      },
    ],
  };
}

async function stockOf(variantId: string): Promise<number> {
  return (await one(db.query<{ stock: number }>(`select stock from product_variants where id = $1`, [variantId])))
    .stock;
}

describe("profiles", () => {
  it("are created for new auth users with their name", async () => {
    const profile = await one(
      db.query<{ email: string; full_name: string; role: string }>(
        `select email, full_name, role from profiles where id = $1`,
        [ids.alice],
      ),
    );
    expect(profile).toEqual({ email: "alice@example.com", full_name: "Alice Moreno", role: "customer" });
  });

  it("let customers edit their name but never their role", async () => {
    await as(db, { role: "authenticated", userId: ids.alice }, async (tx) => {
      const { affectedRows } = await tx.query(`update profiles set full_name = 'Alice M.' where id = $1`, [ids.alice]);
      expect(affectedRows).toBe(1);
      await expect(tx.query(`update profiles set role = 'admin' where id = $1`, [ids.alice])).rejects.toThrow(
        /permission denied/,
      );
    });
  });

  it("are private to their owner", async () => {
    const rows = await as(
      db,
      { role: "authenticated", userId: ids.bob },
      async (tx) => (await tx.query<{ id: string }>(`select id from profiles`)).rows,
    );
    expect(rows.map((r) => r.id)).toEqual([ids.bob]);
  });
});

describe("catalogue visibility", () => {
  it("shows only published products to the public", async () => {
    const slugs = await as(db, { role: "anon" }, async (tx) =>
      (await tx.query<{ slug: string }>(`select slug from products order by slug`)).rows.map((r) => r.slug),
    );
    expect(slugs).toEqual(["speckled-mug"]);
  });

  it("hides variants of draft products from the public", async () => {
    const skus = await as(db, { role: "anon" }, async (tx) =>
      (await tx.query<{ sku: string }>(`select sku from product_variants order by sku`)).rows.map((r) => r.sku),
    );
    expect(skus).toEqual(["MUG-OAT", "MUG-SAGE"]);
  });

  it("shows drafts to staff, including the demo admin", async () => {
    for (const userId of [ids.admin, ids.demo]) {
      const count = await as(
        db,
        { role: "authenticated", userId },
        async (tx) => (await one(tx.query<{ n: number }>(`select count(*)::int n from products`))).n,
      );
      expect(count).toBe(2);
    }
  });

  it("builds product cards with price range, stock, sale flag, images and option values", async () => {
    const card = await as(db, { role: "anon" }, async (tx) =>
      one(
        tx.query<Record<string, unknown>>(
          `select price, max_price, compare_at_price, on_sale, total_stock, variant_count, glazes, sizes,
                  image_url, hover_image_url, category_slug
           from product_cards where slug = 'speckled-mug'`,
        ),
      ),
    );
    expect(card).toMatchObject({
      price: 2800,
      max_price: 3200,
      compare_at_price: 3600,
      on_sale: true,
      total_stock: 6,
      variant_count: 2,
      sizes: ["12 oz"],
      image_url: "https://img.test/mug-1.jpg",
      hover_image_url: "https://img.test/mug-2.jpg",
      category_slug: "mugs",
    });
    expect([...(card.glazes as string[])].sort()).toEqual(["Oat", "Sage"]);
  });

  it("supports weighted full-text search", async () => {
    const slugs = await as(db, { role: "anon" }, async (tx) =>
      (
        await tx.query<{ slug: string }>(
          `select slug from products where search @@ websearch_to_tsquery('english', 'speckled glaze')`,
        )
      ).rows.map((r) => r.slug),
    );
    expect(slugs).toEqual(["speckled-mug"]);
  });
});

describe("catalogue writes", () => {
  it("are allowed for admins", async () => {
    await as(db, { role: "authenticated", userId: ids.admin }, async (tx) => {
      await tx.query(`insert into products (slug, title, base_price) values ('new-bowl', 'New Bowl', 4000)`);
      const { affectedRows } = await tx.query(`update product_variants set stock = 10 where id = $1`, [ids.mugOat]);
      expect(affectedRows).toBe(1);
    });
  });

  it("are blocked for the read-only demo admin", async () => {
    await as(db, { role: "authenticated", userId: ids.demo }, async (tx) => {
      await expect(
        tx.query(`insert into products (slug, title, base_price) values ('nope', 'Nope', 100)`),
      ).rejects.toThrow(/row-level security/);
    });
    await as(db, { role: "authenticated", userId: ids.demo }, async (tx) => {
      const { affectedRows } = await tx.query(`update product_variants set stock = 0 where id = $1`, [ids.mugOat]);
      expect(affectedRows).toBe(0);
      const deleted = await tx.query(`delete from products where id = $1`, [ids.mug]);
      expect(deleted.affectedRows).toBe(0);
    });
  });

  it("are blocked for customers", async () => {
    await as(db, { role: "authenticated", userId: ids.alice }, async (tx) => {
      const { affectedRows } = await tx.query(`update products set base_price = 1 where id = $1`, [ids.mug]);
      expect(affectedRows).toBe(0);
    });
  });
});

describe("fulfil_checkout", () => {
  it("cannot be called by customers or the public", async () => {
    const { order, items } = checkoutPayload();
    for (const actor of [{ role: "anon" as const }, { role: "authenticated" as const, userId: ids.alice }]) {
      await as(db, actor, async (tx) => {
        await expect(
          tx.query(`select * from fulfil_checkout('evt_x', 'checkout.session.completed', $1, $2)`, [
            order,
            JSON.stringify(items),
          ]),
        ).rejects.toThrow(/permission denied/);
      });
    }
  });

  it("creates the order, snapshots items, decrements stock, counts the discount and is idempotent", async () => {
    await as(db, { role: "service_role" }, async (tx) => {
      const { order, items } = checkoutPayload();
      const first = await one(
        tx.query<{ order_id: string; order_number: string; already_processed: boolean }>(
          `select * from fulfil_checkout('evt_1', 'checkout.session.completed', $1, $2)`,
          [order, JSON.stringify(items)],
        ),
      );
      expect(first.already_processed).toBe(false);
      expect(first.order_number).toMatch(/^KC-\d{5}$/);

      const stock = await one(
        tx.query<{ stock: number }>(`select stock from product_variants where id = $1`, [ids.mugOat]),
      );
      expect(stock.stock).toBe(3);

      const row = await one(
        tx.query<{ status: string; total: number; discount_code: string }>(
          `select status, total, discount_code from orders where id = $1`,
          [first.order_id],
        ),
      );
      expect(row).toEqual({ status: "paid", total: 5760, discount_code: "WELCOME10" });

      const line = await one(
        tx.query<{ line_total: number; product_title: string }>(
          `select line_total, product_title from order_items where order_id = $1`,
          [first.order_id],
        ),
      );
      expect(line).toEqual({ line_total: 6400, product_title: "Speckled Mug" });

      const used = await one(
        tx.query<{ times_used: number }>(`select times_used from discount_codes where code = 'WELCOME10'`),
      );
      expect(used.times_used).toBe(1);

      const timeline = await tx.query<{ status: string }>(
        `select status from order_status_history where order_id = $1`,
        [first.order_id],
      );
      expect(timeline.rows.map((r) => r.status)).toEqual(["paid"]);

      // Stripe re-delivers the same event.
      const again = await one(
        tx.query<{ order_id: string; already_processed: boolean }>(
          `select * from fulfil_checkout('evt_1', 'checkout.session.completed', $1, $2)`,
          [order, JSON.stringify(items)],
        ),
      );
      expect(again).toMatchObject({ order_id: first.order_id, already_processed: true });

      // Same session under a different event id.
      const sameSession = await one(
        tx.query<{ order_id: string; already_processed: boolean }>(
          `select * from fulfil_checkout('evt_2', 'checkout.session.async_payment_succeeded', $1, $2)`,
          [order, JSON.stringify(items)],
        ),
      );
      expect(sameSession).toMatchObject({ order_id: first.order_id, already_processed: true });

      const orders = await one(tx.query<{ n: number }>(`select count(*)::int n from orders`));
      expect(orders.n).toBe(1);
      expect(
        (await one(tx.query<{ stock: number }>(`select stock from product_variants where id = $1`, [ids.mugOat])))
          .stock,
      ).toBe(3);
    });
  });

  it("never takes stock below zero and flags the shortfall", async () => {
    await as(db, { role: "service_role" }, async (tx) => {
      const { order, items } = checkoutPayload({ session: "cs_short", qty: 9 });
      const result = await one(
        tx.query<{ order_id: string }>(
          `select * from fulfil_checkout('evt_short', 'checkout.session.completed', $1, $2)`,
          [order, JSON.stringify(items)],
        ),
      );
      const stock = await one(
        tx.query<{ stock: number }>(`select stock from product_variants where id = $1`, [ids.mugOat]),
      );
      expect(stock.stock).toBe(0);
      const notes = await tx.query<{ note: string }>(
        `select note from order_status_history where order_id = $1 order by created_at`,
        [result.order_id],
      );
      expect(notes.rows.some((r) => r.note.includes("Stock shortfall on MUG-OAT"))).toBe(true);
    });
    expect(await stockOf(ids.mugOat)).toBe(5); // rolled back
  });

  it("rejects an empty cart", async () => {
    await as(db, { role: "service_role" }, async (tx) => {
      const { order } = checkoutPayload({ session: "cs_empty" });
      await expect(
        tx.query(`select * from fulfil_checkout('evt_empty', 'checkout.session.completed', $1, '[]')`, [order]),
      ).rejects.toThrow(/no items/);
    });
  });
});

describe("orders", () => {
  async function placeOrder(session: string, userId: string | null = ids.alice): Promise<string> {
    const { order, items } = checkoutPayload({ session, userId, qty: 1 });
    const result = await one(
      db.query<{ order_id: string }>(`select * from fulfil_checkout($1, 'checkout.session.completed', $2, $3)`, [
        `evt_${session}`,
        order,
        JSON.stringify(items),
      ]),
    );
    return result.order_id;
  }

  it("are visible to their owner and staff only", async () => {
    const orderId = await placeOrder("cs_visibility");
    const seenBy = async (userId: string) =>
      as(
        db,
        { role: "authenticated", userId },
        async (tx) => (await tx.query(`select 1 from orders where id = $1`, [orderId])).rows.length,
      );
    expect(await seenBy(ids.alice)).toBe(1);
    expect(await seenBy(ids.bob)).toBe(0);
    expect(await seenBy(ids.demo)).toBe(1);
    expect(await seenBy(ids.admin)).toBe(1);
  });

  it("move through statuses with a timeline note, by admins only", async () => {
    const orderId = await placeOrder("cs_status");
    await as(db, { role: "authenticated", userId: ids.admin }, async (tx) => {
      await tx.query(`select update_order_status($1, 'processing')`, [orderId]);
      await tx.query(`select update_order_status($1, 'shipped', 'Packed with extra paper.', '1Z999', 'UPS')`, [
        orderId,
      ]);
      const order = await one(
        tx.query<{ status: string; tracking_number: string }>(
          `select status, tracking_number from orders where id = $1`,
          [orderId],
        ),
      );
      expect(order).toEqual({ status: "shipped", tracking_number: "1Z999" });
      const timeline = await tx.query<{ status: string; note: string }>(
        `select status, note from order_status_history where order_id = $1 order by created_at, status`,
        [orderId],
      );
      expect(timeline.rows.map((r) => r.status)).toEqual(["paid", "processing", "shipped"]);
      expect(timeline.rows[2]?.note).toBe("Packed with extra paper.");
      await expect(tx.query(`select update_order_status($1, 'paid')`, [orderId])).rejects.toThrow(
        /Cannot move an order/,
      );
    });
    await as(db, { role: "authenticated", userId: ids.demo }, async (tx) => {
      await expect(tx.query(`select update_order_status($1, 'processing')`, [orderId])).rejects.toThrow(/Only admins/);
    });
    await as(db, { role: "authenticated", userId: ids.alice }, async (tx) => {
      await expect(tx.query(`insert into orders (email, subtotal, total) values ('x@y.z', 1, 1)`)).rejects.toThrow(
        /permission denied/,
      );
    });
  });
});

describe("discount codes", () => {
  const validate = (code: string, subtotal: number) =>
    as(db, { role: "anon" }, async (tx) =>
      one(
        tx.query<{ valid: boolean; reason: string | null; type: string | null; value: number }>(
          `select * from validate_discount_code($1, $2)`,
          [code, subtotal],
        ),
      ),
    );

  it("validate case-insensitively", async () => {
    expect(await validate(" welcome10 ", 2000)).toMatchObject({ valid: true, type: "percentage", value: 10 });
  });

  it("explain why a code can't be used", async () => {
    expect(await validate("CLAY20", 5000)).toMatchObject({ valid: false, reason: "below_minimum" });
    expect(await validate("CLAY20", 10000)).toMatchObject({ valid: true });
    expect(await validate("OLDCODE", 5000)).toMatchObject({ valid: false, reason: "expired" });
    expect(await validate("NOPE", 5000)).toMatchObject({ valid: false, reason: "not_found" });
  });

  it("can't be listed by the public or customers", async () => {
    for (const actor of [{ role: "anon" as const }, { role: "authenticated" as const, userId: ids.alice }]) {
      const n = await as(db, actor, async (tx) => (await tx.query(`select code from discount_codes`)).rows.length);
      expect(n).toBe(0);
    }
  });
});

describe("reviews", () => {
  it("can only be written by customers who bought the product", async () => {
    await as(db, { role: "authenticated", userId: ids.bob }, async (tx) => {
      await expect(
        tx.query(
          `insert into reviews (product_id, user_id, author_name, rating, title, body) values ($1, $2, 'Bob', 5, 'Great', 'Lovely mug')`,
          [ids.mug, ids.bob],
        ),
      ).rejects.toThrow(/row-level security/);
    });
  });

  it("are verified and held for moderation, even if the author tries to approve them", async () => {
    const { order, items } = checkoutPayload({ session: "cs_review", userId: ids.bob, qty: 1 });
    await db.query(`select * from fulfil_checkout('evt_review', 'checkout.session.completed', $1, $2)`, [
      order,
      JSON.stringify(items),
    ]);
    await as(db, { role: "authenticated", userId: ids.bob }, async (tx) => {
      const review = await one(
        tx.query<{ verified: boolean; status: string }>(
          `insert into reviews (product_id, user_id, author_name, rating, title, body, verified, status)
           values ($1, $2, 'Bob', 5, 'Great', 'Lovely mug', false, 'approved') returning verified, status`,
          [ids.mug, ids.bob],
        ),
      );
      expect(review).toEqual({ verified: true, status: "pending" });
    });
  });

  it("show only approved reviews publicly, with stats", async () => {
    await db.query(
      `insert into reviews (product_id, author_name, rating, title, body, status) values
       ($1, 'Ana', 5, 'Perfect', 'Holds heat well', 'approved'),
       ($1, 'Lee', 4, 'Nice', 'Slightly smaller than expected', 'approved'),
       ($1, 'Spam', 1, 'Buy stuff', 'Spam spam', 'hidden')`,
      [ids.mug],
    );
    await as(db, { role: "anon" }, async (tx) => {
      const titles = (await tx.query<{ title: string }>(`select title from reviews order by title`)).rows.map(
        (r) => r.title,
      );
      expect(titles).toEqual(["Nice", "Perfect"]);
      const stats = await one(
        tx.query<{ review_count: number; average_rating: number; five_star: number }>(
          `select review_count, average_rating, five_star from product_review_stats where product_id = $1`,
          [ids.mug],
        ),
      );
      expect(stats).toEqual({ review_count: 2, average_rating: 4.5, five_star: 1 });
    });
  });
});

describe("customer-owned data", () => {
  it("keeps addresses private and allows one default per customer", async () => {
    await as(db, { role: "authenticated", userId: ids.alice }, async (tx) => {
      await tx.query(
        `insert into addresses (user_id, full_name, line1, city, postal_code, is_default) values ($1, 'Alice', '1 Kiln Lane', 'Portland', '97201', true)`,
        [ids.alice],
      );
      await expect(
        tx.query(
          `insert into addresses (user_id, full_name, line1, city, postal_code, is_default) values ($1, 'Alice', '2 Clay St', 'Portland', '97202', true)`,
          [ids.alice],
        ),
      ).rejects.toThrow(/addresses_one_default_idx/);
    });
    await as(db, { role: "authenticated", userId: ids.bob }, async (tx) => {
      await expect(
        tx.query(
          `insert into addresses (user_id, full_name, line1, city, postal_code) values ($1, 'Mallory', 'x', 'y', 'z')`,
          [ids.alice],
        ),
      ).rejects.toThrow(/row-level security/);
    });
  });

  it("keeps wishlists and carts per customer", async () => {
    await db.query(`insert into wishlists (user_id, product_id) values ($1, $2)`, [ids.alice, ids.mug]);
    const bobSees = await as(
      db,
      { role: "authenticated", userId: ids.bob },
      async (tx) => (await tx.query(`select 1 from wishlists`)).rows.length,
    );
    expect(bobSees).toBe(0);
    await as(db, { role: "authenticated", userId: ids.bob }, async (tx) => {
      const cart = await one(
        tx.query<{ id: string }>(`insert into carts (user_id) values ($1) returning id`, [ids.bob]),
      );
      await tx.query(`insert into cart_items (cart_id, variant_id, quantity) values ($1, $2, 2)`, [
        cart.id,
        ids.mugOat,
      ]);
      await expect(tx.query(`insert into carts (user_id) values ($1)`, [ids.alice])).rejects.toThrow(
        /row-level security/,
      );
    });
  });
});

describe("rate limiting", () => {
  it("is server-only and enforces the limit per window", async () => {
    await as(db, { role: "anon" }, async (tx) => {
      await expect(tx.query(`select check_rate_limit('contact:1.2.3.4', 2, 60)`)).rejects.toThrow(/permission denied/);
    });
    await as(db, { role: "service_role" }, async (tx) => {
      const results: boolean[] = [];
      for (let i = 0; i < 3; i++) {
        results.push((await one(tx.query<{ ok: boolean }>(`select check_rate_limit('contact:1.2.3.4', 2, 60) ok`))).ok);
      }
      expect(results).toEqual([true, true, false]);
    });
  });
});

describe("inbox tables", () => {
  it("are not readable or writable by the public directly", async () => {
    await as(db, { role: "anon" }, async (tx) => {
      await expect(
        tx.query(`insert into contact_messages (name, email, subject, message) values ('a', 'a@b.co', 's', 'm')`),
      ).rejects.toThrow(/row-level security/);
    });
    await as(db, { role: "anon" }, async (tx) => {
      await expect(tx.query(`insert into newsletter_subscribers (email) values ('a@b.co')`)).rejects.toThrow(
        /row-level security/,
      );
    });
    const visible = await as(
      db,
      { role: "authenticated", userId: ids.alice },
      async (tx) => (await tx.query(`select 1 from contact_messages`)).rows.length,
    );
    expect(visible).toBe(0);
  });
});
