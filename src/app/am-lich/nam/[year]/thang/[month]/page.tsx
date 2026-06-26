import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AmLichMonthPageContent } from "../../../../AmLichPageContent";
import { getMonthOverview } from "@/lib/calendar/perpetual";
import { amLichMonthHref, amLichYearHref } from "@/lib/calendar/urls";
import { siteConfig } from "@/lib/site";

type PageProps = {
  params: Promise<{ year: string; month: string }>;
};

function resolveParams(params: { year: string; month: string }): { year: number; month: number } | null {
  const year = Number(params.year);
  const month = Number(params.month);
  if (!Number.isInteger(year) || year < 1900 || year > 2050) return null;
  if (!Number.isInteger(month) || month < 1 || month > 12) return null;
  return { year, month };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolved = resolveParams(await params);
  if (!resolved) return { title: "Tháng không hợp lệ | Ngày Giờ", robots: { index: false, follow: false } };

  const { year, month } = resolved;
  const overview = getMonthOverview(year, month);
  const title = `Lịch Âm Tháng ${month} Năm ${year} - Lịch Âm ${month}/${year} - Lịch Vạn Niên ${month}/${year}`;
  const description = `Xem lịch âm tháng ${month} năm ${year} chuẩn nhất: ${overview.totalDays} ngày, ${overview.goodDays} ngày Hoàng Đạo, ${overview.badDays} ngày Hắc Đạo, ngày lễ, tiết khí và can chi trong tháng.`;

  return {
    title,
    description,
    keywords: [`lịch âm tháng ${month}`, `lich am thang ${month}`, `âm lịch tháng ${month}/${year}`, `lịch vạn niên tháng ${month}/${year}`, `ngày tốt tháng ${month}/${year}`, `tháng ${month}/${year} có bao nhiêu ngày`],
    alternates: { canonical: amLichMonthHref(year, month) },
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}${amLichMonthHref(year, month)}`,
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

export default async function AmLichMonthPage({ params }: PageProps) {
  const resolved = resolveParams(await params);
  if (!resolved) notFound();
  return <AmLichMonthPageContent year={resolved.year} month={resolved.month} />;
}
