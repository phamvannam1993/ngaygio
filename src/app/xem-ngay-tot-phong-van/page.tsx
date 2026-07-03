import { ActivityKeywordPage, buildActivityKeywordMetadata } from "../xem-ngay-tot/ActivityKeywordPage";
import type { ActivitySlug } from "@/lib/calendar/activity";

type PageProps = { searchParams?: Promise<Record<string, string | string[] | undefined>> };
export const dynamic = "force-dynamic";
export const metadata = buildActivityKeywordMetadata("phong-van" as ActivitySlug, "/xem-ngay-tot-phong-van");
export default async function Page({ searchParams }: PageProps) {
  return <ActivityKeywordPage activitySlug={"phong-van" as ActivitySlug} path="/xem-ngay-tot-phong-van" params={(await searchParams) ?? {}} />;
}
