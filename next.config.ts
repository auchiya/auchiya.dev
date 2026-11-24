import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // In production, imported images are emitted to /_next/static/media/** and
    // optimized through Cloudflare Images. In dev, vinext points them at the
    // Vite source path (/content/...), which the Worker image endpoint cannot
    // fetch, so serve those files directly instead. See docs/images.md.
    unoptimized: process.env.NODE_ENV !== "production",
    // Keep /images/** for fixed-URL public images and to avoid proxying
    // arbitrary local paths. Vinext always allows /_next/static/media/**.
    localPatterns: [{ pathname: "/images/**" }],
  },
};

export default nextConfig;
