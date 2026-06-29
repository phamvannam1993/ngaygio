import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GoodBadPageContent, goodBadDateHref } from "../../../GoodBadPageContent";
import { formatDisplayDate, isValidDateParts, type DateParts } from "@/lib/date";
import { getGoodBadDetails } from "@/lib/calendar/good-bad";
import { getDayInfo } from "@/lib/calendar/service";
import { siteConfig } from "@/lib/site";

type PageProps = {
  params: Promise<{
    year: string;
    month: string;
    day: string;
  }>;
};

function resolveDate(params: { year: string; month: string; day: string }): DateParts | null {
  const date = {
    year: Number(params.year),
    month: Number(params.month),
    day: Number(params.day),
  };

  return isValidDateParts(date) ? date : null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const selectedDate = resolveDate(resolvedParams);

  if (!selectedDate) {
    return {
      title: "Ngày không hợp lệ | Ngày Giờ",
      robots: { index: false, follow: false },
    };
  }

  const dayInfo = getDayInfo(selectedDate);
  const details = getGoodBadDetails(dayInfo);
  const displayDate = formatDisplayDate(selectedDate);
  const title = `Ngày ${displayDate} tốt hay xấu? ${details.overallLabel} | Ngày Giờ`;
  const description = `${details.overallLabel}: ngày ${displayDate} là ${dayInfo.lunar.day}/${dayInfo.lunar.month}/${dayInfo.lunar.year} âm lịch, ngày ${dayInfo.canChi.day}, tháng ${dayInfo.canChi.month}, năm ${dayInfo.canChi.year}. Xem giờ hoàng đạo và việc nên làm.`;

  return {
    title,
    description,
    keywords: [
      `ngày ${displayDate} tốt hay xấu`,
      `ngày ${displayDate}`,
      `xem ngày tốt xấu ${selectedDate.year}`,
      `ngày ${dayInfo.canChi.day}`,
      "giờ hoàng đạo",
    ],
    alternates: { canonical: goodBadDateHref(selectedDate) },
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}${goodBadDateHref(selectedDate)}`,
      siteName: siteConfig.name,
      locale: "vi_VN",
      type: "article",
      images: [{ url: "/home.jpg", width: 1200, height: 630, alt: title }],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export default async function NgayTotXauByDatePage({ params }: PageProps) {
  const selectedDate = resolveDate(await params);
  if (!selectedDate) notFound();

  return <GoodBadPageContent selectedDate={selectedDate} />;
}
