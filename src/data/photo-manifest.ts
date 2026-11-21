/**
 * Shape of src/data/photos.json, written by `npm run seed:photos` and read by
 * the seed (to upload) and the /credits page (to credit photographers).
 */
export interface PhotoCredit {
  id: string;
  /** Original-quality download URL from the photo library. */
  downloadUrl: string;
  alt: string;
  width: number;
  height: number;
  photographer: string;
  photographerUrl: string;
  /** The photo's page on the library site. */
  sourceUrl: string;
  source: "Pexels";
}

export interface PhotoManifest {
  generatedAt: string;
  products: Record<string, PhotoCredit[]>;
  collections: Record<string, PhotoCredit | null>;
  site: {
    hero: PhotoCredit[];
    process: PhotoCredit[];
    gallery: PhotoCredit[];
  };
}

/**
 * Storage paths, shared by the seed (upload) and the app (public URLs).
 * The photo id is part of every path, so swapping a photo always produces a
 * new URL and long-lived image caches never serve the old one.
 */
export const STORAGE_BUCKET = "product-images";

export const storagePaths = {
  product: (slug: string, photo: PhotoCredit) => `products/${slug}/${photo.id}.jpg`,
  collection: (slug: string, photo: PhotoCredit) => `collections/${slug}-${photo.id}.jpg`,
  site: (photo: PhotoCredit) => `site/${photo.id}.jpg`,
};
