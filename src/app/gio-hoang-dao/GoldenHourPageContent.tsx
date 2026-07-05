import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { GoldenHourDesign } from "@/components/GoldenHourDesign";
import { gioHoangDaoDayHref } from "@/lib/calendar/urls";
import { CHI, formatHours } from "@/lib/calendar/can-chi";
import { getDayInfo, getMonthCalendar } from "@/lib/calendar/service";
import type { DateParts } from "@/lib/date";
import { formatDisplayDate } from "@/lib/date";
import { siteConfig } from "@/lib/site";

export function GoldenHourPageContent({ selectedDate, isHomNay, isNgayMai }: { selectedDate: DateParts; isHomNay?: boolean; isNgayMai?: boolean }) {
  const day = getDayInfo(selectedDate);
  const calendar = getMonthCalendar(selectedDate.year, selectedDate.month, selectedDate);
  const sortedHours = [...day.goodHours, ...day.badHours].sort((a, b) => CHI.indexOf(a.branch) - CHI.indexOf(b.branch));
  const displayDate = formatDisplayDate(selectedDate);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: `Giờ hoàng đạo ngày ${displayDate}`,
        url: `${siteConfig.url}${gioHoangDaoDayHref(selectedDate)}`,
        description: `Giờ hoàng đạo ngày ${displayDate}: ${formatHours(day.goodHours)}.`,
        isPartOf: { "@type": "WebSite", name: siteConfig.name, url: siteConfig.url },
        inLanguage: "vi-VN",
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          { "@type": "Question", name: `Giờ hoàng đạo ngày ${displayDate} gồm giờ nào?`, acceptedAnswer: { "@type": "Answer", text: formatHours(day.goodHours) } },
          { "@type": "Question", name: `Giờ hắc đạo ngày ${displayDate} gồm giờ nào?`, acceptedAnswer: { "@type": "Answer", text: formatHours(day.badHours) } },
          { "@type": "Question", name: `Ngày ${displayDate} là ngày can chi gì?`, acceptedAnswer: { "@type": "Answer", text: `Ngày ${day.canChi.day}, tháng ${day.canChi.month}, năm ${day.canChi.year}.` } },
        ],
      },
      {
        "@type": "ItemList",
        name: `12 khung giờ ngày ${displayDate}`,
        itemListElement: sortedHours.map((hour, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: `Giờ ${hour.branch} ${hour.range}`,
          description: hour.isGood ? "Giờ hoàng đạo" : "Giờ hắc đạo",
        })),
      },
    ],
  };

  return (
    <>
      <Header currentYear={selectedDate.year} />
      <div className="dayGoodBadShell goldenDayShell">
        <GoldenHourDesign day={day} calendar={calendar} isHomNay={isHomNay} isNgayMai={isNgayMai} />
      </div>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
