import type { Metadata } from "next";
import { formatDisplayDate } from "@/lib/date";
import { getHomNayData } from "@/lib/homNay";
import { HomNayPageShell } from "@/components/HomNaySections";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-dynamic";
export const revalidate = 0;
const PAGE_PATH = "/hom-nay-la-tuan-may";

export async function generateMetadata(): Promise<Metadata> {
  const { today, week, weekYear, doy } = getHomNayData();
  const title = `Hôm nay là tuần thứ mấy trong năm? Tuần ${week}/${weekYear} | Ngày Giờ`;
  const description = `Hôm nay ${formatDisplayDate(today)} thuộc tuần thứ ${week} của năm ${weekYear} (chuẩn ISO-8601), là ngày thứ ${doy} trong năm. Xem thêm thứ, ngày âm dương và giờ tốt.`;
  return {
    title, description,
    keywords: ["hôm nay là tuần thứ mấy", "tuần thứ mấy trong năm", "hôm nay tuần mấy", "tuần bao nhiêu của năm"],
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
      schemaName={`Hôm nay là tuần thứ ${week} năm ${weekYear}`}
      focus={{
        eyebrow: "Hôm nay là tuần thứ mấy?",
        h1: `Hôm nay là tuần thứ ${week} của năm ${weekYear}`,
        intro: `Theo chuẩn ISO-8601, hôm nay (${info.weekdayName}, ${today.day}/${today.month}/${today.year}) là tuần thứ ${week} và là ngày thứ ${doy} trong năm ${weekYear}.`,
      }}
      faq={[
        { q: "Hôm nay là tuần thứ mấy trong năm?", a: `Hôm nay thuộc tuần thứ ${week} của năm ${weekYear} theo chuẩn ISO-8601.` },
        { q: "Cách tính tuần thứ mấy trong năm?", a: "Theo ISO-8601, tuần bắt đầu từ thứ Hai; tuần số 1 là tuần chứa ngày thứ Năm đầu tiên của năm." },
        { q: "Hôm nay là ngày thứ bao nhiêu trong năm?", a: `Hôm nay là ngày thứ ${doy} trong năm ${today.year}.` },
      ]}
    />
  );
}
