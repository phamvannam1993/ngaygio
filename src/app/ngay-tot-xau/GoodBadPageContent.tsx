import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { DayGoodBadDesign } from "@/components/DayGoodBadDesign";
import { type DateParts } from "@/lib/date";
import { getGoodBadDetails } from "@/lib/calendar/good-bad";
import { getDayInfo, getMonthCalendar } from "@/lib/calendar/service";
import { siteConfig } from "@/lib/site";

export function goodBadDateHref(date: DateParts): string {
  return `/ngay-tot-xau/${date.year}/${date.month}/${date.day}`;
}

export function buildGoodBadJsonLd(dayInfo: ReturnType<typeof getDayInfo>, details: ReturnType<typeof getGoodBadDetails>) {
  const pageUrl = `${siteConfig.url}${goodBadDateHref(dayInfo.solar)}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: `Ngày ${dayInfo.solar.day}/${dayInfo.solar.month}/${dayInfo.solar.year} tốt hay xấu?`,
        url: pageUrl,
        description: `${details.overallLabel}: ngày ${dayInfo.canChi.day}, tháng ${dayInfo.canChi.month}, năm ${dayInfo.canChi.year}.`,
        isPartOf: { "@type": "WebSite", name: siteConfig.name, url: siteConfig.url },
        inLanguage: "vi-VN",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Lịch âm", item: siteConfig.url },
          { "@type": "ListItem", position: 2, name: "Ngày tốt xấu", item: `${siteConfig.url}/ngay-tot-xau` },
          { "@type": "ListItem", position: 3, name: `Ngày ${dayInfo.solar.day}/${dayInfo.solar.month}/${dayInfo.solar.year}`, item: pageUrl },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: `Ngày ${dayInfo.solar.day}/${dayInfo.solar.month}/${dayInfo.solar.year} tốt hay xấu?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: details.overallSummary,
            },
          },
          {
            "@type": "Question",
            name: "Ngày này có giờ hoàng đạo nào?",
            acceptedAnswer: {
              "@type": "Answer",
              text: dayInfo.goodHours.map((hour) => `${hour.branch} ${hour.range}`).join(", "),
            },
          },
          {
            "@type": "Question",
            name: "Ngày này nên làm gì?",
            acceptedAnswer: {
              "@type": "Answer",
              text: details.shouldDo.join(", "),
            },
          },
        ],
      },
    ],
  };
}

export function GoodBadPageContent({ selectedDate, isHomNay, isNgayMai }: { selectedDate: DateParts; isHomNay?: boolean; isNgayMai?: boolean }) {
  const dayInfo = getDayInfo(selectedDate);
  const details = getGoodBadDetails(dayInfo);
  const monthCalendar = getMonthCalendar(selectedDate.year, selectedDate.month, selectedDate);
  const jsonLd = buildGoodBadJsonLd(dayInfo, details);

  return (
    <>
      <Header currentYear={selectedDate.year} />
      <div className="dayGoodBadShell">
        <DayGoodBadDesign day={dayInfo} details={details} calendar={monthCalendar} isHomNay={isHomNay} isNgayMai={isNgayMai} />
      </div>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
