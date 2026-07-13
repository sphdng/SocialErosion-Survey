import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Keep file tracing rooted in this project (avoids picking a parent lockfile).
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
