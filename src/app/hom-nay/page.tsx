import type { Metadata } from "next";
import { formatDisplayDate } from "@/lib/date";
import { getHomNayData } from "@/lib/homNay";
import { HomNayPageShell } from "@/components/HomNaySections";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const PAGE_PATH = "/hom-nay";

export async function generateMetadata(): Promise<Metadata> {
  const { today, info } = getHomNayData();
  const title = `Hôm nay là thứ mấy, ngày mấy? ${info.weekdayName}, ${formatDisplayDate(today)} | Ngày Giờ`;
  const description = `Hôm nay ${info.weekdayName}, ngày ${today.day}/${today.month}/${today.year} dương lịch, tức ${info.lunar.day}/${info.lunar.month} âm lịch. Xem tuần trong năm, ngày lễ, giờ tốt và ngày tốt xấu hôm nay.`;
  return {
    title,
    description,
    keywords: ["hôm nay là thứ mấy", "hôm nay ngày mấy", "hôm nay là ngày gì", "hôm nay là tuần thứ mấy", "ngày dương lịch hôm nay", "hôm nay âm lịch", "giờ tốt hôm nay"],
    alternates: { canonical: `${siteConfig.url}${PAGE_PATH}` },
    openGraph: { title, description, url: `${siteConfig.url}${PAGE_PATH}`, siteName: siteConfig.name, locale: "vi_VN", type: "website", images: [{ url: "/home.jpg", width: 1200, height: 630, alt: "Hôm nay là ngày gì" }] },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  };
}

export default function HomNayPage() {
  const { today, info, details, week, weekYear, doy, goodHoursText } = getHomNayData();
  return (
    <HomNayPageShell
      path={PAGE_PATH}
      schemaName={`Hôm nay là ngày gì — ${info.weekdayName}, ${formatDisplayDate(today)}`}
      focus={{
        eyebrow: "Hôm nay là ngày gì?",
        h1: `Hôm nay ${info.weekdayName}, ngày ${today.day}/${today.month}/${today.year}`,
      }}
      faq={[
        { q: "Hôm nay là thứ mấy?", a: `Hôm nay là ${info.weekdayName}, ngày ${today.day}/${today.month}/${today.year} dương lịch.` },
        { q: "Hôm nay ngày mấy âm lịch?", a: `Hôm nay ${today.day}/${today.month}/${today.year} dương lịch nhằm ngày ${info.lunar.day}/${info.lunar.month}/${info.lunar.year} âm lịch (ngày ${info.canChi.day}, tháng ${info.canChi.month}, năm ${info.canChi.year}).` },
        { q: "Hôm nay là tuần thứ mấy trong năm?", a: `Hôm nay thuộc tuần thứ ${week} của năm ${weekYear} (theo chuẩn ISO-8601) và là ngày thứ ${doy} trong năm.` },
        { q: "Hôm nay là ngày tốt hay xấu?", a: `Hôm nay là ${info.quality.label} — đánh giá ${details.overallLabel}. ${info.quality.note}` },
        { q: "Giờ tốt (giờ hoàng đạo) hôm nay là những giờ nào?", a: `Giờ hoàng đạo hôm nay: ${goodHoursText}.` },
      ]}
    />
  );
}
