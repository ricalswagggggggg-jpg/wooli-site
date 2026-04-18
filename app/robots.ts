import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/"
    },
    sitemap: "https://wooli.me/sitemap.xml",
    host: "https://wooli.me"
  };
}
