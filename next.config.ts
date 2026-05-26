import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow OG images from any HTTPS origin (user-submitted deals can come from any travel site).
    // Restrict to remotePatterns instead of unoptimized so Next.js still optimises them.
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;
