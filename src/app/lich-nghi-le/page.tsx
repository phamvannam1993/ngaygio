import type { Metadata } from "next";
import { HolidayPageContent } from "./HolidayPageContent";
import { getVietnamTodayParts } from "@/lib/date";
import { siteConfig, webPageSchema, faqSchema } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const year = getVietnamTodayParts().year;
  const title = `Lịch nghỉ lễ ${year} - Các ngày lễ Tết trong năm | Ngày Giờ`;
  const description = `Tra cứu lịch nghỉ lễ ${year}, Tết âm lịch, Giỗ Tổ Hùng Vương, ngày lễ dương lịch và các ngày kỷ niệm nổi bật trong năm.`;
  return {
    title,
    description,
    keywords: ["lịch nghỉ lễ", `lịch nghỉ lễ ${year}`, "ngày lễ trong năm", "lịch Tết", "lịch nghỉ Tết"],
    alternates: { canonical: "/lich-nghi-le" },
    openGraph: { title, description, url: `${siteConfig.url}/lich-nghi-le`, siteName: siteConfig.name, locale: "vi_VN", type: "website", images: [{ url: "/og-home.svg", width: 1200, height: 630, alt: "Lịch nghỉ lễ" }] },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  };
}

export default function LichNghiLePage() {
  const year = getVietnamTodayParts().year;
  const jsonLd = [
    webPageSchema({
      name: `Lịch nghỉ lễ ${year}`,
      url: `${siteConfig.url}/lich-nghi-le`,
      description: `Tra cứu lịch nghỉ lễ ${year}, Tết âm lịch, Giỗ Tổ Hùng Vương, ngày lễ dương lịch và các ngày kỷ niệm nổi bật trong năm.`,
      breadcrumb: [{ name: `Lịch nghỉ lễ ${year}`, url: `${siteConfig.url}/lich-nghi-le` }],
    }),
    faqSchema([
      { q: `Năm ${year} có bao nhiêu ngày nghỉ lễ?`, a: `Năm ${year} có các ngày lễ chính: Tết Dương lịch (1/1), Tết Âm lịch (7 ngày), Giỗ Tổ Hùng Vương (10/3 âm lịch), ngày 30/4, ngày 1/5 và Quốc khánh 2/9. Xem chi tiết ngày nghỉ chính xác trên trang này.` },
      { q: "Lịch nghỉ Tết Âm lịch bao nhiêu ngày?", a: "Theo quy định hiện hành, người lao động được nghỉ Tết Âm lịch 7 ngày (từ 29/12 âm đến mùng 5 tháng Giêng). Nếu ngày nghỉ lễ trùng cuối tuần thì được nghỉ bù." },
      { q: "Xem lịch nghỉ lễ năm khác ở đâu?", a: "Trên trang này bạn có thể chọn năm bất kỳ để xem lịch nghỉ lễ tương ứng, hoặc truy cập trực tiếp /lich-nghi-le/{năm}." },
    ]),
  ];
  return (
    <>
      <HolidayPageContent year={year} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
