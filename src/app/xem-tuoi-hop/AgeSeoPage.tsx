import Link from "next/link";
import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { AgeCompatibilityTool, FengShuiAgeTool, HouseAgeTool } from "@/components/AgeCompatibilityTool";
import { SiteIcon } from "@/components/Icon";
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

function modeLabel(mode: AgeSeoPageMode): string {
  if (mode === "house") return "Kim Lâu · Hoang Ốc · Tam Tai";
  if (mode === "color") return "Màu bản mệnh · Tương sinh";
  if (mode === "direction") return "Cung phi · Bát trạch";
  if (mode === "feng-full") return "Màu hợp · Hướng hợp";
  return "Can chi · Nạp âm · Ngũ hành";
}

function modeScoreText(mode: AgeSeoPageMode): string {
  if (mode === "house") return "Tuổi nhà";
  if (mode === "color") return "Màu hợp";
  if (mode === "direction") return "Hướng hợp";
  if (mode === "feng-full") return "Phong thủy";
  return "Hợp tuổi";
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
      <div className="ageModernShell dayGoodBadShell">
        <main className="ageModernPage">
          <div className="pageFullscreenBg ageFullscreenBg" style={{ backgroundImage: "linear-gradient(90deg, rgba(255,255,255,.94) 0%, rgba(255,255,255,.82) 42%, rgba(255,255,255,.52) 100%), linear-gradient(180deg, rgba(245,251,247,.18) 0%, rgba(245,251,247,.9) 100%), url(/bg-page-age.png)" }} aria-hidden="true" />

          <div className="container ageModernContainer">
            <nav className="ngdBreadcrumb" aria-label="Đường dẫn">
              <Link href="/">Trang chủ</Link>
              <span>›</span>
              <Link href="/xem-tuoi-hop">Xem tuổi hợp</Link>
              <span>›</span>
              <strong>{config.title}</strong>
            </nav>

            <section className="ageModernHero" aria-labelledby="compat-page-title">
              <div className="ageHeroText">
                <p className="ngdEyebrow">{config.eyebrow ?? "Xem tuổi · Phong thủy"}</p>
                <h1 id="compat-page-title">{config.h1}</h1>
                <p>{config.description}</p>
                <div className="ageHeroBadges">
                  <span>Can chi</span>
                  <span>Con giáp</span>
                  <span>Nạp âm</span>
                  <span>Ngũ hành</span>
                  <span>{modeLabel(config.mode)}</span>
                </div>
              </div>

              <div className="ageHeroPreview" aria-label="Công cụ xem tuổi">
                <span>Công cụ</span>
                <strong>100</strong>
                <em>{modeScoreText(config.mode)}</em>
                <small>Chấm điểm tham khảo theo quy tắc dân gian, có giải thích lý do và gợi ý tiếp theo.</small>
              </div>
            </section>

            <div className="ageModernLayout">
              <div className="ageModernMain">
                {config.mode === "compat" && <AgeCompatibilityTool purpose={config.purpose ?? "tong-quan"} params={params} title={config.h1} description={config.description} canonicalPath={config.canonicalPath} />}
                {config.mode === "house" && <HouseAgeTool params={params} canonicalPath={config.canonicalPath} />}
                {config.mode === "color" && <FengShuiAgeTool params={params} canonicalPath={config.canonicalPath} mode="color" />}
                {config.mode === "direction" && <FengShuiAgeTool params={params} canonicalPath={config.canonicalPath} mode="direction" />}
                {config.mode === "feng-full" && <FengShuiAgeTool params={params} canonicalPath={config.canonicalPath} mode="full" />}

                <article className="ageModernArticle">
                  <p className="ngdEyebrow">Luận giải</p>
                  <h2>{config.h1} nên hiểu thế nào?</h2>
                  <p>Công cụ trên Ngaygio.vn dùng năm sinh để quy đổi can chi, con giáp, nạp âm và quan hệ ngũ hành. Kết quả được trình bày theo thang điểm và giải thích từng yếu tố để người dùng dễ tham khảo, không chỉ nhận một câu kết luận ngắn.</p>
                  <h2>Kết quả có phải tuyệt đối không?</h2>
                  <p>Không. Xem tuổi, xem màu hợp, hướng hợp hay tuổi làm nhà là nội dung thuộc văn hóa dân gian. Khi dùng cho việc quan trọng, anh/chị nên kết hợp hoàn cảnh thực tế, pháp lý, sức khỏe, tài chính, lịch gia đình và ý kiến người có chuyên môn.</p>
                  <h2>Công cụ liên quan</h2>
                  <div className="ageRelatedPills">
                    <Link href="/xem-ngay-tot-theo-tuoi"><SiteIcon name="calendar" />Xem ngày tốt theo tuổi</Link>
                    <Link href="/xem-tuoi-hop-lam-an"><SiteIcon name="building" />Tuổi hợp làm ăn</Link>
                    <Link href="/xem-tuoi-vo-chong"><SiteIcon name="heart" />Tuổi vợ chồng</Link>
                    <Link href="/xem-tuoi-lam-nha"><SiteIcon name="home" />Tuổi làm nhà</Link>
                    <Link href={`/tuoi-lam-nha/${today.year}`}><SiteIcon name="temple" />Bảng tuổi làm nhà {today.year}</Link>
                    <Link href="/lap-la-so-tu-vi"><SiteIcon name="bagua" />Lập lá số tử vi</Link>
                  </div>
                </article>
              </div>

              <aside className="ageModernSidebar" aria-label="Tra cứu tuổi nhanh">
                <section className="ageSideCard">
                  <h2>Xem nhanh</h2>
                  <Link href="/xem-tuoi-hop"><SiteIcon name="age" />Xem tuổi hợp tổng quan</Link>
                  <Link href="/xem-tuoi-hop-lam-an"><SiteIcon name="building" />Tuổi hợp làm ăn</Link>
                  <Link href="/xem-tuoi-vo-chong"><SiteIcon name="heart" />Tuổi vợ chồng</Link>
                  <Link href="/xem-tuoi-sinh-con"><SiteIcon name="sparkle" />Tuổi sinh con</Link>
                  <Link href="/xem-tuoi-lam-nha"><SiteIcon name="home" />Tuổi làm nhà</Link>
                  <Link href="/xem-tuoi-hop-mau-gi"><SiteIcon name="star" />Màu hợp tuổi</Link>
                  <Link href="/xem-tuoi-hop-huong-nao"><SiteIcon name="compass" />Hướng hợp tuổi</Link>
                </section>

                <section className="ageSideCard ageNoteCard">
                  <h2>Lưu ý khi xem tuổi</h2>
                  <p>Nội dung chỉ mang tính tham khảo văn hóa dân gian. Việc quan trọng vẫn cần xét hoàn cảnh thực tế, tình cảm, sức khỏe, tài chính và pháp lý.</p>
                </section>
              </aside>
            </div>
          </div>
        </main>
      </div>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
