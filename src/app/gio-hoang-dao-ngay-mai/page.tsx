import type { Metadata } from "next";
import { GoldenHourPageContent } from "@/app/gio-hoang-dao/GoldenHourPageContent";
import { formatDisplayDate, getVietnamTodayParts, addDays } from "@/lib/date";
import { getDayInfo } from "@/lib/calendar/service";
import { formatHours } from "@/lib/calendar/can-chi";
import { gioHoangDaoDayHref } from "@/lib/calendar/urls";
import { siteConfig, webPageSchema, faqSchema } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const today = getVietnamTodayParts();
  const tomorrow = addDays(today, 1);
  const day = getDayInfo(tomorrow);
  const displayDate = formatDisplayDate(tomorrow);
  const hours = formatHours(day.goodHours);
  const title = `Giờ hoàng đạo ngày mai ${displayDate} – ${hours} | Ngày Giờ`;
  const description = `Giờ hoàng đạo ngày mai ${displayDate}: ${hours}. Âm lịch ${day.lunar.day}/${day.lunar.month}/${day.lunar.year}, ngày ${day.canChi.day}, ${day.quality.label}.`;
  return {
    title,
    description,
    alternates: { canonical: `${siteConfig.url}${gioHoangDaoDayHref(tomorrow)}` },
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}/gio-hoang-dao-ngay-mai`,
      siteName: siteConfig.name,
      locale: "vi_VN",
      type: "website",
    },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  };
}

export default function GioHoangDaoNgayMaiPage() {
  const today = getVietnamTodayParts();
  const tomorrow = addDays(today, 1);
  const day = getDayInfo(tomorrow);
  const displayDate = formatDisplayDate(tomorrow);
  const hours = formatHours(day.goodHours);

  const jsonLd = [
    webPageSchema({
      name: `Giờ hoàng đạo ngày mai ${displayDate}`,
      url: `${siteConfig.url}/gio-hoang-dao-ngay-mai`,
      description: `Giờ hoàng đạo ngày mai ${displayDate}: ${hours}.`,
      breadcrumb: [
        { name: "Giờ hoàng đạo", url: `${siteConfig.url}/gio-hoang-dao` },
        { name: "Giờ hoàng đạo ngày mai", url: `${siteConfig.url}/gio-hoang-dao-ngay-mai` },
      ],
    }),
    faqSchema([
      { q: "Giờ hoàng đạo ngày mai là mấy giờ?", a: `Giờ hoàng đạo ngày mai ${displayDate} gồm: ${hours}. Đây là các khung giờ tốt để xuất hành, khai trương, ký kết.` },
      { q: "Ngày mai ngày âm lịch mấy?", a: `Ngày mai ${displayDate} tương đương ngày ${day.lunar.day}/${day.lunar.month}/${day.lunar.year} âm lịch, ngày ${day.canChi.day}.` },
    ]),
  ];

  return (
    <>
      <GoldenHourPageContent selectedDate={tomorrow} isNgayMai />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
