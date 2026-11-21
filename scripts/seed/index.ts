/**
 * npm run seed
 *
 * Resets the store to a known demo state on your Supabase project:
 *   - wipes catalogue, orders, reviews and inbox tables (never auth users)
 *   - creates or updates the owner admin, demo admin and 8 sample customers
 *   - uploads product, collection and site photos to Storage (if
 *     src/data/photos.json exists; run `npm run seed:photos` first)
 *   - inserts 40 products, 120 reviews, 25 orders and the discount codes
 *
 * Safe to run repeatedly. Uses the secret (service role) key.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { randomBytes } from "node:crypto";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../../src/types/database.ts";
import { STORAGE_BUCKET, storagePaths, type PhotoCredit, type PhotoManifest } from "../../src/data/photo-manifest.ts";
import { buildSeedPlan, type PersonPlan } from "./plan.ts";
import { toTableRows, type ResolvedImage } from "./rows.ts";

try {
  process.loadEnvFile(".env.local");
} catch {
  // No .env.local: fall back to the shell environment.
}

function requireEnv(name: string, hint: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    console.error(`✗ ${name} is missing. ${hint}`);
    process.exit(1);
  }
  return value;
}

const url = requireEnv("NEXT_PUBLIC_SUPABASE_URL", "Add your Supabase project URL to .env.local.");
const secret = requireEnv("SUPABASE_SECRET_KEY", "Add the secret (service role) key to .env.local.");
const ownerPassword = requireEnv("SEED_OWNER_ADMIN_PASSWORD", "Choose a strong password for owner@kilnandco.test.");
const demoPassword = requireEnv("SEED_DEMO_ADMIN_PASSWORD", "Choose a password for the public read-only demo admin.");
for (const [name, value] of [
  ["SEED_OWNER_ADMIN_PASSWORD", ownerPassword],
  ["SEED_DEMO_ADMIN_PASSWORD", demoPassword],
] as const) {
  if (value.length < 10) {
    console.error(`✗ ${name} must be at least 10 characters.`);
    process.exit(1);
  }
}

type Client = SupabaseClient<Database>;
const supabase: Client = createClient<Database>(url, secret, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const step = (message: string) => console.log(`\n▸ ${message}`);
const fail = (context: string, error: { message: string } | null) => {
  if (error) throw new Error(`${context}: ${error.message}`);
};

// ------------------------------------------------------------------ helpers
async function inChunks<T>(items: T[], size: number, fn: (chunk: T[]) => Promise<void>) {
  for (let i = 0; i < items.length; i += size) await fn(items.slice(i, i + size));
}

async function withConcurrency<T>(items: T[], limit: number, fn: (item: T) => Promise<void>) {
  let index = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (index < items.length) {
      const item = items[index++];
      if (item !== undefined) await fn(item);
    }
  });
  await Promise.all(workers);
}

// ------------------------------------------------------------------ wipe
const wipeOrder = [
  "reviews",
  "order_status_history",
  "order_items",
  "stripe_events",
  "orders",
  "cart_items",
  "carts",
  "wishlists",
  "stock_notifications",
  "collection_products",
  "product_variants",
  "product_images",
  "products",
  "collections",
  "categories",
  "discount_codes",
  "newsletter_subscribers",
  "contact_messages",
  "rate_limits",
] as const;

const keyColumn: Partial<Record<(typeof wipeOrder)[number], string>> = {
  collection_products: "product_id",
  wishlists: "user_id",
  rate_limits: "key",
};

async function wipe() {
  for (const table of wipeOrder) {
    const column = keyColumn[table] ?? "id";
    const { error } = await supabase.from(table).delete().not(column, "is", null);
    fail(`wipe ${table}`, error);
  }
}

// ------------------------------------------------------------------ people
async function findUsersByEmail(): Promise<Map<string, string>> {
  const byEmail = new Map<string, string>();
  for (let page = 1; ; page++) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 1000 });
    fail("list users", error);
    for (const user of data.users) if (user.email) byEmail.set(user.email.toLowerCase(), user.id);
    if (data.users.length < 1000) break;
  }
  return byEmail;
}

async function ensurePeople(people: PersonPlan[]): Promise<Map<string, string>> {
  const existing = await findUsersByEmail();
  const ids = new Map<string, string>();

  for (const person of people) {
    const password =
      person.password === "owner"
        ? ownerPassword
        : person.password === "demo"
          ? demoPassword
          : randomBytes(18).toString("base64url");
    let id = existing.get(person.email.toLowerCase());

    if (!id) {
      const { data, error } = await supabase.auth.admin.createUser({
        email: person.email,
        password,
        email_confirm: true,
        user_metadata: { full_name: person.fullName },
      });
      fail(`create ${person.email}`, error);
      id = data.user?.id;
    } else if (person.password !== "random") {
      // Keep admin passwords in sync with .env.local.
      const { error } = await supabase.auth.admin.updateUserById(id, { password, email_confirm: true });
      fail(`update ${person.email}`, error);
    }
    if (!id) throw new Error(`No id for ${person.email}`);

    const { error } = await supabase
      .from("profiles")
      .update({ role: person.role, full_name: person.fullName, created_at: person.createdAt })
      .eq("id", id);
    fail(`profile ${person.email}`, error);
    ids.set(person.key, id);
  }
  return ids;
}

// ------------------------------------------------------------------ photos
const cacheDir = join(process.cwd(), "scripts", "seed", ".cache");

async function download(photo: PhotoCredit): Promise<Buffer> {
  const cached = join(cacheDir, `${photo.id}.jpg`);
  if (existsSync(cached)) return readFileSync(cached);
  const res = await fetch(photo.downloadUrl);
  if (!res.ok) throw new Error(`Download ${photo.id} failed: ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  writeFileSync(cached, buffer);
  return buffer;
}

async function upload(path: string, photo: PhotoCredit): Promise<ResolvedImage> {
  const body = await download(photo);
  const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, body, {
    contentType: "image/jpeg",
    cacheControl: "31536000",
    upsert: true,
  });
  fail(`upload ${path}`, error);
  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return { url: data.publicUrl, alt: photo.alt, storagePath: path, width: photo.width, height: photo.height };
}

function loadManifest(): PhotoManifest | null {
  const file = join(process.cwd(), "src", "data", "photos.json");
  if (!existsSync(file)) return null;
  return JSON.parse(readFileSync(file, "utf8")) as PhotoManifest;
}

async function uploadPhotos(manifest: PhotoManifest) {
  mkdirSync(cacheDir, { recursive: true });
  const productImages = new Map<string, ResolvedImage>();
  const jobs: { path: string; photo: PhotoCredit; done: (img: ResolvedImage) => void }[] = [];

  for (const [slug, photos] of Object.entries(manifest.products)) {
    photos.forEach((photo, index) =>
      jobs.push({
        path: storagePaths.product(slug, photo),
        photo,
        done: (img) => productImages.set(`${slug}|${index}`, img),
      }),
    );
  }
  const collectionImages = new Map<string, ResolvedImage>();
  for (const [slug, photo] of Object.entries(manifest.collections)) {
    if (photo)
      jobs.push({ path: storagePaths.collection(slug, photo), photo, done: (img) => collectionImages.set(slug, img) });
  }
  for (const group of ["hero", "process", "gallery"] as const) {
    for (const photo of manifest.site[group]) jobs.push({ path: storagePaths.site(photo), photo, done: () => {} });
  }

  let done = 0;
  await withConcurrency(jobs, 6, async (job) => {
    job.done(await upload(job.path, job.photo));
    done += 1;
    if (done % 20 === 0 || done === jobs.length) process.stdout.write(`  ${done}/${jobs.length} photos\r`);
  });
  console.log();
  await pruneStorage(new Set(jobs.map((j) => j.path)));
  return { productImages, collectionImages };
}

/** Lists every file path under a folder of the bucket (one level of subfolders). */
async function listFiles(folder: string): Promise<string[]> {
  const bucket = supabase.storage.from(STORAGE_BUCKET);
  const { data, error } = await bucket.list(folder, { limit: 1000 });
  fail(`list ${folder}`, error);
  const paths: string[] = [];
  for (const entry of data ?? []) {
    // Folders come back without an id.
    if (entry.id === null) paths.push(...(await listFiles(`${folder}/${entry.name}`)));
    else paths.push(`${folder}/${entry.name}`);
  }
  return paths;
}

