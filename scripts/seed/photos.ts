/**
 * npm run seed:photos
 *
 * Picks royalty-free photos from the official Pexels API (free key:
 * https://www.pexels.com/api/) and writes src/data/photos.json: which photo
 * goes where, its alt text, and the photographer credit shown on /credits.
 * Nothing is downloaded here; `npm run seed` downloads and uploads to Supabase
 * Storage. Run once, review the result, commit photos.json.
 *
 * Licence: https://www.pexels.com/license/ (free to use, no attribution
 * required; we credit every photographer anyway).
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { collections, products } from "./catalog.ts";
import { buildSeedPlan } from "./plan.ts";
import type { PhotoCredit, PhotoManifest } from "../../src/data/photo-manifest.ts";

try {
  process.loadEnvFile(".env.local");
} catch {
  // No .env.local: fall back to the shell environment.
}

const key = process.env.PEXELS_API_KEY;
if (!key) {
  console.error("PEXELS_API_KEY is missing. Get a free key at https://www.pexels.com/api/ and add it to .env.local.");
  process.exit(1);
}

interface PexelsPhoto {
  id: number;
  width: number;
  height: number;
  url: string;
  alt: string | null;
  photographer: string;
  photographer_url: string;
  src: { original: string };
}

const used = new Set<number>();
let requests = 0;

async function search(query: string, orientation: "portrait" | "landscape" | "square"): Promise<PexelsPhoto[]> {
  const url = new URL("https://api.pexels.com/v1/search");
  url.searchParams.set("query", query);
  url.searchParams.set("per_page", "20");
  url.searchParams.set("orientation", orientation);
  requests += 1;
  const res = await fetch(url, { headers: { Authorization: key ?? "" } });
  if (res.status === 429) throw new Error("Pexels rate limit reached (200/hour). Wait an hour and run again.");
  if (!res.ok) throw new Error(`Pexels search "${query}" failed: ${res.status} ${await res.text()}`);
  const body = (await res.json()) as { photos: PexelsPhoto[] };
  return body.photos;
}

function toCredit(photo: PexelsPhoto, fallbackAlt: string, width: number): PhotoCredit {
  const src = new URL(photo.src.original);
  src.searchParams.set("auto", "compress");
  src.searchParams.set("cs", "tinysrgb");
  src.searchParams.set("w", String(width));
  const alt = photo.alt?.trim() ? photo.alt.trim().replace(/\.$/, "") : fallbackAlt;
  return {
    id: `pexels-${photo.id}`,
    downloadUrl: src.toString(),
    alt: alt.charAt(0).toUpperCase() + alt.slice(1),
    width,
    height: Math.round((photo.height / photo.width) * width),
    photographer: photo.photographer,
    photographerUrl: photo.photographer_url,
    sourceUrl: photo.url,
    source: "Pexels",
  };
}

async function pick(
  query: string,
  count: number,
  orientation: "portrait" | "landscape" | "square",
  fallbackAlt: string,
  width = 1600,
): Promise<PhotoCredit[]> {
  const photos = await search(query, orientation);
  const chosen: PhotoCredit[] = [];
  for (const photo of photos) {
    if (chosen.length === count) break;
    if (used.has(photo.id)) continue;
    used.add(photo.id);
    chosen.push(toCredit(photo, fallbackAlt, width));
  }
  if (chosen.length < count) console.warn(`  only found ${chosen.length}/${count} new photos for "${query}"`);
  return chosen;
}

const plan = buildSeedPlan();
const manifest: PhotoManifest = {
  generatedAt: new Date().toISOString(),
  products: {},
  collections: {},
  site: { hero: [], process: [], gallery: [] },
};

for (const product of products) {
  const count = plan.images.filter((i) => i.productSlug === product.slug).length;
  process.stdout.write(`${product.slug}: `);
  manifest.products[product.slug] = await pick(product.photoQuery, count, "portrait", product.title);
  console.log(manifest.products[product.slug]?.length ?? 0);
}

for (const collection of collections) {
  manifest.collections[collection.slug] =
    (await pick(collection.photoQuery, 1, "landscape", collection.name))[0] ?? null;
}

manifest.site.hero = await pick(
  "handmade ceramics pottery table",
  1,
  "landscape",
  "Handmade ceramics on a table",
  2400,
);
manifest.site.process = [
  ...(await pick("potter throwing clay on pottery wheel", 1, "portrait", "A potter throwing clay on the wheel")),
  ...(await pick("glazing pottery by hand", 1, "portrait", "Dipping a pot in glaze")),
  ...(await pick("pottery kiln firing", 1, "portrait", "Pots stacked in the kiln")),
];
manifest.site.gallery = await pick("ceramics styled home interior", 6, "square", "Kiln & Co. ceramics at home", 1000);

const out = join(process.cwd(), "src", "data", "photos.json");
writeFileSync(out, `${JSON.stringify(manifest, null, 2)}\n`);
const total =
  Object.values(manifest.products).flat().length +
  Object.values(manifest.collections).filter(Boolean).length +
  manifest.site.hero.length +
  manifest.site.process.length +
  manifest.site.gallery.length;
console.log(`\nWrote ${total} photos from ${requests} Pexels searches to ${out}`);
