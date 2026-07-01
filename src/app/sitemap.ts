import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { ACTIVITIES } from "@/lib/calendar/activity";
import { fortuneHref, ZODIAC_FORTUNES } from "@/lib/calendar/fortune";

const BASE = siteConfig.url;
type SitemapEntry = MetadataRoute.Sitemap[number];

export const dynamic = "force-dynamic";

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
    { id: "holidays" },
    { id: "year" },
    { id: `month-${yr}` },
    { id: `month-${yr - 1}` },
    { id: `month-${yr + 1}` },
    { id: `month-${yr + 2}` },
    { id: `month-${yr + 3}` },
    { id: `month-${yr + 4}` },
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
      u("/xem-ngay-tot", now, "daily", 0.93),
      u("/xem-ngay-tot-theo-tuoi", now, "daily", 0.90),
      u("/tu-vi-hom-nay", now, "daily", 0.91),
      u("/tu-vi-12-con-giap", now, "daily", 0.84),
      u("/lap-la-so-tu-vi", now, "monthly", 0.86),
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
    // Tết countdown + cluster pages
    const tetEntries: SitemapEntry[] = [];
    for (let y = yr - 1; y <= yr + 5; y++) {
      const ref = new Date(y, 0, 1);
      const isCurr = y === yr;
      tetEntries.push(u(`/tet/${y}`, isCurr ? now : ref, isCurr ? "daily" : "yearly", isCurr ? 0.80 : 0.65));
      tetEntries.push(u(`/giao-thua/${y}`, ref, "yearly", 0.62));
      tetEntries.push(u(`/ong-cong-ong-tao/${y}`, ref, "yearly", 0.62));
      tetEntries.push(u(`/ram-thang-chap/${y}`, ref, "yearly", 0.60));
      tetEntries.push(u(`/lich-nghi-tet/${y}`, ref, "yearly", 0.65));
    }
    return [
      u("/chuyen-doi-lich", now, "monthly", 0.82),
      u("/tinh-tuoi-am", now, "monthly", 0.80),
      u("/dem-ngay", now, "monthly", 0.78),
      u("/lich-nghi-le", now, "monthly", 0.78),
      u("/nhac-ngay-gio", now, "monthly", 0.80),
      u("/tao-anh-lich", now, "weekly", 0.78),
      u("/tai-lich-am-pdf", now, "weekly", 0.78),
      u("/dem-ngay-su-kien", now, "daily", 0.80),
      u("/widget", now, "monthly", 0.72),
      ...ACTIVITIES.map((activity) => u(`/xem-ngay-tot/${activity.slug}`, now, "daily", 0.82)),
      ...ACTIVITIES.map((activity) => u(`/xem-ngay-tot-${activity.slug}`, now, "daily", 0.76)),
      ...ZODIAC_FORTUNES.map((item) => u(fortuneHref(item.slug), now, "daily", 0.82)),
      u("/con-bao-nhieu-ngay-den-tet", now, "daily", 0.85),
      u("/lich-am-ngay-mai", now, "daily", 0.70),
      u("/lich-am-hom-qua", now, "daily", 0.65),
      u("/ngay-tot-xau-hom-nay", now, "daily", 0.88),
      u("/gio-hoang-dao-hom-nay", now, "daily", 0.88),
      ...tetEntries,
      ...ageEntries,
    ];
  }

  // ── 3. Ngày lễ ─────────────────────────────────────────────────────────────
  if (id === "holidays") {
    const holidayEntries: SitemapEntry[] = [
      u("/trung-thu", now, "yearly", 0.72),
      u("/vu-lan", now, "yearly", 0.70),
      u("/gio-to-hung-vuong", now, "yearly", 0.70),
      u("/ngay-30-4", now, "yearly", 0.70),
      u("/quoc-khanh-2-9", now, "yearly", 0.70),
    ];
    // Yearly holiday landing per year
    for (let y = yr - 1; y <= yr + 2; y++) {
      const ref = new Date(y, 0, 1);
      holidayEntries.push(u(`/trung-thu/${y}`, ref, "yearly", 0.62));
      holidayEntries.push(u(`/vu-lan/${y}`, ref, "yearly", 0.60));
      holidayEntries.push(u(`/gio-to-hung-vuong/${y}`, ref, "yearly", 0.60));
      holidayEntries.push(u(`/ngay-30-4/${y}`, ref, "yearly", 0.60));
      holidayEntries.push(u(`/quoc-khanh-2-9/${y}`, ref, "yearly", 0.60));
    }
    return holidayEntries;
  }

  // ── 4. Năm ─────────────────────────────────────────────────────────────────
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
