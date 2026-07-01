import { ActivityKeywordPage, buildActivityKeywordMetadata } from "../xem-ngay-tot/ActivityKeywordPage";

type PageProps = { searchParams?: Promise<Record<string, string | string[] | undefined>> };
export const dynamic = "force-dynamic";
export const metadata = buildActivityKeywordMetadata("nhap-trach", "/xem-ngay-tot-nhap-trach");
export default async function Page({ searchParams }: PageProps) {
  return <ActivityKeywordPage activitySlug="nhap-trach" path="/xem-ngay-tot-nhap-trach" params={(await searchParams) ?? {}} />;
}
