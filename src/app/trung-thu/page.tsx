import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getVietnamTodayParts, formatDisplayDate } from "@/lib/date";
import { convertLunar2Solar } from "@/lib/calendar/lunar";
import { siteConfig, webPageSchema, faqSchema } from "@/lib/site";
import { amLichDayHref } from "@/lib/calendar/urls";

export const dynamic = "force-dynamic";

function getTrungThu(year: number) {
  const solar = convertLunar2Solar(15, 8, year, false);
  return solar;
}

export async function generateMetadata(): Promise<Metadata> {
  const today = getVietnamTodayParts();
  const solar = getTrungThu(today.year);
  const solarNext = getTrungThu(today.year + 1);
  const dateStr = solar ? formatDisplayDate(solar) : "";
  const title = `Tết Trung Thu ${today.year} là ngày mấy? ${dateStr} | Ngày Giờ`;
  const description = `Tết Trung Thu năm ${today.year} vào ngày 15/8 âm lịch, tức ${dateStr} dương lịch. Tìm hiểu ý nghĩa, phong tục và ngày Tết Trung Thu ${today.year + 1}.`;
  return {
    title,
    description,
    alternates: { canonical: `${siteConfig.url}/trung-thu` },
    openGraph: { title, description, url: `${siteConfig.url}/trung-thu`, siteName: siteConfig.name, locale: "vi_VN", type: "website" },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  };
}

