import Link from "next/link";
import { formatDisplayDate } from "@/lib/date";
import { amLichDayHref, gioHoangDaoDayHref } from "@/lib/calendar/urls";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getHomNayData, type HomNayData } from "@/lib/homNay";
import { siteConfig, webPageSchema, faqSchema } from "@/lib/site";
import type { ReactNode } from "react";

type Focus = {
  eyebrow: string;
  h1: string;
  intro?: ReactNode;
};

// Các khối nội dung dùng chung cho cụm "Hôm nay". Chỉ phần hero (eyebrow/h1/intro) thay đổi theo từng biến thể.
export function HomNaySections({ data, focus }: { data: HomNayData; focus: Focus }) {
  const { today, info, details, tet, week, weekYear, doy, goodHoursText, goodHourBranches, events } = data;

  return (
    <>
      <section className="heroCard" aria-labelledby="hom-nay-title">
        <p className="eyebrow">{focus.eyebrow}</p>
        <h1 id="hom-nay-title">{focus.h1}</h1>
        {focus.intro && <p className="homeHeroLead" style={{ marginTop: 10 }}>{focus.intro}</p>}

        <div className="todayGrid" style={{ marginTop: 24 }}>
          <article className="dateBox">
            <span className="boxTitle">Dương lịch</span>
            <strong className="monthTitle">Tháng {today.month}<small>Năm {today.year}</small></strong>
            <span className="bigDate">{today.day}</span>
            <span className="subDate">{info.weekdayName}</span>
          </article>

          <article className="dateBox lunarBox">
            <span className="boxTitle">Âm lịch</span>
            <strong className="monthTitle">Tháng {info.lunar.month}{info.lunar.isLeap ? " nhuận" : ""}<small>Năm {info.canChi.year}</small></strong>
            <span className="bigDate">{info.lunar.day}</span>
            <span className="subDate">Ngày {info.canChi.day} · Tiết {info.solarTerm}</span>
          </article>

          <article className="infoBox">
            <p>Tuần thứ <strong>{week}</strong> trong năm {weekYear} · Ngày thứ <strong>{doy}</strong> của năm.</p>
            <p>Hôm nay là ngày <strong>{info.quality.label}</strong> — {details.overallLabel}.</p>
            <p>Giờ hoàng đạo: <strong>{goodHourBranches}</strong>.</p>
            {tet.daysLeft > 0 && <p>Còn <strong>{tet.daysLeft}</strong> ngày nữa đến Tết {tet.canChi} {tet.year}.</p>}
            <p className="disclaimer">Số liệu tính theo giờ Việt Nam (GMT+7), tự cập nhật mỗi ngày.</p>
          </article>
        </div>
      </section>

      {events.length > 0 && (
        <section className="heroCard" aria-labelledby="events-title">
          <h2 id="events-title" className="monthTitle" style={{ marginBottom: 14 }}>Sự kiện & ngày lễ hôm nay</h2>
          <div className="dayLinkList">
            {events.map((ev, i) => (
              ev.href
                ? <Link key={`${ev.title}-${i}`} href={ev.href} className={`eventPill ${ev.color === "red" ? "red" : ev.color === "blue" ? "blue" : "green"}`}>{ev.title}</Link>
                : <span key={`${ev.title}-${i}`} className={`eventPill ${ev.color === "red" ? "red" : ev.color === "blue" ? "blue" : "green"}`}>{ev.title}</span>
            ))}
          </div>
        </section>
      )}

      <section className="heroCard" aria-labelledby="tot-xau-title">
        <h2 id="tot-xau-title" className="monthTitle" style={{ marginBottom: 12 }}>Ngày tốt xấu & giờ tốt hôm nay</h2>
        <div className="todayGrid">
          <article className="infoBox">
            <p><strong>Đánh giá:</strong> {details.overallLabel} ({info.quality.label})</p>
            <p><strong>Việc nên làm:</strong> {details.shouldDo.slice(0, 5).join(", ") || "Đang cập nhật"}.</p>
            <p><strong>Việc nên tránh:</strong> {details.shouldAvoid.slice(0, 5).join(", ") || "Đang cập nhật"}.</p>
          </article>
          <article className="infoBox">
            <p><strong>Giờ hoàng đạo (giờ tốt):</strong> {goodHoursText}.</p>
            <p><strong>Trực ngày:</strong> Trực {details.twelveDirect.name}.</p>
            <p style={{ marginTop: 6 }}>
              <Link href={gioHoangDaoDayHref(today)} className="tshInlineLink">Xem chi tiết giờ hoàng đạo →</Link>
            </p>
          </article>
        </div>
      </section>

      <article className="seoArticle">
        <h2>Hôm nay là thứ mấy, ngày mấy?</h2>
        <p>Hôm nay là <strong>{info.weekdayName}</strong>, ngày <strong>{today.day}/{today.month}/{today.year}</strong> dương lịch. Theo âm lịch, hôm nay là ngày <strong>{info.lunar.day}/{info.lunar.month}/{info.lunar.year}</strong> — ngày {info.canChi.day}, tháng {info.canChi.month}, năm {info.canChi.year}. Trang này tự động cập nhật mỗi ngày theo giờ Việt Nam.</p>

        <h2>Hôm nay là tuần thứ mấy trong năm?</h2>
        <p>Tính theo chuẩn ISO-8601 (tuần bắt đầu từ thứ Hai), hôm nay thuộc <strong>tuần thứ {week}</strong> của năm {weekYear}, đồng thời là <strong>ngày thứ {doy}</strong> trong năm.</p>

        <h2>Hôm nay có ngày lễ, sự kiện gì?</h2>
        <p>{events.length > 0 ? `Hôm nay có: ${events.map((e) => e.title).join(", ")}.` : "Hôm nay không trùng ngày lễ lớn theo lịch của chúng tôi."} {tet.daysLeft > 0 ? `Còn ${tet.daysLeft} ngày nữa là đến Tết Nguyên Đán ${tet.canChi} ${tet.year} (${formatDisplayDate(tet.solarDate)}).` : ""}</p>

        <h2>Hôm nay tốt hay xấu? Giờ nào đẹp?</h2>
        <p>Hôm nay được xếp loại <strong>{info.quality.label}</strong> ({details.overallLabel}). {info.quality.note} Giờ hoàng đạo (giờ tốt) trong ngày gồm: {goodHoursText}.</p>

        <h2>Công cụ liên quan</h2>
        <div className="dayLinkList">
          <Link href="/hom-nay" className="eventPill green">Hôm nay là ngày gì</Link>
          <Link href="/am-lich-hom-nay" className="eventPill green">Lịch âm hôm nay</Link>
          <Link href="/ngay-tot-xau-hom-nay" className="eventPill green">Ngày tốt xấu hôm nay</Link>
          <Link href="/gio-hoang-dao-hom-nay" className="eventPill green">Giờ hoàng đạo hôm nay</Link>
          <Link href={amLichDayHref(today)} className="eventPill blue">Chi tiết ngày âm hôm nay</Link>
          <Link href="/con-bao-nhieu-ngay-den-tet" className="eventPill blue">Còn bao nhiêu ngày đến Tết</Link>
        </div>
      </article>
    </>
  );
}

