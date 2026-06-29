import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { AmLichDayHero, AmLichDayDetails, MonthCalendarForAmLich } from "@/components/AmLichBlocks";
import { addDays, formatDisplayDate, getVietnamTodayParts } from "@/lib/date";
import { getDayInfo, getMonthCalendar } from "@/lib/calendar/service";
import { amLichDayHref } from "@/lib/calendar/urls";
import { formatHours } from "@/lib/calendar/can-chi";
import { siteConfig, webPageSchema, faqSchema } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const tomorrow = addDays(getVietnamTodayParts(), 1);
  const day = getDayInfo(tomorrow);
  const displayDate = formatDisplayDate(tomorrow);
  const title = `Lịch âm ngày mai ${displayDate} mùng mấy? | Ngày Giờ`;
  const description = `Lịch âm ngày mai ${displayDate} là ngày ${day.lunar.day}/${day.lunar.month}/${day.lunar.year}, ngày ${day.canChi.day}, ${day.quality.label}. Giờ hoàng đạo ngày mai: ${formatHours(day.goodHours)}.`;
  return {
    title,
    description,
    alternates: { canonical: `${siteConfig.url}/lich-am-ngay-mai` },
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}/lich-am-ngay-mai`,
      siteName: siteConfig.name,
      locale: "vi_VN",
      type: "website",
      images: [{ url: "/home.jpg", width: 1200, height: 630, alt: title }],
    },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  };
}

export default function LichAmNgayMaiPage() {
  const today = getVietnamTodayParts();
  const tomorrow = addDays(today, 1);
  const day = getDayInfo(tomorrow);
  const calendar = getMonthCalendar(tomorrow.year, tomorrow.month, tomorrow);
  const displayDate = formatDisplayDate(tomorrow);
  const hours = formatHours(day.goodHours);

  const jsonLd = [
    webPageSchema({
      name: `Lịch âm ngày mai ${displayDate}`,
      url: `${siteConfig.url}/lich-am-ngay-mai`,
      description: `Ngày mai ${displayDate} là ngày ${day.lunar.day}/${day.lunar.month}/${day.lunar.year} âm lịch, ${day.quality.label}.`,
      breadcrumb: [
        { name: "Âm lịch hôm nay", url: `${siteConfig.url}/am-lich-hom-nay` },
        { name: "Lịch âm ngày mai", url: `${siteConfig.url}/lich-am-ngay-mai` },
      ],
    }),
    faqSchema([
      { q: `Lịch âm ngày mai ${displayDate} là ngày mấy?`, a: `Ngày mai ${displayDate} dương lịch là ngày ${day.lunar.day}/${day.lunar.month}/${day.lunar.year} âm lịch${day.lunar.isLeap ? " nhuận" : ""}, ngày ${day.canChi.day}, tháng ${day.canChi.month}, năm ${day.canChi.year}.` },
      { q: `Ngày mai ${displayDate} tốt hay xấu?`, a: `Ngày mai ${displayDate} là ${day.quality.label}. ${day.quality.note}` },
      { q: `Giờ hoàng đạo ngày mai ${displayDate} là giờ nào?`, a: `Giờ hoàng đạo ngày mai ${displayDate}: ${hours}.` },
    ]),
  ];

  return (
    <>
      <Header currentYear={today.year} />
      <main className="container mainStack">
        <AmLichDayHero day={day} prevDay={today} nextDay={addDays(tomorrow, 1)} isNgayMai />
        <AmLichDayDetails day={day} isNgayMai />
        <MonthCalendarForAmLich calendar={calendar} />
        <article className="seoArticle">
          <h2>Lịch âm ngày mai {displayDate}</h2>
          <p>Ngày mai <strong>{displayDate}</strong> dương lịch tương đương ngày <strong>{day.lunar.day} tháng {day.lunar.month} năm {day.lunar.year}</strong> âm lịch ({day.canChi.day}, tháng {day.canChi.month}, năm {day.canChi.year}). Tiết khí: {day.solarTerm}.</p>
          <h2>Ngày mai {displayDate} tốt hay xấu?</h2>
          <p>Ngày mai là <strong>{day.quality.label}</strong>. {day.quality.note}</p>
          <h2>Giờ hoàng đạo ngày mai {displayDate}</h2>
          <p>Giờ hoàng đạo ngày mai: <strong>{hours}</strong>. Đây là các khung giờ tốt để xuất hành, khai trương, ký kết hoặc làm việc quan trọng.</p>
          <div className="dayLinkList" style={{ marginTop: "16px" }}>
            <Link href="/am-lich-hom-nay" className="eventPill blue">Âm lịch hôm nay</Link>
            <Link href={amLichDayHref(tomorrow)} className="eventPill blue">Lịch âm ngày {tomorrow.day}/{tomorrow.month}/{tomorrow.year}</Link>
            <Link href="/ngay-tot-xau-hom-nay" className="eventPill green">Ngày tốt xấu hôm nay</Link>
            <Link href="/gio-hoang-dao-hom-nay" className="eventPill green">Giờ hoàng đạo hôm nay</Link>
          </div>
        </article>
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
