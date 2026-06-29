import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HolidayPageContent, holidayYearHref } from "../HolidayPageContent";
import { siteConfig } from "@/lib/site";

type PageProps = { params: Promise<{ year: string }> };

function resolveYear(value: string): number | null {
  const year = Number(value);
  return Number.isInteger(year) && year >= 1900 && year <= 2050 ? year : null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const year = resolveYear((await params).year);
  if (!year) return { title: "Năm không hợp lệ | Ngày Giờ", robots: { index: false, follow: false } };
  const title = `Lịch nghỉ lễ ${year} - Ngày lễ Tết năm ${year} | Ngày Giờ`;
  const description = `Tra cứu lịch nghỉ lễ năm ${year}, Tết âm lịch, Giỗ Tổ Hùng Vương, Quốc khánh, các ngày lễ dương và âm lịch.`;
  return {
    title,
    description,
    keywords: [`lịch nghỉ lễ ${year}`, `ngày lễ ${year}`, `lịch Tết ${year}`, "lịch nghỉ lễ"],
    alternates: { canonical: holidayYearHref(year) },
    openGraph: { title, description, url: `${siteConfig.url}${holidayYearHref(year)}`, siteName: siteConfig.name, locale: "vi_VN", type: "article", images: [{ url: "/home.jpg", width: 1200, height: 630, alt: title }] },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  };
}

export default async function LichNghiLeByYearPage({ params }: PageProps) {
  const year = resolveYear((await params).year);
  if (!year) notFound();
  return <HolidayPageContent year={year} />;
}
