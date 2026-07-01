import { ActivityKeywordPage, buildActivityKeywordMetadata } from "../xem-ngay-tot/ActivityKeywordPage";

type PageProps = { searchParams?: Promise<Record<string, string | string[] | undefined>> };
export const dynamic = "force-dynamic";
export const metadata = buildActivityKeywordMetadata("mua-xe", "/xem-ngay-tot-mua-xe");
export default async function Page({ searchParams }: PageProps) {
  return <ActivityKeywordPage activitySlug="mua-xe" path="/xem-ngay-tot-mua-xe" params={(await searchParams) ?? {}} />;
}
