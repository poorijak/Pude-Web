import type { NextConfig } from "next";

const INTERNAL_API_URL =
  process.env.INTERNAL_API_URL || "https://pude-api-dev.bbxst-hub.dev";

const nextConfig: NextConfig = {
  output: "standalone",
  // Keep the development badge from covering the mobile microphone control.
  devIndicators: false,
  experimental: {
    agentFeedback: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-55c54a64a4904de38ffb99bcd80e714b.r2.dev",
      },
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        // CSS Modules must keep their .module.css type and scoped class exports.
        condition: { not: { path: /\.module\.css$/ } },
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${INTERNAL_API_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;
