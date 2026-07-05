import type { Metadata } from "next";
import { ActivityGoodDateDesign } from "@/components/ActivityGoodDateDesign";
import { getActivity, type ActivitySlug } from "@/lib/calendar/activity";
import { faqSchema, siteConfig, webPageSchema } from "@/lib/site";

export type SearchParams = Record<string, string | string[] | undefined>;

export function buildActivityKeywordMetadata(activitySlug: ActivitySlug, path: string): Metadata {
  const activity = getActivity(activitySlug);
  const year = new Date().getFullYear();
  // Title có token năm để tăng CTR + độ tươi mới trên SERP (chuẩn đối thủ lichngaytot/tuvi).
  const title = `${activity.title} ${year} theo tuổi, theo tháng`;
  // Meta description ≤155 ký tự: mô tả việc + lợi ích cụ thể + CTA.
  const description = `${activity.description} Lọc ngày hoàng đạo, giờ đẹp, tránh tuổi xung khắc theo năm sinh. Xem ngay!`;
  return {
    title: `${title} | Ngày Giờ`,
    description,
    keywords: [activity.seoKeyword, `${activity.seoKeyword} ${year}`, `${activity.seoKeyword} theo tuổi`, `ngày đẹp ${activity.shortTitle.toLowerCase()}`, `${activity.shortTitle.toLowerCase()} ngày nào tốt`],
    alternates: { canonical: path },
    openGraph: {
      title: `${title} | Ngày Giờ`,
      description,
      url: `${siteConfig.url}${path}`,
      siteName: siteConfig.name,
      locale: "vi_VN",
      type: "website",
      images: [{ url: "/home.jpg", width: 1200, height: 630, alt: title }],
    },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  };
}

export function ActivityKeywordPage({ activitySlug, path, params }: { activitySlug: ActivitySlug; path: string; params?: SearchParams }) {
  const activity = getActivity(activitySlug);
  const jsonLd = [
    webPageSchema({
      name: activity.title,
      url: `${siteConfig.url}${path}`,
      description: activity.description,
      breadcrumb: [{ name: "Xem ngày tốt", url: `${siteConfig.url}/xem-ngay-tot` }],
    }),
    faqSchema([
      { q: `${activity.shortTitle} nên chọn ngày như thế nào?`, a: `Nên ưu tiên ngày hoàng đạo, trực hợp với việc ${activity.shortTitle.toLowerCase()}, giờ hoàng đạo, tránh ngày kỵ và tránh ngày xung/hại với tuổi nếu có năm sinh.` },
      { q: `Có thể xem ${activity.shortTitle.toLowerCase()} theo tuổi không?`, a: "Có. Bạn nhập năm sinh trong bộ lọc để hệ thống trừ điểm các ngày xung/hại và cộng điểm các ngày có dấu hiệu hợp tuổi." },
    ]),
  ];
  return (
    <>
      <ActivityGoodDateDesign activitySlug={activitySlug} path={path} params={params ?? {}} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
