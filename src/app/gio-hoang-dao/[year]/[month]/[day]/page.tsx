import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GoldenHourPageContent } from "../../../GoldenHourPageContent";
import { gioHoangDaoDayHref } from "@/lib/calendar/urls";
import { formatDisplayDate, isValidDateParts, type DateParts } from "@/lib/date";
import { formatHours } from "@/lib/calendar/can-chi";
import { getDayInfo } from "@/lib/calendar/service";
import { siteConfig } from "@/lib/site";

type PageProps = { params: Promise<{ year: string; month: string; day: string }> };

function resolveDate(params: { year: string; month: string; day: string }): DateParts | null {
  const date = { year: Number(params.year), month: Number(params.month), day: Number(params.day) };
  return isValidDateParts(date) ? date : null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const date = resolveDate(await params);
  if (!date) return { title: "Ngày không hợp lệ | Ngày Giờ", robots: { index: false, follow: false } };
  const day = getDayInfo(date);
  const displayDate = formatDisplayDate(date);
  const title = `Giờ hoàng đạo ngày ${displayDate} | Ngày Giờ`;
  const description = `Giờ hoàng đạo ngày ${displayDate}: ${formatHours(day.goodHours)}. Âm lịch ${day.lunar.day}/${day.lunar.month}/${day.lunar.year}, ngày ${day.canChi.day}.`;
  return {
    title,
    description,
    keywords: [`giờ hoàng đạo ngày ${displayDate}`, `giờ tốt ngày ${displayDate}`, "giờ hoàng đạo", "giờ hắc đạo"],
    alternates: { canonical: gioHoangDaoDayHref(date) },
    openGraph: { title, description, url: `${siteConfig.url}${gioHoangDaoDayHref(date)}`, siteName: siteConfig.name, locale: "vi_VN", type: "article", images: [{ url: "/og-home.svg", width: 1200, height: 630, alt: title }] },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  };
}

export default async function GioHoangDaoByDatePage({ params }: PageProps) {
  const date = resolveDate(await params);
  if (!date) notFound();
  return <GoldenHourPageContent selectedDate={date} />;
}
