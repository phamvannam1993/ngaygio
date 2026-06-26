import type { Metadata } from "next";
import { HolidayPageContent } from "./HolidayPageContent";
import { getVietnamTodayParts } from "@/lib/date";
import { siteConfig } from "@/lib/site";

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
  return <HolidayPageContent year={getVietnamTodayParts().year} />;
}
