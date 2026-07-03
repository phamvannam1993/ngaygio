import { ActivityKeywordPage, buildActivityKeywordMetadata } from "../xem-ngay-tot/ActivityKeywordPage";
import type { ActivitySlug } from "@/lib/calendar/activity";

type PageProps = { searchParams?: Promise<Record<string, string | string[] | undefined>> };
export const dynamic = "force-dynamic";
export const metadata = buildActivityKeywordMetadata("mo-hang" as ActivitySlug, "/xem-ngay-tot-mo-hang");
export default async function Page({ searchParams }: PageProps) {
  return <ActivityKeywordPage activitySlug={"mo-hang" as ActivitySlug} path="/xem-ngay-tot-mo-hang" params={(await searchParams) ?? {}} />;
}
