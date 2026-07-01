import type { Metadata } from "next";
import { XemNgayTotPageContent, resolveGoodDateParams } from "./XemNgayTotPageContent";
import { getActivity, type ActivitySlug } from "@/lib/calendar/activity";
import { faqSchema, siteConfig, webPageSchema } from "@/lib/site";

export type SearchParams = Record<string, string | string[] | undefined>;

export function buildActivityKeywordMetadata(activitySlug: ActivitySlug, path: string): Metadata {
  const activity = getActivity(activitySlug);
  const title = `${activity.title} theo tuổi, theo tháng`;
  const description = `${activity.description} Nhập khoảng ngày và năm sinh để lọc ngày đẹp, giờ hoàng đạo, tuổi xung hợp và lý do chấm điểm 100.`;
  return {
    title: `${title} | Ngày Giờ`,
    description,
    keywords: [activity.seoKeyword, `${activity.seoKeyword} theo tuổi`, `ngày đẹp ${activity.shortTitle.toLowerCase()}`, `${activity.shortTitle.toLowerCase()} ngày nào tốt`],
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
  const resolved = resolveGoodDateParams(params ?? {}, activitySlug);
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
      <XemNgayTotPageContent
        resolved={resolved}
        overrideTitle={activity.title}
        overrideDescription={`${activity.description} Trang này tập trung cho từ khóa ${activity.seoKeyword}, có bộ lọc theo tuổi, khoảng ngày, giờ hoàng đạo và thang điểm 100.`}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
