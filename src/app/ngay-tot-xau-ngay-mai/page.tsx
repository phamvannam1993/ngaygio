import type { Metadata } from "next";
import { GoodBadPageContent, goodBadDateHref } from "@/app/ngay-tot-xau/GoodBadPageContent";
import { formatDisplayDate, getVietnamTodayParts, addDays } from "@/lib/date";
import { getDayInfo } from "@/lib/calendar/service";
import { siteConfig, webPageSchema, faqSchema } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const today = getVietnamTodayParts();
  const tomorrow = addDays(today, 1);
  const day = getDayInfo(tomorrow);
  const displayDate = formatDisplayDate(tomorrow);
  const title = `Ngày tốt xấu ngày mai ${displayDate} – ${day.quality.label} | Ngày Giờ`;
  const description = `Ngày mai ${displayDate} là ${day.quality.label}. ${day.quality.note} Xem giờ hoàng đạo, can chi và lịch âm ngày mai.`;
  return {
    title,
    description,
    alternates: { canonical: `${siteConfig.url}${goodBadDateHref(tomorrow)}` },
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}/ngay-tot-xau-ngay-mai`,
      siteName: siteConfig.name,
      locale: "vi_VN",
      type: "website",
    },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  };
}

export default function NgayTotXauNgayMaiPage() {
  const today = getVietnamTodayParts();
  const tomorrow = addDays(today, 1);
  const day = getDayInfo(tomorrow);
  const displayDate = formatDisplayDate(tomorrow);

  const jsonLd = [
    webPageSchema({
      name: `Ngày tốt xấu ngày mai ${displayDate}`,
      url: `${siteConfig.url}/ngay-tot-xau-ngay-mai`,
      description: `Ngày mai ${displayDate} là ${day.quality.label}. Xem chi tiết ngày tốt xấu theo âm lịch.`,
      breadcrumb: [
        { name: "Ngày tốt xấu", url: `${siteConfig.url}/ngay-tot-xau` },
        { name: "Ngày tốt xấu ngày mai", url: `${siteConfig.url}/ngay-tot-xau-ngay-mai` },
      ],
    }),
    faqSchema([
      { q: "Ngày mai là ngày tốt hay ngày xấu?", a: `Ngày mai ${displayDate} là ${day.quality.label}. ${day.quality.note}` },
      { q: "Ngày mai ngày âm lịch mấy?", a: `Ngày mai dương lịch ${displayDate} tương đương ngày ${day.lunar.day}/${day.lunar.month}/${day.lunar.year} âm lịch, ngày ${day.canChi.day}.` },
    ]),
  ];

  return (
    <>
      <GoodBadPageContent selectedDate={tomorrow} isNgayMai />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
