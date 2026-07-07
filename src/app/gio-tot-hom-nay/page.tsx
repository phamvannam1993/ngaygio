import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getVietnamTodayParts, formatDisplayDate } from "@/lib/date";
import { getDayInfo } from "@/lib/calendar/service";
import { gioHoangDaoDayHref } from "@/lib/calendar/urls";
import { siteConfig, webPageSchema, faqSchema } from "@/lib/site";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const PAGE_PATH = "/gio-tot-hom-nay";

// Giờ hoàng đạo phù hợp cho các việc trọng đại (xuất hành, ký kết, khai trương, nhận xe...).
const ACTIVITIES = [
  { key: "xuat-hanh", label: "Xuất hành, đi xa" },
  { key: "ky-hop-dong", label: "Ký hợp đồng, giao dịch" },
  { key: "khai-truong", label: "Khai trương, mở hàng" },
  { key: "nhan-xe", label: "Nhận xe, mua xe" },
  { key: "cuoi-hoi", label: "Cưới hỏi, ăn hỏi" },
  { key: "dong-tho", label: "Động thổ, nhập trạch" },
];

export async function generateMetadata(): Promise<Metadata> {
  const today = getVietnamTodayParts();
  const day = getDayInfo(today);
  const goodText = day.goodHours.map((h) => `${h.branch} (${h.range})`).join(", ");
  const title = `Giờ tốt hôm nay ${formatDisplayDate(today)}: Giờ hoàng đạo, giờ đẹp xuất hành | Ngày Giờ`;
  const description = `Giờ tốt hôm nay ${formatDisplayDate(today)}: giờ hoàng đạo ${goodText}. Xem giờ đẹp xuất hành, ký hợp đồng, khai trương, nhận xe và giờ hắc đạo nên tránh.`;
  return {
    title,
    description,
    keywords: ["giờ tốt hôm nay", "giờ đẹp hôm nay", "xem giờ tốt hôm nay", "giờ hoàng đạo hôm nay", "giờ tốt xuất hành hôm nay", "giờ đẹp ngày hôm nay"],
    alternates: { canonical: `${siteConfig.url}${PAGE_PATH}` },
    openGraph: { title, description, url: `${siteConfig.url}${PAGE_PATH}`, siteName: siteConfig.name, locale: "vi_VN", type: "website", images: [{ url: "/home.jpg", width: 1200, height: 630, alt: "Giờ tốt hôm nay" }] },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  };
}

