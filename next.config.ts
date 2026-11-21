import type { NextConfig } from "next";

// Product photos are served from the project's Supabase Storage bucket.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const storagePattern = supabaseUrl ? [new URL("/storage/v1/object/public/product-images/**", supabaseUrl)] : [];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    remotePatterns: storagePattern,
    formats: ["image/avif", "image/webp"],
    // Product photos change only when re-uploaded under a new path, so cache optimised variants for 30 days.
    minimumCacheTTL: 2_592_000,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
