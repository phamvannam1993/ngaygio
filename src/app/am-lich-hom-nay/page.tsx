import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { QuickTools } from "@/components/QuickTools";
import { AmLichDayDetails, AmLichDayHero, MonthCalendarForAmLich } from "@/components/AmLichBlocks";
import { addDays, formatDisplayDate, getVietnamTodayParts } from "@/lib/date";
import { getDayInfo, getMonthCalendar } from "@/lib/calendar/service";
import { amLichDayHref } from "@/lib/calendar/urls";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const today = getVietnamTodayParts();
  const day = getDayInfo(today);
  const displayDate = formatDisplayDate(today);
  const title = `Âm lịch hôm nay ${displayDate} mùng mấy? | Ngày Giờ`;
  const description = `Âm lịch hôm nay ${displayDate} là ngày ${day.lunar.day}/${day.lunar.month}/${day.lunar.year}, ngày ${day.canChi.day}, tháng ${day.canChi.month}, năm ${day.canChi.year}. Xem giờ hoàng đạo hôm nay.`;

  return {
    title,
    description,
    alternates: { canonical: `${siteConfig.url}${amLichDayHref(today)}` },
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}/am-lich-hom-nay`,
      siteName: siteConfig.name,
      locale: "vi_VN",
      type: "website",
      images: [{ url: "/og-home.svg", width: 1200, height: 630, alt: "Âm lịch hôm nay" }],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
    },
  };
}

export default function AmLichHomNayPage() {
  const today = getVietnamTodayParts();
  const day = getDayInfo(today);
  const calendar = getMonthCalendar(today.year, today.month, today);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: `Âm lịch hôm nay ${formatDisplayDate(today)}`,
        url: `${siteConfig.url}/am-lich-hom-nay`,
        description: `Tra âm lịch hôm nay, ngày âm, can chi, tiết khí và giờ hoàng đạo.`,
        isPartOf: { "@type": "WebSite", name: siteConfig.name, url: siteConfig.url },
        inLanguage: "vi-VN",
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          { "@type": "Question", name: "Âm lịch hôm nay mùng mấy?", acceptedAnswer: { "@type": "Answer", text: `Hôm nay là ngày ${day.lunar.day}/${day.lunar.month}/${day.lunar.year}${day.lunar.isLeap ? " nhuận" : ""} âm lịch.` } },
          { "@type": "Question", name: "Hôm nay là ngày can chi gì?", acceptedAnswer: { "@type": "Answer", text: `Hôm nay là ngày ${day.canChi.day}, tháng ${day.canChi.month}, năm ${day.canChi.year}.` } },
        ],
      },
    ],
  };

  return (
    <>
      <Header currentYear={today.year} />
      <main className="container mainStack">
        <AmLichDayHero day={day} prevDay={addDays(today, -1)} nextDay={addDays(today, 1)} isHomNay />
        <AmLichDayDetails day={day} />
        <MonthCalendarForAmLich calendar={calendar} />
        <QuickTools />
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
