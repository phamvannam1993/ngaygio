import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { FortuneDetail } from "@/components/FortuneDetail";
import { Header } from "@/components/Header";
import { fortuneHref, getDailyFortune, getFortuneProfileBySlug, ZODIAC_FORTUNES } from "@/lib/calendar/fortune";
import { formatDisplayDate, getVietnamTodayParts } from "@/lib/date";
import { faqSchema, siteConfig, webPageSchema } from "@/lib/site";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return ZODIAC_FORTUNES.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const profile = getFortuneProfileBySlug(slug);
  if (!profile) return {};

  const today = getVietnamTodayParts();
  const fortune = getDailyFortune(profile.chi, today);
  const title = `Tử vi tuổi ${profile.chi} hôm nay ${fortune.dateLabel}: ${fortune.score}/100 | Ngày Giờ`;
  const description = `Xem tử vi tuổi ${profile.chi} hôm nay ${fortune.dateLabel}: tổng quan, công việc, tài lộc, tình cảm, sức khỏe, giờ tốt, màu may mắn và lưu ý trong ngày.`;
  const canonical = `${siteConfig.url}${fortuneHref(profile.slug)}`;

  return {
    title,
    description,
    keywords: [`tử vi tuổi ${profile.chi} hôm nay`, `tử vi tuổi ${profile.animal}`, `tuổi ${profile.chi} hôm nay`, "tử vi hôm nay"],
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: siteConfig.name,
      locale: "vi_VN",
      type: "website",
      images: [{ url: "/home.jpg", width: 1200, height: 630, alt: title }],
    },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  };
}

export default async function ZodiacFortunePage({ params }: PageProps) {
  const { slug } = await params;
  const profile = getFortuneProfileBySlug(slug);
  if (!profile) notFound();

  const today = getVietnamTodayParts();
  const fortune = getDailyFortune(profile.chi, today);
  const canonical = `${siteConfig.url}${fortuneHref(profile.slug)}`;

  const jsonLd = [
    webPageSchema({
      name: `Tử vi tuổi ${profile.chi} hôm nay`,
      url: canonical,
      description: `Xem tử vi tuổi ${profile.chi} hôm nay ${formatDisplayDate(today)} trên Ngaygio.vn.`,
      breadcrumb: [
        { name: "Tử vi hôm nay", url: `${siteConfig.url}/tu-vi-hom-nay` },
        { name: `Tuổi ${profile.chi}`, url: canonical },
      ],
    }),
    faqSchema([
      { q: `Tử vi tuổi ${profile.chi} hôm nay tốt hay xấu?`, a: `Tuổi ${profile.chi} hôm nay đạt ${fortune.score}/100 theo thang tham khảo của Ngaygio.vn. Quan hệ với ngày là ${fortune.relationLabel}.` },
      { q: `Tuổi ${profile.chi} hôm nay nên làm gì?`, a: fortune.shouldDo.join(" ") },
      { q: `Tuổi ${profile.chi} hôm nay cần tránh gì?`, a: fortune.shouldAvoid.join(" ") },
    ]),
  ];

  return (
    <>
      <Header currentYear={today.year} />
      <main className="container mainStack">
        <FortuneDetail profile={profile} date={today} />
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
