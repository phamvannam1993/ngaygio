import type { Metadata } from "next";
import { formatDisplayDate } from "@/lib/date";
import { getHomNayData } from "@/lib/homNay";
import { HomNayPageShell } from "@/components/HomNaySections";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-dynamic";
export const revalidate = 0;
const PAGE_PATH = "/ngay-duong-lich-hom-nay";

export async function generateMetadata(): Promise<Metadata> {
  const { today, info } = getHomNayData();
  const title = `Ngày dương lịch hôm nay: ${formatDisplayDate(today)} (${info.weekdayName}) | Ngày Giờ`;
  const description = `Hôm nay ngày ${today.day} tháng ${today.month} năm ${today.year} dương lịch, ${info.weekdayName}. Đối chiếu âm lịch ${info.lunar.day}/${info.lunar.month}, tuần trong năm và giờ tốt.`;
  return {
    title, description,
    keywords: ["ngày dương lịch hôm nay", "hôm nay ngày mấy dương lịch", "dương lịch hôm nay", "hôm nay ngày bao nhiêu"],
    alternates: { canonical: `${siteConfig.url}${PAGE_PATH}` },
    openGraph: { title, description, url: `${siteConfig.url}${PAGE_PATH}`, siteName: siteConfig.name, locale: "vi_VN", type: "website", images: [{ url: "/home.jpg", width: 1200, height: 630, alt: title }] },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  };
}

export default function Page() {
  const { today, info, week, weekYear } = getHomNayData();
  return (
    <HomNayPageShell
      path={PAGE_PATH}
      schemaName={`Ngày dương lịch hôm nay — ${formatDisplayDate(today)}`}
      focus={{
        eyebrow: "Ngày dương lịch hôm nay",
        h1: `Ngày dương lịch hôm nay: ${today.day}/${today.month}/${today.year}`,
        intro: `Hôm nay là ${info.weekdayName}, ngày ${today.day} tháng ${today.month} năm ${today.year} dương lịch — tương ứng ${info.lunar.day}/${info.lunar.month} âm lịch, tuần ${week}/${weekYear}.`,
      }}
      faq={[
        { q: "Hôm nay ngày mấy dương lịch?", a: `Hôm nay là ngày ${today.day} tháng ${today.month} năm ${today.year} dương lịch (${info.weekdayName}).` },
        { q: "Ngày dương lịch hôm nay ứng với ngày âm lịch nào?", a: `Ngày ${today.day}/${today.month}/${today.year} dương lịch nhằm ngày ${info.lunar.day}/${info.lunar.month}/${info.lunar.year} âm lịch.` },
        { q: "Hôm nay là thứ mấy?", a: `Hôm nay là ${info.weekdayName}.` },
      ]}
    />
  );
}
