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
  if (!cluster?.ongTao) return {};
  const dateStr = formatDisplayDate(cluster.ongTao);
  const title = `Ông Công Ông Táo ${yr} là ngày mấy? ${dateStr} | Ngày Giờ`;
  const description = `Lễ cúng ông Công ông Táo năm ${yr} là ngày 23 tháng Chạp âm lịch, tức ${dateStr} dương lịch. Tìm hiểu phong tục và ý nghĩa ngày lễ này.`;
  return {
    title,
    description,
    alternates: { canonical: `${siteConfig.url}/ong-cong-ong-tao/${yr}` },
    openGraph: { title, description, url: `${siteConfig.url}/ong-cong-ong-tao/${yr}`, siteName: siteConfig.name, locale: "vi_VN", type: "website" },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  };
}

export default async function OngCongOngTaoPage({ params }: PageProps) {
  const { year: yearStr } = await params;
  const yr = Number(yearStr);
  if (!yr || yr < 2020 || yr > 2040) notFound();
  const cluster = getTetCluster(yr);
  if (!cluster?.ongTao) notFound();

  const today = getVietnamTodayParts();
  const dateStr = formatDisplayDate(cluster.ongTao);
  const tetStr = formatDisplayDate(cluster.tet);

  const jsonLd = [
    webPageSchema({
      name: `Ông Công Ông Táo ${yr} là ngày mấy?`,
      url: `${siteConfig.url}/ong-cong-ong-tao/${yr}`,
      description: `Lễ cúng ông Công ông Táo năm ${yr} là ngày ${dateStr} (23/12 âm lịch).`,
      breadcrumb: [
        { name: `Tết ${yr}`, url: `${siteConfig.url}/tet/${yr}` },
        { name: `Ông Công Ông Táo ${yr}`, url: `${siteConfig.url}/ong-cong-ong-tao/${yr}` },
      ],
    }),
    faqSchema([
      { q: `Ông Công Ông Táo ${yr} là ngày mấy dương lịch?`, a: `Lễ cúng ông Công ông Táo năm ${yr} vào ngày 23 tháng Chạp âm lịch, tức ngày ${dateStr} dương lịch.` },
      { q: "Ông Công Ông Táo là ai?", a: "Ông Công (Thổ Công) cai quản đất đai, ông Táo (Táo Quân) cai quản bếp núc trong nhà. Theo tín ngưỡng dân gian, hàng năm vào 23 tháng Chạp, các vị thần này về trời báo cáo công việc gia đình với Ngọc Hoàng." },
      { q: "Cúng ông Công ông Táo gồm những gì?", a: "Lễ cúng ông Công ông Táo thường gồm: mâm cỗ chay hoặc mặn, vàng mã, quần áo giấy (đặc biệt có cá chép sống để tiễn ông Táo về trời). Sau lễ cúng, thả cá chép xuống sông/ao là phong tục phổ biến." },
      { q: `Từ ngày cúng ông Táo đến Tết ${yr} còn bao nhiêu ngày?`, a: `Từ ngày cúng ông Công ông Táo (${dateStr}) đến mùng 1 Tết ${cluster.canChi} ${yr} (${tetStr}) là 7 ngày.` },
    ]),
  ];

  return (
    <>
      <Header currentYear={today.year} />
      <main className="container mainStack">
        <section className="heroCard" aria-labelledby="ong-tao-title">
          <p className="eyebrow">Trước Tết {cluster.canChi} {yr}</p>
          <h1 id="ong-tao-title">Ông Công Ông Táo {yr}: Ngày {dateStr}</h1>
          <div className="todayGrid" style={{ marginTop: "24px" }}>
            <article className="dateBox">
              <span className="boxTitle">Cúng ông Táo</span>
              <strong className="monthTitle">{dateStr}</strong>
              <span className="bigDate">{cluster.ongTao.day}</span>
              <span className="subDate">23 tháng Chạp</span>
            </article>
            <article className="dateBox lunarBox">
              <span className="boxTitle">Mùng 1 Tết</span>
              <strong className="monthTitle">{tetStr}</strong>
              <span className="bigDate">{cluster.tet.day}</span>
              <span className="subDate">Năm {cluster.canChi}</span>
            </article>
            <article className="infoBox">
              <p><strong>23 tháng Chạp → {dateStr}</strong></p>
              <p>Ngày tiễn ông Công ông Táo về trời.</p>
              <p>Còn <strong>7 ngày</strong> nữa là mùng 1 Tết.</p>
              <p className="disclaimer">Theo lịch âm Việt Nam.</p>
            </article>
          </div>
        </section>

        <article className="seoArticle">
          <h2>Ông Công Ông Táo {yr} là ngày mấy?</h2>
          <p>Lễ cúng ông Công ông Táo năm {yr} diễn ra vào ngày 23 tháng Chạp âm lịch, tức ngày <strong>{dateStr}</strong> dương lịch. Đây là ngày trước Tết Nguyên Đán {cluster.canChi} {yr} (mùng 1 Tết: {tetStr}) đúng 7 ngày.</p>
          <h2>Ý nghĩa ngày 23 tháng Chạp</h2>
          <p>Theo tín ngưỡng dân gian Việt Nam, ngày 23 tháng Chạp là ngày ông Công ông Táo cưỡi cá chép về thiên đình để báo cáo với Ngọc Hoàng về công việc trong gia đình suốt một năm qua. Đây là ngày mở đầu cho tuần lễ Tết và là thời điểm các gia đình bắt đầu dọn dẹp, sắm Tết.</p>
          <h2>Cách cúng ông Công ông Táo</h2>
          <p>Mâm lễ cúng ông Táo thường bao gồm: hương, hoa, quả, vàng mã, quần áo giấy, và đặc biệt là <strong>cá chép</strong> (thường là cá chép sống). Sau khi cúng xong, gia đình thả cá chép xuống sông hoặc ao để tiễn ông Táo về trời. Thời gian cúng tốt nhất là trước 12h trưa ngày 23 tháng Chạp.</p>
          <h2>Xem thêm về Tết {cluster.canChi} {yr}</h2>
          <div className="dayLinkList">
            {cluster.ramThangChap && <Link href={`/ram-thang-chap/${yr}`} className="eventPill blue">Rằm tháng Chạp {yr} – {formatDisplayDate(cluster.ramThangChap)}</Link>}
            <Link href={`/giao-thua/${yr}`} className="eventPill blue">Giao thừa {yr} – {formatDisplayDate(cluster.giaoThua)}</Link>
            <Link href={`/tet/${yr}`} className="eventPill green">Tết {yr} còn bao nhiêu ngày</Link>
            <Link href={`/lich-nghi-tet/${yr}`} className="eventPill green">Lịch nghỉ Tết {yr}</Link>
            <Link href={amLichDayHref(cluster.ongTao)} className="eventPill blue">Lịch âm ngày {dateStr}</Link>
          </div>
        </article>
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