export default function TrungThuPage() {
  const today = getVietnamTodayParts();
  const solar = getTrungThu(today.year);
  const solarNext = getTrungThu(today.year + 1);
  const dateStr = solar ? formatDisplayDate(solar) : "";
  const dateStrNext = solarNext ? formatDisplayDate(solarNext) : "";

  const daysLeft = solar
    ? Math.ceil((new Date(solar.year, solar.month - 1, solar.day).getTime() - new Date(today.year, today.month - 1, today.day).getTime()) / 86400000)
    : 0;
  const passed = daysLeft < 0;

  const displayYear = passed ? today.year + 1 : today.year;
  const displayDate = passed ? dateStrNext : dateStr;
  const displayDays = passed ? (solarNext ? Math.ceil((new Date(solarNext.year, solarNext.month - 1, solarNext.day).getTime() - new Date(today.year, today.month - 1, today.day).getTime()) / 86400000) : 0) : daysLeft;

  const jsonLd = [
    webPageSchema({
      name: `Tết Trung Thu ${displayYear} là ngày mấy?`,
      url: `${siteConfig.url}/trung-thu`,
      description: `Tết Trung Thu ${displayYear} vào ngày ${displayDate} dương lịch (15/8 âm lịch).`,
      breadcrumb: [
        { name: "Lịch nghỉ lễ", url: `${siteConfig.url}/lich-nghi-le` },
        { name: "Tết Trung Thu", url: `${siteConfig.url}/trung-thu` },
      ],
    }),
    faqSchema([
      { q: `Tết Trung Thu ${displayYear} là ngày mấy dương lịch?`, a: `Tết Trung Thu ${displayYear} vào ngày 15 tháng 8 âm lịch, tức ngày ${displayDate} dương lịch.` },
      { q: "Tết Trung Thu có phải ngày nghỉ lễ không?", a: "Tết Trung Thu (Rằm tháng Tám) không phải ngày nghỉ lễ chính thức theo quy định nhà nước Việt Nam. Đây là ngày lễ truyền thống, không có nghỉ bù." },
      { q: "Ý nghĩa của Tết Trung Thu là gì?", a: "Tết Trung Thu là dịp trăng rằm tháng Tám, gắn liền với phong tục rước đèn, phá cỗ, và là ngày dành cho trẻ em. Người lớn thường tặng bánh trung thu, ngắm trăng và sum họp gia đình." },
      { q: `Còn bao nhiêu ngày nữa đến Tết Trung Thu ${displayYear}?`, a: `Từ hôm nay (${formatDisplayDate(today)}), còn ${displayDays} ngày nữa đến Tết Trung Thu ${displayYear} (${displayDate}).` },
    ]),
  ];

  return (
    <>
      <Header currentYear={today.year} />
      <main className="container mainStack">
        <section className="heroCard" aria-labelledby="trung-thu-title">
          <p className="eyebrow">Ngày lễ truyền thống</p>
          <h1 id="trung-thu-title">Tết Trung Thu {displayYear}: Ngày {displayDate}</h1>
          <div className="todayGrid" style={{ marginTop: "24px" }}>
            <article className="dateBox">
              <span className="boxTitle">Âm lịch</span>
              <strong className="monthTitle">15/8/{displayYear}</strong>
              <span className="bigDate">15</span>
              <span className="subDate">Rằm tháng Tám</span>
            </article>
            <article className="dateBox lunarBox">
              <span className="boxTitle">Dương lịch</span>
              <strong className="monthTitle">{displayDate}</strong>
              <span className="bigDate">{passed ? solarNext?.day : solar?.day}</span>
              <span className="subDate">Tháng {passed ? solarNext?.month : solar?.month}/{displayYear}</span>
            </article>
            <article className="infoBox">
              <p><strong>Tết Trung Thu {displayYear}</strong></p>
              <p>Ngày 15/8 âm lịch &rarr; <span>{displayDate}</span> dương lịch.</p>
              {displayDays > 0 && <p>Còn <span style={{ fontSize: "1.8rem", fontWeight: 900 }}>{displayDays}</span> ngày nữa.</p>}
              {displayDays === 0 && <p><strong>Hôm nay là Tết Trung Thu!</strong></p>}
              <p className="disclaimer">Không phải ngày nghỉ lễ chính thức.</p>
            </article>
          </div>
        </section>

        <article className="seoArticle">
          <h2>Tết Trung Thu là gì?</h2>
          <p>Tết Trung Thu (Rằm tháng Tám âm lịch) là một trong những ngày lễ truyền thống quan trọng của người Việt, diễn ra vào ngày 15 tháng 8 âm lịch hàng năm. Đây là dịp trăng tròn và sáng nhất trong năm, gắn liền với phong tục rước đèn lồng, phá cỗ, múa lân và tặng bánh trung thu.</p>
          <h2>Tết Trung Thu có phải ngày nghỉ không?</h2>
          <p>Tết Trung Thu <strong>không phải ngày nghỉ lễ chính thức</strong> theo quy định của Nhà nước Việt Nam. Người lao động vẫn đi làm bình thường trong ngày này. Chỉ trẻ em ở một số trường mầm non và tiểu học có thể tổ chức hoạt động vào buổi chiều/tối.</p>
          <h2>Phong tục Tết Trung Thu</h2>
          <p>Các phong tục phổ biến trong dịp Tết Trung Thu bao gồm: <strong>rước đèn</strong> (đèn ông sao, đèn kéo quân), <strong>phá cỗ</strong> (bày cỗ với bưởi, bánh, hoa quả), <strong>múa lân</strong>, và tặng <strong>bánh trung thu</strong> (bánh nướng, bánh dẻo). Đây còn được gọi là "Tết thiếu nhi" vì trẻ em là trung tâm của ngày lễ.</p>
          <h2>Xem Tết Trung Thu theo năm</h2>
          <div className="dayLinkList">
            {[today.year - 1, today.year, today.year + 1, today.year + 2].map((y) => {
              const s = getTrungThu(y);
              return s ? (
                <Link key={y} href={`/trung-thu/${y}`} className="eventPill blue">
                  Trung Thu {y} – {formatDisplayDate(s)}
                </Link>
              ) : null;
            })}
          </div>
          <h2>Xem thêm</h2>
          <div className="dayLinkList">
            <Link href={`/lich-nghi-le/${today.year}`} className="eventPill green">Lịch nghỉ lễ {today.year}</Link>
            <Link href="/con-bao-nhieu-ngay-den-tet" className="eventPill green">Còn bao nhiêu ngày đến Tết</Link>
            {solar && <Link href={amLichDayHref(solar)} className="eventPill blue">Lịch âm ngày Trung Thu {today.year}</Link>}
          </div>
        </article>
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
