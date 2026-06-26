import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

const BASE = siteConfig.url;
type SitemapEntry = MetadataRoute.Sitemap[number];

function u(path: string, lastmod: Date, changeFrequency: SitemapEntry["changeFrequency"], priority: number): SitemapEntry {
  return { url: `${BASE}${path}`, lastModified: lastmod, changeFrequency, priority };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const yr = now.getFullYear();
  const mo = now.getMonth() + 1;
  const dy = now.getDate();

  // ── 1. Static pages ──────────────────────────────────────────────────────────
  const staticUrls: SitemapEntry[] = [
    u("/", now, "daily", 1.0),
    u("/lich-hom-nay", now, "daily", 0.98),
    u(`/am-lich/nam/${yr}/thang/${mo}/ngay/${dy}`, now, "daily", 0.96), // canonical cho ngày hôm nay
    u("/gio-hoang-dao", now, "daily", 0.92),
    u("/ngay-tot-xau", now, "daily", 0.92),
    u("/lich-van-nien", now, "weekly", 0.88),
    u("/chuyen-doi-lich", now, "monthly", 0.82),
    u("/tinh-tuoi-am", now, "monthly", 0.80),
    u("/dem-ngay", now, "monthly", 0.78),
    u("/nhac-ngay-gio", now, "monthly", 0.75),
    u("/lich-nghi-le", now, "monthly", 0.78),
  ];

  // ── 2. Năm hiện tại và ±1 ───────────────────────────────────────────────────
  const yearUrls: SitemapEntry[] = [];
  for (const y of [yr - 1, yr, yr + 1]) {
    const isCurrent = y === yr;
    const ref = new Date(y, 0, 1);
    yearUrls.push(u(`/am-lich/nam/${y}`, isCurrent ? now : ref, isCurrent ? "monthly" : "yearly", isCurrent ? 0.90 : 0.72));
    yearUrls.push(u(`/lich-nghi-le/${y}`, isCurrent ? now : ref, isCurrent ? "monthly" : "yearly", isCurrent ? 0.80 : 0.62));
  }

  // ── 3. Tháng: 12 tháng năm hiện tại + 3 tháng gần nhất ──────────────────────
  const monthUrls: SitemapEntry[] = [];
  for (let m = 1; m <= 12; m++) {
    const isCurrent = m === mo;
    const ref = new Date(yr, m - 1, 1);
    monthUrls.push(u(`/am-lich/nam/${yr}/thang/${m}`, isCurrent ? now : ref, isCurrent ? "daily" : "weekly", isCurrent ? 0.94 : 0.80));
  }
  // 3 tháng gần nhất của năm trước/năm sau nếu lân cận
  for (const offset of [-2, -1, 1, 2]) {
    const d = new Date(yr, mo - 1 + offset, 1);
    const y = d.getFullYear();
    const m = d.getMonth() + 1;
    if (y !== yr) {
      monthUrls.push(u(`/am-lich/nam/${y}/thang/${m}`, d, "weekly", 0.72));
    }
  }

  // ── 4. Ngày: ±30 ngày quanh hôm nay (3 URL/ngày) ───────────────────────────
  const dayUrls: SitemapEntry[] = [];
  for (let offset = -30; offset <= 30; offset++) {
    const d = new Date(yr, mo - 1, dy + offset);
    const y = d.getFullYear();
    const m = d.getMonth() + 1;
    const dd = d.getDate();
    const isToday = offset === 0;
    const near = Math.abs(offset) <= 7;
    const lm = isToday ? now : d;
    const cf: SitemapEntry["changeFrequency"] = isToday ? "daily" : "weekly";
    const basePri = isToday ? 0.96 : near ? 0.82 : 0.65;

    // Bỏ qua hôm nay ở đây (đã có ở staticUrls)
    if (!isToday) {
      dayUrls.push(u(`/am-lich/nam/${y}/thang/${m}/ngay/${dd}`, lm, cf, basePri));
    }
    dayUrls.push(u(`/ngay-tot-xau/${y}/${m}/${dd}`, lm, cf, Math.max(0.55, basePri - 0.06)));
    dayUrls.push(u(`/gio-hoang-dao/${y}/${m}/${dd}`, lm, cf, Math.max(0.55, basePri - 0.08)));
  }

  return [...staticUrls, ...yearUrls, ...monthUrls, ...dayUrls];
}
