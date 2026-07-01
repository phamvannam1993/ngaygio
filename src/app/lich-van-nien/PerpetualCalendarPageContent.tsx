import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MonthCalendar } from "@/components/MonthCalendar";
import { PerpetualCalendarSearch } from "@/components/PerpetualCalendarSearch";
import { PageHeroBanner } from "@/components/PageHeroBanner";
import {
  lichVanNienHref,
  PerpetualCalendarArticle,
  PerpetualDayPanel,
  PerpetualYearOverview,
  SelectedMonthSummary,
} from "@/components/PerpetualCalendarBlocks";
import { type DateParts } from "@/lib/date";
import { getPerpetualCalendarData } from "@/lib/calendar/perpetual";
import { siteConfig } from "@/lib/site";

export function buildLichVanNienJsonLd(data: ReturnType<typeof getPerpetualCalendarData>) {
  const pageUrl = `${siteConfig.url}${lichVanNienHref(data.selectedDate)}`;
  const day = data.selectedDay;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: `Lịch vạn niên ngày ${day.solar.day}/${day.solar.month}/${day.solar.year}`,
        url: pageUrl,
        description: `Tra lịch ngày ${day.solar.day}/${day.solar.month}/${day.solar.year}: âm lịch ${day.lunar.day}/${day.lunar.month}/${day.lunar.year}, ngày ${day.canChi.day}, giờ hoàng đạo và lịch tháng.`,
        isPartOf: { "@type": "WebSite", name: siteConfig.name, url: siteConfig.url },
        inLanguage: "vi-VN",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Lịch âm", item: siteConfig.url },
          { "@type": "ListItem", position: 2, name: "Lịch vạn niên", item: `${siteConfig.url}/lich-van-nien` },
          { "@type": "ListItem", position: 3, name: `Năm ${day.solar.year}`, item: `${siteConfig.url}/lich-van-nien/${day.solar.year}` },
          { "@type": "ListItem", position: 4, name: `Tháng ${day.solar.month}`, item: `${siteConfig.url}/lich-van-nien/${day.solar.year}/${day.solar.month}` },
          { "@type": "ListItem", position: 5, name: `Ngày ${day.solar.day}`, item: pageUrl },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: `Ngày ${day.solar.day}/${day.solar.month}/${day.solar.year} là ngày bao nhiêu âm lịch?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `Ngày ${day.solar.day}/${day.solar.month}/${day.solar.year} dương lịch là ngày ${day.lunar.day}/${day.lunar.month}/${day.lunar.year}${day.lunar.isLeap ? " nhuận" : ""} âm lịch.`,
            },
          },
          {
            "@type": "Question",
            name: `Lịch vạn niên năm ${day.solar.year} có bao nhiêu ngày?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `Năm ${day.solar.year} có ${data.yearSummary.totalDays} ngày dương lịch, gồm ${data.yearSummary.goodDays} ngày Hoàng Đạo và ${data.yearSummary.badDays} ngày Hắc Đạo theo bảng tham khảo hiện tại.`,
            },
          },
        ],
      },
    ],
  };
}

export function PerpetualCalendarPageContent({ selectedDate }: { selectedDate: DateParts }) {
  const data = getPerpetualCalendarData(selectedDate);
  const jsonLd = buildLichVanNienJsonLd(data);

  return (
    <>
      <Header currentYear={selectedDate.year} />
      <main className="container mainStack">
        <PageHeroBanner
          eyebrow="Lịch vạn niên"
          title="Tra cứu lịch vạn niên đẹp, rõ, tiện dùng"
          description="Xem ngày âm dương, can chi, tiết khí và lịch tháng theo năm với phần trình bày trực quan hơn, phù hợp cả desktop lẫn mobile."
          imageSrc="/bg-page-perpetual.png"
        />
        <PerpetualCalendarSearch defaultDate={selectedDate} />
        <PerpetualDayPanel day={data.selectedDay} prevDay={data.prevDay} nextDay={data.nextDay} />
        <PerpetualYearOverview summary={data.yearSummary} selectedMonth={selectedDate.month} />
        <SelectedMonthSummary calendar={data.selectedMonth} />
        <MonthCalendar calendar={data.selectedMonth} makeHref={lichVanNienHref} />
        <PerpetualCalendarArticle />
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}