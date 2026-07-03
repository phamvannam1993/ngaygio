import { ActivityKeywordPage, buildActivityKeywordMetadata } from "../xem-ngay-tot/ActivityKeywordPage";
import type { ActivitySlug } from "@/lib/calendar/activity";

type PageProps = { searchParams?: Promise<Record<string, string | string[] | undefined>> };
export const dynamic = "force-dynamic";
export const metadata = buildActivityKeywordMetadata("dat-coc" as ActivitySlug, "/xem-ngay-tot-dat-coc");
export default async function Page({ searchParams }: PageProps) {
  return <ActivityKeywordPage activitySlug={"dat-coc" as ActivitySlug} path="/xem-ngay-tot-dat-coc" params={(await searchParams) ?? {}} />;
}
