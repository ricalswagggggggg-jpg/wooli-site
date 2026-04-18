import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: "https://wooli.me",
      lastModified: now,
      changeFrequency: "daily",
      priority: 1
    },
    {
      url: "https://www.wooli.me",
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9
    }
  ];
}
