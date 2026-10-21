import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const updatedAt = new Date();
  return [
    {
      url: siteConfig.siteUrl,
      lastModified: updatedAt,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${siteConfig.siteUrl}/politica-de-privacidade`,
      lastModified: updatedAt,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteConfig.siteUrl}/termos-de-uso`,
      lastModified: updatedAt,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
