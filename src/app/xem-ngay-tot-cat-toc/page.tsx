import { ActivityKeywordPage, buildActivityKeywordMetadata } from "../xem-ngay-tot/ActivityKeywordPage";

type PageProps = { searchParams?: Promise<Record<string, string | string[] | undefined>> };
export const dynamic = "force-dynamic";
export const metadata = buildActivityKeywordMetadata("cat-toc", "/xem-ngay-tot-cat-toc");
export default async function Page({ searchParams }: PageProps) {
  return <ActivityKeywordPage activitySlug="cat-toc" path="/xem-ngay-tot-cat-toc" params={(await searchParams) ?? {}} />;
}
