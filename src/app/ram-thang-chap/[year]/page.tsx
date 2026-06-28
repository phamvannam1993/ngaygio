import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getVietnamTodayParts, formatDisplayDate } from "@/lib/date";
import { getTetCluster } from "@/lib/calendar/tet";
import { siteConfig, webPageSchema, faqSchema } from "@/lib/site";
import { amLichDayHref } from "@/lib/calendar/urls";

export const dynamic = "force-dynamic";
export const revalidate = 0;
type PageProps = { params: Promise<{ year: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { year: yearStr } = await params;
  const yr = Number(yearStr);
  if (!yr || yr < 2020 || yr > 2040) return {};
  const cluster = getTetCluster(yr);
  if (!cluster?.ramThangChap) return {};
  const dateStr = formatDisplayDate(cluster.ramThangChap);
  const title = `Rằm tháng Chạp ${yr} là ngày mấy? ${dateStr} | Ngày Giờ`;
  const description = `Rằm tháng Chạp năm ${yr} là ngày 15 tháng 12 âm lịch, tức ${dateStr} dương lịch. Xem phong tục cúng Rằm tháng Chạp và lịch các ngày quan trọng trước Tết.`;
  return {
    title,
    description,
    alternates: { canonical: `${siteConfig.url}/ram-thang-chap/${yr}` },
    openGraph: { title, description, url: `${siteConfig.url}/ram-thang-chap/${yr}`, siteName: siteConfig.name, locale: "vi_VN", type: "website" },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  };
}

export default async function RamThangChapPage({ params }: PageProps) {
  const { year: yearStr } = await params;
  const yr = Number(yearStr);
  if (!yr || yr < 2020 || yr > 2040) notFound();
  const cluster = getTetCluster(yr);
  if (!cluster?.ramThangChap) notFound();

  const today = getVietnamTodayParts();
  const dateStr = formatDisplayDate(cluster.ramThangChap);
  const tetStr = formatDisplayDate(cluster.tet);

  const jsonLd = [
    webPageSchema({
      name: `Rằm tháng Chạp ${yr} là ngày mấy?`,
      url: `${siteConfig.url}/ram-thang-chap/${yr}`,
      description: `Rằm tháng Chạp năm ${yr} là ngày ${dateStr} (15/12 âm lịch).`,
      breadcrumb: [
        { name: `Tết ${yr}`, url: `${siteConfig.url}/tet/${yr}` },
        { name: `Rằm tháng Chạp ${yr}`, url: `${siteConfig.url}/ram-thang-chap/${yr}` },
      ],
    }),
    faqSchema([
      { q: `Rằm tháng Chạp ${yr} là ngày mấy dương lịch?`, a: `Rằm tháng Chạp (15/12 âm lịch) trước Tết ${cluster.canChi} ${yr} là ngày ${dateStr} dương lịch.` },
      { q: "Rằm tháng Chạp có ý nghĩa gì?", a: "Rằm tháng Chạp (15 tháng 12 âm lịch) là ngày rằm cuối cùng trong năm âm lịch, thường được xem là dịp cúng gia tiên, cầu bình an cho năm mới. Đây cũng là thời điểm nhiều gia đình bắt đầu chuẩn bị cho Tết Nguyên Đán." },
      { q: `Từ Rằm tháng Chạp đến Tết ${yr} còn bao nhiêu ngày?`, a: `Từ Rằm tháng Chạp (${dateStr}) đến mùng 1 Tết ${cluster.canChi} ${yr} (${tetStr}) là 15 ngày.` },
    ]),
  ];

  return (
    <>
      <Header currentYear={today.year} />
      <main className="container mainStack">
        <section className="heroCard" aria-labelledby="ram-chap-title">
          <p className="eyebrow">Trước Tết {cluster.canChi} {yr}</p>
          <h1 id="ram-chap-title">Rằm tháng Chạp {yr}: Ngày {dateStr}</h1>
          <div className="todayGrid" style={{ marginTop: "24px" }}>
            <article className="dateBox">
              <span className="boxTitle">Rằm tháng Chạp</span>
              <strong className="monthTitle">{dateStr}</strong>
              <span className="bigDate">{cluster.ramThangChap.day}</span>
              <span className="subDate">15 tháng Chạp</span>
            </article>
            <article className="dateBox lunarBox">
              <span className="boxTitle">Mùng 1 Tết</span>
              <strong className="monthTitle">{tetStr}</strong>
              <span className="bigDate">{cluster.tet.day}</span>
              <span className="subDate">Năm {cluster.canChi}</span>
            </article>
            <article className="infoBox">
              <p><strong>15 tháng Chạp → {dateStr}</strong></p>
              <p>Rằm cuối năm âm lịch.</p>
              <p>Còn <strong>15 ngày</strong> nữa là mùng 1 Tết.</p>
              <p className="disclaimer">Theo lịch âm Việt Nam.</p>
            </article>
          </div>
        </section>

        <article className="seoArticle">
          <h2>Rằm tháng Chạp {yr} là ngày mấy?</h2>
          <p>Rằm tháng Chạp năm {yr} vào ngày 15 tháng 12 âm lịch, tức ngày <strong>{dateStr}</strong> dương lịch. Đây là ngày rằm cuối cùng trước Tết Nguyên Đán {cluster.canChi} {yr} (mùng 1 Tết: {tetStr}), cách Tết đúng 15 ngày.</p>
          <h2>Phong tục cúng Rằm tháng Chạp</h2>
          <p>Rằm tháng Chạp là dịp cúng gia tiên quan trọng trước thềm năm mới. Nhiều gia đình làm mâm cỗ cúng vào ngày này để tạ ơn tổ tiên và cầu mong bình an, may mắn trong năm mới. Ngoài ra, đây cũng là thời điểm để sắm sửa đồ lễ, dọn dẹp nhà cửa chuẩn bị đón Tết.</p>
          <h2>Lịch các ngày quan trọng trước Tết {cluster.canChi} {yr}</h2>
          <div className="dayLinkList">
            <Link href={`/ong-cong-ong-tao/${yr}`} className="eventPill blue">Ông Công Ông Táo {yr} – {cluster.ongTao ? formatDisplayDate(cluster.ongTao) : ""} (23 tháng Chạp)</Link>
            <Link href={`/giao-thua/${yr}`} className="eventPill blue">Giao thừa {yr} – {formatDisplayDate(cluster.giaoThua)} (30 tháng Chạp)</Link>
            <Link href={`/tet/${yr}`} className="eventPill green">Tết {yr} còn bao nhiêu ngày</Link>
            <Link href={`/lich-nghi-tet/${yr}`} className="eventPill green">Lịch nghỉ Tết {yr}</Link>
            <Link href={amLichDayHref(cluster.ramThangChap)} className="eventPill blue">Lịch âm ngày {dateStr}</Link>
          </div>
        </article>
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
