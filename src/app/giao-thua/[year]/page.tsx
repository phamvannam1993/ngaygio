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
  if (!cluster) return {};
  const dateStr = formatDisplayDate(cluster.giaoThua);
  const title = `Giao thừa ${yr} là ngày mấy? ${dateStr} | Ngày Giờ`;
  const description = `Đêm Giao thừa Tết ${cluster.canChi} ${yr} là tối ngày ${dateStr} dương lịch (30 tháng Chạp âm lịch). Tìm hiểu phong tục đón giao thừa và các ngày lễ quanh Tết.`;
  return {
    title,
    description,
    alternates: { canonical: `${siteConfig.url}/giao-thua/${yr}` },
    openGraph: { title, description, url: `${siteConfig.url}/giao-thua/${yr}`, siteName: siteConfig.name, locale: "vi_VN", type: "website" },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  };
}

export default async function GiaoThuaPage({ params }: PageProps) {
  const { year: yearStr } = await params;
  const yr = Number(yearStr);
  if (!yr || yr < 2020 || yr > 2040) notFound();
  const cluster = getTetCluster(yr);
  if (!cluster) notFound();

  const today = getVietnamTodayParts();
  const dateStr = formatDisplayDate(cluster.giaoThua);
  const tetStr = formatDisplayDate(cluster.tet);

  const jsonLd = [
    webPageSchema({
      name: `Giao thừa ${yr} là ngày mấy?`,
      url: `${siteConfig.url}/giao-thua/${yr}`,
      description: `Đêm Giao thừa Tết ${cluster.canChi} ${yr} là tối ngày ${dateStr}.`,
      breadcrumb: [
        { name: "Tết", url: `${siteConfig.url}/tet/${yr}` },
        { name: `Giao thừa ${yr}`, url: `${siteConfig.url}/giao-thua/${yr}` },
      ],
    }),
    faqSchema([
      { q: `Giao thừa Tết ${yr} là ngày mấy?`, a: `Đêm Giao thừa Tết ${cluster.canChi} ${yr} là tối ngày ${dateStr} dương lịch (30 tháng Chạp âm lịch). Mùng 1 Tết là ngày ${tetStr}.` },
      { q: "Giao thừa là gì?", a: "Giao thừa là thời khắc chuyển giao giữa năm cũ và năm mới (0h00 đêm 30 tháng Chạp sang mùng 1 tháng Giêng âm lịch). Đây là khoảnh khắc thiêng liêng để cúng giao thừa, tiễn quan cũ rước quan mới và cầu mong năm mới an lành." },
      { q: "Cúng giao thừa trong nhà hay ngoài trời?", a: "Phong tục truyền thống cúng giao thừa gồm hai lễ: cúng ngoài trời (để tiễn quan hành khiển năm cũ, đón quan mới) và cúng trong nhà (gia tiên). Cả hai đều thực hiện vào khoảng 0h00 đêm 30 Tết." },
    ]),
  ];

  return (
    <>
      <Header currentYear={today.year} />
      <main className="container mainStack">
        <section className="heroCard" aria-labelledby="giao-thua-title">
          <p className="eyebrow">Tết {cluster.canChi} {yr}</p>
          <h1 id="giao-thua-title">Giao thừa {yr}: Đêm ngày {dateStr}</h1>
          <div className="todayGrid" style={{ marginTop: "24px" }}>
            <article className="dateBox">
              <span className="boxTitle">Đêm Giao thừa</span>
              <strong className="monthTitle">{dateStr}</strong>
              <span className="bigDate">{cluster.giaoThua.day}</span>
              <span className="subDate">30 tháng Chạp</span>
            </article>
            <article className="dateBox lunarBox">
              <span className="boxTitle">Mùng 1 Tết</span>
              <strong className="monthTitle">{tetStr}</strong>
              <span className="bigDate">{cluster.tet.day}</span>
              <span className="subDate">Năm {cluster.canChi}</span>
            </article>
            <article className="infoBox">
              <p><strong>Giao thừa Tết {yr}</strong></p>
              <p>0h00 đêm ngày <span>{dateStr}</span></p>
              <p>Mùng 1 Tết bắt đầu: <span>{tetStr}</span></p>
              <p className="disclaimer">Theo giờ Việt Nam (GMT+7).</p>
            </article>
          </div>
        </section>

        <article className="seoArticle">
          <h2>Giao thừa Tết {yr} là đêm nào?</h2>
          <p>Đêm Giao thừa Tết <strong>{cluster.canChi} {yr}</strong> là đêm ngày <strong>{dateStr}</strong> dương lịch, tức ngày 30 tháng Chạp âm lịch. Vào đúng 0h00, năm mới bắt đầu và mùng 1 Tết {tetStr} chính thức đến.</p>
          <h2>Giao thừa là gì?</h2>
          <p>Giao thừa (hay "Trừ tịch") là thời khắc chuyển giao thiêng liêng giữa năm cũ và năm mới theo âm lịch. Phong tục cúng giao thừa gồm cúng ngoài trời (tiễn quan hành khiển năm cũ, đón quan mới) và cúng trong nhà (gia tiên), thường được thực hiện vào đúng nửa đêm.</p>
          <h2>Lịch Tết {cluster.canChi} {yr}</h2>
          <div className="dayLinkList">
            {cluster.ongTao && <Link href={`/ong-cong-ong-tao/${yr}`} className="eventPill blue">Ông Công Ông Táo {yr} – {formatDisplayDate(cluster.ongTao)}</Link>}
            {cluster.ramThangChap && <Link href={`/ram-thang-chap/${yr}`} className="eventPill blue">Rằm tháng Chạp {yr} – {formatDisplayDate(cluster.ramThangChap)}</Link>}
            <Link href={amLichDayHref(cluster.giaoThua)} className="eventPill green">Lịch âm ngày {dateStr}</Link>
            <Link href={`/tet/${yr}`} className="eventPill green">Tết {yr} còn bao nhiêu ngày</Link>
            <Link href={`/lich-nghi-tet/${yr}`} className="eventPill blue">Lịch nghỉ Tết {yr}</Link>
          </div>
        </article>
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
