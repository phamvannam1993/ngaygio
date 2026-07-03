import { ActivityKeywordPage, buildActivityKeywordMetadata } from "../xem-ngay-tot/ActivityKeywordPage";
import type { ActivitySlug } from "@/lib/calendar/activity";

type PageProps = { searchParams?: Promise<Record<string, string | string[] | undefined>> };
export const dynamic = "force-dynamic";
export const metadata = buildActivityKeywordMetadata("khai-but" as ActivitySlug, "/xem-ngay-tot-khai-but");
export default async function Page({ searchParams }: PageProps) {
  return <ActivityKeywordPage activitySlug={"khai-but" as ActivitySlug} path="/xem-ngay-tot-khai-but" params={(await searchParams) ?? {}} />;
}
