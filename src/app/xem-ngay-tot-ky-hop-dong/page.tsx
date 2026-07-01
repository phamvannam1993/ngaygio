import { ActivityKeywordPage, buildActivityKeywordMetadata } from "../xem-ngay-tot/ActivityKeywordPage";

type PageProps = { searchParams?: Promise<Record<string, string | string[] | undefined>> };
export const dynamic = "force-dynamic";
export const metadata = buildActivityKeywordMetadata("ky-hop-dong", "/xem-ngay-tot-ky-hop-dong");
export default async function Page({ searchParams }: PageProps) {
  return <ActivityKeywordPage activitySlug="ky-hop-dong" path="/xem-ngay-tot-ky-hop-dong" params={(await searchParams) ?? {}} />;
}
