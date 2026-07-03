import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { amLichDayHref } from "@/lib/calendar/urls";
import { getHolidayCanonical, getHolidayDate, getHolidayPageConfig, HOLIDAY_PAGE_CONFIGS, type HolidayPageConfig, type HolidayPageSlug } from "@/lib/calendar/holiday-pages";
import { formatDisplayDate, getVietnamTodayParts, type DateParts } from "@/lib/date";
import { faqSchema, siteConfig, webPageSchema } from "@/lib/site";

function dateMs(date: DateParts) {
  return new Date(date.year, date.month - 1, date.day).getTime();
}

function daysBetween(from: DateParts, to: DateParts) {
  return Math.ceil((dateMs(to) - dateMs(from)) / 86400000);
}

function resolveDisplayYear(config: HolidayPageConfig, fixedYear?: number) {
  if (fixedYear) return fixedYear;

  const today = getVietnamTodayParts();
  const thisYearDate = getHolidayDate(config, today.year);
  if (!thisYearDate) return today.year;

  return daysBetween(today, thisYearDate) < 0 ? today.year + 1 : today.year;
}

export function buildHolidaySeoMetadata(slug: HolidayPageSlug, fixedYear?: number): Metadata {
  const config = getHolidayPageConfig(slug);
  if (!config) return { title: "Ngày lễ không hợp lệ | Ngày Giờ", robots: { index: false, follow: false } };

  const year = resolveDisplayYear(config, fixedYear);
  const solar = getHolidayDate(config, year);
  const dateText = solar ? formatDisplayDate(solar) : "";
  const canonical = getHolidayCanonical(slug, fixedYear);
  const title = fixedYear
    ? `${config.title} ${year} là ngày mấy? ${dateText} | Ngày Giờ`
    : `${config.title} là ngày mấy? Lịch ${config.shortTitle} ${year} | Ngày Giờ`;
  const description = `${config.title} ${year} vào ${config.dateLabel}${dateText ? `, tức ${dateText} dương lịch` : ""}. Xem còn bao nhiêu ngày, ý nghĩa, phong tục và lịch các năm gần nhất.`;

  return {
    title,
    description,
    keywords: [...config.keywords, `${config.shortTitle.toLowerCase()} ${year}`, `${config.title.toLowerCase()} ${year}`],
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}${canonical}`,
      siteName: siteConfig.name,
      locale: "vi_VN",
      type: "website",
      images: [{ url: "/home.jpg", width: 1200, height: 630, alt: title }],
    },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  };
}

type Props = {
  slug: HolidayPageSlug;
  fixedYear?: number;
};

export function HolidaySeoPage({ slug, fixedYear }: Props) {
  const config = getHolidayPageConfig(slug);
  if (!config) return null;

  const today = getVietnamTodayParts();
  const displayYear = resolveDisplayYear(config, fixedYear);
  const solar = getHolidayDate(config, displayYear);
  const nextSolar = getHolidayDate(config, displayYear + 1);
  const dateText = solar ? formatDisplayDate(solar) : "";
  const daysLeft = solar ? daysBetween(today, solar) : 0;
  const absoluteDaysLeft = fixedYear ? daysLeft : Math.max(0, daysLeft);
  const canonical = getHolidayCanonical(slug, fixedYear);
  const relatedYears = [displayYear - 1, displayYear, displayYear + 1, displayYear + 2].filter((year) => year >= 1900 && year <= 2050);
  const otherHolidays = HOLIDAY_PAGE_CONFIGS.filter((item) => item.slug !== slug).slice(0, 5);

  const jsonLd = [
    webPageSchema({
      name: `${config.title} ${displayYear}`,
      url: `${siteConfig.url}${canonical}`,
      description: `${config.title} ${displayYear} vào ${config.dateLabel}${dateText ? `, tức ${dateText} dương lịch` : ""}.`,
      breadcrumb: [
        { name: "Lịch nghỉ lễ", url: `${siteConfig.url}/lich-nghi-le` },
        { name: config.title, url: `${siteConfig.url}${canonical}` },
      ],
    }),
    faqSchema([
      { q: `${config.title} ${displayYear} là ngày mấy dương lịch?`, a: `${config.title} ${displayYear} vào ${config.dateLabel}${dateText ? `, tức ${dateText} dương lịch` : ""}.` },
      { q: `${config.title} có được nghỉ không?`, a: config.dayOffNote },
      { q: `${config.title} có ý nghĩa gì?`, a: config.meaning },
    ]),
  ];

  return (
    <>
      <Header currentYear={today.year} />
      <main className="container mainStack">
        <section className="heroCard" aria-labelledby="holiday-title">
          <p className="eyebrow">Ngày lễ · Lịch Việt Nam</p>
          <h1 id="holiday-title">{config.title} {displayYear}: {dateText || config.dateLabel}</h1>
          <p className="converterIntro yearIntroText">{config.description} Trang này giúp tra ngày dương lịch, còn bao nhiêu ngày, ý nghĩa, phong tục và liên kết lịch âm chi tiết.</p>
          <div className="todayGrid" style={{ marginTop: "24px" }}>
            <article className="dateBox">
              <span className="boxTitle">Ngày lễ</span>
              <strong className="monthTitle">{config.dateLabel}</strong>
              <span className="bigDate">{config.type === "lunar" ? config.lunarDay : config.solarDay}</span>
              <span className="subDate">{config.type === "lunar" ? "Âm lịch" : "Dương lịch"}</span>
            </article>
            <article className="dateBox lunarBox">
              <span className="boxTitle">Dương lịch {displayYear}</span>
              <strong className="monthTitle">{dateText}</strong>
              <span className="bigDate">{solar?.day}</span>
              <span className="subDate">Tháng {solar?.month}/{displayYear}</span>
            </article>
            <article className="infoBox">
              <p><strong>{config.title} {displayYear}</strong></p>
              <p>{config.dateLabel}{dateText ? <> &rarr; <span>{dateText}</span> dương lịch.</> : null}</p>
              {absoluteDaysLeft > 0 && <p>Còn <span style={{ fontSize: "1.8rem", fontWeight: 900 }}>{absoluteDaysLeft}</span> ngày nữa.</p>}
              {daysLeft === 0 && <p><strong>Hôm nay là {config.title}!</strong></p>}
              {daysLeft < 0 && fixedYear && <p className="disclaimer">Mốc này đã qua so với hôm nay ({formatDisplayDate(today)}).</p>}
              <p className="disclaimer">{config.isOfficialDayOff ? "Ngày nghỉ lễ chính thức." : "Không phải ngày nghỉ lễ chính thức."}</p>
            </article>
          </div>
        </section>

        <article className="seoArticle">
          <h2>{config.title} là ngày gì?</h2>
          <p>{config.description}</p>
          <p>{config.meaning}</p>
          <h2>{config.title} {displayYear} là ngày mấy?</h2>
          <p>Năm {displayYear}, <strong>{config.title}</strong> rơi vào <strong>{config.dateLabel}</strong>{dateText ? <> tức <strong>{dateText}</strong> dương lịch</> : null}. {nextSolar ? <>Năm kế tiếp, {config.shortTitle} {displayYear + 1} dự kiến rơi vào {formatDisplayDate(nextSolar)}.</> : null}</p>
          <h2>{config.title} có được nghỉ không?</h2>
          <p>{config.dayOffNote}</p>
          <h2>Phong tục thường gặp</h2>
          <ul>
            {config.customs.map((item) => <li key={item}>{item}</li>)}
          </ul>
          <h2>Xem {config.shortTitle} theo năm</h2>
          <div className="dayLinkList">
            {relatedYears.map((year) => {
              const date = getHolidayDate(config, year);
              return date ? <Link key={year} href={`/${config.slug}/${year}`} className="eventPill blue">{config.shortTitle} {year} – {formatDisplayDate(date)}</Link> : null;
            })}
            <Link href="/lich-nghi-le" className="eventPill green">Lịch nghỉ lễ</Link>
            <Link href={`/lich-nghi-le/${displayYear}`} className="eventPill green">Lịch nghỉ lễ {displayYear}</Link>
            {solar && <Link href={amLichDayHref(solar)} className="eventPill green">Lịch âm ngày này</Link>}
          </div>
          <h2>Các ngày lễ khác</h2>
          <div className="dayLinkList">
            {otherHolidays.map((item) => <Link key={item.slug} href={`/${item.slug}`} className="eventPill blue">{item.shortTitle}</Link>)}
          </div>
        </article>
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
