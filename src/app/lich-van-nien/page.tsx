import type { Metadata } from "next";
import { PerpetualCalendarPageContent } from "./PerpetualCalendarPageContent";
import { getVietnamTodayParts } from "@/lib/date";
import { siteConfig, webPageSchema, faqSchema } from "@/lib/site";

export const metadata: Metadata = {
  title: "Lịch vạn niên hôm nay - Lịch âm dương Việt Nam | Ngày Giờ",
  description: "Xem lịch vạn niên hôm nay, lịch âm dương theo ngày tháng năm, can chi, tiết khí, giờ hoàng đạo, ngày tốt xấu và các ngày lễ quan trọng của Việt Nam.",
  keywords: ["lịch vạn niên", "lịch âm dương", "lịch âm hôm nay", "xem lịch tháng", "lịch năm", "ngày tốt xấu", "giờ hoàng đạo"],
  alternates: { canonical: "/lich-van-nien" },
  openGraph: {
    title: "Lịch vạn niên hôm nay | Ngày Giờ",
    description: "Tra cứu lịch âm dương, can chi, tiết khí, ngày tốt xấu và lịch tháng.",
    url: `${siteConfig.url}/lich-van-nien`,
    siteName: siteConfig.name,
    locale: "vi_VN",
    type: "website",
    images: [{ url: "/og-home.svg", width: 1200, height: 630, alt: "Lịch vạn niên Ngày Giờ" }],
  },
};

const jsonLd = [
  webPageSchema({
    name: "Lịch vạn niên hôm nay",
    url: `${siteConfig.url}/lich-van-nien`,
    description: "Tra cứu lịch âm dương, can chi, tiết khí và ngày tốt xấu theo lịch Việt Nam.",
    breadcrumb: [{ name: "Lịch vạn niên", url: `${siteConfig.url}/lich-van-nien` }],
  }),
  faqSchema([
    { q: "Lịch vạn niên là gì?", a: "Lịch vạn niên (hay lịch âm dương) là hệ thống lịch kết hợp dương lịch và âm lịch, ghi đầy đủ ngày can chi, tiết khí, giờ hoàng đạo và các thông tin phong thủy trong ngày." },
    { q: "Lịch vạn niên khác lịch âm như thế nào?", a: "Lịch âm đơn thuần chỉ hiển thị ngày tháng năm âm lịch. Lịch vạn niên đầy đủ hơn: bao gồm can chi, tiết khí, ngày hoàng đạo/hắc đạo, sao tốt xấu và giờ xuất hành." },
    { q: "Tra lịch vạn niên theo ngày cụ thể ở đâu?", a: "Trên trang này bạn có thể chọn bất kỳ ngày nào để xem đầy đủ thông tin lịch vạn niên: âm lịch, can chi, tiết khí và ngày tốt xấu." },
  ]),
];

export default function LichVanNienPage() {
  return (
    <>
      <PerpetualCalendarPageContent selectedDate={getVietnamTodayParts()} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
