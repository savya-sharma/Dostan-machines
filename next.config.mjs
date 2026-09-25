/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // Files under /public get no cache headers from Next.js by default
  // (unlike the content-hashed /_next/static assets, which already cache
  // forever). The hero frame sequence and the about-section video are
  // large, filename-versioned, and never change in place, so they're safe
  // to cache aggressively — this only affects repeat visits/navigations,
  // not the first load.
  async headers() {
    return [
      {
        source: "/compressed_images/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/videos/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
