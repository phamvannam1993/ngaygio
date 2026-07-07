import type { Metadata } from "next";
import { formatDisplayDate } from "@/lib/date";
import { getHomNayData } from "@/lib/homNay";
import { HomNayPageShell } from "@/components/HomNaySections";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-dynamic";
export const revalidate = 0;
const PAGE_PATH = "/hom-nay-ngay-gi";

export async function generateMetadata(): Promise<Metadata> {
  const { today, info, events, tet } = getHomNayData();
  const evText = events.length ? events.map((e) => e.title).join(", ") : "không trùng ngày lễ lớn";
  const title = `Hôm nay là ngày gì? ${info.weekdayName}, ${formatDisplayDate(today)} | Ngày Giờ`;
  const description = `Hôm nay ${info.weekdayName}, ${today.day}/${today.month}/${today.year} (${info.lunar.day}/${info.lunar.month} âm lịch) — ${evText}. Còn ${tet.daysLeft} ngày đến Tết ${tet.canChi}. Xem ngày tốt xấu và giờ tốt.`;
  return {
    title, description,
    keywords: ["hôm nay là ngày gì", "hôm nay ngày gì", "hôm nay có sự kiện gì", "hôm nay lễ gì", "hôm nay ngày lễ gì"],
    alternates: { canonical: `${siteConfig.url}${PAGE_PATH}` },
    openGraph: { title, description, url: `${siteConfig.url}${PAGE_PATH}`, siteName: siteConfig.name, locale: "vi_VN", type: "website", images: [{ url: "/home.jpg", width: 1200, height: 630, alt: title }] },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  };
}

export default function Page() {
  const { today, info, events, tet, details } = getHomNayData();
  const evText = events.length ? events.map((e) => e.title).join(", ") : "không trùng ngày lễ lớn theo lịch của chúng tôi";
  return (
    <HomNayPageShell
      path={PAGE_PATH}
      schemaName={`Hôm nay là ngày gì — ${info.weekdayName}, ${formatDisplayDate(today)}`}
      focus={{
        eyebrow: "Hôm nay là ngày gì?",
        h1: `Hôm nay là ngày gì? ${info.weekdayName}, ${today.day}/${today.month}/${today.year}`,
        intro: `Hôm nay ${evText}. Ngày ${info.lunar.day}/${info.lunar.month} âm lịch, xếp loại ${info.quality.label} (${details.overallLabel}).`,
      }}
      faq={[
        { q: "Hôm nay là ngày gì?", a: `Hôm nay là ${info.weekdayName}, ${today.day}/${today.month}/${today.year} dương lịch (${info.lunar.day}/${info.lunar.month} âm lịch). ${events.length ? "Hôm nay có: " + events.map((e) => e.title).join(", ") + "." : "Hôm nay không trùng ngày lễ lớn."}` },
        { q: "Hôm nay có ngày lễ hay sự kiện gì không?", a: events.length ? `Có: ${events.map((e) => e.title).join(", ")}.` : "Hôm nay không trùng ngày lễ lớn theo lịch của chúng tôi." },
        { q: "Còn bao nhiêu ngày nữa đến Tết?", a: tet.daysLeft > 0 ? `Còn ${tet.daysLeft} ngày nữa đến Tết ${tet.canChi} ${tet.year} (${formatDisplayDate(tet.solarDate)}).` : "Hôm nay là dịp Tết Nguyên Đán." },
      ]}
    />
  );
}
