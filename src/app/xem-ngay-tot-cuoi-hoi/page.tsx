import { ActivityKeywordPage, buildActivityKeywordMetadata } from "../xem-ngay-tot/ActivityKeywordPage";

type PageProps = { searchParams?: Promise<Record<string, string | string[] | undefined>> };
export const dynamic = "force-dynamic";
export const metadata = buildActivityKeywordMetadata("cuoi-hoi", "/xem-ngay-tot-cuoi-hoi");
export default async function Page({ searchParams }: PageProps) {
  return <ActivityKeywordPage activitySlug="cuoi-hoi" path="/xem-ngay-tot-cuoi-hoi" params={(await searchParams) ?? {}} />;
}