/** Removes seed-managed photos that the current manifest no longer uses. */
async function pruneStorage(keep: Set<string>) {
  const stale: string[] = [];
  for (const folder of ["products", "collections", "site"]) {
    for (const path of await listFiles(folder)) if (!keep.has(path)) stale.push(path);
  }
  await inChunks(stale, 100, async (chunk) => {
    const { error } = await supabase.storage.from(STORAGE_BUCKET).remove(chunk);
    fail("remove old photos", error);
  });
  if (stale.length) console.log(`  removed ${stale.length} unused photos`);
}

// ------------------------------------------------------------------ main
async function main() {
  const started = Date.now();
  const plan = buildSeedPlan({ now: new Date() });
  console.log(`Seeding ${url}`);

  step("Clearing existing store data");
  await wipe();

  step("Creating accounts");
  const userIds = await ensurePeople(plan.people);

  const manifest = loadManifest();
  let productImages = new Map<string, ResolvedImage>();
  let collectionImages = new Map<string, ResolvedImage>();
  if (manifest) {
    step("Uploading photos to Storage");
    ({ productImages, collectionImages } = await uploadPhotos(manifest));
  } else {
    console.warn(
      "\n! src/data/photos.json not found: products will use the no-photo state. Run `npm run seed:photos` first.",
    );
  }

  step("Writing catalogue, orders and reviews");
  const tables = toTableRows(plan, {
    userIds,
    imageFor: (slug, photoIndex) => productImages.get(`${slug}|${photoIndex}`) ?? null,
  });
  for (const { table, rows } of tables) {
    if (table === "order_status_history") {
      // Replace the "now" rows written by the orders trigger with back-dated history.
      const { error } = await supabase.from("order_status_history").delete().not("id", "is", null);
      fail("clear trigger history", error);
    }
    await inChunks(rows, 500, async (chunk) => {
      const { error } = await supabase.from(table as "products").insert(chunk as never);
      fail(`insert ${table}`, error);
    });
    console.log(`  ${table.padEnd(24)} ${rows.length}`);
  }

  for (const [slug, image] of collectionImages) {
    const { error } = await supabase
      .from("collections")
      .update({ image_url: image.url, image_alt: image.alt })
      .eq("slug", slug);
    fail(`collection image ${slug}`, error);
  }

  const seconds = ((Date.now() - started) / 1000).toFixed(1);
  console.log(`\n✓ Done in ${seconds}s`);
  console.log("  Owner admin:  owner@kilnandco.test (password: SEED_OWNER_ADMIN_PASSWORD)");
  console.log("  Demo admin:   demo-admin@kilnandco.test (password: SEED_DEMO_ADMIN_PASSWORD, read-only)");
}

main().catch((error: unknown) => {
  console.error(`\n✗ Seed failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
