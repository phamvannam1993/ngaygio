import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ReminderWidget } from "@/components/ReminderWidget";
import { getVietnamTodayParts } from "@/lib/date";
import { siteConfig, webPageSchema } from "@/lib/site";

export const metadata: Metadata = {
  title: "Nhắc ngày giờ - Tạo nhắc việc và xuất lịch .ics | Ngày Giờ",
  description: "Tạo nhắc ngày giờ trên trình duyệt, lưu nhắc việc cục bộ và xuất file .ics để thêm vào Google Calendar, Apple Calendar hoặc Outlook.",
  keywords: ["nhắc ngày giờ", "tạo nhắc việc", "nhắc lịch", "file ics", "calendar reminder"],
  alternates: { canonical: "/nhac-ngay-gio" },
  openGraph: {
    title: "Nhắc ngày giờ | Ngày Giờ",
    description: "Tạo nhắc việc và xuất file lịch .ics.",
    url: `${siteConfig.url}/nhac-ngay-gio`,
    siteName: siteConfig.name,
    locale: "vi_VN",
    type: "website",
    images: [{ url: "/home.jpg", width: 1200, height: 630, alt: "Nhắc ngày giờ" }],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      name: "Nhắc ngày giờ - Tạo nhắc việc",
      url: `${siteConfig.url}/nhac-ngay-gio`,
      description: "Tạo nhắc việc trực tuyến, lưu cục bộ và xuất file .ics cho Google Calendar, Apple Calendar.",
      inLanguage: "vi-VN",
      isPartOf: { "@type": "WebSite", name: siteConfig.name, url: siteConfig.url },
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Trang chủ", item: siteConfig.url },
          { "@type": "ListItem", position: 2, name: "Nhắc ngày giờ", item: `${siteConfig.url}/nhac-ngay-gio` },
        ],
      },
    },
    {
      "@type": "WebApplication",
      name: "Nhắc ngày giờ",
      url: `${siteConfig.url}/nhac-ngay-gio`,
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "VND" },
      description: "Tạo nhắc việc trực tuyến, xuất file .ics cho Google Calendar, Apple Calendar và Outlook.",
      inLanguage: "vi-VN",
    },
  ],
};

export default function NhacNgayGioPage() {
  const today = getVietnamTodayParts();
  return (
    <>
      <Header currentYear={today.year} />
      <main className="container mainStack">
        <section className="heroCard">
          <p className="eyebrow">Tiện ích cá nhân</p>
          <h1>Nhắc ngày giờ</h1>
          <p className="converterIntro yearIntroText">Tạo nhắc việc nhanh theo ngày giờ. Phiên bản này không cần tài khoản, lưu dữ liệu trong trình duyệt và có thể tải file .ics để đưa vào lịch cá nhân.</p>
        </section>
        <ReminderWidget />
        <article className="seoArticle">
          <h2>Lưu ý khi dùng nhắc ngày giờ</h2>
          <p>Dữ liệu nhắc việc được lưu trên trình duyệt hiện tại. Nếu đổi thiết bị hoặc xóa dữ liệu trình duyệt, danh sách đã lưu có thể mất. Để chắc chắn hơn, hãy tải file .ics và thêm vào ứng dụng lịch bạn đang dùng.</p>
        </article>
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
