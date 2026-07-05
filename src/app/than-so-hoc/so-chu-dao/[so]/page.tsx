import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getVietnamTodayParts } from "@/lib/date";
import { getLifePathDetail, LIFE_PATH_NUMBERS } from "@/lib/numerology";
import { siteConfig, webPageSchema, faqSchema } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return LIFE_PATH_NUMBERS.map((n) => ({ so: String(n) }));
}

function pageUrl(n: number) {
  return `${siteConfig.url}/than-so-hoc/so-chu-dao/${n}`;
}

export async function generateMetadata({ params }: { params: Promise<{ so: string }> }): Promise<Metadata> {
  const { so } = await params;
  const detail = getLifePathDetail(Number(so));
  if (!detail) return {};
  const title = `Số chủ đạo ${detail.number}: ${detail.title.split("–")[0].trim()} – Tình yêu, sự nghiệp, tài chính | Ngày Giờ`;
  const description = `Ý nghĩa số chủ đạo ${detail.number} (Số Đường Đời ${detail.number}) trong thần số học: tính cách, tình yêu, sự nghiệp, tài chính, điểm mạnh – điểm yếu và nghề nghiệp phù hợp.`;
  return {
    title,
    description,
    keywords: [
      `số chủ đạo ${detail.number}`,
      `số đường đời ${detail.number}`,
      `thần số học số ${detail.number}`,
      `số chủ đạo ${detail.number} là người như thế nào`,
      `số ${detail.number} hợp nghề gì`,
    ],
    alternates: { canonical: pageUrl(detail.number) },
    openGraph: {
      title,
      description,
      url: pageUrl(detail.number),
      siteName: siteConfig.name,
      locale: "vi_VN",
      type: "article",
      images: [{ url: "/home.jpg", width: 1200, height: 630, alt: title }],
    },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  };
}

export default async function SoChuDaoPage({ params }: { params: Promise<{ so: string }> }) {
  const { so } = await params;
  const detail = getLifePathDetail(Number(so));
  if (!detail) {
    notFound();
    return null;
  }
  const today = getVietnamTodayParts();

  const jsonLd = [
    webPageSchema({
      name: `Số chủ đạo ${detail.number} – ${detail.title}`,
      url: pageUrl(detail.number),
      description: detail.overview,
      breadcrumb: [
        { name: "Thần số học", url: `${siteConfig.url}/than-so-hoc` },
        { name: `Số chủ đạo ${detail.number}`, url: pageUrl(detail.number) },
      ],
    }),
    faqSchema([
      { q: `Số chủ đạo ${detail.number} là người như thế nào?`, a: detail.overview },
      { q: `Số chủ đạo ${detail.number} hợp nghề gì?`, a: `Người số chủ đạo ${detail.number} phù hợp với: ${detail.careers.join(", ")}. ${detail.career}` },
      { q: `Người số ${detail.number} trong tình yêu ra sao?`, a: detail.love },
      { q: `Điểm mạnh và điểm yếu của số ${detail.number} là gì?`, a: `Điểm mạnh: ${detail.strengths.join(", ")}. Điểm yếu cần lưu ý: ${detail.weaknesses.join(", ")}.` },
    ]),
  ];

  const aspects: Array<{ h: string; body: string }> = [
    { h: "Tổng quan tính cách", body: detail.overview },
    { h: "Tình yêu & các mối quan hệ", body: detail.love },
    { h: "Sự nghiệp & công việc", body: detail.career },
    { h: "Tài chính & tiền bạc", body: detail.finance },
  ];

  return (
    <>
      <Header currentYear={today.year} />
      <main className="numerologyLuxuryShell">
        <div className="tshDecorBg" aria-hidden="true" />
        <div className="container tshContentWrap">
          <nav className="tshCrumb" aria-label="Breadcrumb">
            <Link href="/than-so-hoc">Thần số học</Link>
            <span aria-hidden="true">/</span>
            <span>Số chủ đạo {detail.number}</span>
          </nav>

          <section className="tshResultHero" aria-labelledby="scd-title">
            <div className="tshNumberOrb">
              <span>{detail.number}</span>
              <small>Số chủ đạo</small>
            </div>
            <div className="tshResultSummary">
              <p className="tshSectionEyebrow">Ý nghĩa số chủ đạo</p>
              <h1 id="scd-title">Số chủ đạo {detail.number} – {detail.title}</h1>
              <p>{detail.overview}</p>
              <div className="tshResultTags">
                {detail.strengths.slice(0, 3).map((s) => <span key={s}>{s}</span>)}
              </div>
            </div>
          </section>

          <section className="tshPanel">
            <div className="tshPanelHead">
              <p className="tshSectionEyebrow">Luận giải chi tiết</p>
              <h2>Số chủ đạo {detail.number} theo từng khía cạnh</h2>
            </div>
            <div className="tshAspectGrid">
              {aspects.map((a) => (
                <article key={a.h} className="tshAspectCard">
                  <h3>{a.h}</h3>
                  <p>{a.body}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="tshBirthReadingGrid">
            <article className="tshPanel">
              <div className="tshPanelHead">
                <p className="tshSectionEyebrow">Điểm mạnh</p>
                <h2>Thế mạnh của số {detail.number}</h2>
              </div>
              <ul className="tshTraitList good">
                {detail.strengths.map((s) => <li key={s}>{s}</li>)}
              </ul>
            </article>
            <article className="tshPanel">
              <div className="tshPanelHead">
                <p className="tshSectionEyebrow">Điểm cần lưu ý</p>
                <h2>Điểm yếu nên rèn luyện</h2>
              </div>
              <ul className="tshTraitList warn">
                {detail.weaknesses.map((s) => <li key={s}>{s}</li>)}
              </ul>
            </article>
          </section>

          <section className="tshPanel">
            <div className="tshPanelHead">
              <p className="tshSectionEyebrow">Nghề nghiệp phù hợp</p>
              <h2>Số chủ đạo {detail.number} hợp nghề gì?</h2>
            </div>
            <div className="tshResultTags">
              {detail.careers.map((c) => <span key={c}>{c}</span>)}
            </div>
          </section>

          <section className="tshPanel tshNumberNav">
            <div className="tshPanelHead">
              <p className="tshSectionEyebrow">Khám phá thêm</p>
              <h2>Ý nghĩa các số chủ đạo khác</h2>
            </div>
            <div className="tshNumberNavGrid">
              {LIFE_PATH_NUMBERS.map((n) => (
                <Link key={n} href={`/than-so-hoc/so-chu-dao/${n}`} className={n === detail.number ? "current" : undefined} aria-current={n === detail.number ? "page" : undefined}>
                  {n}
                </Link>
              ))}
            </div>
            <p style={{ marginTop: 12 }}>
              <Link href="/than-so-hoc" className="tshInlineLink">← Quay lại công cụ tra cứu thần số học</Link>
            </p>
          </section>
        </div>
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
