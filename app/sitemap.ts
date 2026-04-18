import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: "https://www.wooli.me",
      lastModified: now,
      changeFrequency: "daily",
      priority: 1
    }
  ];
}
