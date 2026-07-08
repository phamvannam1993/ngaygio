import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ActivityKeywordPage } from "../../xem-ngay-tot/ActivityKeywordPage";
import { getActivity, isActivitySlug, type ActivitySlug } from "@/lib/calendar/activity";
import { getAgeResult, isValidBirthYear } from "@/lib/calendar/age";
import { getVietnamTodayParts } from "@/lib/date";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-dynamic";

type SearchParams = Record<string, string | string[] | undefined>;
type PageProps = {
  params: Promise<{ activity: string }>;
  searchParams?: Promise<SearchParams>;
};

function single(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

// Phân giải các tham số URL sạch: tuoi (năm sinh) hoặc thang+nam.
function resolveClean(sp: SearchParams) {
  const tuoiRaw = Number(single(sp.tuoi));
  const thang = Number(single(sp.thang));
  const nam = Number(single(sp.nam));
  const hasAge = isValidBirthYear(tuoiRaw);
  const hasMonth = Number.isInteger(thang) && thang >= 1 && thang <= 12 && Number.isInteger(nam) && nam >= 1900 && nam <= 2050;
  return {
    tuoi: hasAge ? tuoiRaw : undefined,
    thang: hasMonth ? thang : undefined,
    nam: hasMonth || (Number.isInteger(nam) && nam >= 1900 && nam <= 2050) ? nam : undefined,
    hasAge,
    hasMonth,
  };
}

// Dựng lại URL sạch để dùng làm canonical (self-referencing).
function cleanCanonical(slug: ActivitySlug, c: ReturnType<typeof resolveClean>): string {
  if (c.hasAge && c.nam) return `/ngay-tot-${slug}-tuoi-${c.tuoi}-nam-${c.nam}`;
  if (c.hasMonth) return `/ngay-tot-${slug}-thang-${c.thang}-${c.nam}`;
  return `/xem-ngay-tot-${slug}`;
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { activity: activityParam } = await params;
  if (!isActivitySlug(activityParam)) return { title: "Không tìm thấy | Ngày Giờ", robots: { index: false, follow: false } };
  const slug = activityParam as ActivitySlug;
  const activity = getActivity(slug);
  const c = resolveClean((await searchParams) ?? {});
  const canonical = cleanCanonical(slug, c);
  const today = getVietnamTodayParts();

  let title: string;
  let description: string;
  const short = activity.shortTitle.toLowerCase();

  if (c.hasAge && c.nam) {
    const age = getAgeResult(c.tuoi as number, c.nam);
    title = `Ngày tốt ${short} cho tuổi ${c.tuoi} (${age.birthCanChi}) năm ${c.nam} - ngày đẹp hoàng đạo`;
    description = `Xem ngày tốt ${short} năm ${c.nam} cho người tuổi ${c.tuoi} (${age.birthCanChi}, con ${age.animal}): lọc ngày hoàng đạo, giờ đẹp, tránh ngày xung khắc với tuổi. Chấm điểm 100.`;
  } else if (c.hasMonth) {
    title = `Ngày tốt ${short} tháng ${c.thang}/${c.nam} - xem ngày đẹp hoàng đạo`;
    description = `Danh sách ngày tốt ${short} trong tháng ${c.thang}/${c.nam}: ngày hoàng đạo, giờ đẹp, trực hợp việc, có xét tuổi. Chọn ngày đẹp chuẩn lịch vạn niên.`;
  } else {
    title = `${activity.title} ${today.year} theo tuổi, theo tháng`;
    description = `${activity.description} Lọc ngày hoàng đạo, giờ đẹp, tránh tuổi xung khắc theo năm sinh. Xem ngay!`;
  }

  return {
    title: `${title} | Ngày Giờ`,
    description,
    keywords: [activity.seoKeyword, `${activity.seoKeyword} theo tuổi`, `ngày tốt ${short}`, `${short} ngày nào tốt`],
    alternates: { canonical },
    openGraph: {
      title: `${title} | Ngày Giờ`,
      description,
      url: `${siteConfig.url}${canonical}`,
      siteName: siteConfig.name,
      locale: "vi_VN",
      type: "website",
      images: [{ url: "/home.jpg", width: 1200, height: 630, alt: title }],
    },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  };
}

export default async function NgayTotSeoPage({ params, searchParams }: PageProps) {
  const { activity: activityParam } = await params;
  if (!isActivitySlug(activityParam)) notFound();
  const slug = activityParam as ActivitySlug;
  const c = resolveClean((await searchParams) ?? {});
  const canonical = cleanCanonical(slug, c);

  // Truyền tham số đã chuẩn hóa vào bộ lọc (tuoi → năm sinh; thang/nam → khoảng tháng).
  const pageParams: SearchParams = {};
  if (c.tuoi) pageParams.tuoi = String(c.tuoi);
  if (c.hasMonth) {
    pageParams.thang = String(c.thang);
    pageParams.nam = String(c.nam);
  }

  return (
    <ActivityKeywordPage
      activitySlug={slug}
      path={canonical}
      params={pageParams}
      formAction={`/xem-ngay-tot-${slug}`}
    />
  );
}
