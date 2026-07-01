import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { LaSoTuViTool } from "@/components/LaSoTuViTool";
import { getVietnamTodayParts } from "@/lib/date";
import { faqSchema, siteConfig, webPageSchema } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const title = "Lập lá số tử vi online theo ngày giờ sinh | Ngày Giờ";
  const description = "Công cụ lập lá số tử vi online: nhập ngày sinh, giờ sinh, giới tính và năm xem để dựng 12 cung Mệnh, Thân, Quan Lộc, Tài Bạch, Phu Thê và luận giải tham khảo.";

  return {
    title,
    description,
    keywords: ["lập lá số tử vi", "lá số tử vi", "tử vi đẩu số", "xem lá số tử vi", "tử vi trọn đời"],
    alternates: { canonical: `${siteConfig.url}/lap-la-so-tu-vi` },
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}/lap-la-so-tu-vi`,
      siteName: siteConfig.name,
      locale: "vi_VN",
      type: "website",
      images: [{ url: "/home.jpg", width: 1200, height: 630, alt: "Lập lá số tử vi online" }],
    },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  };
}

export default async function LapLaSoTuViPage() {
  const today = getVietnamTodayParts();

  const jsonLd = [
    webPageSchema({
      name: "Lập lá số tử vi online",
      url: `${siteConfig.url}/lap-la-so-tu-vi`,
      description: "Công cụ lập lá số tử vi theo ngày giờ sinh trên Ngaygio.vn.",
      breadcrumb: [
        { name: "Tử vi", url: `${siteConfig.url}/tu-vi-hom-nay` },
        { name: "Lập lá số tử vi", url: `${siteConfig.url}/lap-la-so-tu-vi` },
      ],
    }),
    faqSchema([
      { q: "Cần nhập gì để lập lá số tử vi?", a: "Bạn cần nhập họ tên, giới tính, ngày sinh, giờ sinh và năm muốn xem. Nếu biết ngày âm lịch có thể chọn loại ngày âm lịch trước khi lập lá số." },
      { q: "Lá số tử vi trên Ngaygio.vn có phải kết luận tuyệt đối không?", a: "Không. Đây là công cụ tham khảo văn hóa dân gian, không thay thế quyết định thực tế hoặc tư vấn chuyên môn về sức khỏe, tài chính, pháp lý." },
      { q: "Công cụ có đổi ngày dương sang ngày âm không?", a: "Có. Khi nhập ngày dương lịch, hệ thống tự đổi sang ngày âm, tính can chi năm, tháng, ngày, giờ rồi dựng bảng 12 cung." },
    ]),
  ];

  return (
    <>
      <Header currentYear={today.year} />
      <main className="container mainStack">
        <LaSoTuViTool defaultYear={today.year} />
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
