import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // The repo has a root-level package-lock.json alongside this project's
  // own, which makes Next.js guess the workspace root. Pinning it avoids
  // the warning and any risk of it guessing wrong.
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
