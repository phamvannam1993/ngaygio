import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AmLichDayPageContent } from "../../../../../../AmLichPageContent";
import { formatDisplayDate, isValidDateParts, type DateParts } from "@/lib/date";
import { getDayInfo } from "@/lib/calendar/service";
import { amLichDayHref, amLichMonthHref, amLichYearHref } from "@/lib/calendar/urls";
import { siteConfig } from "@/lib/site";

type PageProps = {
  params: Promise<{ year: string; month: string; day: string }>;
};

function resolveDate(params: { year: string; month: string; day: string }): DateParts | null {
  const date = { year: Number(params.year), month: Number(params.month), day: Number(params.day) };
  if (date.year < 1900 || date.year > 2050) return null;
  return isValidDateParts(date) ? date : null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const date = resolveDate(await params);
  if (!date) return { title: "Ngày không hợp lệ | Ngày Giờ", robots: { index: false, follow: false } };

  const day = getDayInfo(date);
  const displayDate = formatDisplayDate(date);
  const title = `Lịch âm ngày ${displayDate} | Xem giờ tốt - xấu ngày ${date.day} tháng ${date.month} năm ${date.year}`;
  const description = `Xem lịch âm ngày ${date.day} tháng ${date.month} năm ${date.year}: âm lịch ${day.lunar.day}/${day.lunar.month}/${day.lunar.year}, ngày ${day.canChi.day}, tháng ${day.canChi.month}, năm ${day.canChi.year}, tiết ${day.solarTerm}, giờ hoàng đạo.`;

  return {
    title,
    description,
    keywords: [`lịch âm ngày ${displayDate}`, `âm lịch ngày ${date.day} tháng ${date.month} năm ${date.year}`, `${displayDate} là ngày bao nhiêu âm`, `${displayDate} giờ nào tốt`, `ngày tốt tháng ${date.month} năm ${date.year}`],
    alternates: { canonical: amLichDayHref(date) },
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}${amLichDayHref(date)}`,
      siteName: siteConfig.name,
      locale: "vi_VN",
      type: "article",
      images: [{ url: "/og-home.svg", width: 1200, height: 630, alt: title }],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
    },
  };
}

export default async function AmLichDayPage({ params }: PageProps) {
  const date = resolveDate(await params);
  if (!date) notFound();
  return <AmLichDayPageContent date={date} />;
}
