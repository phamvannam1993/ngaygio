import type { Metadata } from "next";
import { AgeCalculatorForm } from "@/components/AgeCalculatorForm";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getAgeResult, isValidBirthYear } from "@/lib/calendar/age";
import { getVietnamTodayParts } from "@/lib/date";
import { siteConfig } from "@/lib/site";

type SearchParams = Record<string, string | string[] | undefined>;
type PageProps = { searchParams?: Promise<SearchParams> };

function single(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function resolveYear(value: string | undefined, fallback: number) {
  const year = Number(value);
  return isValidBirthYear(year) ? year : fallback;
}

export async function generateMetadata(): Promise<Metadata> {
  const currentYear = getVietnamTodayParts().year;
  const title = `Tính tuổi âm ${currentYear} - Đổi tuổi, can chi, con giáp | Ngày Giờ`;
  const description = "Công cụ tính tuổi âm, tuổi mụ, tuổi dương, can chi năm sinh, con giáp, nạp âm ngũ hành và tuổi hợp xung theo năm.";
  return {
    title,
    description,
    keywords: ["tính tuổi âm", "đổi tuổi", "tính tuổi mụ", "tuổi con giáp", "xem tuổi âm", "can chi năm sinh"],
    alternates: { canonical: "/tinh-tuoi-am" },
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}/tinh-tuoi-am`,
      siteName: siteConfig.name,
      locale: "vi_VN",
      type: "website",
      images: [{ url: "/og-home.svg", width: 1200, height: 630, alt: "Tính tuổi âm" }],
    },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  };
}

export default async function TinhTuoiAmPage({ searchParams }: PageProps) {
  const today = getVietnamTodayParts();
  const params = (await searchParams) ?? {};
  const birthYear = resolveYear(single(params.namSinh), today.year - 30);
  const rawViewYear = Number(single(params.namXem));
  const viewYear = Number.isInteger(rawViewYear) && rawViewYear >= birthYear && rawViewYear <= 2050 ? rawViewYear : today.year;
  const result = getAgeResult(birthYear, viewYear);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: "Tính tuổi âm, đổi tuổi can chi",
        url: `${siteConfig.url}/tinh-tuoi-am`,
        description: "Công cụ tính tuổi âm, tuổi dương, tuổi mụ, can chi và con giáp theo năm sinh.",
        isPartOf: { "@type": "WebSite", name: siteConfig.name, url: siteConfig.url },
        inLanguage: "vi-VN",
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          { "@type": "Question", name: "Tuổi âm là gì?", acceptedAnswer: { "@type": "Answer", text: "Tuổi âm hoặc tuổi mụ là cách tính tuổi theo quan niệm dân gian, thường lấy tuổi dương cộng thêm một để tham khảo trong văn hóa Á Đông." } },
          { "@type": "Question", name: `Sinh năm ${birthYear} năm ${viewYear} bao nhiêu tuổi âm?`, acceptedAnswer: { "@type": "Answer", text: `Sinh năm ${birthYear}, đến năm ${viewYear} là ${result.solarAge} tuổi dương và ${result.lunarAge} tuổi âm/tuổi mụ tham khảo.` } },
        ],
      },
      {
        "@type": "WebApplication",
        name: "Tính tuổi âm",
        url: `${siteConfig.url}/tinh-tuoi-am`,
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Web",
        offers: { "@type": "Offer", price: "0", priceCurrency: "VND" },
        description: "Tính tuổi âm, tuổi mụ, tuổi dương, can chi và con giáp theo năm sinh.",
        inLanguage: "vi-VN",
      },
    ],
  };

  return (
    <>
      <Header currentYear={today.year} />
      <main className="container mainStack">
        <AgeCalculatorForm birthYear={birthYear} viewYear={viewYear} />

        <section className="heroCard ageResultHero" aria-labelledby="age-result-title">
          <div className="yearOverviewHead">
            <div>
              <p className="eyebrow">Kết quả đổi tuổi</p>
              <h1 id="age-result-title">Sinh năm {birthYear} năm {viewYear} bao nhiêu tuổi?</h1>
              <p className="converterIntro yearIntroText">{result.summary}</p>
            </div>
            <div className="yearAnimal">
              <span>{result.animalEmoji}</span>
              <strong>{result.birthCanChi}</strong>
              <small>Con {result.animal}</small>
            </div>
          </div>

          <div className="yearStatsGrid ageStatsGrid">
            <article><strong>{result.solarAge}</strong><span>tuổi dương</span></article>
            <article><strong>{result.lunarAge}</strong><span>tuổi âm/tuổi mụ</span></article>
            <article><strong>{result.napAm}</strong><span>nạp âm</span></article>
            <article><strong>{result.relationWithViewYear}</strong><span>so với năm {result.viewCanChi}</span></article>
          </div>
        </section>

        <section className="panelCard ageDetailGrid" aria-labelledby="age-detail-title">
          <div>
            <p className="eyebrow">Can chi · ngũ hành</p>
            <h2 id="age-detail-title">Thông tin tuổi {result.birthCanChi}</h2>
            <p><strong>Con giáp:</strong> {result.animal}. {result.animalDescription}</p>
            <p><strong>Nạp âm:</strong> {result.napAm}, hành {result.element}. {result.elementMeaning}</p>
            <p><strong>Năm đang xem:</strong> {viewYear} là năm {result.viewCanChi}.</p>
          </div>
          <div className="monthSummaryColumns">
            <article>
              <h3>Tuổi hợp tham khảo</h3>
              <div className="dayLinkList">{result.compatibleBranches.map((item) => <span key={item}>{item}</span>)}</div>
            </article>
            <article>
              <h3>Tuổi nên thận trọng</h3>
              <div className="dayLinkList badList">{result.conflictBranches.map((item) => <span key={item}>{item}</span>)}</div>
            </article>
          </div>
        </section>

        <article className="seoArticle">
          <h2>Cách tính tuổi âm trên Ngaygio.vn</h2>
          <p>Tuổi dương được tính bằng năm cần xem trừ năm sinh. Tuổi âm hoặc tuổi mụ thường được tham khảo bằng tuổi dương cộng thêm một. Bên cạnh đó, hệ thống còn hiển thị can chi, con giáp, nạp âm ngũ hành và nhóm tuổi hợp/xung để tiện tra cứu.</p>
          <h2>Lưu ý khi xem tuổi</h2>
          <p>Thông tin hợp tuổi, xung tuổi, nạp âm và tuổi âm mang tính tham khảo văn hóa dân gian. Với việc quan trọng như cưới hỏi, xây nhà, hợp tác làm ăn, nên xét thêm hoàn cảnh thực tế và ý kiến người có chuyên môn.</p>
        </article>
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
