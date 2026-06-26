import type { Metadata } from "next";
import { CalendarConverterForms } from "@/components/CalendarConverterForms";
import { ConversionArticle } from "@/components/ConversionArticle";
import { ConversionResultPanel } from "@/components/ConversionResultPanel";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MonthCalendar } from "@/components/MonthCalendar";
import { getDefaultConversion } from "@/lib/calendar/conversion";
import { getMonthCalendar } from "@/lib/calendar/service";
import { siteConfig } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const result = getDefaultConversion();
  return {
    title: "Ứng dụng chuyển đổi ngày Dương lịch sang Âm lịch và ngược lại",
    description: result.metaDescription,
    keywords: ["chuyển dương lịch sang âm lịch", "đổi ngày âm dương", "âm lịch sang dương lịch", "lịch âm dương"],
    alternates: { canonical: "/chuyen-doi-lich" },
    openGraph: {
      title: "Chuyển đổi lịch âm dương | Ngày Giờ",
      description: result.metaDescription,
      url: `${siteConfig.url}/chuyen-doi-lich`,
      siteName: siteConfig.name,
      locale: "vi_VN",
      type: "website",
      images: [{ url: "/og-home.svg", width: 1200, height: 630, alt: "Chuyển đổi lịch âm dương" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Chuyển đổi lịch âm dương | Ngày Giờ",
      description: result.metaDescription,
      images: ["/og-home.svg"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export default function CalendarConverterPage() {
  const result = getDefaultConversion();
  const calendar = getMonthCalendar(result.solar.year, result.solar.month, result.solar);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: "Chuyển đổi lịch âm dương",
        url: `${siteConfig.url}/chuyen-doi-lich`,
        description: result.metaDescription,
        isPartOf: { "@type": "WebSite", name: siteConfig.name, url: siteConfig.url },
        inLanguage: "vi-VN",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Lịch âm", item: siteConfig.url },
          { "@type": "ListItem", position: 2, name: "Chuyển đổi lịch âm dương", item: `${siteConfig.url}/chuyen-doi-lich` },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Chuyển dương lịch sang âm lịch như thế nào?",
            acceptedAnswer: { "@type": "Answer", text: "Chọn ngày dương lịch trong công cụ, hệ thống sẽ tính ngày âm lịch tương ứng theo lịch Việt Nam và hiển thị can chi, tiết khí, giờ hoàng đạo." },
          },
          {
            "@type": "Question",
            name: "Chuyển âm lịch sang dương lịch có cần chọn tháng nhuận không?",
            acceptedAnswer: { "@type": "Answer", text: "Nếu ngày âm lịch thuộc tháng nhuận, cần bật tùy chọn tháng nhuận để kết quả chính xác." },
          },
        ],
      },
    ],
  };

  return (
    <>
      <Header currentYear={result.solar.year} />
      <main className="container mainStack">
        <CalendarConverterForms defaultSolar={result.solar} defaultLunar={result.lunar} defaultMode="duong-am" />
        <ConversionResultPanel result={result} />
        <MonthCalendar calendar={calendar} />
        <ConversionArticle />
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
