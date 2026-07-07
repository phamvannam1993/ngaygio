import type { Metadata } from "next";
import { GoldenHourPageContent } from "@/app/gio-hoang-dao/GoldenHourPageContent";
import { formatDisplayDate, getVietnamTodayParts } from "@/lib/date";
import { getDayInfo } from "@/lib/calendar/service";
import { formatHours } from "@/lib/calendar/can-chi";
import { siteConfig, webPageSchema, faqSchema } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const today = getVietnamTodayParts();
  const day = getDayInfo(today);
  const displayDate = formatDisplayDate(today);
  const hours = formatHours(day.goodHours);
  const title = `Giờ hoàng đạo hôm nay ${displayDate} là mấy giờ? ${hours} | Ngày Giờ`;
  const description = `Giờ hoàng đạo hôm nay ${displayDate} gồm: ${hours}. Xem chi tiết giờ hoàng đạo, giờ hắc đạo, can chi từng giờ. Âm lịch ${day.lunar.day}/${day.lunar.month}, ngày ${day.canChi.day}, ${day.quality.label}.`;
  return {
    title,
    description,
    alternates: { canonical: `${siteConfig.url}/gio-hoang-dao-hom-nay` },
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}/gio-hoang-dao-hom-nay`,
      siteName: siteConfig.name,
      locale: "vi_VN",
      type: "website",
      images: [{ url: "/home.jpg", width: 1200, height: 630, alt: title }],
    },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  };
}

export default function GioHoangDaoHomNayPage() {
  const today = getVietnamTodayParts();
  const day = getDayInfo(today);
  const displayDate = formatDisplayDate(today);
  const hours = formatHours(day.goodHours);

  const jsonLd = [
    webPageSchema({
      name: `Giờ hoàng đạo hôm nay ${displayDate}`,
      url: `${siteConfig.url}/gio-hoang-dao-hom-nay`,
      description: `Xem giờ tốt xấu hôm nay ${displayDate}: giờ hoàng đạo gồm ${hours}.`,
      breadcrumb: [
        { name: "Giờ hoàng đạo", url: `${siteConfig.url}/gio-hoang-dao` },
        { name: "Giờ hoàng đạo hôm nay", url: `${siteConfig.url}/gio-hoang-dao-hom-nay` },
      ],
    }),
    faqSchema([
      { q: "Giờ tốt hôm nay là mấy giờ?", a: `Giờ tốt hôm nay ${displayDate}, tức các giờ hoàng đạo, gồm: ${hours}. Đây là các khung giờ tốt để xuất hành, khai trương, ký kết.` },
      { q: "Hôm nay ngày âm lịch mấy?", a: `Hôm nay ${displayDate} tương đương ngày ${day.lunar.day}/${day.lunar.month}/${day.lunar.year} âm lịch, ngày ${day.canChi.day}.` },
    ]),
  ];

  return (
    <>
      <GoldenHourPageContent selectedDate={today} isHomNay />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
