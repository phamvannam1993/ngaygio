import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

const BASE = siteConfig.url;
type SitemapEntry = MetadataRoute.Sitemap[number];

function u(path: string, lastmod: Date, changeFrequency: SitemapEntry["changeFrequency"], priority: number): SitemapEntry {
  return { url: `${BASE}${path}`, lastModified: lastmod, changeFrequency, priority };
}

// Sitemap index: Next.js hỗ trợ multiple sitemaps qua generateSitemaps()
// File này export default function → single sitemap.xml chứa tất cả URLs.
// Nếu cần sitemap index thực sự (>50k URLs), dùng generateSitemaps() + dynamic segments.

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const yr = now.getFullYear();
  const mo = now.getMonth() + 1;
  const dy = now.getDate();

  // ── 1. Static / evergreen ───────────────────────────────────────────────────
  const staticUrls: SitemapEntry[] = [
    u("/", now, "daily", 1.0),
    u("/lich-hom-nay", now, "daily", 0.98),
    u("/am-lich-hom-nay", now, "daily", 0.96),
    u("/gio-hoang-dao", now, "daily", 0.92),
    u("/ngay-tot-xau", now, "daily", 0.92),
    u("/lich-van-nien", now, "weekly", 0.88),
    u("/am-lich", now, "weekly", 0.85),
    u("/chuyen-doi-lich", now, "monthly", 0.80),
    u("/tinh-tuoi-am", now, "monthly", 0.80),
    u("/dem-ngay", now, "monthly", 0.78),
    u("/nhac-ngay-gio", now, "monthly", 0.75),
    u("/lich-nghi-le", now, "monthly", 0.78),
  ];

  // ── 2. Năm (±2 năm) ─────────────────────────────────────────────────────────
  const yearUrls: SitemapEntry[] = [];
  for (let y = yr - 2; y <= yr + 2; y++) {
    const isCurrentYear = y === yr;
    const ref = new Date(y, 0, 1);
    const lm = isCurrentYear ? now : ref;
    const pri = isCurrentYear ? 0.9 : y === yr - 1 || y === yr + 1 ? 0.78 : 0.65;
    yearUrls.push(u(`/am-lich/nam/${y}`, lm, isCurrentYear ? "monthly" : "yearly", pri));
    yearUrls.push(u(`/lich-nghi-le/${y}`, lm, isCurrentYear ? "monthly" : "yearly", Math.max(0.55, pri - 0.1)));
  }

  // ── 3. Tháng (24 tháng: 12 tháng năm hiện tại + 6 tháng lân cận) ───────────
  const monthUrls: SitemapEntry[] = [];
  for (let offset = -6; offset <= 17; offset++) {
    const d = new Date(yr, mo - 1 + offset, 1);
    const y = d.getFullYear();
    const m = d.getMonth() + 1;
    if (y < 1900 || y > 2050) continue;
    const isCurrentMonth = y === yr && m === mo;
    const lm = isCurrentMonth ? now : d;
    const pri = isCurrentMonth ? 0.94 : Math.abs(offset) <= 3 ? 0.84 : 0.72;
    monthUrls.push(u(`/am-lich/nam/${y}/thang/${m}`, lm, isCurrentMonth ? "daily" : "weekly", pri));
  }

  // ── 4. Ngày: ±60 ngày quanh hôm nay — 4 URL/ngày ──────────────────────────
  const dayUrls: SitemapEntry[] = [];
  const RADIUS = 60;
  for (let offset = -RADIUS; offset <= RADIUS; offset++) {
    const d = new Date(yr, mo - 1, dy + offset);
    const y = d.getFullYear();
    const m = d.getMonth() + 1;
    const dd = d.getDate();
    if (y < 1900 || y > 2050) continue;
    const isToday = offset === 0;
    const near = Math.abs(offset) <= 14;
    const lm = isToday ? now : d;
    const cf: SitemapEntry["changeFrequency"] = isToday ? "daily" : "weekly";
    const basePri = isToday ? 0.96 : near ? 0.84 : 0.68;

    dayUrls.push(u(`/am-lich/nam/${y}/thang/${m}/ngay/${dd}`, lm, cf, basePri));
    dayUrls.push(u(`/ngay-tot-xau/${y}/${m}/${dd}`, lm, cf, Math.max(0.55, basePri - 0.06)));
    dayUrls.push(u(`/gio-hoang-dao/${y}/${m}/${dd}`, lm, cf, Math.max(0.55, basePri - 0.08)));
  }

  return [...staticUrls, ...yearUrls, ...monthUrls, ...dayUrls];
}
