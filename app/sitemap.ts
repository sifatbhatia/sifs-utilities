import type { MetadataRoute } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://sifs-utils.vercel.app";

const routes = [
  "",
  "/sif/utils",
  "/pixsqueeze",
  "/vidsqueeze",
  "/pdf-compressor",
  "/circle-crop",
  "/meta-shield",
  "/synth-strip",
  "/grain-pix",
  "/icon-set",
  "/json-formatter",
  "/yaml-formatter",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
