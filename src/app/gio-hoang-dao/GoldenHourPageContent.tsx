import Link from "next/link";
import { Footer } from "@/components/Footer";
import { GoldenHourDateForm } from "@/components/GoldenHourDateForm";
import { GoldenHourArticle } from "@/components/GoldenHourArticle";
import { gioHoangDaoDayHref } from "@/lib/calendar/urls";
import { Header } from "@/components/Header";
import { MonthCalendar } from "@/components/MonthCalendar";
import { CHI, formatHours } from "@/lib/calendar/can-chi";
import { getDayInfo, getMonthCalendar } from "@/lib/calendar/service";
import type { DateParts } from "@/lib/date";
import { formatDisplayDate } from "@/lib/date";
import { siteConfig } from "@/lib/site";

export function GoldenHourPageContent({ selectedDate }: { selectedDate: DateParts }) {
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
          { "@type": "Question", name: `Ngày ${displayDate} là ngày can chi gì?`, acceptedAnswer: { "@type": "Answer", text: `Ngày ${day.canChi.day}, tháng ${day.canChi.month}, năm ${day.canChi.year}.` } },
        ],
      },
    ],
  };

  return (
    <>
      <Header currentYear={selectedDate.year} />
      <main className="container mainStack">
        <GoldenHourDateForm defaultDate={selectedDate} />
        <section className="heroCard" aria-labelledby="golden-hour-title">
          <p className="eyebrow">Giờ tốt trong ngày</p>
          <h1 id="golden-hour-title">Giờ hoàng đạo ngày {displayDate}</h1>
          <p className="converterIntro">
            Ngày {displayDate} là {day.weekdayName}, âm lịch {day.lunar.day}/{day.lunar.month}/{day.lunar.year}, ngày {day.canChi.day}, tháng {day.canChi.month}, năm {day.canChi.year}. Ngày này là {day.quality.label.toLowerCase()}.
          </p>
          <div className="adviceGrid">
            <article className="adviceCard goodAdvice">
              <h2>Giờ Hoàng Đạo</h2>
              <p>{formatHours(day.goodHours)}.</p>
              <div className="hourGrid detailHourGrid">
                {day.goodHours.map((hour) => <span key={hour.branch} className="hourPill good"><strong>{hour.branch}</strong><small>{hour.range}</small></span>)}
              </div>
            </article>
            <article className="adviceCard badAdvice">
              <h2>Giờ Hắc Đạo</h2>
              <p>{formatHours(day.badHours)}.</p>
              <div className="hourGrid detailHourGrid">
                {day.badHours.map((hour) => <span key={hour.branch} className="hourPill bad"><strong>{hour.branch}</strong><small>{hour.range}</small></span>)}
              </div>
            </article>
          </div>
        </section>

        <section className="panelCard detailBlock" aria-labelledby="all-hours-title">
          <p className="eyebrow">12 khung giờ</p>
          <h2 id="all-hours-title">Chi tiết toàn bộ khung giờ ngày {displayDate}</h2>
          <div className="hourGrid">
            {sortedHours.map((hour) => <span key={hour.branch} className={["hourPill", hour.isGood ? "good" : "bad"].join(" ")}><strong>{hour.branch}</strong><small>{hour.range}</small></span>)}
          </div>
          <p className="smallNote">Thông tin giờ tốt xấu mang tính tham khảo văn hóa dân gian. Việc quan trọng vẫn cần chuẩn bị kỹ thực tế.</p>
          <nav className="breadcrumb" aria-label="Đường dẫn">
            <Link href="/">Lịch âm</Link><span>/</span><Link href="/gio-hoang-dao">Giờ hoàng đạo</Link><span>/</span><span>{displayDate}</span>
          </nav>
        </section>

        <MonthCalendar calendar={calendar} makeHref={gioHoangDaoDayHref} />
        <GoldenHourArticle />
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
