import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { CountdownEventGrid } from "@/components/CountdownEventGrid";
import { HomeHero } from "@/components/HomeHero";
import { ModernFeatureHub } from "@/components/ModernFeatureHub";
import { MonthCalendar } from "@/components/MonthCalendar";
import { MonthPicker } from "@/components/MonthPicker";
import { QuickTools } from "@/components/QuickTools";
import { SeoArticle } from "@/components/SeoArticle";
import { TodayPanel } from "@/components/TodayPanel";
import { getVietnamTodayParts, parseDateKey, type DateParts } from "@/lib/date";
import { getDayInfo, getMonthCalendar } from "@/lib/calendar/service";
import { amLichDayHref } from "@/lib/calendar/urls";
import { siteConfig } from "@/lib/site";

type SearchParams = Record<string, string | string[] | undefined>;
type PageProps = {
  searchParams?: Promise<SearchParams>;
};

function single(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function resolveSelectedDate(params: SearchParams): DateParts {
  const date = parseDateKey(single(params.date));
  if (date) return date;

  const month = Number(single(params.month));
  const year = Number(single(params.year));
  if (Number.isInteger(month) && month >= 1 && month <= 12 && Number.isInteger(year) && year >= 1900 && year <= 2050) {
    return { year, month, day: 1 };
  }

  return getVietnamTodayParts();
}

export async function generateMetadata(): Promise<Metadata> {
  const today = getVietnamTodayParts();
  const title = `Ngày Giờ – Lịch âm dương, ngày tốt xấu, giờ hoàng đạo ${today.year}`;
  const description = `Xem ngày âm lịch hôm nay, lịch vạn niên, ngày đẹp, giờ hoàng đạo và chuyển đổi âm dương nhanh chóng trên ${siteConfig.domain}. Lịch âm Việt Nam ${today.year}.`;

  return {
    title,
    description,
    keywords: siteConfig.keywords,
    alternates: { canonical: "/" },
    openGraph: {
      title,
      description,
      url: siteConfig.url,
      siteName: siteConfig.name,
      locale: "vi_VN",
      type: "website",
      images: [{ url: "/home.jpg", width: 1200, height: 630, alt: "Ngày Giờ - xem lịch âm hôm nay" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/home.jpg"],
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

export default async function Home({ searchParams }: PageProps) {
  const params = (await searchParams) ?? {};

  // Redirect if only ?date=... query param (no month/year)
  if (params.date && !params.month && !params.year) {
    redirect("/");
  }

  const selectedDate = resolveSelectedDate(params);
  const todayInfo = getDayInfo(selectedDate);
  const monthCalendar = getMonthCalendar(selectedDate.year, selectedDate.month, selectedDate);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: siteConfig.name,
        url: siteConfig.url,
        inLanguage: "vi-VN",
      },
      {
        "@type": "WebPage",
        name: `Âm lịch ngày ${selectedDate.day}/${selectedDate.month}/${selectedDate.year}`,
        url: siteConfig.url,
        description: "Trang chủ xem âm lịch hôm nay, lịch tháng, giờ hoàng đạo và công cụ tra cứu ngày giờ.",
        isPartOf: { "@type": "WebSite", name: siteConfig.name, url: siteConfig.url },
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Âm lịch hôm nay mùng mấy?",
            acceptedAnswer: {
              "@type": "Answer",
              text: `Ngày ${selectedDate.day}/${selectedDate.month}/${selectedDate.year} dương lịch là ${todayInfo.lunar.day}/${todayInfo.lunar.month}/${todayInfo.lunar.year} âm lịch.`,
            },
          },
          {
            "@type": "Question",
            name: "Giờ hoàng đạo hôm nay gồm những giờ nào?",
            acceptedAnswer: {
              "@type": "Answer",
              text: todayInfo.goodHours.map((hour) => `${hour.branch} ${hour.range}`).join(", "),
            },
          },
        ],
      },
    ],
  };

  return (
    <>
      <Header currentYear={selectedDate.year} />
      <main className="homePageMain">
        <HomeHero day={todayInfo} />
        <div className="container mainStack homeContentStack">
          <TodayPanel day={todayInfo} asH2 />
          <MonthCalendar calendar={monthCalendar} makeHref={amLichDayHref} />
          <div className="twoColumns">
            <MonthPicker month={selectedDate.month} year={selectedDate.year} />
            <QuickTools />
          </div>
          <ModernFeatureHub />
          <CountdownEventGrid year={selectedDate.year} />
          <SeoArticle />
        </div>
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
