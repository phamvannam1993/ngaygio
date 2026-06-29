import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getVietnamTodayParts, formatDisplayDate } from "@/lib/date";
import { getTetInfoForYear, getTetCluster } from "@/lib/calendar/tet";
import { siteConfig, webPageSchema, faqSchema } from "@/lib/site";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type PageProps = { params: Promise<{ year: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { year: yearStr } = await params;
  const lunarYear = Number(yearStr);
  if (!lunarYear || lunarYear < 2020 || lunarYear > 2040) return {};

  const today = getVietnamTodayParts();
  const tet = getTetInfoForYear(lunarYear, today);
  const tetDisplay = formatDisplayDate(tet.solarDate);

  const title = tet.passed
    ? `Tết ${tet.canChi} ${lunarYear} là ngày ${tetDisplay} – đã qua ${tet.daysLeft} ngày | Ngày Giờ`
    : `Tết ${lunarYear} còn bao nhiêu ngày? – Còn ${tet.daysLeft} ngày | Ngày Giờ`;
  const description = `Tết Nguyên Đán ${tet.canChi} năm ${lunarYear} (mùng 1/1 âm lịch) là ngày ${tetDisplay} dương lịch. ${tet.passed ? `Đã qua ${tet.daysLeft} ngày.` : `Còn ${tet.daysLeft} ngày nữa.`} Xem lịch nghỉ Tết, giao thừa, ông Công ông Táo.`;

  return {
    title,
    description,
    alternates: { canonical: `${siteConfig.url}/tet/${lunarYear}` },
    openGraph: { title, description, url: `${siteConfig.url}/tet/${lunarYear}`, siteName: siteConfig.name, locale: "vi_VN", type: "website", images: [{ url: "/home.jpg", width: 1200, height: 630, alt: title }] },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  };
}

export default async function TetYearPage({ params }: PageProps) {
  const { year: yearStr } = await params;
  const lunarYear = Number(yearStr);
  if (!lunarYear || lunarYear < 2020 || lunarYear > 2040) notFound();

  const today = getVietnamTodayParts();
  const tet = getTetInfoForYear(lunarYear, today);
  const tetDisplay = formatDisplayDate(tet.solarDate);
  const todayDisplay = formatDisplayDate(today);
  const cluster = getTetCluster(lunarYear);

  const jsonLd = [
    webPageSchema({
      name: `Tết ${tet.canChi} ${lunarYear} ngày nào?`,
      url: `${siteConfig.url}/tet/${lunarYear}`,
      description: `Tết Nguyên Đán ${tet.canChi} ${lunarYear} là ngày ${tetDisplay}. ${tet.passed ? `Đã qua ${tet.daysLeft} ngày.` : `Còn ${tet.daysLeft} ngày.`}`,
      breadcrumb: [
        { name: "Còn bao nhiêu ngày đến Tết", url: `${siteConfig.url}/con-bao-nhieu-ngay-den-tet` },
        { name: `Tết ${lunarYear}`, url: `${siteConfig.url}/tet/${lunarYear}` },
      ],
    }),
    faqSchema([
      { q: `Tết ${lunarYear} là ngày mấy?`, a: `Tết Nguyên Đán ${tet.canChi} năm ${lunarYear} (mùng 1/1 âm lịch) là ngày ${tetDisplay} dương lịch.` },
      { q: tet.passed ? `Tết ${lunarYear} đã qua chưa?` : `Còn bao nhiêu ngày đến Tết ${lunarYear}?`, a: tet.passed ? `Tết ${tet.canChi} ${lunarYear} đã qua được ${tet.daysLeft} ngày (tính từ ${todayDisplay}).` : `Tính từ hôm nay (${todayDisplay}), còn ${tet.daysLeft} ngày nữa đến Tết ${tet.canChi} ${lunarYear}.` },
      { q: `Giao thừa Tết ${lunarYear} là đêm nào?`, a: cluster ? `Đêm Giao thừa Tết ${tet.canChi} ${lunarYear} là tối ngày ${formatDisplayDate(cluster.giaoThua)} (30 tháng Chạp âm lịch).` : `Đêm 30 tháng Chạp, tức ngày liền trước mùng 1 Tết ${tetDisplay}.` },
      { q: `Ông Công Ông Táo ${lunarYear} là ngày mấy?`, a: cluster?.ongTao ? `Lễ cúng ông Công ông Táo trước Tết ${lunarYear} vào ngày 23 tháng Chạp âm lịch, tức ngày ${formatDisplayDate(cluster.ongTao)} dương lịch.` : `Ngày 23 tháng Chạp âm lịch, trước mùng 1 Tết 7 ngày.` },
      { q: `Tết ${lunarYear} nghỉ bao nhiêu ngày?`, a: `Theo quy định, người lao động nghỉ Tết Nguyên Đán ${lunarYear} tối thiểu 5 ngày. Kỳ nghỉ thường kéo dài 7 ngày kể từ 30 tháng Chạp. Lịch chính xác theo thông báo của Chính phủ.` },
    ]),
  ];

  return (
    <>
      <Header currentYear={today.year} />
      <main className="container mainStack">
        <section className="heroCard" aria-labelledby="tet-year-title">
          <p className="eyebrow">Tết Nguyên Đán {lunarYear}</p>
          <h1 id="tet-year-title">
            Tết {tet.canChi} {lunarYear} – {tet.passed ? `Đã qua ${tet.daysLeft} ngày` : `Còn ${tet.daysLeft} ngày nữa`}
          </h1>

          <div className="todayGrid" style={{ marginTop: "24px" }}>
            <article className="dateBox">
              <span className="boxTitle">Hôm nay</span>
              <strong className="monthTitle">{today.day}/{today.month}/{today.year}</strong>
              <span className="bigDate">{today.day}</span>
              <span className="subDate">{todayDisplay}</span>
            </article>

            <article className="dateBox lunarBox">
              <span className="boxTitle">Mùng 1 Tết {lunarYear}</span>
              <strong className="monthTitle">{tet.solarDate.day}/{tet.solarDate.month}/{tet.solarDate.year}</strong>
              <span className="bigDate">{tet.solarDate.day}</span>
              <span className="subDate">Năm {tet.canChi}</span>
            </article>

            <article className="infoBox">
              <p><strong>Tết {tet.canChi} {lunarYear}</strong> là <span>{tetDisplay}</span></p>
              <p>{tet.passed ? "Đã qua" : "Còn"} <span style={{ fontSize: "2rem", fontWeight: 900 }}>{tet.daysLeft}</span> ngày</p>
              {cluster && <p>Giao thừa: <span>{formatDisplayDate(cluster.giaoThua)}</span></p>}
              <p className="disclaimer">Tính theo mùng 1/1 âm lịch giờ Việt Nam (GMT+7).</p>
            </article>
          </div>
        </section>

        {cluster && (
          <section className="panelCard" aria-labelledby="tet-cluster-title">
            <p className="eyebrow">Lịch các ngày quan trọng</p>
            <h2 id="tet-cluster-title">Lịch Tết {tet.canChi} {lunarYear} đầy đủ</h2>
            <div className="dayLinkList" style={{ marginTop: "12px" }}>
              {cluster.ramThangChap && (
                <Link href={`/ram-thang-chap/${lunarYear}`} className="eventPill blue">
                  Rằm tháng Chạp – {formatDisplayDate(cluster.ramThangChap)}
                </Link>
              )}
              {cluster.ongTao && (
                <Link href={`/ong-cong-ong-tao/${lunarYear}`} className="eventPill blue">
                  Ông Công Ông Táo (23 tháng Chạp) – {formatDisplayDate(cluster.ongTao)}
                </Link>
              )}
              <Link href={`/giao-thua/${lunarYear}`} className="eventPill blue">
                Giao thừa (30 tháng Chạp) – {formatDisplayDate(cluster.giaoThua)}
              </Link>
              <Link href={`/lich-nghi-tet/${lunarYear}`} className="eventPill green">
                Lịch nghỉ Tết {lunarYear}
              </Link>
            </div>
          </section>
        )}

        <article className="seoArticle">
          <h2>Tết Nguyên Đán {tet.canChi} {lunarYear} là ngày nào?</h2>
          <p>Mùng 1 tháng Giêng năm {tet.canChi} ({lunarYear}) rơi vào ngày <strong>{tetDisplay}</strong> dương lịch. {tet.passed ? `Đây là Tết đã diễn ra cách đây ${tet.daysLeft} ngày.` : `Từ hôm nay còn ${tet.daysLeft} ngày nữa là Tết.`}</p>
          <h2>Năm {tet.canChi} có ý nghĩa gì?</h2>
          <p>Năm {tet.canChi} là năm thứ {((lunarYear - 4) % 60 + 60) % 60 + 1} trong chu kỳ 60 năm can chi. Theo quan niệm dân gian, mỗi năm mang theo đặc trưng của can và chi tương ứng, ảnh hưởng đến vận hạn và phong thủy trong năm.</p>
          <h2>Xem Tết các năm khác</h2>
          <div className="dayLinkList">
            <Link href="/con-bao-nhieu-ngay-den-tet" className="eventPill green">Còn bao nhiêu ngày đến Tết</Link>
            {[lunarYear - 1, lunarYear + 1, lunarYear + 2].map((y) => {
              const t = getTetInfoForYear(y, today);
              return (
                <Link key={y} href={`/tet/${y}`} className="eventPill blue">
                  Tết {t.canChi} {y} – {formatDisplayDate(t.solarDate)}
                </Link>
              );
            })}
          </div>
        </article>
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
