import { ActivityKeywordPage, buildActivityKeywordMetadata } from "../xem-ngay-tot/ActivityKeywordPage";

type PageProps = { searchParams?: Promise<Record<string, string | string[] | undefined>> };
export const dynamic = "force-dynamic";
export const metadata = buildActivityKeywordMetadata("chuyen-nha", "/xem-ngay-tot-chuyen-nha");
export default async function Page({ searchParams }: PageProps) {
  return <ActivityKeywordPage activitySlug="chuyen-nha" path="/xem-ngay-tot-chuyen-nha" params={(await searchParams) ?? {}} />;
}
