import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import {
  AmLichDayDetails,
  AmLichDayHero,
  DayInternalLinks,
  AmLichMonthExtra,
  AmLichMonthHero,
  AmLichSeoArticle,
  AmLichYearCalendars,
  AmLichYearHero,
  AmLichYearMonthLinks,
  MonthCalendarForAmLich,
  RelatedYears,
  SameSolarDateAcrossYears,
  amLichDayHref,
  amLichMonthHref,
  amLichYearHref,
} from "@/components/AmLichBlocks";
import { addDays, getVietnamTodayParts, type DateParts } from "@/lib/date";
import { convertLunar2Solar } from "@/lib/calendar/lunar";
import { getPerpetualYearSummary } from "@/lib/calendar/perpetual";
import { getDayInfo, getMonthCalendar } from "@/lib/calendar/service";
import { siteConfig } from "@/lib/site";

function tetSolarDate(year: number): DateParts | null {
  return convertLunar2Solar(1, 1, year, false);
}

export function buildAmLichBreadcrumbJsonLd(items: Array<{ name: string; href: string }>) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.href}`,
    })),
  };
}

export function AmLichDayPageContent({ date }: { date: DateParts }) {
  const day = getDayInfo(date);
  const calendar = getMonthCalendar(date.year, date.month, date);
  const prevDay = addDays(date, -1);
  const nextDay = addDays(date, 1);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: `Lịch âm ngày ${date.day}/${date.month}/${date.year}`,
        url: `${siteConfig.url}${amLichDayHref(date)}`,
        description: `Xem âm lịch ngày ${date.day}/${date.month}/${date.year}: ${day.lunar.day}/${day.lunar.month}/${day.lunar.year} âm lịch, ngày ${day.canChi.day}, tháng ${day.canChi.month}, năm ${day.canChi.year}.`,
        inLanguage: "vi-VN",
        isPartOf: { "@type": "WebSite", name: siteConfig.name, url: siteConfig.url },
      },
      buildAmLichBreadcrumbJsonLd([
        { name: "Lịch âm", href: "/" },
        { name: `Năm ${date.year}`, href: amLichYearHref(date.year) },
        { name: `Tháng ${date.month}`, href: amLichMonthHref(date.year, date.month) },
        { name: `Ngày ${date.day}`, href: amLichDayHref(date) },
      ]),
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: `Ngày ${date.day}/${date.month}/${date.year} là ngày bao nhiêu âm lịch?`,
            acceptedAnswer: { "@type": "Answer", text: `Ngày ${date.day}/${date.month}/${date.year} dương lịch là ngày ${day.lunar.day}/${day.lunar.month}/${day.lunar.year}${day.lunar.isLeap ? " nhuận" : ""} âm lịch.` },
          },
          {
            "@type": "Question",
            name: `Ngày ${date.day}/${date.month}/${date.year} là ngày tốt hay xấu?`,
            acceptedAnswer: { "@type": "Answer", text: `Ngày này là ${day.quality.label}. ${day.quality.note}` },
          },
        ],
      },
    ],
  };

  return (
    <>
      <Header currentYear={date.year} />
      <main className="container mainStack">
        <AmLichDayHero day={day} prevDay={prevDay} nextDay={nextDay} />
        <MonthCalendarForAmLich calendar={calendar} />
        <AmLichDayDetails day={day} />
        <DayInternalLinks day={day} prevDay={prevDay} nextDay={nextDay} />
        <SameSolarDateAcrossYears date={date} />
        <AmLichSeoArticle mode="day" year={date.year} month={date.month} />
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}

export function AmLichMonthPageContent({ year, month }: { year: number; month: number }) {
  const today = getVietnamTodayParts();
  const selectedDate = today.year === year && today.month === month ? today : { year, month, day: 1 };
  const calendar = getMonthCalendar(year, month, selectedDate);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: `Lịch âm tháng ${month} năm ${year}`,
        url: `${siteConfig.url}${amLichMonthHref(year, month)}`,
        description: `Tra lịch âm tháng ${month}/${year}, xem ngày âm, can chi, ngày tốt xấu, ngày lễ và sự kiện trong tháng.`,
        inLanguage: "vi-VN",
        isPartOf: { "@type": "WebSite", name: siteConfig.name, url: siteConfig.url },
      },
      buildAmLichBreadcrumbJsonLd([
        { name: "Lịch âm", href: "/" },
        { name: `Năm ${year}`, href: amLichYearHref(year) },
        { name: `Tháng ${month}`, href: amLichMonthHref(year, month) },
      ]),
    ],
  };

  return (
    <>
      <Header currentYear={year} />
      <main className="container mainStack">
        <AmLichMonthHero calendar={calendar} />
        <MonthCalendarForAmLich calendar={calendar} />
        <AmLichMonthExtra calendar={calendar} />
        <AmLichYearMonthLinks summary={getPerpetualYearSummary(year)} selectedMonth={month} />
        <AmLichSeoArticle mode="month" year={year} month={month} />
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}

export function AmLichYearPageContent({ year }: { year: number }) {
  const summary = getPerpetualYearSummary(year);
  const today = getVietnamTodayParts();
  const selectedDate = today.year === year ? today : undefined;
  const tetDate = tetSolarDate(year);
  const tetDay = tetDate ? getDayInfo(tetDate) : null;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: `Lịch âm năm ${year}`,
        url: `${siteConfig.url}${amLichYearHref(year)}`,
        description: `Tra lịch âm năm ${year}, năm ${summary.canChiYear}, xem đủ 12 tháng, ngày tốt xấu, can chi và các ngày lễ trong năm.`,
        inLanguage: "vi-VN",
        isPartOf: { "@type": "WebSite", name: siteConfig.name, url: siteConfig.url },
      },
      buildAmLichBreadcrumbJsonLd([
        { name: "Lịch âm", href: "/" },
        { name: `Năm ${year}`, href: amLichYearHref(year) },
      ]),
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: `Năm ${year} là năm con gì?`,
            acceptedAnswer: { "@type": "Answer", text: `Năm ${year} là năm ${summary.canChiYear}, cầm tinh con ${summary.animal}.` },
          },
          {
            "@type": "Question",
            name: `Năm ${year} có bao nhiêu ngày?`,
            acceptedAnswer: { "@type": "Answer", text: `Năm ${year} dương lịch có ${summary.totalDays} ngày.` },
          },
        ],
      },
    ],
  };

  return (
    <>
      <Header currentYear={year} />
      <main className="container mainStack">
        <AmLichYearHero summary={summary} tetDay={tetDay} />
        <AmLichYearMonthLinks summary={summary} />
        <AmLichYearCalendars year={year} selectedDate={selectedDate} />
        <RelatedYears year={year} />
        <AmLichSeoArticle mode="year" year={year} />
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