// Khung trang đầy đủ cho cụm "Hôm nay" — tái dùng cho /hom-nay và 4 biến thể.
export function HomNayPageShell({
  path,
  focus,
  faq,
  schemaName,
}: {
  path: string;
  focus: Focus;
  faq: { q: string; a: string }[];
  schemaName: string;
}) {
  const data = getHomNayData();
  const jsonLd = [
    webPageSchema({
      name: schemaName,
      url: `${siteConfig.url}${path}`,
      description: "Thông tin đầy đủ về hôm nay: thứ, ngày dương lịch, ngày âm lịch, tuần trong năm, ngày lễ, giờ tốt và ngày tốt xấu.",
      breadcrumb: [{ name: focus.eyebrow, url: `${siteConfig.url}${path}` }],
    }),
    faqSchema(faq),
  ];
  return (
    <>
      <Header currentYear={data.today.year} />
      <main className="container mainStack">
        <div className="pageFullscreenBg" style={{ backgroundImage: "linear-gradient(90deg, rgba(255,255,255,.94) 0%, rgba(255,255,255,.82) 42%, rgba(255,255,255,.52) 100%), linear-gradient(180deg, rgba(245,251,247,.18) 0%, rgba(245,251,247,.9) 100%), url(/bg-page-calendar.png)" }} aria-hidden="true" />
        <HomNaySections data={data} focus={focus} />
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
