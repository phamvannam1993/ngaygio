import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { AgeCompatibilityTool, FengShuiAgeTool, HouseAgeTool } from "@/components/AgeCompatibilityTool";
import { getVietnamTodayParts } from "@/lib/date";
import { faqSchema, siteConfig, webPageSchema } from "@/lib/site";
import type { CompatibilityPurpose } from "@/lib/calendar/compatibility";

export type AgeSeoPageMode = "compat" | "house" | "color" | "direction" | "feng-full";
export type SearchParams = Record<string, string | string[] | undefined>;

export type AgeSeoPageConfig = {
  canonicalPath: string;
  title: string;
  h1: string;
  description: string;
  keywords: string[];
  mode: AgeSeoPageMode;
  purpose?: CompatibilityPurpose;
  eyebrow?: string;
  faq: Array<{ q: string; a: string }>;
};

export function buildAgeSeoMetadata(config: AgeSeoPageConfig): Metadata {
  return {
    title: `${config.title} | Ngày Giờ`,
    description: config.description,
    keywords: config.keywords,
    alternates: { canonical: config.canonicalPath },
    openGraph: {
      title: `${config.title} | Ngày Giờ`,
      description: config.description,
      url: `${siteConfig.url}${config.canonicalPath}`,
      siteName: siteConfig.name,
      locale: "vi_VN",
      type: "website",
      images: [{ url: "/home.jpg", width: 1200, height: 630, alt: config.title }],
    },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  };
}

export function AgeSeoPage({ config, params }: { config: AgeSeoPageConfig; params?: SearchParams }) {
  const today = getVietnamTodayParts();
  const jsonLd = [
    webPageSchema({
      name: config.title,
      url: `${siteConfig.url}${config.canonicalPath}`,
      description: config.description,
      breadcrumb: [{ name: "Xem tuổi", url: `${siteConfig.url}/xem-tuoi-hop` }],
    }),
    faqSchema(config.faq),
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: config.title,
      url: `${siteConfig.url}${config.canonicalPath}`,
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "VND" },
      inLanguage: "vi-VN",
      description: config.description,
    },
  ];

  return (
    <>
      <Header currentYear={today.year} />
      <main className="container mainStack">
        <section className="heroCard compatHero" aria-labelledby="compat-page-title">
          <div>
            <p className="eyebrow">{config.eyebrow ?? "Xem tuổi · Phong thủy"}</p>
            <h1 id="compat-page-title">{config.h1}</h1>
            <p className="converterIntro yearIntroText">{config.description}</p>
            <div className="activityHeroBadges">
              <span>Can chi</span>
              <span>Con giáp</span>
              <span>Nạp âm</span>
              <span>Ngũ hành</span>
            </div>
          </div>
          <div className="heroScorePreview compatHeroPreview">
            <span>Công cụ</span>
            <strong>100</strong>
            <small>Chấm điểm tham khảo theo quy tắc dân gian, dễ hiểu và có giải thích lý do.</small>
          </div>
        </section>

        {config.mode === "compat" && <AgeCompatibilityTool purpose={config.purpose ?? "tong-quan"} params={params} title={config.h1} description={config.description} canonicalPath={config.canonicalPath} />}
        {config.mode === "house" && <HouseAgeTool params={params} canonicalPath={config.canonicalPath} />}
        {config.mode === "color" && <FengShuiAgeTool params={params} canonicalPath={config.canonicalPath} mode="color" />}
        {config.mode === "direction" && <FengShuiAgeTool params={params} canonicalPath={config.canonicalPath} mode="direction" />}
        {config.mode === "feng-full" && <FengShuiAgeTool params={params} canonicalPath={config.canonicalPath} mode="full" />}

        <article className="seoArticle">
          <h2>{config.h1} nên hiểu thế nào?</h2>
          <p>Công cụ trên Ngaygio.vn dùng năm sinh để quy đổi can chi, con giáp, nạp âm và quan hệ ngũ hành. Kết quả được trình bày theo thang điểm và giải thích từng yếu tố để người dùng dễ tham khảo, không chỉ nhận một câu kết luận ngắn.</p>
          <h2>Kết quả có phải tuyệt đối không?</h2>
          <p>Không. Xem tuổi, xem màu hợp, hướng hợp hay tuổi làm nhà là nội dung thuộc văn hóa dân gian. Khi dùng cho việc quan trọng, anh/chị nên kết hợp hoàn cảnh thực tế, pháp lý, sức khỏe, tài chính, lịch gia đình và ý kiến người có chuyên môn.</p>
          <h2>Công cụ liên quan</h2>
          <div className="dayLinkList">
            <a className="eventPill blue" href="/xem-ngay-tot-theo-tuoi">Xem ngày tốt theo tuổi</a>
            <a className="eventPill blue" href="/xem-tuoi-hop-lam-an">Tuổi hợp làm ăn</a>
            <a className="eventPill blue" href="/xem-tuoi-vo-chong">Tuổi vợ chồng</a>
            <a className="eventPill blue" href="/xem-tuoi-lam-nha">Tuổi làm nhà</a>
            <a className="eventPill blue" href="/lap-la-so-tu-vi">Lập lá số tử vi</a>
          </div>
        </article>
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
