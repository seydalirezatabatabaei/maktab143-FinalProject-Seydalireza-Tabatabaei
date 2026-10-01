import type { NextConfig } from "next";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
const apiImageOrigin = apiBaseUrl ? new URL(apiBaseUrl) : null;

const nextConfig: NextConfig = {
  images: apiImageOrigin
    ? {
        remotePatterns: [
          {
            protocol: apiImageOrigin.protocol.slice(0, -1) as "http" | "https",
            hostname: apiImageOrigin.hostname,
            port: apiImageOrigin.port,
            pathname: "/files/**",
            search: "",
          },
        ],
      }
    : undefined,
};

export default nextConfig;
