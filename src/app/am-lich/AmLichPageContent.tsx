import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PageHeroBanner } from "@/components/PageHeroBanner";
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

const WEEKDAY_VN = ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"];

// Các dịp lễ theo âm lịch trong năm (ngày âm cố định) → quy đổi ra dương lịch để tạo nội dung khác biệt từng năm.
function getLunarFestivals(year: number): Array<{ name: string; lunarLabel: string; solar: DateParts | null }> {
  const defs: Array<{ name: string; d: number; m: number }> = [
    { name: "Tết Nguyên Đán", d: 1, m: 1 },
    { name: "Rằm tháng Giêng (Nguyên Tiêu)", d: 15, m: 1 },
    { name: "Tết Hàn Thực", d: 3, m: 3 },
    { name: "Giỗ Tổ Hùng Vương", d: 10, m: 3 },
    { name: "Tết Đoan Ngọ", d: 5, m: 5 },
    { name: "Lễ Vu Lan (Rằm tháng 7)", d: 15, m: 7 },
    { name: "Tết Trung Thu", d: 15, m: 8 },
    { name: "Ông Công Ông Táo", d: 23, m: 12 },
  ];
  return defs.map((f) => ({ name: f.name, lunarLabel: `${f.d}/${f.m} âm lịch`, solar: convertLunar2Solar(f.d, f.m, year, false) }));
}

function solarWithWeekday(date: DateParts | null): string {
  if (!date) return "—";
  const wd = WEEKDAY_VN[new Date(date.year, date.month - 1, date.day).getDay()];
  return `${wd}, ${date.day}/${date.month}/${date.year}`;
}

function AmLichYearFestivals({ year }: { year: number }) {
  const festivals = getLunarFestivals(year);
  return (
    <section className="panelCard amLichFestivals" aria-labelledby="amlich-festivals-title">
      <p className="eyebrow">Lịch âm {year}</p>
      <h2 id="amlich-festivals-title">Các ngày lễ âm lịch quan trọng năm {year}</h2>
      <p>Ngày dương lịch tương ứng của các dịp lễ, Tết theo âm lịch trong năm {year} — tiện lên kế hoạch cúng lễ, nghỉ lễ và sự kiện gia đình.</p>
      <div style={{ overflowX: "auto" }}>
        <table className="amLichFestivalTable">
          <thead>
            <tr><th>Dịp lễ</th><th>Âm lịch</th><th>Dương lịch {year}</th></tr>
          </thead>
          <tbody>
            {festivals.map((f) => (
              <tr key={f.name}>
                <td>{f.solar ? <Link href={amLichDayHref(f.solar)}>{f.name}</Link> : f.name}</td>
                <td>{f.lunarLabel}</td>
                <td>{solarWithWeekday(f.solar)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="dayLinkList" style={{ marginTop: 16 }}>
        <Link href={`/tai-lich-am/${year}`} className="eventPill blue">Tải lịch âm {year} (PDF)</Link>
        <Link href="/tai-lich-am-pdf" className="eventPill blue">In lịch âm khổ A4</Link>
        <Link href={`/tet/${year}`} className="eventPill green">Tết {year} vào ngày nào?</Link>
      </div>
    </section>
  );
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
        <div className="pageFullscreenBg" style={{ backgroundImage: "linear-gradient(90deg, rgba(255,255,255,.94) 0%, rgba(255,255,255,.82) 42%, rgba(255,255,255,.52) 100%), linear-gradient(180deg, rgba(245,251,247,.18) 0%, rgba(245,251,247,.9) 100%), url(/bg-page-calendar.png)" }} aria-hidden="true" />
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
        <div className="pageFullscreenBg" style={{ backgroundImage: "linear-gradient(90deg, rgba(255,255,255,.94) 0%, rgba(255,255,255,.82) 42%, rgba(255,255,255,.52) 100%), linear-gradient(180deg, rgba(245,251,247,.18) 0%, rgba(245,251,247,.9) 100%), url(/bg-page-calendar.png)" }} aria-hidden="true" />
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
          {
            "@type": "Question",
            name: `Tết Nguyên Đán ${year} vào ngày nào dương lịch?`,
            acceptedAnswer: { "@type": "Answer", text: tetDate ? `Mùng 1 Tết Nguyên Đán ${summary.canChiYear} ${year} rơi vào ${solarWithWeekday(tetDate)} dương lịch.` : `Xem chi tiết tại trang Tết ${year}.` },
          },
          {
            "@type": "Question",
            name: `Rằm tháng Giêng, Vu Lan và Trung thu ${year} là ngày nào?`,
            acceptedAnswer: { "@type": "Answer", text: getLunarFestivals(year).filter((f) => ["Rằm tháng Giêng (Nguyên Tiêu)", "Lễ Vu Lan (Rằm tháng 7)", "Tết Trung Thu"].includes(f.name)).map((f) => `${f.name}: ${solarWithWeekday(f.solar)}`).join("; ") + "." },
          },
        ],
      },
    ],
  };

  return (
    <>
      <Header currentYear={year} />
      <main className="container mainStack">
        <div className="pageFullscreenBg" style={{ backgroundImage: "linear-gradient(90deg, rgba(255,255,255,.94) 0%, rgba(255,255,255,.82) 42%, rgba(255,255,255,.52) 100%), linear-gradient(180deg, rgba(245,251,247,.18) 0%, rgba(245,251,247,.9) 100%), url(/bg-page-calendar.png)" }} aria-hidden="true" />
        <AmLichYearHero summary={summary} tetDay={tetDay} />
        <AmLichYearMonthLinks summary={summary} />
        <AmLichYearFestivals year={year} />
        <AmLichYearCalendars year={year} selectedDate={selectedDate} />
        <RelatedYears year={year} />
        <AmLichSeoArticle mode="year" year={year} />
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}