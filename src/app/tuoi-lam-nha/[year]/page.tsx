import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getHouseAgeCheck } from "@/lib/calendar/compatibility";
import { getVietnamTodayParts } from "@/lib/date";
import { faqSchema, siteConfig, webPageSchema } from "@/lib/site";

type PageProps = { params: Promise<{ year: string }> };

type HouseYearRow = ReturnType<typeof getHouseAgeCheck>;

const MIN_YEAR = 1900;
const MAX_YEAR = 2050;

function resolveYear(value: string): number | null {
  const year = Number(value);
  if (!Number.isInteger(year) || year < MIN_YEAR || year > MAX_YEAR) return null;
  return year;
}

function buildRows(year: number): HouseYearRow[] {
  const oldestBirthYear = year - 80;
  const youngestBirthYear = year - 18;
  const rows: HouseYearRow[] = [];

  for (let birthYear = youngestBirthYear; birthYear >= oldestBirthYear; birthYear--) {
    if (birthYear >= MIN_YEAR && birthYear <= year) {
      rows.push(getHouseAgeCheck(birthYear, year));
    }
  }

  return rows;
}

function statusText(row: HouseYearRow) {
  if (row.level === "good") return "Tuổi đẹp";
  if (row.level === "ok") return "Cần cân nhắc";
  return "Nên tránh/mượn tuổi";
}

function checkText(row: HouseYearRow, name: string) {
  return row.checks.find((check) => check.name === name)?.status === "good" ? "Không phạm" : "Phạm";
}

function nearbyYears(year: number) {
  return [year - 1, year, year + 1, year + 2, year + 3].filter((y) => y >= MIN_YEAR && y <= MAX_YEAR);
}

