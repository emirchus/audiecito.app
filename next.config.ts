import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: true,
    dynamicIO: false,
    viewTransition: true,
    serverActions: {
      allowedOrigins: ["gp3bq85x-3000.brs.devtunnels.ms"],
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default nextConfig;
