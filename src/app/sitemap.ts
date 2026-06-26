import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

const BASE = siteConfig.url;
type SitemapEntry = MetadataRoute.Sitemap[number];

function u(path: string, lastmod: Date, changeFrequency: SitemapEntry["changeFrequency"], priority: number): SitemapEntry {
  return { url: `${BASE}${path}`, lastModified: lastmod, changeFrequency, priority };
}

function todayVN(): { now: Date; yr: number; mo: number; dy: number } {
  const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" }));
  return { now, yr: now.getFullYear(), mo: now.getMonth() + 1, dy: now.getDate() };
}

// ── Sitemap IDs ───────────────────────────────────────────────────────────────
// Next.js tạo /sitemap/[id].xml + index tại /sitemap.xml khi dùng generateSitemaps()
export function generateSitemaps() {
  const { yr } = todayVN();
  return [
    { id: "static" },
    { id: "tools" },
    { id: "year" },
    { id: `month-${yr}` },
    { id: `month-${yr - 1}` },
    { id: `day-${yr}` },
    { id: `day-${yr - 1}` },
    { id: `day-${yr + 1}` },
  ];
}

export default function sitemap({ id }: { id: string }): MetadataRoute.Sitemap {
  const { now, yr, mo, dy } = todayVN();

  // ── 1. Static ───────────────────────────────────────────────────────────────
  if (id === "static") {
    return [
      u("/", now, "daily", 1.0),
      u("/lich-hom-nay", now, "daily", 0.98),
      u(`/am-lich/nam/${yr}/thang/${mo}/ngay/${dy}`, now, "daily", 0.96),
      u("/am-lich-hom-nay", now, "daily", 0.94),
      u("/gio-hoang-dao", now, "daily", 0.92),
      u("/ngay-tot-xau", now, "daily", 0.92),
      u("/lich-van-nien", now, "weekly", 0.88),
    ];
  }

  // ── 2. Tools ────────────────────────────────────────────────────────────────
  if (id === "tools") {
    const ageEntries: SitemapEntry[] = [];
    for (let y = yr - 1; y >= yr - 80; y--) {
      const ref = new Date(y, 0, 1);
      const pri = y >= yr - 50 ? 0.65 : 0.50;
      ageEntries.push(u(`/tinh-tuoi-am/${y}`, ref, "yearly", pri));
      ageEntries.push(u(`/sinh-nam/${y}`, ref, "yearly", pri));
    }
    // Tết countdown
    const tetEntries: SitemapEntry[] = [];
    for (let y = yr - 1; y <= yr + 5; y++) {
      tetEntries.push(u(`/tet/${y}`, now, y === yr ? "daily" : "yearly", y === yr ? 0.80 : 0.65));
    }
    return [
      u("/chuyen-doi-lich", now, "monthly", 0.82),
      u("/tinh-tuoi-am", now, "monthly", 0.80),
      u("/dem-ngay", now, "monthly", 0.78),
      u("/lich-nghi-le", now, "monthly", 0.78),
      u("/nhac-ngay-gio", now, "monthly", 0.75),
      u("/con-bao-nhieu-ngay-den-tet", now, "daily", 0.85),
      u("/lich-am-ngay-mai", now, "daily", 0.70),
      u("/lich-am-hom-qua", now, "daily", 0.65),
      u("/ngay-tot-xau-hom-nay", now, "daily", 0.88),
      u("/gio-hoang-dao-hom-nay", now, "daily", 0.88),
      ...tetEntries,
      ...ageEntries,
    ];
  }

  // ── 3. Năm ─────────────────────────────────────────────────────────────────
  if (id === "year") {
    const entries: SitemapEntry[] = [];
    for (const y of [yr - 1, yr, yr + 1]) {
      const isCurrent = y === yr;
      const ref = new Date(y, 0, 1);
      entries.push(u(`/am-lich/nam/${y}`, isCurrent ? now : ref, isCurrent ? "monthly" : "yearly", isCurrent ? 0.90 : 0.72));
      entries.push(u(`/lich-nghi-le/${y}`, isCurrent ? now : ref, isCurrent ? "monthly" : "yearly", isCurrent ? 0.80 : 0.62));
    }
    return entries;
  }

  // ── 3. Tháng theo năm ──────────────────────────────────────────────────────
  const monthMatch = id.match(/^month-(\d{4})$/);
  if (monthMatch) {
    const targetYear = Number(monthMatch[1]);
    const entries: SitemapEntry[] = [];
    for (let m = 1; m <= 12; m++) {
      const isCurrent = targetYear === yr && m === mo;
      const ref = new Date(targetYear, m - 1, 1);
      entries.push(u(
        `/am-lich/nam/${targetYear}/thang/${m}`,
        isCurrent ? now : ref,
        isCurrent ? "daily" : "weekly",
        isCurrent ? 0.94 : targetYear === yr ? 0.82 : 0.68,
      ));
    }
    return entries;
  }

  // ── 4. Ngày theo năm (3 URL/ngày) ──────────────────────────────────────────
  const dayMatch = id.match(/^day-(\d{4})$/);
  if (dayMatch) {
    const targetYear = Number(dayMatch[1]);
    const entries: SitemapEntry[] = [];
    const isCurrentYear = targetYear === yr;

    for (let m = 1; m <= 12; m++) {
      const daysInMonth = new Date(targetYear, m, 0).getDate();
      for (let d = 1; d <= daysInMonth; d++) {
        const isToday = isCurrentYear && m === mo && d === dy;
        const lm = isToday ? now : new Date(targetYear, m - 1, d);
        const cf: SitemapEntry["changeFrequency"] = isToday ? "daily" : "weekly";

        // Priority: hôm nay cao nhất, năm hiện tại > quá khứ/tương lai
        const basePri = isToday ? 0.96 : isCurrentYear ? 0.72 : 0.58;

        entries.push(u(`/am-lich/nam/${targetYear}/thang/${m}/ngay/${d}`, lm, cf, basePri));
        entries.push(u(`/ngay-tot-xau/${targetYear}/${m}/${d}`, lm, cf, Math.max(0.45, basePri - 0.08)));
        entries.push(u(`/gio-hoang-dao/${targetYear}/${m}/${d}`, lm, cf, Math.max(0.45, basePri - 0.10)));
      }
    }
    return entries;
  }

  return [];
}
