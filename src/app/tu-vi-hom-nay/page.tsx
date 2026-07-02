import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { FortuneOverview } from "@/components/FortuneOverview";
import { Header } from "@/components/Header";
import { getAllDailyFortunes } from "@/lib/calendar/fortune";
import { formatDisplayDate, getVietnamTodayParts } from "@/lib/date";
import { faqSchema, siteConfig, webPageSchema } from "@/lib/site";

export const dynamic = "force-dynamic";

type SearchParams = Record<string, string | string[] | undefined>;
type PageProps = { searchParams?: Promise<SearchParams> };

export async function generateMetadata(): Promise<Metadata> {
  const today = getVietnamTodayParts();
  const title = `Tử vi hôm nay 12 con giáp ${formatDisplayDate(today)} | Ngày Giờ`;
  const description = `Xem tử vi hôm nay 12 con giáp ngày ${formatDisplayDate(today)}: công việc, tài lộc, tình cảm, sức khỏe, giờ tốt, màu may mắn và tuổi cần thận trọng.`;

  return {
    title,
    description,
    keywords: ["tử vi hôm nay", "tử vi 12 con giáp", "tử vi tuổi tý", "tử vi tuổi sửu", "xem tử vi hôm nay"],
    alternates: { canonical: `${siteConfig.url}/tu-vi-hom-nay` },
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}/tu-vi-hom-nay`,
      siteName: siteConfig.name,
      locale: "vi_VN",
      type: "website",
      images: [{ url: "/home.jpg", width: 1200, height: 630, alt: "Tử vi hôm nay 12 con giáp" }],
    },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  };
}

export default async function TuViHomNayPage(_props: PageProps) {
  const today = getVietnamTodayParts();
  const fortunes = getAllDailyFortunes(today);
  const top = [...fortunes].sort((a, b) => b.score - a.score)[0];

  const jsonLd = [
    webPageSchema({
      name: "Tử vi hôm nay 12 con giáp",
      url: `${siteConfig.url}/tu-vi-hom-nay`,
      description: `Xem tử vi hôm nay 12 con giáp ngày ${formatDisplayDate(today)} trên Ngaygio.vn.`,
      breadcrumb: [{ name: "Tử vi hôm nay", url: `${siteConfig.url}/tu-vi-hom-nay` }],
    }),
    faqSchema([
      { q: "Tử vi hôm nay 12 con giáp có ý nghĩa gì?", a: "Đây là nội dung tham khảo văn hóa dân gian, kết hợp can chi ngày, hoàng đạo/hắc đạo, trực ngày, giờ tốt và quan hệ xung hợp giữa tuổi với ngày." },
      { q: "Con giáp nào có điểm sáng hôm nay?", a: `Theo thang tham khảo của Ngaygio.vn, ${top.shortTitle} đang có điểm nổi bật nhất với ${top.score}/100 trong ngày ${formatDisplayDate(today)}.` },
      { q: "Có nên quyết định việc lớn chỉ dựa vào tử vi không?", a: "Không. Tử vi chỉ nên dùng để tham khảo tinh thần. Việc quan trọng cần kết hợp điều kiện thực tế, lịch cá nhân và tư vấn chuyên môn nếu cần." },
    ]),
  ];

  return (
    <>
      <Header currentYear={today.year} />
      <main className="container mainStack">
        <div className="pageFullscreenBg" style={{ backgroundImage: "linear-gradient(90deg, rgba(255,255,255,.94) 0%, rgba(255,255,255,.82) 42%, rgba(255,255,255,.52) 100%), linear-gradient(180deg, rgba(245,251,247,.18) 0%, rgba(245,251,247,.9) 100%), url(/bg-page-perpetual.png)" }} aria-hidden="true" />
        <FortuneOverview date={today} />
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
