import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root so Turbopack doesn't pick up a stray parent lockfile.
  turbopack: {
    root: path.join(__dirname),
  },
  async redirects() {
    return [
      {
        source: "/offer",
        destination: "/design-system-audit",
        permanent: false,
      },
      {
        source: "/audit",
        destination: "/design-system-audit",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
