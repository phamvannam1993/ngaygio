import type { Metadata } from "next";
import { GoodBadPageContent } from "./GoodBadPageContent";
import { getVietnamTodayParts } from "@/lib/date";
import { siteConfig, webPageSchema, faqSchema } from "@/lib/site";

export const metadata: Metadata = {
  title: "Xem ngày tốt xấu theo ngày – Tra ngày hoàng đạo, hắc đạo | Ngày Giờ",
  description: "Tra cứu ngày tốt xấu theo âm lịch và can chi: ngày Hoàng Đạo, Hắc Đạo, Trực, giờ tốt, việc nên làm và tránh theo phong thủy Việt Nam.",
  keywords: ["ngày tốt xấu", "xem ngày tốt", "xem ngày xấu", "ngày hoàng đạo", "ngày hắc đạo", "giờ hoàng đạo"],
  alternates: { canonical: "/ngay-tot-xau" },
  openGraph: {
    title: "Xem ngày tốt xấu hôm nay | Ngày Giờ",
    description: "Tra cứu ngày tốt xấu, giờ hoàng đạo, can chi và ngày kỵ theo lịch Việt Nam.",
    url: `${siteConfig.url}/ngay-tot-xau`,
    siteName: siteConfig.name,
    locale: "vi_VN",
    type: "website",
    images: [{ url: "/home.jpg", width: 1200, height: 630, alt: "Xem ngày tốt xấu hôm nay" }],
  },
};

const jsonLd = [
  webPageSchema({
    name: "Xem ngày tốt xấu hôm nay",
    url: `${siteConfig.url}/ngay-tot-xau`,
    description: "Tra cứu ngày tốt xấu, hoàng đạo hắc đạo và giờ tốt theo lịch âm Việt Nam.",
    breadcrumb: [{ name: "Ngày tốt xấu", url: `${siteConfig.url}/ngay-tot-xau` }],
  }),
  faqSchema([
    { q: "Ngày hoàng đạo là gì?", a: "Ngày hoàng đạo là ngày tốt theo lịch âm, thích hợp để làm những việc quan trọng như cưới hỏi, khai trương, xuất hành." },
    { q: "Ngày hắc đạo có kiêng kỵ gì không?", a: "Ngày hắc đạo được coi là ngày xấu, nên tránh các việc lớn như ký hợp đồng, cưới hỏi, khai trương. Tuy nhiên các việc bình thường vẫn làm được." },
    { q: "Làm sao biết hôm nay là ngày tốt hay xấu?", a: "Tra cứu ngay trên trang này — hệ thống tự động tính ngày âm lịch, can chi và phân loại hoàng đạo hay hắc đạo cho ngày hôm nay." },
  ]),
];

export default function NgayTotXauPage() {
  return (
    <>
      <GoodBadPageContent selectedDate={getVietnamTodayParts()} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
