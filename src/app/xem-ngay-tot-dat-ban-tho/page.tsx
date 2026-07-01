import { ActivityKeywordPage, buildActivityKeywordMetadata } from "../xem-ngay-tot/ActivityKeywordPage";

type PageProps = { searchParams?: Promise<Record<string, string | string[] | undefined>> };
export const dynamic = "force-dynamic";
export const metadata = buildActivityKeywordMetadata("dat-ban-tho", "/xem-ngay-tot-dat-ban-tho");
export default async function Page({ searchParams }: PageProps) {
  return <ActivityKeywordPage activitySlug="dat-ban-tho" path="/xem-ngay-tot-dat-ban-tho" params={(await searchParams) ?? {}} />;
}
