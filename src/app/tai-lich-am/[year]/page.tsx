import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MonthCalendar } from "@/components/MonthCalendar";
import { CalendarPrintActions } from "@/components/CalendarPrintActions";
import { amLichDayHref } from "@/lib/calendar/urls";
import { getMonthCalendar } from "@/lib/calendar/service";
import { getVietnamTodayParts } from "@/lib/date";
import { faqSchema, siteConfig, webPageSchema } from "@/lib/site";

type PageProps = { params: Promise<{ year: string }> };

const MIN_YEAR = 1900;
const MAX_YEAR = 2050;

function resolveYear(value: string): number | null {
  const year = Number(value);
  if (!Number.isInteger(year) || year < MIN_YEAR || year > MAX_YEAR) return null;
  return year;
}

function monthLinks(year: number) {
  return Array.from({ length: 12 }, (_, index) => ({ month: index + 1, href: `/tai-lich-am-pdf?year=${year}&month=${index + 1}` }));
}

export function generateStaticParams() {
  const year = new Date().getFullYear();
  return Array.from({ length: 8 }, (_, index) => ({ year: String(year - 1 + index) }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { year: yearParam } = await params;
  const year = resolveYear(yearParam);
  if (!year) return { title: "Năm không hợp lệ | Ngày Giờ", robots: { index: false, follow: false } };

  const title = `Tải lịch âm ${year} PDF, in lịch âm dương 12 tháng | Ngày Giờ`;
  const description = `Tải và in lịch âm ${year}: lịch âm dương 12 tháng, ngày âm, ngày dương, ngày tốt xấu, sự kiện nổi bật. Có thể lưu PDF trực tiếp từ trình duyệt.`;

  return {
    title,
    description,
    keywords: [`tải lịch âm ${year} pdf`, `lịch âm ${year} pdf`, `in lịch âm ${year}`, `lịch âm dương ${year}`, `tải lịch ${year}`],
    alternates: { canonical: `/tai-lich-am/${year}` },
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}/tai-lich-am/${year}`,
      siteName: siteConfig.name,
      locale: "vi_VN",
      type: "website",
      images: [{ url: "/home.jpg", width: 1200, height: 630, alt: title }],
    },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  };
}

export default async function TaiLichAmYearPage({ params }: PageProps) {
  const { year: yearParam } = await params;
  const year = resolveYear(yearParam);
  if (!year) notFound();

  const today = getVietnamTodayParts();
  const previewMonth = year === today.year ? today.month : 1;
  const calendar = getMonthCalendar(year, previewMonth, { year, month: previewMonth, day: 1 });
  const links = monthLinks(year);
  const nearbyYears = [year - 1, year, year + 1, year + 2].filter((item) => item >= MIN_YEAR && item <= MAX_YEAR);

  const jsonLd = [
    webPageSchema({
      name: `Tải lịch âm ${year} PDF`,
      url: `${siteConfig.url}/tai-lich-am/${year}`,
      description: `Tải và in lịch âm dương năm ${year}.`,
      breadcrumb: [
        { name: "Tải lịch âm PDF", url: `${siteConfig.url}/tai-lich-am-pdf` },
        { name: `Lịch âm ${year}`, url: `${siteConfig.url}/tai-lich-am/${year}` },
      ],
    }),
    faqSchema([
      { q: `Có tải được lịch âm ${year} dạng PDF không?`, a: `Có. Chọn tháng cần in rồi bấm “In / Lưu PDF” trên trang tải lịch âm để lưu lịch âm dương ${year} thành PDF.` },
      { q: `Lịch âm ${year} có những thông tin gì?`, a: "Lịch hiển thị ngày dương, ngày âm, ngày tốt xấu và các sự kiện nổi bật trong tháng." },
      { q: "Có in được lịch tháng ra giấy không?", a: "Có. Khi bấm in, trình duyệt sẽ tự ẩn phần menu để bản lịch gọn hơn trên giấy A4 hoặc file PDF." },
    ]),
  ];

  return (
    <>
      <Header currentYear={year} />
      <main className="container mainStack printPage">
        <section className="heroCard noPrint" aria-labelledby="download-year-title">
          <p className="eyebrow">Tải / in lịch</p>
          <h1 id="download-year-title">Tải lịch âm {year} dạng PDF</h1>
          <p className="converterIntro yearIntroText">Chọn tháng cần in trong năm {year}, sau đó lưu thành PDF từ trình duyệt. Trang này được tối ưu cho nhu cầu tìm “tải lịch âm {year} PDF”, “lịch âm dương {year}” và “in lịch âm {year}”.</p>
          <div className="activityHeroBadges">
            <span>12 tháng</span>
            <span>Lịch âm dương</span>
            <span>Ngày tốt xấu</span>
            <span>Lưu PDF</span>
          </div>
        </section>

        <section className="panelCard noPrint" aria-labelledby="download-months-title">
          <p className="eyebrow">Chọn tháng</p>
          <h2 id="download-months-title">In lịch âm từng tháng năm {year}</h2>
          <p>Bấm vào tháng cần dùng, trang in sẽ mở đúng tháng và năm đã chọn.</p>
          <div className="dayLinkList">
            {links.map((item) => (
              <Link key={item.month} href={item.href} className="eventPill blue">Tháng {item.month}/{year}</Link>
            ))}
          </div>
        </section>

        <section className="panelCard noPrint" aria-labelledby="download-actions-title">
          <p className="eyebrow">Thao tác nhanh</p>
          <h2 id="download-actions-title">In hoặc lưu PDF tháng {previewMonth}/{year}</h2>
          <p className="converterIntro yearIntroText">Bản xem trước bên dưới là tháng {previewMonth}/{year}. Có thể in trực tiếp hoặc mở tháng khác trong danh sách phía trên.</p>
          <CalendarPrintActions />
        </section>

        <section className="printCalendarArea">
          <div className="printCalendarTitle">
            <h2>Lịch âm dương tháng {previewMonth}/{year}</h2>
            <p>{siteConfig.domain} · Thông tin lịch âm chỉ mang tính tham khảo văn hóa dân gian.</p>
          </div>
          <MonthCalendar calendar={calendar} makeHref={amLichDayHref} />
        </section>

        <section className="panelCard noPrint activitySeoLinks" aria-labelledby="download-year-links-title">
          <p className="eyebrow">Cụm năm liên quan</p>
          <h2 id="download-year-links-title">Tải lịch âm các năm gần {year}</h2>
          <div className="dayLinkList">
            {nearbyYears.map((item) => (
              <Link key={item} href={`/tai-lich-am/${item}`} className="eventPill blue">Tải lịch âm {item}</Link>
            ))}
            <Link href={`/am-lich/nam/${year}`} className="eventPill green">Xem lịch vạn niên {year}</Link>
            <Link href={`/lich-nghi-le/${year}`} className="eventPill green">Lịch nghỉ lễ {year}</Link>
          </div>
        </section>

        <article className="seoArticle noPrint">
          <h2>Lịch âm {year} dùng để làm gì?</h2>
          <p>Lịch âm dương năm {year} giúp tra ngày âm, ngày dương, rằm, mùng 1, ngày lễ Tết, ngày tốt xấu và các mốc sinh hoạt gia đình. Bản in phù hợp để dán bàn làm việc, tủ lạnh, phòng thờ hoặc lưu PDF trên điện thoại.</p>
          <h2>Cách lưu lịch âm {year} thành PDF</h2>
          <p>Chọn tháng, bấm nút in, sau đó chọn “Save as PDF” hoặc “Lưu dưới dạng PDF” trong trình duyệt. Khi in, giao diện sẽ tự ẩn các phần không cần thiết để lịch gọn hơn.</p>
        </article>
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
