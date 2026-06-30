import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root so Turbopack doesn't pick up a stray parent lockfile
  // (this template often lives nested inside another repo).
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
