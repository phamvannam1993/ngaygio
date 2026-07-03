import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { ACTIVITIES } from "@/lib/calendar/activity";
import { fortuneHref, ZODIAC_FORTUNES } from "@/lib/calendar/fortune";

const BASE = siteConfig.url.replace(/\/+$/, "");
const VN_TIMEZONE = "Asia/Ho_Chi_Minh";

type SitemapEntry = MetadataRoute.Sitemap[number];
type ChangeFrequency = SitemapEntry["changeFrequency"];

export const dynamic = "force-dynamic";

/**
 * Đổi giá trị này mỗi khi bạn cập nhật nội dung/cấu trúc site thật sự.
 * Có thể set env:
 * SITE_CONTENT_LASTMOD=2026-07-02T16:15:19.000Z
 */
const FALLBACK_SITE_CONTENT_LASTMOD = "2026-07-02T16:15:19.000Z";

function getSiteContentLastmod(now: Date): Date {
  const raw =
    process.env.SITE_CONTENT_LASTMOD ||
    process.env.NEXT_PUBLIC_SITE_CONTENT_LASTMOD ||
    FALLBACK_SITE_CONTENT_LASTMOD;

  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? now : date;
}

function todayVN(): { now: Date; yr: number; mo: number; dy: number } {
  const now = new Date();

  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: VN_TIMEZONE,
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(now);

  const map = Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  );

  return {
    now,
    yr: Number(map.year),
    mo: Number(map.month),
    dy: Number(map.day),
  };
}

function normalizeUrl(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) {
    return pathOrUrl;
  }

  if (pathOrUrl === "/") {
    return `${BASE}/`;
  }

  const path = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return `${BASE}${path}`;
}

function clampPriority(priority: number): number {
  return Math.min(1, Math.max(0, Number(priority.toFixed(2))));
}

function u(
  pathOrUrl: string,
  lastmod: Date,
  changeFrequency: ChangeFrequency,
  priority: number,
): SitemapEntry {
  return {
    url: normalizeUrl(pathOrUrl),
    lastModified: lastmod,
    changeFrequency,
    priority: clampPriority(priority),
  };
}

function unique(entries: SitemapEntry[]): SitemapEntry[] {
  const seen = new Set<string>();

  return entries.filter((entry) => {
    if (seen.has(entry.url)) return false;
    seen.add(entry.url);
    return true;
  });
}

function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

function resolveTetFocusYear(yr: number, mo: number): number {
  /**
   * Sau tháng 2 thường nên tập trung SEO Tết năm sau.
   * Nếu muốn chuẩn tuyệt đối theo âm lịch, có thể thay bằng logic lịch âm của bạn.
   */
  return mo <= 2 ? yr : yr + 1;
}

// ── Sitemap IDs ───────────────────────────────────────────────────────────────
// Với file app/sitemap.ts, Next.js tạo các sitemap con dạng /sitemap/[id].xml
export async function generateSitemaps(): Promise<Array<{ id: string }>> {
  const { yr } = todayVN();

  const monthYears = [yr - 1, yr, yr + 1, yr + 2, yr + 3, yr + 4];
  const dayYears = [yr - 1, yr, yr + 1];

  return [
    { id: "static" },
    { id: "tools" },
    { id: "holidays" },
    { id: "year" },
    ...monthYears.map((year) => ({ id: `month-${year}` })),
    ...dayYears.map((year) => ({ id: `day-${year}` })),
  ];
}

