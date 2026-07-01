import { ActivityKeywordPage, buildActivityKeywordMetadata } from "../xem-ngay-tot/ActivityKeywordPage";

type PageProps = { searchParams?: Promise<Record<string, string | string[] | undefined>> };
export const dynamic = "force-dynamic";
export const metadata = buildActivityKeywordMetadata("xuat-hanh", "/xem-ngay-tot-xuat-hanh");
export default async function Page({ searchParams }: PageProps) {
  return <ActivityKeywordPage activitySlug="xuat-hanh" path="/xem-ngay-tot-xuat-hanh" params={(await searchParams) ?? {}} />;
}
