import { type NextRequest, NextResponse } from "next/server";
import { getDayInfo } from "@/lib/calendar/service";
import { getTetInfo } from "@/lib/calendar/tet";
import { formatHours } from "@/lib/calendar/can-chi";
import { getVietnamTodayParts, formatDisplayDate } from "@/lib/date";
import type { DateParts } from "@/lib/date";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-dynamic";

function parseDate(raw: string | null): DateParts | null {
  if (!raw) return null;
  const m = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return null;
  const [, y, mo, d] = m.map(Number);
  if (mo < 1 || mo > 12 || d < 1 || d > 31) return null;
  return { year: y, month: mo, day: d };
}

export function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const dateParam = searchParams.get("date");
  const format = searchParams.get("format") ?? "json";

  const solar = parseDate(dateParam) ?? getVietnamTodayParts();
  const day = getDayInfo(solar);
  const today = getVietnamTodayParts();
  const tet = getTetInfo(today);

  const data = {
    date: `${solar.year}-${String(solar.month).padStart(2, "0")}-${String(solar.day).padStart(2, "0")}`,
    solarDate: formatDisplayDate(solar),
    weekday: day.weekdayName,
    lunar: {
      day: day.lunar.day,
      month: day.lunar.month,
      year: day.lunar.year,
      isLeap: day.lunar.isLeap,
    },
    canChi: {
      day: day.canChi.day,
      month: day.canChi.month,
      year: day.canChi.year,
    },
    quality: {
      label: day.quality.label,
      note: day.quality.note,
    },
    goodHours: day.goodHours,
    goodHoursText: formatHours(day.goodHours),
    solarTerm: day.solarTerm,
    tetDaysLeft: tet.daysLeft,
    tetYear: tet.year,
    tetCanChi: tet.canChi,
    tetSolarDate: formatDisplayDate(tet.solarDate),
    source: siteConfig.url,
    updatedAt: new Date().toISOString(),
  };

  if (format === "ics") {
    const d = solar;
    const dStr = `${d.year}${String(d.month).padStart(2, "0")}${String(d.day).padStart(2, "0")}`;
    const stamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,");
    const summary = `${data.solarDate} – Âm ${day.lunar.day}/${day.lunar.month}/${day.lunar.year} – ${day.quality.label}`;
    const desc = `Ngày ${day.canChi.day}, tháng ${day.canChi.month}, năm ${day.canChi.year}. Giờ hoàng đạo: ${data.goodHoursText}.`;
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//ngaygio.vn//API//VI",
      "BEGIN:VEVENT",
      `UID:${dStr}@ngaygio.vn`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${dStr}`,
      `DTEND;VALUE=DATE:${dStr}`,
      `SUMMARY:${esc(summary)}`,
      `DESCRIPTION:${esc(desc)}`,
      `URL:${siteConfig.url}/am-lich/nam/${d.year}/thang/${d.month}/ngay/${d.day}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    return new NextResponse(ics, {
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": `attachment; filename="lich-am-${data.date}.ics"`,
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=3600",
      },
    });
  }

  return NextResponse.json(data, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
