import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getVietnamTodayParts, formatDisplayDate } from "@/lib/date";
import { getTetInfo, getTetInfoForYear } from "@/lib/calendar/tet";
import { siteConfig, webPageSchema, faqSchema } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const today = getVietnamTodayParts();
  const tet = getTetInfo(today);
  const title = tet.daysLeft === 0
    ? `Hôm nay là mùng 1 Tết ${tet.canChi} ${tet.year}! | Ngày Giờ`
    : `Còn ${tet.daysLeft} ngày nữa đến Tết ${tet.canChi} ${tet.year} | Ngày Giờ`;
  const description = `Đếm ngày đến Tết Nguyên Đán ${tet.canChi} ${tet.year} (${formatDisplayDate(tet.solarDate)}). Còn ${tet.daysLeft} ngày nữa là Tết.`;
  return {
    title,
    description,
    alternates: { canonical: `${siteConfig.url}/con-bao-nhieu-ngay-den-tet` },
    openGraph: { title, description, url: `${siteConfig.url}/con-bao-nhieu-ngay-den-tet`, siteName: siteConfig.name, locale: "vi_VN", type: "website", images: [{ url: "/og-home.svg", width: 1200, height: 630, alt: title }] },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  };
}

export default function ConBaoNhieuNgayDenTetPage() {
  const today = getVietnamTodayParts();
  const tet = getTetInfo(today);
  const todayDisplay = formatDisplayDate(today);
  const tetDisplay = formatDisplayDate(tet.solarDate);

  const jsonLd = [
    webPageSchema({
      name: `Còn bao nhiêu ngày đến Tết ${tet.canChi} ${tet.year}`,
      url: `${siteConfig.url}/con-bao-nhieu-ngay-den-tet`,
      description: `Đếm ngược đến Tết Nguyên Đán ${tet.canChi} ${tet.year}. Hôm nay ${todayDisplay}, còn ${tet.daysLeft} ngày.`,
      breadcrumb: [{ name: "Còn bao nhiêu ngày đến Tết", url: `${siteConfig.url}/con-bao-nhieu-ngay-den-tet` }],
    }),
    faqSchema([
      { q: `Tết ${tet.year} là ngày mấy dương lịch?`, a: `Tết Nguyên Đán ${tet.canChi} năm ${tet.year} (mùng 1/1 âm lịch) rơi vào ngày ${tetDisplay} dương lịch.` },
      { q: `Còn bao nhiêu ngày nữa là Tết ${tet.year}?`, a: `Tính từ hôm nay (${todayDisplay}), còn ${tet.daysLeft} ngày nữa đến Tết ${tet.canChi} ${tet.year}.` },
      { q: `Tết ${tet.year} là năm con gì?`, a: `Tết ${tet.year} là năm ${tet.canChi}. ${tet.canChi.split(" ")[1] === "Tý" ? "Năm con Chuột." : tet.canChi.split(" ")[1] === "Sửu" ? "Năm con Trâu." : tet.canChi.split(" ")[1] === "Dần" ? "Năm con Hổ." : tet.canChi.split(" ")[1] === "Mão" ? "Năm con Mèo." : tet.canChi.split(" ")[1] === "Thìn" ? "Năm con Rồng." : tet.canChi.split(" ")[1] === "Tỵ" ? "Năm con Rắn." : tet.canChi.split(" ")[1] === "Ngọ" ? "Năm con Ngựa." : tet.canChi.split(" ")[1] === "Mùi" ? "Năm con Dê." : tet.canChi.split(" ")[1] === "Thân" ? "Năm con Khỉ." : tet.canChi.split(" ")[1] === "Dậu" ? "Năm con Gà." : tet.canChi.split(" ")[1] === "Tuất" ? "Năm con Chó." : "Năm con Heo."}` },
      { q: `Còn bao nhiêu tuần nữa đến Tết ${tet.year}?`, a: `Từ hôm nay (${todayDisplay}) còn khoảng ${Math.ceil(tet.daysLeft / 7)} tuần nữa đến Tết ${tet.canChi} ${tet.year}.` },
      { q: "Tết Âm lịch khác Tết Dương lịch thế nào?", a: "Tết Dương lịch (Tết Tây) là ngày 1/1 theo lịch Gregory, cố định mỗi năm. Tết Âm lịch (Tết Nguyên Đán) là mùng 1 tháng Giêng âm lịch, thường rơi vào cuối tháng 1 hoặc đầu tháng 2 dương lịch và thay đổi mỗi năm." },
    ]),
  ];

  return (
    <>
      <Header currentYear={today.year} />
      <main className="container mainStack">
        <section className="heroCard" aria-labelledby="tet-countdown-title">
          <p className="eyebrow">Đếm ngược đến Tết</p>
          <h1 id="tet-countdown-title">
            {tet.daysLeft === 0 ? `Hôm nay là mùng 1 Tết ${tet.canChi}!` : `Còn ${tet.daysLeft} ngày nữa đến Tết`}
          </h1>

          <div className="todayGrid" style={{ marginTop: "24px" }}>
            <article className="dateBox">
              <span className="boxTitle">Hôm nay</span>
              <strong className="monthTitle">{today.day}/{today.month}/{today.year}</strong>
              <span className="bigDate">{today.day}</span>
              <span className="subDate">{todayDisplay}</span>
            </article>

            <article className="dateBox lunarBox">
              <span className="boxTitle">Mùng 1 Tết</span>
              <strong className="monthTitle">{tet.solarDate.day}/{tet.solarDate.month}/{tet.solarDate.year}</strong>
              <span className="bigDate">{tet.solarDate.day}</span>
              <span className="subDate">Năm {tet.canChi}</span>
            </article>

            <article className="infoBox">
              <p><strong>Tết Nguyên Đán</strong> năm <span>{tet.canChi} {tet.year}</span></p>
              <p>Mùng 1 Tết rơi vào <span>{tetDisplay}</span> dương lịch.</p>
              <p>Từ hôm nay còn <span style={{ fontSize: "2rem", fontWeight: 900 }}>{tet.daysLeft}</span> ngày nữa là Tết.</p>
              <p className="disclaimer">Ngày Tết tính theo mùng 1/1 âm lịch giờ Việt Nam.</p>
            </article>
          </div>
        </section>

        <article className="seoArticle">
          <h2>Tết Nguyên Đán {tet.canChi} {tet.year} là ngày nào?</h2>
          <p>Tết Nguyên Đán {tet.canChi} năm {tet.year} (mùng 1 tháng Giêng âm lịch) rơi vào ngày <strong>{tetDisplay}</strong> theo dương lịch. Từ hôm nay ({todayDisplay}), còn <strong>{tet.daysLeft} ngày</strong> — tức khoảng {Math.ceil(tet.daysLeft / 7)} tuần nữa là Tết.</p>
          <h2>Cách tính ngày còn lại đến Tết</h2>
          <p>Số ngày còn lại được tính từ hôm nay ({todayDisplay}) đến mùng 1 Tết ({tetDisplay}). Trang này tự động cập nhật mỗi ngày theo giờ Việt Nam (GMT+7). Ngày giao thừa (đêm 30 tháng Chạp) là ngày liền trước mùng 1, tức sẽ rơi vào ngày {tet.solarDate.day - 1 > 0 ? `${tet.solarDate.day - 1}/${tet.solarDate.month}` : `cuối tháng ${tet.solarDate.month - 1}`}/{tet.solarDate.year} dương lịch.</p>
          <h2>Tết Nguyên Đán có ý nghĩa gì?</h2>
          <p>Tết Nguyên Đán là ngày đầu năm mới theo lịch âm, thường diễn ra vào cuối tháng 1 hoặc đầu tháng 2 dương lịch. Đây là dịp gia đình sum họp, thờ cúng tổ tiên và chào đón năm mới với nhiều phong tục như lì xì, chúc Tết, hái lộc. Người lao động thường được nghỉ Tết 7 ngày theo quy định nhà nước.</p>
          <h2>Xem đếm ngày đến Tết theo từng năm</h2>
          <div className="dayLinkList">
            {[tet.year - 1, tet.year, tet.year + 1, tet.year + 2].map((y) => {
              const t = getTetInfoForYear(y, today);
              return (
                <Link key={y} href={`/tet/${y}`} className="eventPill blue">
                  Tết {t.canChi} {y} – {formatDisplayDate(t.solarDate)}
                </Link>
              );
            })}
          </div>
          <h2>Lịch các ngày quan trọng quanh Tết {tet.canChi} {tet.year}</h2>
          <div className="dayLinkList">
            <Link href={`/ram-thang-chap/${tet.year}`} className="eventPill blue">Rằm tháng Chạp {tet.year}</Link>
            <Link href={`/ong-cong-ong-tao/${tet.year}`} className="eventPill blue">Ông Công Ông Táo {tet.year} (23 tháng Chạp)</Link>
            <Link href={`/giao-thua/${tet.year}`} className="eventPill blue">Giao thừa {tet.year} (30 tháng Chạp)</Link>
            <Link href={`/lich-nghi-tet/${tet.year}`} className="eventPill green">Lịch nghỉ Tết {tet.year}</Link>
          </div>
          <h2>Xem thêm</h2>
          <div className="dayLinkList">
            <Link href={`/lich-nghi-le/${tet.solarDate.year}`} className="eventPill green">Lịch nghỉ lễ {tet.solarDate.year}</Link>
            <Link href={`/am-lich/nam/${tet.solarDate.year}/thang/${tet.solarDate.month}`} className="eventPill green">Lịch âm tháng {tet.solarDate.month}/{tet.solarDate.year}</Link>
          </div>
        </article>
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
