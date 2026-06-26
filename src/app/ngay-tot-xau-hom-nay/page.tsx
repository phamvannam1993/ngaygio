import type { Metadata } from "next";
import { GoodBadPageContent, goodBadDateHref } from "@/app/ngay-tot-xau/GoodBadPageContent";
import { formatDisplayDate, getVietnamTodayParts } from "@/lib/date";
import { getDayInfo } from "@/lib/calendar/service";
import { siteConfig, webPageSchema, faqSchema } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const today = getVietnamTodayParts();
  const day = getDayInfo(today);
  const displayDate = formatDisplayDate(today);
  const title = `Ngày tốt xấu hôm nay ${displayDate} – ${day.quality.label} | Ngày Giờ`;
  const description = `Hôm nay ${displayDate} là ${day.quality.label}. ${day.quality.note} Xem giờ hoàng đạo, can chi và lịch âm hôm nay.`;
  return {
    title,
    description,
    alternates: { canonical: `${siteConfig.url}${goodBadDateHref(today)}` },
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}/ngay-tot-xau-hom-nay`,
      siteName: siteConfig.name,
      locale: "vi_VN",
      type: "website",
      images: [{ url: "/og-home.svg", width: 1200, height: 630, alt: title }],
    },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  };
}

export default function NgayTotXauHomNayPage() {
  const today = getVietnamTodayParts();
  const day = getDayInfo(today);
  const displayDate = formatDisplayDate(today);

  const jsonLd = [
    webPageSchema({
      name: `Ngày tốt xấu hôm nay ${displayDate}`,
      url: `${siteConfig.url}/ngay-tot-xau-hom-nay`,
      description: `Hôm nay ${displayDate} là ${day.quality.label}. Xem chi tiết ngày tốt xấu theo âm lịch.`,
      breadcrumb: [
        { name: "Ngày tốt xấu", url: `${siteConfig.url}/ngay-tot-xau` },
        { name: `Ngày tốt xấu hôm nay`, url: `${siteConfig.url}/ngay-tot-xau-hom-nay` },
      ],
    }),
    faqSchema([
      { q: "Hôm nay là ngày tốt hay ngày xấu?", a: `Hôm nay ${displayDate} là ${day.quality.label}. ${day.quality.note}` },
      { q: "Ngày hoàng đạo hôm nay là ngày mấy âm?", a: `Hôm nay dương lịch ${displayDate} tương đương ngày ${day.lunar.day}/${day.lunar.month}/${day.lunar.year} âm lịch, ngày ${day.canChi.day}.` },
    ]),
  ];

  return (
    <>
      <GoodBadPageContent selectedDate={today} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
