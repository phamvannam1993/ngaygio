import { ActivityKeywordPage, buildActivityKeywordMetadata } from "../xem-ngay-tot/ActivityKeywordPage";

type PageProps = { searchParams?: Promise<Record<string, string | string[] | undefined>> };
export const dynamic = "force-dynamic";
export const metadata = buildActivityKeywordMetadata("khai-truong", "/xem-ngay-tot-khai-truong");
export default async function Page({ searchParams }: PageProps) {
  return <ActivityKeywordPage activitySlug="khai-truong" path="/xem-ngay-tot-khai-truong" params={(await searchParams) ?? {}} />;
}
