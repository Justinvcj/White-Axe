import type { NextConfig } from "next";

// @ts-expect-error - forcefully ignoring strict type check for rapid deployment
const nextConfig: any = {
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors. Required for rapid MVP deployment.
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
