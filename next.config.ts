import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  // The live WordPress site uses trailing-slash URLs; keep them for SEO parity.
  trailingSlash: true,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [60, 75, 85],
    deviceSizes: [360, 640, 768, 1024, 1280, 1536, 1920, 2560],
  },
};

export default nextConfig;
