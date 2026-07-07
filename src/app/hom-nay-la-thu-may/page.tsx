import type { Metadata } from "next";
import { formatDisplayDate } from "@/lib/date";
import { getHomNayData } from "@/lib/homNay";
import { HomNayPageShell } from "@/components/HomNaySections";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-dynamic";
export const revalidate = 0;
const PAGE_PATH = "/hom-nay-la-thu-may";

export async function generateMetadata(): Promise<Metadata> {
  const { today, info } = getHomNayData();
  const title = `Hôm nay là thứ mấy? ${info.weekdayName}, ngày ${formatDisplayDate(today)} | Ngày Giờ`;
  const description = `Hôm nay là ${info.weekdayName}, ngày ${today.day}/${today.month}/${today.year} dương lịch (${info.lunar.day}/${info.lunar.month} âm lịch). Xem nhanh thứ trong tuần, ngày âm dương và giờ tốt hôm nay.`;
  return {
    title, description,
    keywords: ["hôm nay là thứ mấy", "hôm nay thứ mấy", "thứ mấy hôm nay", "hôm nay ngày thứ mấy"],
    alternates: { canonical: `${siteConfig.url}${PAGE_PATH}` },
    openGraph: { title, description, url: `${siteConfig.url}${PAGE_PATH}`, siteName: siteConfig.name, locale: "vi_VN", type: "website", images: [{ url: "/home.jpg", width: 1200, height: 630, alt: title }] },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  };
}

export default function Page() {
  const { today, info, week, weekYear, doy } = getHomNayData();
  return (
    <HomNayPageShell
      path={PAGE_PATH}
      schemaName={`Hôm nay là thứ mấy — ${info.weekdayName}, ${formatDisplayDate(today)}`}
      focus={{
        eyebrow: "Hôm nay là thứ mấy?",
        h1: `Hôm nay là ${info.weekdayName}`,
        intro: `Hôm nay ${info.weekdayName}, ngày ${today.day}/${today.month}/${today.year} dương lịch — tức ${info.lunar.day}/${info.lunar.month} âm lịch.`,
      }}
      faq={[
        { q: "Hôm nay là thứ mấy?", a: `Hôm nay là ${info.weekdayName}, ngày ${today.day}/${today.month}/${today.year} dương lịch.` },
        { q: "Ngày mai là thứ mấy?", a: `Sau ${info.weekdayName} sẽ là ngày kế tiếp trong tuần. Trang tự cập nhật mỗi ngày theo giờ Việt Nam.` },
        { q: "Hôm nay là tuần thứ mấy trong năm?", a: `Hôm nay thuộc tuần thứ ${week} của năm ${weekYear} và là ngày thứ ${doy} trong năm.` },
      ]}
    />
  );
}
