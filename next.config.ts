import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "c809654.parspack.net",
      },
    ],
  },
};

export default nextConfig;
