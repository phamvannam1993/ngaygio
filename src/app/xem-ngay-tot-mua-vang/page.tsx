import { ActivityKeywordPage, buildActivityKeywordMetadata } from "../xem-ngay-tot/ActivityKeywordPage";
import type { ActivitySlug } from "@/lib/calendar/activity";

type PageProps = { searchParams?: Promise<Record<string, string | string[] | undefined>> };
export const dynamic = "force-dynamic";
export const metadata = buildActivityKeywordMetadata("mua-vang" as ActivitySlug, "/xem-ngay-tot-mua-vang");
export default async function Page({ searchParams }: PageProps) {
  return <ActivityKeywordPage activitySlug={"mua-vang" as ActivitySlug} path="/xem-ngay-tot-mua-vang" params={(await searchParams) ?? {}} />;
}
