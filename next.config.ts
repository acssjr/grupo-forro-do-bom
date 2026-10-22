import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  outputFileTracingExcludes: {
    "/*": [".data/**/*", ".vercel/**/*", ".impeccable/**/*", ".agents/**/*", ".env*"],
  },
};

export default nextConfig;
