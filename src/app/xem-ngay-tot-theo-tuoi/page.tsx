import type { Metadata } from "next";
import { resolveGoodDateParams } from "../xem-ngay-tot/XemNgayTotPageContent";
import { AgeGoodDateDesign } from "@/components/AgeGoodDateDesign";
import { siteConfig } from "@/lib/site";

type PageProps = { searchParams?: Promise<Record<string, string | string[] | undefined>> };

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Xem ngày tốt theo tuổi – Lọc ngày hợp năm sinh | Ngày Giờ",
  description: "Nhập năm sinh để xem ngày tốt theo tuổi, tránh ngày xung/hại và chọn ngày đẹp cho khai trương, cưới hỏi, động thổ, nhập trạch.",
  keywords: ["xem ngày tốt theo tuổi", "ngày hợp tuổi", "chọn ngày theo năm sinh", "tuổi xung ngày"],
  alternates: { canonical: "/xem-ngay-tot-theo-tuoi" },
  openGraph: {
    title: "Xem ngày tốt theo tuổi | Ngày Giờ",
    description: "Lọc ngày hợp tuổi theo năm sinh và thang điểm ngày đẹp 100.",
    url: `${siteConfig.url}/xem-ngay-tot-theo-tuoi`,
    siteName: siteConfig.name,
    locale: "vi_VN",
    type: "website",
    images: [{ url: "/home.jpg", width: 1200, height: 630, alt: "Xem ngày tốt theo tuổi" }],
  },
};

export default async function XemNgayTotTheoTuoiPage({ searchParams }: PageProps) {
  const resolved = resolveGoodDateParams((await searchParams) ?? {}, "khai-truong");
  return <AgeGoodDateDesign resolved={resolved} />;
}
