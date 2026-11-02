import type { NextConfig } from "next";
import { IMAGE_HOSTS } from "./lib/images";
import { BASE_PATH } from "./lib/paths";

const nextConfig: NextConfig = {
  output: "export",
  basePath: BASE_PATH,
  trailingSlash: true,
  images: { unoptimized: true, remotePatterns: IMAGE_HOSTS.map((hostname) => ({ protocol: "https", hostname, pathname: "/**" })) },
  turbopack: { rules: { "*.css": { loaders: ["@tailwindcss/turbopack"], as: "*.css" } } },
};

export default nextConfig;
