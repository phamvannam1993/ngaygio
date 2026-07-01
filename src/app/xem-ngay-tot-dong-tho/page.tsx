import { ActivityKeywordPage, buildActivityKeywordMetadata } from "../xem-ngay-tot/ActivityKeywordPage";

type PageProps = { searchParams?: Promise<Record<string, string | string[] | undefined>> };
export const dynamic = "force-dynamic";
export const metadata = buildActivityKeywordMetadata("dong-tho", "/xem-ngay-tot-dong-tho");
export default async function Page({ searchParams }: PageProps) {
  return <ActivityKeywordPage activitySlug="dong-tho" path="/xem-ngay-tot-dong-tho" params={(await searchParams) ?? {}} />;
}
