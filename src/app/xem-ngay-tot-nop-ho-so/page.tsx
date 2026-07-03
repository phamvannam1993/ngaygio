import { ActivityKeywordPage, buildActivityKeywordMetadata } from "../xem-ngay-tot/ActivityKeywordPage";
import type { ActivitySlug } from "@/lib/calendar/activity";

type PageProps = { searchParams?: Promise<Record<string, string | string[] | undefined>> };
export const dynamic = "force-dynamic";
export const metadata = buildActivityKeywordMetadata("nop-ho-so" as ActivitySlug, "/xem-ngay-tot-nop-ho-so");
export default async function Page({ searchParams }: PageProps) {
  return <ActivityKeywordPage activitySlug={"nop-ho-so" as ActivitySlug} path="/xem-ngay-tot-nop-ho-so" params={(await searchParams) ?? {}} />;
}
