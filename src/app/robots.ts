import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/"],
      },
    ],
    sitemap: [
      `${siteConfig.url}/sitemap/static.xml`,
      `${siteConfig.url}/sitemap/tools.xml`,
      `${siteConfig.url}/sitemap/holidays.xml`,
      `${siteConfig.url}/sitemap/year.xml`,
      `${siteConfig.url}/sitemap/month-${new Date().getFullYear()}.xml`,
      `${siteConfig.url}/sitemap/month-${new Date().getFullYear() - 1}.xml`,
      `${siteConfig.url}/sitemap/month-${new Date().getFullYear() + 1}.xml`,
      `${siteConfig.url}/sitemap/month-${new Date().getFullYear() + 2}.xml`,
      `${siteConfig.url}/sitemap/month-${new Date().getFullYear() + 3}.xml`,
      `${siteConfig.url}/sitemap/month-${new Date().getFullYear() + 4}.xml`,
      `${siteConfig.url}/sitemap/day-${new Date().getFullYear()}.xml`,
      `${siteConfig.url}/sitemap/day-${new Date().getFullYear() - 1}.xml`,
      `${siteConfig.url}/sitemap/day-${new Date().getFullYear() + 1}.xml`,
    ],
    host: siteConfig.url,
  };
}
