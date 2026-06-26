import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getVietnamTodayParts, formatDisplayDate, addDays } from "@/lib/date";
import { getTetCluster } from "@/lib/calendar/tet";
import { siteConfig, webPageSchema, faqSchema } from "@/lib/site";
import { amLichDayHref } from "@/lib/calendar/urls";

type PageProps = { params: Promise<{ year: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { year: yearStr } = await params;
  const yr = Number(yearStr);
  if (!yr || yr < 2020 || yr > 2040) return {};
  const cluster = getTetCluster(yr);
  if (!cluster) return {};
  const tetStr = formatDisplayDate(cluster.tet);
  const title = `Lịch nghỉ Tết ${yr}: Nghỉ từ ngày nào đến ngày nào? | Ngày Giờ`;
  const description = `Lịch nghỉ Tết Nguyên Đán ${cluster.canChi} ${yr}. Mùng 1 Tết là ${tetStr}. Xem ngày nghỉ chính thức và lịch các ngày quan trọng quanh Tết.`;
  return {
    title,
    description,
    alternates: { canonical: `${siteConfig.url}/lich-nghi-tet/${yr}` },
    openGraph: { title, description, url: `${siteConfig.url}/lich-nghi-tet/${yr}`, siteName: siteConfig.name, locale: "vi_VN", type: "website" },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  };
}

export default async function LichNghiTetPage({ params }: PageProps) {
  const { year: yearStr } = await params;
  const yr = Number(yearStr);
  if (!yr || yr < 2020 || yr > 2040) notFound();
  const cluster = getTetCluster(yr);
  if (!cluster) notFound();

  const today = getVietnamTodayParts();
  const tetStr = formatDisplayDate(cluster.tet);

  // Lịch nghỉ Tết theo quy định thông thường: 7 ngày (30 Tết + mùng 1–6)
  const nghiDays = Array.from({ length: 7 }, (_, i) => {
    const d = i === 0 ? cluster.giaoThua : addDays(cluster.tet, i - 1);
    const label = i === 0 ? "30 tháng Chạp (Giao thừa)" : `Mùng ${i} Tết`;
    return { date: d, label };
  });

  const jsonLd = [
    webPageSchema({
      name: `Lịch nghỉ Tết ${yr}`,
      url: `${siteConfig.url}/lich-nghi-tet/${yr}`,
      description: `Lịch nghỉ Tết Nguyên Đán ${cluster.canChi} ${yr}. Mùng 1 Tết: ${tetStr}.`,
      breadcrumb: [
        { name: `Tết ${yr}`, url: `${siteConfig.url}/tet/${yr}` },
        { name: `Lịch nghỉ Tết ${yr}`, url: `${siteConfig.url}/lich-nghi-tet/${yr}` },
      ],
    }),
    faqSchema([
      { q: `Tết ${yr} nghỉ từ ngày nào đến ngày nào?`, a: `Tết Nguyên Đán ${cluster.canChi} ${yr} theo quy định nhà nước thường nghỉ 7 ngày, từ ngày ${formatDisplayDate(cluster.giaoThua)} (30 tháng Chạp) đến ${formatDisplayDate(addDays(cluster.tet, 5))} (mùng 6 Tết). Lịch chính xác cần đối chiếu thông báo chính thức của Chính phủ.` },
      { q: `Mùng 1 Tết ${yr} là ngày mấy dương lịch?`, a: `Mùng 1 Tết Nguyên Đán ${cluster.canChi} ${yr} là ngày ${tetStr} dương lịch.` },
      { q: `Tết ${yr} năm nay được nghỉ mấy ngày?`, a: `Theo quy định, người lao động được nghỉ Tết Nguyên Đán 7 ngày (5 ngày theo quy định + 2 ngày cuối tuần). Số ngày nghỉ thực tế có thể khác tùy theo thông báo điều chỉnh của Chính phủ từng năm.` },
    ]),
  ];

  return (
    <>
      <Header currentYear={today.year} />
      <main className="container mainStack">
        <section className="heroCard" aria-labelledby="lich-nghi-tet-title">
          <p className="eyebrow">Tết {cluster.canChi} {yr}</p>
          <h1 id="lich-nghi-tet-title">Lịch nghỉ Tết {yr}: Từ {formatDisplayDate(cluster.giaoThua)} đến {formatDisplayDate(addDays(cluster.tet, 5))}</h1>

          <div style={{ marginTop: "24px", overflowX: "auto" }}>
            <table className="calTable" style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ padding: "8px 12px", textAlign: "left", background: "var(--surface2)" }}>Ngày âm</th>
                  <th style={{ padding: "8px 12px", textAlign: "left", background: "var(--surface2)" }}>Ngày dương</th>
                  <th style={{ padding: "8px 12px", textAlign: "left", background: "var(--surface2)" }}>Ghi chú</th>
                </tr>
              </thead>
              <tbody>
                {nghiDays.map(({ date, label }, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? "var(--surface)" : "var(--surface2)" }}>
                    <td style={{ padding: "8px 12px" }}>{label}</td>
                    <td style={{ padding: "8px 12px" }}>
                      <Link href={amLichDayHref(date)} style={{ color: "var(--accent)" }}>{formatDisplayDate(date)}</Link>
                    </td>
                    <td style={{ padding: "8px 12px", color: "var(--muted)", fontSize: "0.9em" }}>
                      {i === 0 ? "Giao thừa đêm nay" : i === 1 ? "Mùng 1 – Tết chính thức bắt đầu" : i === 6 ? "Ngày cuối kỳ nghỉ (tham khảo)" : "Ngày nghỉ Tết"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="disclaimer" style={{ marginTop: "12px" }}>* Lịch trên là tham khảo. Lịch nghỉ chính thức theo Nghị quyết của Chính phủ ban hành từng năm.</p>
        </section>

        <article className="seoArticle">
          <h2>Tết {cluster.canChi} {yr} nghỉ bao nhiêu ngày?</h2>
          <p>Theo Bộ luật Lao động Việt Nam, người lao động được nghỉ Tết Nguyên Đán <strong>5 ngày</strong> (có thể điều chỉnh để liên thông cuối tuần). Thông thường kỳ nghỉ Tết kéo dài khoảng 7 ngày, bắt đầu từ ngày 30 tháng Chạp (đêm Giao thừa {formatDisplayDate(cluster.giaoThua)}) đến hết mùng 5 hoặc mùng 6 Tết.</p>
          <h2>Lịch làm việc trở lại sau Tết {yr}</h2>
          <p>Ngày làm việc đầu tiên sau Tết {cluster.canChi} {yr} thường là mùng 7 Tết ({formatDisplayDate(addDays(cluster.tet, 6))}). Tuy nhiên, lịch cụ thể phụ thuộc vào ngày Tết rơi vào thứ mấy trong tuần và quyết định điều chỉnh của Chính phủ.</p>
          <h2>Các ngày quan trọng quanh Tết {cluster.canChi} {yr}</h2>
          <div className="dayLinkList">
            {cluster.ramThangChap && <Link href={`/ram-thang-chap/${yr}`} className="eventPill blue">Rằm tháng Chạp – {formatDisplayDate(cluster.ramThangChap)}</Link>}
            {cluster.ongTao && <Link href={`/ong-cong-ong-tao/${yr}`} className="eventPill blue">Ông Công Ông Táo – {formatDisplayDate(cluster.ongTao)}</Link>}
            <Link href={`/giao-thua/${yr}`} className="eventPill blue">Giao thừa – {formatDisplayDate(cluster.giaoThua)}</Link>
            <Link href={`/tet/${yr}`} className="eventPill green">Tết {yr} còn bao nhiêu ngày</Link>
            <Link href={`/lich-nghi-le/${cluster.tet.year}`} className="eventPill green">Toàn bộ lịch nghỉ lễ {cluster.tet.year}</Link>
          </div>
        </article>
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
