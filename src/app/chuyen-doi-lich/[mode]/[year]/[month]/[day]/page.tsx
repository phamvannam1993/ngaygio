import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalendarConverterForms } from "@/components/CalendarConverterForms";
import { ConversionArticle } from "@/components/ConversionArticle";
import { ConversionResultPanel } from "@/components/ConversionResultPanel";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MonthCalendar } from "@/components/MonthCalendar";
import { convertCalendarDate, normalizeConversionMode, type CalendarConversion } from "@/lib/calendar/conversion";
import { getMonthCalendar } from "@/lib/calendar/service";
import { getVietnamTodayParts, isValidDateParts, type DateParts } from "@/lib/date";
import { siteConfig } from "@/lib/site";

type RouteParams = {
  mode: string;
  year: string;
  month: string;
  day: string;
};

type SearchParams = Record<string, string | string[] | undefined>;

type PageProps = {
  params: Promise<RouteParams>;
  searchParams?: Promise<SearchParams>;
};

function single(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function toNumber(value: string): number | null {
  if (!/^\d+$/.test(value)) return null;
  return Number(value);
}

function parseRouteDate(params: RouteParams): DateParts | null {
  const year = toNumber(params.year);
  const month = toNumber(params.month);
  const day = toNumber(params.day);
  if (year === null || month === null || day === null) return null;
  return { year, month, day };
}

async function resolveConversion({ params, searchParams }: PageProps): Promise<CalendarConversion> {
  const rawParams = await params;
  const rawSearchParams = (await searchParams) ?? {};
  const mode = normalizeConversionMode(rawParams.mode);
  const input = parseRouteDate(rawParams);
  const isLeapMonth = ["1", "true", "yes"].includes((single(rawSearchParams.nhuan) ?? single(rawSearchParams.leap) ?? "").toLowerCase());

  if (!mode || !input) {
    notFound();
  }

  if (!mode || !input) {
    throw new Error("Đường dẫn chuyển đổi lịch không hợp lệ.");
  }

  if (mode === "duong-am" && !isValidDateParts(input)) {
    notFound();
  }

  return convertCalendarDate(mode, input, isLeapMonth);
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const result = await resolveConversion(props);
  const title = result.metaTitle;
  const description = result.metaDescription;
  const canonical = result.canonicalPath;

  return {
    title,
    description,
    keywords: ["chuyển dương lịch sang âm lịch", "âm lịch sang dương lịch", "đổi ngày âm dương", "chuyển đổi lịch"],
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}${canonical}`,
      siteName: siteConfig.name,
      locale: "vi_VN",
      type: "article",
      images: [{ url: "/og-home.svg", width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-home.svg"],
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

export default async function CalendarConverterResultPage(props: PageProps) {
  const result = await resolveConversion(props);
  const selectedSolar = result.status === "success" ? result.solar : getVietnamTodayParts();
  const selectedLunar = result.status === "success" ? result.lunar : result.input;
  const calendar = getMonthCalendar(selectedSolar.year, selectedSolar.month, selectedSolar);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: result.heading,
        url: `${siteConfig.url}${result.canonicalPath}`,
        description: result.metaDescription,
        isPartOf: { "@type": "WebSite", name: siteConfig.name, url: siteConfig.url },
        inLanguage: "vi-VN",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Lịch âm", item: siteConfig.url },
          { "@type": "ListItem", position: 2, name: "Chuyển đổi lịch âm dương", item: `${siteConfig.url}/chuyen-doi-lich` },
          { "@type": "ListItem", position: 3, name: result.status === "success" ? result.breadcrumbCurrent : "Ngày chưa hợp lệ", item: `${siteConfig.url}${result.canonicalPath}` },
        ],
      },
    ],
  };

  return (
    <>
      <Header currentYear={selectedSolar.year} />
      <main className="container mainStack">
        <CalendarConverterForms
          defaultSolar={selectedSolar}
          defaultLunar={selectedLunar}
          defaultMode={result.mode}
          defaultLunarLeap={result.inputIsLeapMonth}
        />
        <ConversionResultPanel result={result} />
        <MonthCalendar calendar={calendar} />
        <ConversionArticle />
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