export default async function sitemap(props: {
  id: string | Promise<string>;
}): Promise<MetadataRoute.Sitemap> {
  const id = await props.id;

  const { now, yr, mo, dy } = todayVN();
  const siteLastmod = getSiteContentLastmod(now);
  const tetFocusYear = resolveTetFocusYear(yr, mo);

  // ── 1. Static / Landing pages ──────────────────────────────────────────────
  if (id === "static") {
    return unique([
      u("/", now, "daily", 1.0),
      u("/lich-hom-nay", now, "daily", 0.98),
      u(`/am-lich/nam/${yr}/thang/${mo}/ngay/${dy}`, now, "daily", 0.96),
      u("/am-lich-hom-nay", now, "daily", 0.94),
      u("/gio-hoang-dao", now, "daily", 0.92),
      u("/ngay-tot-xau", now, "daily", 0.92),
      u("/xem-ngay-tot", now, "daily", 0.93),
      u("/xem-ngay-tot-theo-tuoi", now, "daily", 0.9),
      u("/tu-vi-hom-nay", now, "daily", 0.91),
      u("/tu-vi-12-con-giap", now, "daily", 0.84),
      u("/lich-van-nien", siteLastmod, "weekly", 0.88),
    ]);
  }

  // ── 2. Tools / Feature pages ───────────────────────────────────────────────
  if (id === "tools") {
    const ageEntries: SitemapEntry[] = [];

    /**
     * Bao phủ từ năm hiện tại về 100 năm trước.
     * Quan trọng: lastModified dùng ngày cập nhật nội dung site,
     * không dùng Date.UTC(y, 0, 1) vì đó là năm sinh, không phải ngày sửa trang.
     */
    for (let y = yr; y >= yr - 100; y--) {
      const pri = y >= yr - 50 ? 0.65 : 0.5;

      ageEntries.push(u(`/tinh-tuoi-am/${y}`, siteLastmod, "yearly", pri));
      ageEntries.push(u(`/sinh-nam/${y}`, siteLastmod, "yearly", pri));
    }

    const tetEntries: SitemapEntry[] = [];
    const houseYearEntries: SitemapEntry[] = [];
    const downloadYearEntries: SitemapEntry[] = [];

    for (let y = yr - 1; y <= yr + 5; y++) {
      const isFocusTet = y === tetFocusYear;
      const lm = isFocusTet ? now : siteLastmod;
      const cf: ChangeFrequency = isFocusTet ? "daily" : "yearly";
      const isCurrentOrFuture = y >= yr;

      tetEntries.push(u(`/tet/${y}`, lm, cf, isFocusTet ? 0.82 : 0.65));
      tetEntries.push(u(`/giao-thua/${y}`, lm, cf, isFocusTet ? 0.72 : 0.62));
      tetEntries.push(u(`/ong-cong-ong-tao/${y}`, lm, cf, isFocusTet ? 0.7 : 0.62));
      tetEntries.push(u(`/ram-thang-chap/${y}`, lm, cf, isFocusTet ? 0.68 : 0.6));
      tetEntries.push(u(`/lich-nghi-tet/${y}`, lm, cf, isFocusTet ? 0.74 : 0.65));

      houseYearEntries.push(u(`/tuoi-lam-nha/${y}`, isCurrentOrFuture ? now : siteLastmod, isCurrentOrFuture ? "weekly" : "yearly", isCurrentOrFuture ? 0.78 : 0.62));
      downloadYearEntries.push(u(`/tai-lich-am/${y}`, isCurrentOrFuture ? now : siteLastmod, isCurrentOrFuture ? "monthly" : "yearly", isCurrentOrFuture ? 0.76 : 0.6));
    }

    return unique([
      u("/chuyen-doi-lich", siteLastmod, "monthly", 0.82),
      u("/tinh-tuoi-am", siteLastmod, "monthly", 0.8),
      u("/dem-ngay", siteLastmod, "monthly", 0.78),
      u("/lich-nghi-le", siteLastmod, "monthly", 0.78),
      u("/nhac-ngay-gio", siteLastmod, "monthly", 0.8),
      u("/tao-anh-lich", siteLastmod, "weekly", 0.78),
      u("/tai-lich-am-pdf", siteLastmod, "weekly", 0.78),
      u("/dem-ngay-su-kien", now, "daily", 0.8),
      u("/widget", siteLastmod, "monthly", 0.72),
      u("/api-lich-am", siteLastmod, "monthly", 0.74),

      ...ACTIVITIES.map((activity) =>
        u(`/xem-ngay-tot-${activity.slug}`, now, "daily", 0.82),
      ),

      ...ZODIAC_FORTUNES.map((item) =>
        u(fortuneHref(item.slug), now, "daily", 0.82),
      ),

      u("/lap-la-so-tu-vi", siteLastmod, "monthly", 0.86),
      u("/xem-tuoi-hop", siteLastmod, "weekly", 0.84),
      u("/xem-tuoi-hop-lam-an", siteLastmod, "weekly", 0.84),
      u("/xem-tuoi-vo-chong", siteLastmod, "weekly", 0.84),
      u("/xem-tuoi-sinh-con", siteLastmod, "weekly", 0.82),
      u("/xem-tuoi-lam-nha", siteLastmod, "weekly", 0.84),
      u("/xem-tuoi-hop-mau-gi", siteLastmod, "weekly", 0.8),
      u("/xem-tuoi-hop-huong-nao", siteLastmod, "weekly", 0.8),
      u("/phong-thuy-theo-tuoi", siteLastmod, "weekly", 0.8),

      u("/con-bao-nhieu-ngay-den-tet", now, "daily", 0.85),
      u("/lich-am-ngay-mai", now, "daily", 0.7),
      u("/lich-am-hom-qua", now, "daily", 0.65),
      u("/ngay-tot-xau-hom-nay", now, "daily", 0.88),
      u("/gio-hoang-dao-hom-nay", now, "daily", 0.88),

      ...tetEntries,
      ...houseYearEntries,
      ...downloadYearEntries,
      ...ageEntries,
    ]);
  }

  // ── 3. Ngày lễ ─────────────────────────────────────────────────────────────
  if (id === "holidays") {
    const holidayEntries: SitemapEntry[] = [
      u("/trung-thu", siteLastmod, "yearly", 0.72),
      u("/vu-lan", siteLastmod, "yearly", 0.7),
      u("/gio-to-hung-vuong", siteLastmod, "yearly", 0.7),
      u("/ngay-30-4", siteLastmod, "yearly", 0.7),
      u("/quoc-khanh-2-9", siteLastmod, "yearly", 0.7),
    ];

    for (let y = yr - 1; y <= yr + 2; y++) {
      const isCurrentOrFuture = y >= yr;
      const lm = isCurrentOrFuture ? now : siteLastmod;
      const cf: ChangeFrequency = isCurrentOrFuture ? "weekly" : "yearly";

      holidayEntries.push(u(`/trung-thu/${y}`, lm, cf, y === yr ? 0.66 : 0.62));
      holidayEntries.push(u(`/vu-lan/${y}`, lm, cf, y === yr ? 0.64 : 0.6));
      holidayEntries.push(u(`/gio-to-hung-vuong/${y}`, lm, cf, y === yr ? 0.64 : 0.6));
      holidayEntries.push(u(`/ngay-30-4/${y}`, lm, cf, y === yr ? 0.64 : 0.6));
      holidayEntries.push(u(`/quoc-khanh-2-9/${y}`, lm, cf, y === yr ? 0.64 : 0.6));
    }

    return unique(holidayEntries);
  }

  // ── 4. Năm ─────────────────────────────────────────────────────────────────
  if (id === "year") {
    const entries: SitemapEntry[] = [];

    for (const y of [yr - 1, yr, yr + 1]) {
      const isCurrent = y === yr;
      const lm = isCurrent ? now : siteLastmod;
      const cf: ChangeFrequency = isCurrent ? "monthly" : "yearly";

      entries.push(u(`/am-lich/nam/${y}`, lm, cf, isCurrent ? 0.9 : 0.72));
      entries.push(u(`/lich-nghi-le/${y}`, lm, cf, isCurrent ? 0.8 : 0.62));
    }

    return unique(entries);
  }

  // ── 5. Tháng theo năm ──────────────────────────────────────────────────────
  const monthMatch = id.match(/^month-(\d{4})$/);

  if (monthMatch) {
    const targetYear = Number(monthMatch[1]);
    const entries: SitemapEntry[] = [];

    for (let m = 1; m <= 12; m++) {
      const isCurrentMonth = targetYear === yr && m === mo;
      const lm = isCurrentMonth ? now : siteLastmod;
      const cf: ChangeFrequency = isCurrentMonth ? "daily" : targetYear === yr ? "weekly" : "yearly";

      const pri = isCurrentMonth
        ? 0.94
        : targetYear === yr
          ? 0.82
          : 0.68;

      entries.push(u(`/am-lich/nam/${targetYear}/thang/${m}`, lm, cf, pri));
    }

    return unique(entries);
  }

  // ── 6. Ngày theo năm ───────────────────────────────────────────────────────
  const dayMatch = id.match(/^day-(\d{4})$/);

  if (dayMatch) {
    const targetYear = Number(dayMatch[1]);
    const entries: SitemapEntry[] = [];

    for (let m = 1; m <= 12; m++) {
      const totalDays = daysInMonth(targetYear, m);

      for (let d = 1; d <= totalDays; d++) {
        const isToday = targetYear === yr && m === mo && d === dy;
        const isCurrentYear = targetYear === yr;

        const lm = isToday ? now : siteLastmod;
        const cf: ChangeFrequency = isToday
          ? "daily"
          : isCurrentYear
            ? "weekly"
            : "yearly";

        const basePri = isToday ? 0.96 : isCurrentYear ? 0.72 : 0.58;

        entries.push(
          u(`/am-lich/nam/${targetYear}/thang/${m}/ngay/${d}`, lm, cf, basePri),
        );

        entries.push(
          u(
            `/ngay-tot-xau/${targetYear}/${m}/${d}`,
            lm,
            cf,
            Math.max(0.45, basePri - 0.08),
          ),
        );

        entries.push(
          u(
            `/gio-hoang-dao/${targetYear}/${m}/${d}`,
            lm,
            cf,
            Math.max(0.45, basePri - 0.1),
          ),
        );
      }
    }

    return unique(entries);
  }

  return [];
}
