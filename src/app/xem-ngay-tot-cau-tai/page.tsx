import { ActivityKeywordPage, buildActivityKeywordMetadata } from "../xem-ngay-tot/ActivityKeywordPage";
import type { ActivitySlug } from "@/lib/calendar/activity";

type PageProps = { searchParams?: Promise<Record<string, string | string[] | undefined>> };
export const dynamic = "force-dynamic";
export const metadata = buildActivityKeywordMetadata("cau-tai" as ActivitySlug, "/xem-ngay-tot-cau-tai");
export default async function Page({ searchParams }: PageProps) {
  return <ActivityKeywordPage activitySlug={"cau-tai" as ActivitySlug} path="/xem-ngay-tot-cau-tai" params={(await searchParams) ?? {}} />;
}
