import type { MetadataRoute } from "next";
import { seoArticles } from "@/data/seo-articles";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: "https://www.wooli.me",
      lastModified: now,
      changeFrequency: "daily",
      priority: 1
    },
    {
      url: "https://www.wooli.me/articles",
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8
    },
    ...seoArticles.map((article) => ({
      url: `https://www.wooli.me/articles/${article.slug}`,
      lastModified: article.publishedAt,
      changeFrequency: "monthly" as const,
      priority: 0.72
    }))
  ];
}
