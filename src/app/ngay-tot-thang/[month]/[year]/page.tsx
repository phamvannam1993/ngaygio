import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getVietnamTodayParts, daysInMonth, formatDisplayDate, weekdayName, type DateParts } from "@/lib/date";
import { getDayInfo } from "@/lib/calendar/service";
import { getGoodBadDetails } from "@/lib/calendar/good-bad";
import { amLichDayHref } from "@/lib/calendar/urls";
import { siteConfig, webPageSchema, faqSchema } from "@/lib/site";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function publicPath(month: number, year: number) {
  return `/ngay-tot-thang-${month}-nam-${year}`;
}
function valid(month: number, year: number) {
  return Number.isInteger(month) && month >= 1 && month <= 12 && Number.isInteger(year) && year >= 2000 && year <= 2035;
}

export async function generateMetadata({ params }: { params: Promise<{ month: string; year: string }> }): Promise<Metadata> {
  const { month, year } = await params;
  const m = Number(month), y = Number(year);
  if (!valid(m, y)) return {};
  const title = `Ngày tốt tháng ${m}/${y}: Xem ngày đẹp, ngày hoàng đạo trong tháng | Ngày Giờ`;
  const description = `Danh sách ngày tốt (ngày hoàng đạo) trong tháng ${m}/${y}: xem ngày đẹp để cưới hỏi, khai trương, động thổ, xuất hành kèm ngày âm lịch và giờ tốt.`;
  return {
    title, description,
    keywords: [`ngày tốt tháng ${m}`, `ngày tốt tháng ${m} năm ${y}`, `ngày đẹp tháng ${m}/${y}`, `ngày hoàng đạo tháng ${m}`],
    alternates: { canonical: `${siteConfig.url}${publicPath(m, y)}` },
    openGraph: { title, description, url: `${siteConfig.url}${publicPath(m, y)}`, siteName: siteConfig.name, locale: "vi_VN", type: "website", images: [{ url: "/home.jpg", width: 1200, height: 630, alt: title }] },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  };
}

export default async function NgayTotThangPage({ params }: { params: Promise<{ month: string; year: string }> }) {
  const { month, year } = await params;
  const m = Number(month), y = Number(year);
  if (!valid(m, y)) { notFound(); return null; }
  const today = getVietnamTodayParts();

  const total = daysInMonth(y, m);
  const goodDays: Array<{ date: DateParts; info: ReturnType<typeof getDayInfo>; details: ReturnType<typeof getGoodBadDetails> }> = [];
  for (let d = 1; d <= total; d += 1) {
    const date = { year: y, month: m, day: d };
    const info = getDayInfo(date);
    const details = getGoodBadDetails(info);
    if (details.overallType === "good" || info.quality.type === "good") {
      goodDays.push({ date, info, details });
    }
  }

  const jsonLd = [
    webPageSchema({ name: `Ngày tốt tháng ${m}/${y}`, url: `${siteConfig.url}${publicPath(m, y)}`, description: `Danh sách ngày tốt, ngày hoàng đạo trong tháng ${m}/${y}.`, breadcrumb: [{ name: `Ngày tốt tháng ${m}/${y}`, url: `${siteConfig.url}${publicPath(m, y)}` }] }),
    faqSchema([
      { q: `Tháng ${m}/${y} có bao nhiêu ngày tốt?`, a: `Tháng ${m}/${y} có ${goodDays.length} ngày được xếp loại tốt (hoàng đạo) trên tổng ${total} ngày.` },
      { q: `Ngày tốt trong tháng ${m}/${y} là những ngày nào?`, a: goodDays.length ? `Các ngày tốt gồm: ${goodDays.map((g) => g.date.day).join(", ")} (dương lịch).` : "Đang cập nhật." },
      { q: "Ngày tốt được xác định dựa vào đâu?", a: "Dựa trên ngày hoàng đạo/hắc đạo, trực, sao và can chi ngày theo lịch âm dương." },
    ]),
  ];

  return (
    <>
      <Header currentYear={today.year} />
      <main className="container mainStack">
        <div className="pageFullscreenBg" style={{ backgroundImage: "linear-gradient(90deg, rgba(255,255,255,.94) 0%, rgba(255,255,255,.82) 42%, rgba(255,255,255,.52) 100%), linear-gradient(180deg, rgba(245,251,247,.18) 0%, rgba(245,251,247,.9) 100%), url(/bg-page-calendar.png)" }} aria-hidden="true" />

        <section className="heroCard" aria-labelledby="ntt-title">
          <p className="eyebrow">Ngày tốt theo tháng</p>
          <h1 id="ntt-title">Ngày tốt tháng {m}/{y}</h1>
          <p className="homeHeroLead" style={{ marginTop: 10 }}>Tháng {m}/{y} có <strong>{goodDays.length}</strong> ngày tốt (hoàng đạo) trong tổng {total} ngày. Chọn ngày đẹp cho cưới hỏi, khai trương, động thổ, xuất hành.</p>
        </section>

        <section className="heroCard">
          <h2 className="monthTitle" style={{ marginBottom: 12 }}>Danh sách ngày tốt trong tháng {m}/{y}</h2>
          <div className="dayLinkList">
            {goodDays.map((g) => (
              <Link key={g.date.day} href={amLichDayHref(g.date)} className="eventPill green">
                {g.date.day}/{m} ({weekdayName(g.date)}) · ÂL {g.info.lunar.day}/{g.info.lunar.month}
              </Link>
            ))}
          </div>
          <p className="disclaimer" style={{ marginTop: 12 }}>Nhấn vào từng ngày để xem chi tiết giờ tốt, tuổi hợp/xung và việc nên làm.</p>
        </section>

        <article className="seoArticle">
          <h2>Xem ngày tốt tháng {m}/{y}</h2>
          <p>Trong tháng {m}/{y} có <strong>{goodDays.length} ngày tốt</strong> (ngày hoàng đạo). Đây là những ngày thuận lợi để tiến hành việc trọng đại. Bạn nên kết hợp thêm tuổi của mình và xem giờ hoàng đạo trong ngày để chọn thời điểm tối ưu.</p>

          <h2>Xem ngày tốt theo việc</h2>
          <div className="dayLinkList">
            <Link href="/xem-ngay-tot-cuoi-hoi" className="eventPill blue">Ngày cưới hỏi</Link>
            <Link href="/xem-ngay-tot-dong-tho" className="eventPill blue">Ngày động thổ</Link>
            <Link href="/xem-ngay-tot-khai-truong" className="eventPill blue">Ngày khai trương</Link>
            <Link href="/xem-ngay-tot-nhap-trach" className="eventPill blue">Ngày nhập trạch</Link>
            <Link href="/xem-ngay-tot-mua-xe" className="eventPill blue">Ngày mua xe</Link>
            <Link href="/xem-ngay-tot" className="eventPill green">Tất cả việc</Link>
          </div>

          <h2>Ngày tốt các tháng khác</h2>
          <div className="dayLinkList">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].filter((mm) => mm !== m).slice(0, 6).map((mm) => (
              <Link key={mm} href={publicPath(mm, y)} className="eventPill green">Ngày tốt tháng {mm}/{y}</Link>
            ))}
          </div>
        </article>
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
