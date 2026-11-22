import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // All site images live under /images. Restrict the optimizer to that
    // prefix so it never proxies arbitrary local paths. See docs/images.md.
    localPatterns: [{ pathname: "/images/**" }],
  },
};

export default nextConfig;
