import type { Metadata } from "next";
import { GoldenHourPageContent } from "./GoldenHourPageContent";
import { getVietnamTodayParts } from "@/lib/date";
import { siteConfig, webPageSchema, faqSchema } from "@/lib/site";

export const metadata: Metadata = {
  title: "Xem giờ hoàng đạo theo ngày – Tra giờ tốt xấu | Ngày Giờ",
  description: "Tra cứu giờ hoàng đạo, giờ hắc đạo và khung giờ tốt xấu trong ngày theo can chi và lịch âm Việt Nam. Chọn ngày bất kỳ để xem.",
  keywords: ["giờ hoàng đạo", "giờ hoàng đạo hôm nay", "xem giờ tốt", "giờ hắc đạo", "giờ tốt hôm nay"],
  alternates: { canonical: "/gio-hoang-dao" },
  openGraph: {
    title: "Giờ hoàng đạo hôm nay | Ngày Giờ",
    description: "Xem giờ tốt xấu trong ngày theo âm lịch và can chi.",
    url: `${siteConfig.url}/gio-hoang-dao`,
    siteName: siteConfig.name,
    locale: "vi_VN",
    type: "website",
    images: [{ url: "/home.jpg", width: 1200, height: 630, alt: "Giờ hoàng đạo hôm nay" }],
  },
};

const jsonLd = [
  webPageSchema({
    name: "Giờ hoàng đạo hôm nay",
    url: `${siteConfig.url}/gio-hoang-dao`,
    description: "Tra cứu giờ hoàng đạo hôm nay, giờ hắc đạo theo lịch âm Việt Nam.",
    breadcrumb: [{ name: "Giờ hoàng đạo hôm nay", url: `${siteConfig.url}/gio-hoang-dao` }],
  }),
  faqSchema([
    { q: "Giờ hoàng đạo là gì?", a: "Giờ hoàng đạo là các khung giờ tốt trong ngày theo phong thủy, thường dùng để xuất hành, ký hợp đồng, khai trương hoặc bắt đầu công việc quan trọng." },
    { q: "Mỗi ngày có bao nhiêu giờ hoàng đạo?", a: "Mỗi ngày thường có 4 giờ hoàng đạo và 4 giờ hắc đạo, xen kẽ nhau trong 12 giờ (chi) của ngày." },
    { q: "Giờ hoàng đạo hôm nay là giờ nào?", a: "Giờ hoàng đạo thay đổi theo ngày âm lịch và can chi của ngày. Xem bảng giờ chi tiết ngay trên trang này." },
  ]),
];

export default function GioHoangDaoPage() {
  return (
    <>
      <GoldenHourPageContent selectedDate={getVietnamTodayParts()} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
