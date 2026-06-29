import type { Metadata } from "next";
import { LichHomNayClient } from "./LichHomNayClient";
import { getVietnamTodayParts, formatDisplayDate } from "@/lib/date";
import { getDayInfo, getMonthCalendar } from "@/lib/calendar/service";
import { MonthCalendar } from "@/components/MonthCalendar";
import { amLichDayHref } from "@/lib/calendar/urls";
import { getHolidayItems } from "@/lib/calendar/holidays";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const today = getVietnamTodayParts();
  const displayDate = formatDisplayDate(today);
  const d = new Date(today.year, today.month - 1, today.day);
  const start = new Date(today.year, 0, 0);
  const ordinal = Math.floor((d.getTime() - start.getTime()) / 86400000);
  const totalDays = new Date(today.year, 1, 29).getMonth() === 1 ? 366 : 365;
  const remaining = totalDays - ordinal;
  const WEEKDAY = ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"];
  const wd = WEEKDAY[d.getDay()];
  const holidays = getHolidayItems(today.year).filter(h => h.date.month === today.month && h.date.day === today.day);
  const holidayText = holidays.length ? ` Hôm nay là ${holidays.map(h => h.title).join(", ")}.` : "";

  const title = `Hôm nay thứ mấy, ngày mấy? ${wd} ${displayDate} | Ngày Giờ`;
  const description = `Hôm nay là ${wd}, ngày ${displayDate} dương lịch, ngày thứ ${ordinal} trong năm ${today.year}, còn ${remaining} ngày.${holidayText} Xem lịch âm, ngày tốt xấu và giờ hoàng đạo hôm nay.`;

  return {
    title,
    description,
    keywords: ["hôm nay thứ mấy", "hôm nay ngày mấy", "nay là ngày gì", "bữa nay thứ mấy", "hôm nay thứ mấy ngày mấy tháng mấy", "lịch hôm nay", `lịch hôm nay ${displayDate}`],
    alternates: { canonical: "/lich-hom-nay" },
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}/lich-hom-nay`,
      siteName: siteConfig.name,
      locale: "vi_VN",
      type: "website",
      images: [{ url: "/home.jpg", width: 1200, height: 630, alt: "Lịch hôm nay" }],
    },
  };
}

export default function LichHomNayPage() {
  const today = getVietnamTodayParts();
  const day = getDayInfo(today);
  const holidays = getHolidayItems(today.year);
  const monthCalendar = getMonthCalendar(today.year, today.month, today);
  return (
    <LichHomNayClient
      today={today}
      day={day}
      allHolidays={holidays}
      calendarSlot={<MonthCalendar calendar={monthCalendar} makeHref={amLichDayHref} />}
    />
  );
}
