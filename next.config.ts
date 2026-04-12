import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* options here */
  reactCompiler: true,
  // Pin Turbopack root when multiple lockfiles exist above this folder (avoids wrong workspace root).
  turbopack: {
    root: path.join(__dirname),
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Embedder-Policy", value: "require-corp" },
        ],
      },
    ];
  },
};

export default nextConfig;
