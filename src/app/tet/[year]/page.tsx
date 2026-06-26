import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getVietnamTodayParts, formatDisplayDate } from "@/lib/date";
import { getTetInfoForYear } from "@/lib/calendar/tet";
import { siteConfig, webPageSchema, faqSchema } from "@/lib/site";

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
  const description = `Tết Nguyên Đán ${tet.canChi} năm ${lunarYear} (mùng 1/1 âm lịch) là ngày ${tetDisplay} dương lịch. ${tet.passed ? `Đã qua ${tet.daysLeft} ngày.` : `Còn ${tet.daysLeft} ngày nữa.`}`;

  return {
    title,
    description,
    alternates: { canonical: `${siteConfig.url}/tet/${lunarYear}` },
    openGraph: { title, description, url: `${siteConfig.url}/tet/${lunarYear}`, siteName: siteConfig.name, locale: "vi_VN", type: "website", images: [{ url: "/og-home.svg", width: 1200, height: 630, alt: title }] },
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
              <p className="disclaimer">Tính theo mùng 1/1 âm lịch giờ Việt Nam (GMT+7).</p>
            </article>
          </div>
        </section>

        <article className="seoArticle">
          <h2>Tết Nguyên Đán {tet.canChi} {lunarYear} là ngày nào?</h2>
          <p>Mùng 1 tháng Giêng năm {tet.canChi} ({lunarYear}) rơi vào ngày <strong>{tetDisplay}</strong> dương lịch. {tet.passed ? `Đây là Tết đã diễn ra cách đây ${tet.daysLeft} ngày.` : `Từ hôm nay còn ${tet.daysLeft} ngày nữa là Tết.`}</p>
          <h2>Năm {tet.canChi} có ý nghĩa gì?</h2>
          <p>Năm {tet.canChi} là năm thứ {((lunarYear - 4) % 60 + 60) % 60 + 1} trong chu kỳ 60 năm can chi. Theo quan niệm dân gian, mỗi năm mang theo đặc trưng của can và chi tương ứng, ảnh hưởng đến vận hạn và phong thủy trong năm.</p>
        </article>
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
