import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // ☁️ CLOUDFLARE FIX:
    // The Free Tier doesn't support the default Next.js Image Optimization API.
    // We disable it so images load directly from Sanity/Clerk without breaking.
    unoptimized: true, 
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
  },
  // Skip TypeScript errors during production build
  typescript: {
    ignoreBuildErrors: true,
  },
  // Skip ESLint during production build
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;