export function generateStaticParams() {
  const year = new Date().getFullYear();
  return Array.from({ length: 8 }, (_, index) => ({ year: String(year - 1 + index) }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { year: yearParam } = await params;
  const year = resolveYear(yearParam);
  if (!year) return { title: "Năm không hợp lệ | Ngày Giờ", robots: { index: false, follow: false } };

  const rows = buildRows(year);
  const goodCount = rows.filter((row) => row.level === "good").length;
  const title = `Tuổi làm nhà năm ${year}: bảng Kim Lâu Hoang Ốc Tam Tai | Ngày Giờ`;
  const description = `Tra bảng tuổi làm nhà năm ${year}: ${goodCount} tuổi đẹp tham khảo, kiểm tra Kim Lâu, Hoang Ốc, Tam Tai, gợi ý mượn tuổi và link xem ngày động thổ hợp tuổi.`;

  return {
    title,
    description,
    keywords: [
      `tuổi làm nhà năm ${year}`,
      `tuổi xây nhà ${year}`,
      `kim lâu hoang ốc tam tai ${year}`,
      `mượn tuổi làm nhà ${year}`,
      `xem tuổi làm nhà ${year}`,
    ],
    alternates: { canonical: `/tuoi-lam-nha/${year}` },
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}/tuoi-lam-nha/${year}`,
      siteName: siteConfig.name,
      locale: "vi_VN",
      type: "website",
      images: [{ url: "/home.jpg", width: 1200, height: 630, alt: title }],
    },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  };
}

export default async function TuoiLamNhaYearPage({ params }: PageProps) {
  const { year: yearParam } = await params;
  const year = resolveYear(yearParam);
  if (!year) notFound();

  const today = getVietnamTodayParts();
  const rows = buildRows(year);
  const goodRows = rows.filter((row) => row.level === "good");
  const okRows = rows.filter((row) => row.level === "ok");
  const badRows = rows.filter((row) => row.level === "bad");
  const topRows = goodRows.slice(0, 18);
  const sampleBirthYear = goodRows[0]?.birthYear ?? year - 35;

  const jsonLd = [
    webPageSchema({
      name: `Tuổi làm nhà năm ${year}`,
      url: `${siteConfig.url}/tuoi-lam-nha/${year}`,
      description: `Bảng tra tuổi làm nhà năm ${year} theo Kim Lâu, Hoang Ốc, Tam Tai.`,
      breadcrumb: [
        { name: "Xem tuổi làm nhà", url: `${siteConfig.url}/xem-tuoi-lam-nha` },
        { name: `Tuổi làm nhà ${year}`, url: `${siteConfig.url}/tuoi-lam-nha/${year}` },
      ],
    }),
    faqSchema([
      {
        q: `Năm ${year} tuổi nào làm nhà đẹp?`,
        a: topRows.length
          ? `Một số tuổi đẹp tham khảo năm ${year}: ${topRows.slice(0, 10).map((row) => `${row.birthYear} (${row.ageInfo.birthCanChi})`).join(", ")}.`
          : `Năm ${year} không có nhiều tuổi đạt mức tốt trong bảng tham khảo hiện tại, nên kiểm tra từng năm sinh cụ thể.`,
      },
      {
        q: `Bảng tuổi làm nhà ${year} tính theo gì?`,
        a: "Bảng xét tuổi âm của gia chủ trong năm làm nhà, sau đó kiểm tra ba nhóm Kim Lâu, Hoang Ốc và Tam Tai theo cách tính dân gian.",
      },
      {
        q: "Phạm tuổi làm nhà thì nên làm gì?",
        a: "Có thể cân nhắc đổi năm, chọn thời điểm khác hoặc tham khảo phong tục mượn tuổi tại địa phương. Việc xây sửa vẫn cần ưu tiên pháp lý, tài chính, kỹ thuật và an toàn.",
      },
    ]),
  ];

  return (
    <>
      <Header currentYear={today.year} />
      <main className="container mainStack">
        <div className="pageFullscreenBg" style={{ backgroundImage: "linear-gradient(90deg, rgba(255,255,255,.94) 0%, rgba(255,255,255,.82) 42%, rgba(255,255,255,.52) 100%), linear-gradient(180deg, rgba(245,251,247,.18) 0%, rgba(245,251,247,.9) 100%), url(/bg-page-age.png)" }} aria-hidden="true" />

        <section className="heroCard compatHero" aria-labelledby="house-year-title">
          <div>
            <p className="eyebrow">Bảng tra cứu theo năm</p>
            <h1 id="house-year-title">Tuổi làm nhà năm {year}: Kim Lâu, Hoang Ốc, Tam Tai</h1>
            <p className="converterIntro yearIntroText">Tra nhanh tuổi đẹp xây nhà, sửa nhà, động thổ năm {year}. Bảng dưới đây giúp so sánh điểm 100, ba hạn chính và gợi ý kiểm tra sâu theo từng năm sinh.</p>
            <div className="activityHeroBadges">
              <span>{goodRows.length} tuổi đẹp</span>
              <span>{okRows.length} tuổi cần cân nhắc</span>
              <span>{badRows.length} tuổi nên tránh</span>
              <span>Có link xem ngày động thổ</span>
            </div>
          </div>
          <div className="heroScorePreview">
            <span>Năm làm nhà</span>
            <strong>{year}</strong>
            <small>{goodRows.length} tuổi đạt mức tốt tham khảo</small>
          </div>
        </section>

        <section className="panelCard" aria-labelledby="house-top-title">
          <p className="eyebrow">Danh sách nhanh</p>
          <h2 id="house-top-title">Các tuổi đẹp làm nhà năm {year}</h2>
          <p>Nhóm dưới đây không phạm cả ba hạn lớn trong bộ tiêu chí hiện tại. Anh có thể bấm từng tuổi để kiểm tra chi tiết hoặc xem ngày động thổ hợp tuổi.</p>
          <div className="dayLinkList">
            {topRows.length ? topRows.map((row) => (
              <Link key={row.birthYear} href={`/xem-tuoi-lam-nha?namSinh=${row.birthYear}&namLamNha=${year}`} className="eventPill green">
                {row.birthYear} · {row.ageInfo.birthCanChi}
              </Link>
            )) : <span>Chưa có tuổi đạt mức tốt trong khoảng tuổi phổ biến.</span>}
          </div>
        </section>

        <section className="panelCard" aria-labelledby="house-table-title">
          <p className="eyebrow">Bảng đầy đủ</p>
          <h2 id="house-table-title">Bảng tuổi làm nhà năm {year}</h2>
          <div style={{ overflowX: "auto" }}>
            <table className="seoDataTable">
              <thead>
                <tr>
                  <th>Năm sinh</th>
                  <th>Can chi</th>
                  <th>Tuổi âm</th>
                  <th>Kim Lâu</th>
                  <th>Hoang Ốc</th>
                  <th>Tam Tai</th>
                  <th>Điểm</th>
                  <th>Đánh giá</th>
                  <th>Tra cứu</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.birthYear}>
                    <td><strong>{row.birthYear}</strong></td>
                    <td>{row.ageInfo.birthCanChi}</td>
                    <td>{row.lunarAge}</td>
                    <td>{checkText(row, "Kim Lâu")}</td>
                    <td>{checkText(row, "Hoang Ốc")}</td>
                    <td>{checkText(row, "Tam Tai")}</td>
                    <td>{row.score}/100</td>
                    <td>{statusText(row)}</td>
                    <td><Link href={`/xem-tuoi-lam-nha?namSinh=${row.birthYear}&namLamNha=${year}`}>Chi tiết</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="panelCard activitySeoLinks" aria-labelledby="house-links-title">
          <p className="eyebrow">Cụm SEO liên quan</p>
          <h2 id="house-links-title">Xem thêm theo năm và theo tuổi</h2>
          <div className="dayLinkList">
            {nearbyYears(year).map((item) => (
              <Link key={item} href={`/tuoi-lam-nha/${item}`} className="eventPill blue">Tuổi làm nhà {item}</Link>
            ))}
            <Link href={`/xem-tuoi-lam-nha?namSinh=${sampleBirthYear}&namLamNha=${year}`} className="eventPill blue">Kiểm tra tuổi {sampleBirthYear}</Link>
            <Link href={`/xem-ngay-tot-dong-tho?tuoi=${sampleBirthYear}`} className="eventPill blue">Xem ngày động thổ</Link>
            <Link href={`/xem-tuoi-hop-huong-nao?namSinh=${sampleBirthYear}`} className="eventPill blue">Xem hướng hợp tuổi</Link>
          </div>
        </section>

        <article className="seoArticle">
          <h2>Cách đọc bảng tuổi làm nhà năm {year}</h2>
          <p>Bảng này lấy năm sinh của gia chủ, tính tuổi âm trong năm {year}, rồi kiểm tra ba nhóm thường dùng khi xem tuổi xây sửa nhà: Kim Lâu, Hoang Ốc và Tam Tai. Mức “tuổi đẹp” nghĩa là không phạm cả ba nhóm trong bộ tiêu chí hiện tại.</p>
          <h2>Có nên phụ thuộc hoàn toàn vào tuổi làm nhà?</h2>
          <p>Không nên. Kết quả chỉ là tham khảo văn hóa dân gian. Với việc xây nhà, những yếu tố như pháp lý đất đai, thiết kế, kết cấu, tài chính, thời tiết, an toàn lao động và lịch của gia đình vẫn cần được ưu tiên.</p>
          <h2>Nếu phạm tuổi làm nhà năm {year} thì sao?</h2>
          <p>Nếu kết quả ở mức cần cân nhắc hoặc nên tránh, anh có thể kiểm tra năm khác, chọn ngày động thổ tốt hơn, hoặc tham khảo phong tục mượn tuổi theo địa phương. Mỗi gia đình có hoàn cảnh khác nhau nên nên dùng bảng này như một lớp tham khảo ban đầu.</p>
        </article>
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
