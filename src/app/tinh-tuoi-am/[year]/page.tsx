import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AgeCalculatorForm } from "@/components/AgeCalculatorForm";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getAgeResult, isValidBirthYear } from "@/lib/calendar/age";
import { getVietnamTodayParts } from "@/lib/date";
import { siteConfig, webPageSchema, faqSchema } from "@/lib/site";

type PageProps = { params: Promise<{ year: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { year: yearStr } = await params;
  const birthYear = Number(yearStr);
  if (!isValidBirthYear(birthYear)) return {};

  const today = getVietnamTodayParts();
  const result = getAgeResult(birthYear, today.year);
  const title = `Sinh năm ${birthYear} (${result.birthCanChi}) ${today.year} bao nhiêu tuổi? | Ngày Giờ`;
  const description = `Sinh năm ${birthYear} mệnh ${result.napAm}, con ${result.animal}. Năm ${today.year} được ${result.solarAge} tuổi dương, ${result.lunarAge} tuổi âm. Xem tuổi hợp, xung, can chi đầy đủ.`;

  return {
    title,
    description,
    alternates: { canonical: `${siteConfig.url}/tinh-tuoi-am/${birthYear}` },
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}/tinh-tuoi-am/${birthYear}`,
      siteName: siteConfig.name,
      locale: "vi_VN",
      type: "website",
      images: [{ url: "/og-home.svg", width: 1200, height: 630, alt: title }],
    },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  };
}

export default async function TinhTuoiAmYearPage({ params }: PageProps) {
  const { year: yearStr } = await params;
  const birthYear = Number(yearStr);
  if (!isValidBirthYear(birthYear)) notFound();

  const today = getVietnamTodayParts();
  const result = getAgeResult(birthYear, today.year);

  const jsonLd = [
    webPageSchema({
      name: `Sinh năm ${birthYear} bao nhiêu tuổi`,
      url: `${siteConfig.url}/tinh-tuoi-am/${birthYear}`,
      description: `Tính tuổi người sinh năm ${birthYear} (${result.birthCanChi}, con ${result.animal}) năm ${today.year}.`,
      breadcrumb: [
        { name: "Tính tuổi âm", url: `${siteConfig.url}/tinh-tuoi-am` },
        { name: `Sinh năm ${birthYear}`, url: `${siteConfig.url}/tinh-tuoi-am/${birthYear}` },
      ],
    }),
    faqSchema([
      {
        q: `Sinh năm ${birthYear} năm ${today.year} bao nhiêu tuổi?`,
        a: `Sinh năm ${birthYear}, đến năm ${today.year} là ${result.solarAge} tuổi dương và ${result.lunarAge} tuổi âm (tuổi mụ). Can chi năm sinh là ${result.birthCanChi}, con ${result.animal}.`,
      },
      {
        q: `Sinh năm ${birthYear} mệnh gì?`,
        a: `Người sinh năm ${birthYear} (${result.birthCanChi}) mang nạp âm ${result.napAm}, hành ${result.element}. ${result.elementMeaning}`,
      },
      {
        q: `Tuổi ${result.birthCanChi} hợp với tuổi gì?`,
        a: `Tuổi ${result.birthCanChi} hợp với: ${result.compatibleBranches.join(", ")}. Nên thận trọng với: ${result.conflictBranches.join(", ")}.`,
      },
    ]),
  ];

  return (
    <>
      <Header currentYear={today.year} />
      <main className="container mainStack">
        <AgeCalculatorForm birthYear={birthYear} viewYear={today.year} />

        <section className="heroCard ageResultHero" aria-labelledby="age-result-title">
          <div className="yearOverviewHead">
            <div>
              <p className="eyebrow">Kết quả tính tuổi</p>
              <h1 id="age-result-title">Sinh năm {birthYear} năm {today.year} bao nhiêu tuổi?</h1>
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
            <p><strong>Năm đang xem:</strong> {today.year} là năm {result.viewCanChi}.</p>
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
          <h2>Sinh năm {birthYear} ({result.birthCanChi}) — con {result.animal}, mệnh {result.napAm}</h2>
          <p>Người sinh năm {birthYear} thuộc can chi <strong>{result.birthCanChi}</strong>, con giáp <strong>{result.animal}</strong>. Nạp âm là <strong>{result.napAm}</strong>, hành <strong>{result.element}</strong>. {result.elementMeaning}</p>
          <p>{result.animalDescription}</p>
          <h2>Cách tính tuổi dương và tuổi âm</h2>
          <p><strong>Tuổi dương</strong> (tuổi chính xác): lấy năm hiện tại trừ năm sinh. Sinh năm {birthYear}, đến năm {today.year} là {result.solarAge} tuổi dương.</p>
          <p><strong>Tuổi âm / tuổi mụ</strong>: trong văn hóa dân gian Á Đông, thường tính bằng tuổi dương cộng thêm 1, tức là {result.lunarAge} tuổi mụ. Cách tính này phổ biến trong phong tục cưới hỏi, xem tuổi hợp xung.</p>
          <h2>Lưu ý khi xem tuổi hợp xung</h2>
          <p>Thông tin hợp tuổi, xung tuổi và nạp âm mang tính tham khảo văn hóa dân gian. Với các việc quan trọng như cưới hỏi, xây nhà, hợp tác kinh doanh, nên xét thêm hoàn cảnh thực tế.</p>
        </article>
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
