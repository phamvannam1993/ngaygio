import type { Metadata } from "next";
import { DayCounterWidget } from "@/components/DayCounterWidget";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getVietnamTodayParts } from "@/lib/date";
import { siteConfig, webPageSchema, faqSchema } from "@/lib/site";

export const metadata: Metadata = {
  title: "Đếm ngày online - Tính số ngày giữa hai mốc | Ngày Giờ",
  description: "Công cụ đếm ngày online giúp tính khoảng cách giữa hai ngày, còn bao nhiêu ngày đến sự kiện, lễ tết, sinh nhật, cưới hỏi hoặc khai trương.",
  keywords: ["đếm ngày", "tính số ngày", "còn bao nhiêu ngày", "date calculator", "đếm ngày online"],
  alternates: { canonical: "/dem-ngay" },
  openGraph: { title: "Đếm ngày online", description: "Tính nhanh số ngày giữa hai mốc thời gian.", url: `${siteConfig.url}/dem-ngay`, siteName: siteConfig.name, locale: "vi_VN", type: "website", images: [{ url: "/home.jpg", width: 1200, height: 630, alt: "Đếm ngày" }] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
};

const jsonLdPage = webPageSchema({
  name: "Đếm ngày online - Tính số ngày giữa hai mốc",
  url: `${siteConfig.url}/dem-ngay`,
  description: "Công cụ tính khoảng cách giữa hai ngày, còn bao nhiêu ngày đến sự kiện.",
  breadcrumb: [{ name: "Đếm ngày", url: `${siteConfig.url}/dem-ngay` }],
});
const jsonLdApp = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Đếm ngày online",
  url: `${siteConfig.url}/dem-ngay`,
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "VND" },
  description: "Tính số ngày giữa hai mốc thời gian, đếm ngày còn lại đến sự kiện.",
  inLanguage: "vi-VN",
};
const jsonLdFaq = faqSchema([
  { q: "Công cụ đếm ngày tính như thế nào?", a: "Công cụ tính số ngày chênh lệch giữa ngày bắt đầu và ngày kết thúc. Có thể tính cả ngày đầu, cả ngày cuối hoặc không tính ngày đầu tùy theo nhu cầu." },
  { q: "Còn bao nhiêu ngày đến Tết?", a: "Nhập ngày hôm nay làm ngày bắt đầu và ngày mùng 1 Tết Nguyên Đán làm ngày kết thúc, công cụ sẽ tự tính số ngày còn lại." },
]);

export default function DemNgayPage() {
  const today = getVietnamTodayParts();
  return (
    <>
      <Header currentYear={today.year} />
      <main className="container mainStack">
        <section className="heroCard">
          <p className="eyebrow">Công cụ ngày tháng</p>
          <h1>Đếm ngày giữa hai mốc thời gian</h1>
          <p className="converterIntro yearIntroText">Chọn ngày bắt đầu và ngày kết thúc để biết khoảng cách bao nhiêu ngày, có thể tính cả ngày đầu và ngày cuối.</p>
        </section>
        <DayCounterWidget />
        <article className="seoArticle">
          <h2>Khi nào cần dùng công cụ đếm ngày?</h2>
          <p>Công cụ đếm ngày hữu ích khi bạn muốn tính còn bao nhiêu ngày đến Tết, lịch nghỉ lễ, sinh nhật, cưới hỏi, hạn nộp hồ sơ, ngày khai trương hoặc một mốc cá nhân quan trọng.</p>
          <h2>Cách tính</h2>
          <p>Kết quả chính là số ngày chênh lệch giữa hai mốc. Công cụ cũng hiển thị thêm cách tính bao gồm cả ngày đầu và ngày cuối để tiện cho kế hoạch thực tế.</p>
        </article>
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdPage) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdApp) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }} />
    </>
  );
}