export default function GioTotHomNayPage() {
  const today = getVietnamTodayParts();
  const day = getDayInfo(today);
  const todayDisplay = formatDisplayDate(today);
  const goodText = day.goodHours.map((h) => `${h.branch} (${h.range})`).join(", ");
  const badText = day.badHours.map((h) => `${h.branch} (${h.range})`).join(", ");

  const jsonLd = [
    webPageSchema({
      name: `Giờ tốt hôm nay ${todayDisplay}`,
      url: `${siteConfig.url}${PAGE_PATH}`,
      description: "Giờ hoàng đạo, giờ hắc đạo và giờ tốt cho từng việc trong ngày hôm nay.",
      breadcrumb: [{ name: "Giờ tốt hôm nay", url: `${siteConfig.url}${PAGE_PATH}` }],
    }),
    faqSchema([
      { q: "Giờ tốt hôm nay là những giờ nào?", a: `Giờ tốt (giờ hoàng đạo) hôm nay ${todayDisplay} gồm: ${goodText}.` },
      { q: "Giờ hắc đạo (giờ xấu) hôm nay nên tránh giờ nào?", a: `Giờ hắc đạo hôm nay: ${badText}. Nên tránh khởi sự việc lớn vào các khung giờ này.` },
      { q: "Giờ nào tốt để xuất hành hôm nay?", a: `Nên chọn khung giờ hoàng đạo: ${goodText}. Đây là các giờ đẹp để xuất hành, ký kết, khai trương.` },
      { q: "Giờ hoàng đạo được tính như thế nào?", a: "Giờ hoàng đạo là các khung giờ tốt theo can chi ngày, thường dùng cho cưới hỏi, xuất hành, khai trương, ký kết theo quan niệm dân gian." },
    ]),
  ];

  return (
    <>
      <Header currentYear={today.year} />
      <main className="container mainStack">
        <div className="pageFullscreenBg" style={{ backgroundImage: "linear-gradient(90deg, rgba(255,255,255,.94) 0%, rgba(255,255,255,.82) 42%, rgba(255,255,255,.52) 100%), linear-gradient(180deg, rgba(245,251,247,.18) 0%, rgba(245,251,247,.9) 100%), url(/bg-page-calendar.png)" }} aria-hidden="true" />

        <section className="heroCard" aria-labelledby="gio-tot-title">
          <p className="eyebrow">Giờ tốt hôm nay</p>
          <h1 id="gio-tot-title">Giờ tốt hôm nay {today.day}/{today.month}/{today.year}</h1>
          <p className="homeHeroLead" style={{ marginTop: 10 }}>
            {day.weekdayName}, ngày {day.canChi.day} tháng {day.canChi.month} năm {day.canChi.year}. Giờ hoàng đạo (giờ tốt): <strong>{day.goodHours.map((h) => h.branch).join(", ")}</strong>.
          </p>
        </section>

        <section className="heroCard" aria-labelledby="gio-hd-title">
          <h2 id="gio-hd-title" className="monthTitle" style={{ marginBottom: 12 }}>Giờ hoàng đạo & giờ hắc đạo hôm nay</h2>
          <div className="todayGrid">
            <article className="infoBox">
              <p><strong>✅ Giờ hoàng đạo (giờ tốt):</strong></p>
              <div className="dayLinkList" style={{ marginTop: 6 }}>
                {day.goodHours.map((h) => <span key={h.branch} className="eventPill green">{h.branch} · {h.range}</span>)}
              </div>
            </article>
            <article className="infoBox">
              <p><strong>❌ Giờ hắc đạo (nên tránh):</strong></p>
              <div className="dayLinkList" style={{ marginTop: 6 }}>
                {day.badHours.map((h) => <span key={h.branch} className="eventPill red">{h.branch} · {h.range}</span>)}
              </div>
            </article>
          </div>
        </section>

        <section className="heroCard" aria-labelledby="gio-viec-title">
          <h2 id="gio-viec-title" className="monthTitle" style={{ marginBottom: 12 }}>Giờ tốt cho từng việc hôm nay</h2>
          <p className="disclaimer" style={{ marginBottom: 12 }}>Nên ưu tiên các khung giờ hoàng đạo dưới đây cho từng công việc quan trọng.</p>
          <div className="bestDateGrid">
            {ACTIVITIES.map((a) => (
              <article key={a.key} className="panelCard">
                <strong>{a.label}</strong>
                <p style={{ marginTop: 6 }}>{goodText}</p>
              </article>
            ))}
          </div>
        </section>

        <article className="seoArticle">
          <h2>Giờ tốt hôm nay là mấy giờ?</h2>
          <p>Giờ tốt (giờ hoàng đạo) hôm nay {todayDisplay} gồm: <strong>{goodText}</strong>. Đây là những khung giờ đẹp theo can chi ngày {day.canChi.day}, thích hợp cho các việc trọng đại như xuất hành, ký hợp đồng, khai trương, nhận xe.</p>

          <h2>Giờ hắc đạo hôm nay nên tránh</h2>
          <p>Ngược lại, các khung giờ hắc đạo hôm nay là: <strong>{badText}</strong>. Dân gian khuyên nên tránh khởi sự việc lớn vào những giờ này.</p>

          <h2>Cách chọn giờ tốt theo việc</h2>
          <p>Với mỗi công việc (xuất hành, cưới hỏi, khai trương, ký kết, động thổ, nhận xe...), bạn nên chọn khung giờ hoàng đạo gần với thời điểm dự định và kết hợp xem thêm ngày tốt xấu để tối ưu.</p>

          <h2>Công cụ liên quan</h2>
          <div className="dayLinkList">
            <Link href="/gio-hoang-dao-hom-nay" className="eventPill green">Giờ hoàng đạo hôm nay</Link>
            <Link href="/gio-hoang-dao-ngay-mai" className="eventPill green">Giờ hoàng đạo ngày mai</Link>
            <Link href="/hom-nay" className="eventPill blue">Hôm nay là ngày gì</Link>
            <Link href="/ngay-tot-xau-hom-nay" className="eventPill green">Ngày tốt xấu hôm nay</Link>
            <Link href={gioHoangDaoDayHref(today)} className="eventPill blue">Chi tiết giờ hoàng đạo</Link>
            <Link href="/xem-ngay-tot" className="eventPill green">Xem ngày tốt theo việc</Link>
          </div>
        </article>
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
