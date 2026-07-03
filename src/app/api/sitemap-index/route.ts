import { NextResponse } from "next/server";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export function GET() {
  const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" }));
  const yr = now.getFullYear();
  const base = siteConfig.url;

  const ids = [
    "static",
    "tools",
    "holidays",
    "year",
    `month-${yr}`,
    `month-${yr - 1}`,
    `month-${yr + 1}`,
    `month-${yr + 2}`,
    `month-${yr + 3}`,
    `month-${yr + 4}`,
    `day-${yr - 1}`,
    `day-${yr}`,
    `day-${yr + 1}`,
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${ids.map(id => `  <sitemap>\n    <loc>${base}/sitemap/${id}.xml</loc>\n  </sitemap>`).join("\n")}
</sitemapindex>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
