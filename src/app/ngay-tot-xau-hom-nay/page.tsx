import type { Metadata } from "next";
import { GoodBadPageContent } from "@/app/ngay-tot-xau/GoodBadPageContent";
import { formatDisplayDate, getVietnamTodayParts } from "@/lib/date";
import { getDayInfo } from "@/lib/calendar/service";
import { getGoodBadDetails } from "@/lib/calendar/good-bad";
import { siteConfig, webPageSchema, faqSchema } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const today = getVietnamTodayParts();
  const day = getDayInfo(today);
  const details = getGoodBadDetails(day);
  const displayDate = formatDisplayDate(today);
  const title = `Ngày tốt xấu hôm nay ${displayDate} – Ngày đẹp hôm nay? | Ngày Giờ`;
  const description = `Xem ngày tốt xấu hôm nay ${displayDate}: hôm nay là ${details.overallLabel}. ${details.overallSummary} Tra ngày đẹp hôm nay, giờ hoàng đạo, can chi và lịch âm.`;
  return {
    title,
    description,
    alternates: { canonical: `${siteConfig.url}/ngay-tot-xau-hom-nay` },
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}/ngay-tot-xau-hom-nay`,
      siteName: siteConfig.name,
      locale: "vi_VN",
      type: "website",
      images: [{ url: "/home.jpg", width: 1200, height: 630, alt: title }],
    },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  };
}

export default function NgayTotXauHomNayPage() {
  const today = getVietnamTodayParts();
  const day = getDayInfo(today);
  const details = getGoodBadDetails(day);
  const displayDate = formatDisplayDate(today);

  const jsonLd = [
    webPageSchema({
      name: `Ngày tốt xấu hôm nay ${displayDate}`,
      url: `${siteConfig.url}/ngay-tot-xau-hom-nay`,
      description: `Hôm nay ${displayDate} là ${details.overallLabel}. Xem chi tiết ngày tốt xấu theo âm lịch.`,
      breadcrumb: [
        { name: "Ngày tốt xấu", url: `${siteConfig.url}/ngay-tot-xau` },
        { name: `Ngày tốt xấu hôm nay`, url: `${siteConfig.url}/ngay-tot-xau-hom-nay` },
      ],
    }),
    faqSchema([
      { q: "Hôm nay là ngày tốt hay ngày xấu?", a: `Hôm nay ${displayDate} là ${details.overallLabel}. ${details.overallSummary}` },
      { q: "Ngày hoàng đạo hôm nay là ngày mấy âm?", a: `Hôm nay dương lịch ${displayDate} tương đương ngày ${day.lunar.day}/${day.lunar.month}/${day.lunar.year} âm lịch, ngày ${day.canChi.day}.` },
    ]),
  ];

  return (
    <>
      <GoodBadPageContent selectedDate={today} isHomNay />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
