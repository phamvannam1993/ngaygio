import { ActivityKeywordPage, buildActivityKeywordMetadata } from "../xem-ngay-tot/ActivityKeywordPage";
import type { ActivitySlug } from "@/lib/calendar/activity";

type PageProps = { searchParams?: Promise<Record<string, string | string[] | undefined>> };
export const dynamic = "force-dynamic";
export const metadata = buildActivityKeywordMetadata("di-xa" as ActivitySlug, "/xem-ngay-tot-di-xa");
export default async function Page({ searchParams }: PageProps) {
  return <ActivityKeywordPage activitySlug={"di-xa" as ActivitySlug} path="/xem-ngay-tot-di-xa" params={(await searchParams) ?? {}} />;
}
