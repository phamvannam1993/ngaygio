import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AmLichYearPageContent } from "../../AmLichPageContent";
import { getPerpetualYearSummary } from "@/lib/calendar/perpetual";
import { amLichYearHref } from "@/lib/calendar/urls";
import { siteConfig } from "@/lib/site";

type PageProps = {
  params: Promise<{ year: string }>;
};

function resolveYear(value: string): number | null {
  const year = Number(value);
  if (!Number.isInteger(year) || year < 1900 || year > 2050) return null;
  return year;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const year = resolveYear((await params).year);
  if (!year) return { title: "Năm không hợp lệ | Ngày Giờ", robots: { index: false, follow: false } };

  const summary = getPerpetualYearSummary(year);
  const title = `Lịch Âm năm ${year} cụ thể theo từng tháng, ngày lễ Tết âm lịch ${year}`;
  const description = `Tra cứu âm lịch năm ${year} ${summary.canChiYear} chi tiết theo 12 tháng: xem ngày hoàng đạo, ngày tốt xấu, lịch vạn niên, các dịp lễ Tết âm lịch.`;

  return {
    title,
    description,
    keywords: [`lịch âm ${year}`, `lich am ${year}`, `lịch vạn niên ${year}`, `âm lịch ${year}`, `ngày tốt năm ${year}`, `năm ${summary.canChiYear}`, `${year} là năm con gì`],
    alternates: { canonical: amLichYearHref(year) },
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}${amLichYearHref(year)}`,
      siteName: siteConfig.name,
      locale: "vi_VN",
      type: "article",
      images: [{ url: "/home.jpg", width: 1200, height: 630, alt: title }],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
    },
  };
}

export default async function AmLichYearPage({ params }: PageProps) {
  const year = resolveYear((await params).year);
  if (!year) notFound();
  return <AmLichYearPageContent year={year} />;
}
