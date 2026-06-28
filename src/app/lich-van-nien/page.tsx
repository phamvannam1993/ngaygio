import type { Metadata } from "next";
import { PerpetualCalendarPageContent } from "./PerpetualCalendarPageContent";
import { getVietnamTodayParts } from "@/lib/date";
import { siteConfig, webPageSchema, faqSchema } from "@/lib/site";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Lịch vạn niên 2026 – Tra lịch âm dương hôm nay, theo ngày tháng | Ngày Giờ",
  description: "Lịch vạn niên 2026: tra cứu lịch âm dương hôm nay theo ngày, tháng, năm. Xem can chi, tiết khí, giờ hoàng đạo, ngày tốt xấu và các ngày lễ Việt Nam.",
  keywords: ["lịch vạn niên", "lịch vạn niên 2026", "lịch âm dương", "xem lịch âm", "lịch âm hôm nay", "lịch vạn niên hôm nay"],
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

export default function LichVanNienPage() {
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

  return (
    <>
      <PerpetualCalendarPageContent selectedDate={getVietnamTodayParts()} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
