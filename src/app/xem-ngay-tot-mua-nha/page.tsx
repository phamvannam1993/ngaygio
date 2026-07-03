import { ActivityKeywordPage, buildActivityKeywordMetadata } from "../xem-ngay-tot/ActivityKeywordPage";
import type { ActivitySlug } from "@/lib/calendar/activity";

type PageProps = { searchParams?: Promise<Record<string, string | string[] | undefined>> };
export const dynamic = "force-dynamic";
export const metadata = buildActivityKeywordMetadata("mua-nha" as ActivitySlug, "/xem-ngay-tot-mua-nha");
export default async function Page({ searchParams }: PageProps) {
  return <ActivityKeywordPage activitySlug={"mua-nha" as ActivitySlug} path="/xem-ngay-tot-mua-nha" params={(await searchParams) ?? {}} />;
}
