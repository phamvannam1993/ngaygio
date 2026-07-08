import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ZodiacIcon } from "@/components/Icon";
import { AgeCalculatorForm } from "@/components/AgeCalculatorForm";
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
  const title = `Sinh năm ${birthYear} bao nhiêu tuổi năm ${today.year}? Tuổi âm, tuổi dương, mệnh gì | Ngày Giờ`;
  const description = `Sinh năm ${birthYear} (${result.birthCanChi}, con ${result.animal}) năm ${today.year} được ${result.solarAge} tuổi dương, ${result.lunarAge} tuổi âm. Mệnh ${result.napAm} (hành ${result.element}), hợp tuổi ${result.compatibleBranches.slice(0, 3).join(", ")}.`;

  return {
    title,
    description,
    alternates: { canonical: `${siteConfig.url}/sinh-nam/${birthYear}` },
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}/sinh-nam/${birthYear}`,
      siteName: siteConfig.name,
      locale: "vi_VN",
      type: "website",
      images: [{ url: "/home.jpg", width: 1200, height: 630, alt: title }],
    },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  };
}

export default async function SinhNamYearPage({ params }: PageProps) {
  const { year: yearStr } = await params;
  const birthYear = Number(yearStr);
  if (!isValidBirthYear(birthYear)) notFound();

  const today = getVietnamTodayParts();
  const result = getAgeResult(birthYear, today.year);

  const jsonLd = [
    webPageSchema({
      name: `Sinh năm ${birthYear} bao nhiêu tuổi`,
      url: `${siteConfig.url}/sinh-nam/${birthYear}`,
      description: `Sinh năm ${birthYear} (${result.birthCanChi}, con ${result.animal}) năm ${today.year} được ${result.solarAge} tuổi dương.`,
      breadcrumb: [
        { name: "Tính tuổi âm", url: `${siteConfig.url}/tinh-tuoi-am` },
        { name: `Sinh năm ${birthYear}`, url: `${siteConfig.url}/sinh-nam/${birthYear}` },
      ],
    }),
    faqSchema([
      {
        q: `Sinh năm ${birthYear} năm ${today.year} bao nhiêu tuổi?`,
        a: `Sinh năm ${birthYear}, năm ${today.year} được ${result.solarAge} tuổi dương và ${result.lunarAge} tuổi âm (tuổi mụ). Can chi năm sinh: ${result.birthCanChi}, con ${result.animal}.`,
      },
      {
        q: `Sinh năm ${birthYear} mệnh gì, con giáp gì?`,
        a: `Người sinh năm ${birthYear} thuộc can chi ${result.birthCanChi}, con giáp ${result.animal}. Nạp âm ${result.napAm}, hành ${result.element}. ${result.elementMeaning}`,
      },
      {
        q: `Tuổi ${result.birthCanChi} hợp với tuổi gì?`,
        a: `Tuổi ${result.birthCanChi} hợp với: ${result.compatibleBranches.join(", ")}. Nên thận trọng với: ${result.conflictBranches.join(", ")}.`,
      },
      {
        q: `${result.solarAge} tuổi sinh năm bao nhiêu?`,
        a: `Người ${result.solarAge} tuổi (tính theo tuổi dương trong năm ${today.year}) sinh năm ${birthYear} dương lịch, tức tuổi ${result.birthCanChi}, con ${result.animal}.`,
      },
    ]),
  ];

  // Gợi ý các năm sinh lân cận
  const nearbyYears = Array.from({ length: 5 }, (_, i) => birthYear - 2 + i).filter(
    (y) => y !== birthYear && isValidBirthYear(y),
  );

  return (
    <>
      <Header currentYear={today.year} />
      <main className="container mainStack">
        <AgeCalculatorForm birthYear={birthYear} viewYear={today.year} />

        <section className="heroCard ageResultHero" aria-labelledby="age-result-title">
          <div className="yearOverviewHead">
            <div>
              <p className="eyebrow">Kết quả tra cứu</p>
              <h1 id="age-result-title">Sinh năm {birthYear} năm {today.year} bao nhiêu tuổi?</h1>
              <p className="converterIntro yearIntroText">{result.summary}</p>
            </div>
            <div className="yearAnimal">
              <ZodiacIcon branch={result.birthChi} />
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
            <p><strong>Năm {today.year}:</strong> {result.viewCanChi} — quan hệ {result.relationWithViewYear} với tuổi {result.birthCanChi}.</p>
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
          <h2>Sinh năm {birthYear} ({result.birthCanChi}) bao nhiêu tuổi năm {today.year}?</h2>
          <p>Người sinh năm <strong>{birthYear}</strong> thuộc can chi <strong>{result.birthCanChi}</strong>, con giáp <strong>{result.animal}</strong>. Nạp âm <strong>{result.napAm}</strong>, hành <strong>{result.element}</strong>. {result.elementMeaning}</p>
          <p>Năm {today.year}, người sinh năm {birthYear} tròn <strong>{result.solarAge} tuổi dương</strong> và <strong>{result.lunarAge} tuổi âm</strong> (tuổi mụ tham khảo theo quan niệm dân gian).</p>
          <p>{result.animalDescription}</p>
          <h2>Các năm sinh lân cận</h2>
          <div className="dayLinkList">
            {nearbyYears.map((y) => (
              <Link key={y} href={`/sinh-nam/${y}`} className="eventPill blue">Sinh năm {y}</Link>
            ))}
            <Link href={`/xem-tuoi-hop-mau-gi?namSinh=${birthYear}`} className="eventPill green">Tuổi {birthYear} hợp màu gì</Link>
            <Link href={`/xem-tuoi-hop-huong-nao?namSinh=${birthYear}`} className="eventPill green">Tuổi {birthYear} hợp hướng nào</Link>
            <Link href={`/xem-tuoi-lam-nha?namSinh=${birthYear}&namLamNha=${today.year}`} className="eventPill green">Làm nhà năm {today.year}</Link>
            <Link href={`/tuoi-lam-nha/${today.year}`} className="eventPill green">Bảng tuổi làm nhà {today.year}</Link>
          </div>
        </article>
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
