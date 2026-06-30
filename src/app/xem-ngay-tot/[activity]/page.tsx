import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { XemNgayTotPageContent, resolveGoodDateParams } from "../XemNgayTotPageContent";
import { ACTIVITIES, getActivity, isActivitySlug } from "@/lib/calendar/activity";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ activity: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export function generateStaticParams() {
  return ACTIVITIES.map((activity) => ({ activity: activity.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { activity: activitySlug } = await params;
  if (!isActivitySlug(activitySlug)) return { title: "Không tìm thấy | Ngày Giờ", robots: { index: false, follow: false } };
  const activity = getActivity(activitySlug);
  const title = `${activity.title} theo tuổi, theo tháng | Ngày Giờ`;
  const description = `${activity.description} Lọc theo khoảng ngày, năm sinh và điểm ngày đẹp 100 trên Ngaygio.vn.`;
  return {
    title,
    description,
    keywords: [activity.seoKeyword, `${activity.seoKeyword} theo tuổi`, `${activity.shortTitle} ngày nào tốt`],
    alternates: { canonical: `/xem-ngay-tot/${activity.slug}` },
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}/xem-ngay-tot/${activity.slug}`,
      siteName: siteConfig.name,
      locale: "vi_VN",
      type: "website",
      images: [{ url: "/home.jpg", width: 1200, height: 630, alt: title }],
    },
  };
}

export default async function XemNgayTotActivityPage({ params, searchParams }: PageProps) {
  const { activity } = await params;
  if (!isActivitySlug(activity)) notFound();
  const resolved = resolveGoodDateParams((await searchParams) ?? {}, activity);
  return <XemNgayTotPageContent resolved={resolved} />;
}
