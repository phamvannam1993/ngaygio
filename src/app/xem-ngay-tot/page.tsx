import type { Metadata } from "next";
import { XemNgayTotPageContent, resolveGoodDateParams } from "./XemNgayTotPageContent";
import { siteConfig, faqSchema, webPageSchema } from "@/lib/site";

type PageProps = { searchParams?: Promise<Record<string, string | string[] | undefined>> };

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Xem ngày tốt theo việc, theo tuổi – Chọn ngày đẹp thang 100 | Ngày Giờ",
  description: "Tìm ngày tốt khai trương, cưới hỏi, động thổ, nhập trạch, mua xe, ký hợp đồng theo khoảng ngày và năm sinh. Chấm điểm ngày đẹp 100 trên Ngaygio.vn.",
  keywords: ["xem ngày tốt", "chọn ngày đẹp", "ngày tốt khai trương", "ngày tốt cưới hỏi", "xem ngày tốt theo tuổi"],
  alternates: { canonical: "/xem-ngay-tot" },
  openGraph: {
    title: "Xem ngày tốt theo việc, theo tuổi | Ngày Giờ",
    description: "Chọn ngày đẹp theo mục đích, tuổi, khoảng thời gian và điểm đánh giá 100.",
    url: `${siteConfig.url}/xem-ngay-tot`,
    siteName: siteConfig.name,
    locale: "vi_VN",
    type: "website",
    images: [{ url: "/home.jpg", width: 1200, height: 630, alt: "Xem ngày tốt theo việc" }],
  },
};

export default async function XemNgayTotPage({ searchParams }: PageProps) {
  const resolved = resolveGoodDateParams((await searchParams) ?? {});
  const jsonLd = [
    webPageSchema({ name: "Xem ngày tốt theo việc", url: `${siteConfig.url}/xem-ngay-tot`, description: "Công cụ chọn ngày tốt theo mục đích, tuổi và khoảng thời gian." }),
    faqSchema([
      { q: "Có thể xem ngày tốt cho những việc nào?", a: "Bạn có thể xem ngày tốt cho khai trương, cưới hỏi, động thổ, nhập trạch, mua xe, ký hợp đồng, xuất hành, cắt tóc, chuyển nhà và đặt bàn thờ." },
      { q: "Điểm ngày đẹp 100 có phải kết luận tuyệt đối không?", a: "Không. Điểm 100 là gợi ý tham khảo để so sánh nhiều ngày theo lịch âm, trực ngày, giờ hoàng đạo, ngày kỵ và tuổi xung hợp." },
    ]),
  ];
  return (
    <>
      <XemNgayTotPageContent resolved={resolved} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
