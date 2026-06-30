import type { Metadata } from "next";
import { CountdownEventGrid } from "@/components/CountdownEventGrid";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getVietnamTodayParts } from "@/lib/date";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Còn bao nhiêu ngày đến Tết, Trung thu, Noel, ngày lễ? | Ngày Giờ",
  description: "Đếm ngày đến Tết, Trung thu, Vu Lan, Vía Thần Tài, Quốc khánh, Noel và các sự kiện quan trọng trong năm.",
  keywords: ["còn bao nhiêu ngày đến", "đếm ngày đến Tết", "đếm ngày Trung thu", "đếm ngày sự kiện"],
  alternates: { canonical: "/dem-ngay-su-kien" },
  openGraph: {
    title: "Đếm ngày sự kiện | Ngày Giờ",
    description: "Còn bao nhiêu ngày đến Tết, Trung thu, Vu Lan, Noel và các ngày lễ lớn?",
    url: `${siteConfig.url}/dem-ngay-su-kien`,
    siteName: siteConfig.name,
    locale: "vi_VN",
    type: "website",
    images: [{ url: "/home.jpg", width: 1200, height: 630, alt: "Đếm ngày sự kiện" }],
  },
};

export default function DemNgaySuKienPage() {
  const today = getVietnamTodayParts();
  return (
    <>
      <Header currentYear={today.year} />
      <main className="container mainStack">
        <section className="heroCard" aria-labelledby="countdown-title">
          <p className="eyebrow">Bộ trang mùa vụ</p>
          <h1 id="countdown-title">Còn bao nhiêu ngày đến các ngày lễ, Tết và sự kiện?</h1>
          <p className="converterIntro yearIntroText">Tổng hợp nhanh những mốc người dùng thường tìm: Tết Nguyên Đán, Vía Thần Tài, Giỗ Tổ Hùng Vương, Vu Lan, Trung thu, Quốc khánh, Noel.</p>
        </section>
        <CountdownEventGrid year={today.year} />
        <CountdownEventGrid year={today.year + 1} />
      </main>
      <Footer />
    </>
  );
}
