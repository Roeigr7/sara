import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Browsers and crawlers often request /favicon.ico by default; serve moz.png
  async rewrites() {
    return [{ source: "/favicon.ico", destination: "/moz.png" }];
  },
};

export default nextConfig;
