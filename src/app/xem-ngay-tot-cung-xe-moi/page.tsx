import { ActivityKeywordPage, buildActivityKeywordMetadata } from "../xem-ngay-tot/ActivityKeywordPage";
import type { ActivitySlug } from "@/lib/calendar/activity";

type PageProps = { searchParams?: Promise<Record<string, string | string[] | undefined>> };
export const dynamic = "force-dynamic";
export const metadata = buildActivityKeywordMetadata("cung-xe-moi" as ActivitySlug, "/xem-ngay-tot-cung-xe-moi");
export default async function Page({ searchParams }: PageProps) {
  return <ActivityKeywordPage activitySlug={"cung-xe-moi" as ActivitySlug} path="/xem-ngay-tot-cung-xe-moi" params={(await searchParams) ?? {}} />;
}
