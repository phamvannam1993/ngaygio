import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { formatDisplayDate } from "@/lib/date";
import { convertSolar2Lunar } from "@/lib/calendar/lunar";
import { getCountdownEvent, countdownToday, COUNTDOWN_SLUGS } from "@/lib/countdown";
import { siteConfig, webPageSchema, faqSchema } from "@/lib/site";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export function generateStaticParams() {
  return COUNTDOWN_SLUGS.map((slug) => ({ slug }));
}

function pagePath(slug: string) {
  return `/con-bao-nhieu-ngay-nua-den-${slug}`;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const ev = getCountdownEvent(slug);
  if (!ev) return {};
  const title = `Còn bao nhiêu ngày nữa đến ${ev.name}? Còn ${ev.daysLeft} ngày | Ngày Giờ`;
  const description = `${ev.longName}: còn ${ev.daysLeft} ngày (khoảng ${ev.weeksLeft} tuần) — ${ev.name} rơi vào ${formatDisplayDate(ev.target)} dương lịch (${ev.lunarLabel}). Xem đồng hồ đếm ngược.`;
  return {
    title,
    description,
    keywords: [`còn bao nhiêu ngày nữa đến ${ev.name.toLowerCase()}`, `đếm ngược ${ev.name.toLowerCase()}`, `${ev.name.toLowerCase()} còn bao nhiêu ngày`, `${ev.name.toLowerCase()} là ngày nào`],
    alternates: { canonical: `${siteConfig.url}${pagePath(slug)}` },
    openGraph: { title, description, url: `${siteConfig.url}${pagePath(slug)}`, siteName: siteConfig.name, locale: "vi_VN", type: "website", images: [{ url: "/home.jpg", width: 1200, height: 630, alt: title }] },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  };
}

export default async function CountdownPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ev = getCountdownEvent(slug);
  if (!ev) {
    notFound();
    return null;
  }
  const { today, todayDisplay } = countdownToday();
  const targetLunar = convertSolar2Lunar(ev.target.day, ev.target.month, ev.target.year);
  const targetDisplay = formatDisplayDate(ev.target);

  const jsonLd = [
    webPageSchema({
      name: ev.longName,
      url: `${siteConfig.url}${pagePath(slug)}`,
      description: ev.meaning,
      breadcrumb: [{ name: `Đếm ngược ${ev.name}`, url: `${siteConfig.url}${pagePath(slug)}` }],
    }),
    faqSchema([
      { q: `Còn bao nhiêu ngày nữa đến ${ev.name}?`, a: `Tính từ hôm nay (${todayDisplay}), còn ${ev.daysLeft} ngày (khoảng ${ev.weeksLeft} tuần) nữa đến ${ev.name}.` },
      { q: `${ev.name} là ngày nào?`, a: `${ev.name} rơi vào ${targetDisplay} dương lịch, tức ${targetLunar.day}/${targetLunar.month} âm lịch (${ev.lunarLabel}).` },
      { q: `${ev.name} có ý nghĩa gì?`, a: ev.meaning },
    ]),
  ];

  return (
    <>
      <Header currentYear={today.year} />
      <main className="container mainStack">
        <div className="pageFullscreenBg" style={{ backgroundImage: "linear-gradient(90deg, rgba(255,255,255,.94) 0%, rgba(255,255,255,.82) 42%, rgba(255,255,255,.52) 100%), linear-gradient(180deg, rgba(245,251,247,.18) 0%, rgba(245,251,247,.9) 100%), url(/bg-page-calendar.png)" }} aria-hidden="true" />

        <section className="heroCard" aria-labelledby="cd-title">
          <p className="eyebrow">Đếm ngược đến {ev.name}</p>
          <h1 id="cd-title">Còn bao nhiêu ngày nữa đến {ev.name}?</h1>
          <p className="homeHeroLead" style={{ marginTop: 8 }}>
            {ev.daysLeft === 0 ? `Hôm nay chính là ${ev.name}!` : <>Còn <strong>{ev.daysLeft} ngày</strong> (khoảng {ev.weeksLeft} tuần) nữa — {ev.name} rơi vào {formatDisplayDate(ev.target)} dương lịch.</>}
          </p>

          <div className="todayGrid" style={{ marginTop: 24 }}>
            <article className="dateBox">
              <span className="boxTitle">Còn lại</span>
              <span className="bigDate">{ev.daysLeft}</span>
              <span className="subDate">ngày (~{ev.weeksLeft} tuần)</span>
            </article>
            <article className="dateBox lunarBox">
              <span className="boxTitle">{ev.name}</span>
              <strong className="monthTitle">{ev.target.day}/{ev.target.month}<small>Năm {ev.target.year}</small></strong>
              <span className="bigDate">{ev.target.day}</span>
              <span className="subDate">{ev.lunarLabel}</span>
            </article>
            <article className="infoBox">
              <p><strong>{ev.name}</strong> rơi vào <span>{targetDisplay}</span> dương lịch.</p>
              <p>Tức ngày <span>{targetLunar.day}/{targetLunar.month}</span> âm lịch.</p>
              <p>Từ hôm nay ({todayDisplay}) còn <strong>{ev.daysLeft}</strong> ngày, khoảng <strong>{ev.weeksLeft}</strong> tuần.</p>
              <p className="disclaimer">Tự cập nhật mỗi ngày theo giờ Việt Nam (GMT+7).</p>
            </article>
          </div>
        </section>

        <article className="seoArticle">
          <h2>Còn bao nhiêu ngày nữa đến {ev.name}?</h2>
          <p>Tính từ hôm nay ({todayDisplay}), còn <strong>{ev.daysLeft} ngày</strong> — tức khoảng <strong>{ev.weeksLeft} tuần</strong> nữa là đến {ev.name}. {ev.name} rơi vào ngày <strong>{targetDisplay}</strong> dương lịch ({targetLunar.day}/{targetLunar.month} âm lịch).</p>

          <h2>{ev.name} là ngày gì?</h2>
          <p>{ev.meaning}</p>

          <h2>Đếm ngược các dịp khác</h2>
          <div className="dayLinkList">
            <Link href="/con-bao-nhieu-ngay-nua-den-tet-2026" className="eventPill blue">Đến Tết 2026</Link>
            <Link href="/con-bao-nhieu-ngay-nua-den-trung-thu-2026" className="eventPill blue">Đến Trung thu 2026</Link>
            <Link href="/con-bao-nhieu-ngay-nua-den-noel" className="eventPill blue">Đến Noel</Link>
            <Link href="/con-bao-nhieu-ngay-nua-den-quoc-khanh" className="eventPill green">Đến Quốc khánh 2/9</Link>
            <Link href="/con-bao-nhieu-ngay-nua-den-30-4" className="eventPill green">Đến 30/4</Link>
            <Link href="/con-bao-nhieu-ngay-den-tet" className="eventPill blue">Đếm ngược Tết (tổng quan)</Link>
            <Link href="/hom-nay" className="eventPill green">Hôm nay là ngày gì</Link>
          </div>
        </article>
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
