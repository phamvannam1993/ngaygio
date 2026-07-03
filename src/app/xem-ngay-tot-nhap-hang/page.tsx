import { ActivityKeywordPage, buildActivityKeywordMetadata } from "../xem-ngay-tot/ActivityKeywordPage";
import type { ActivitySlug } from "@/lib/calendar/activity";

type PageProps = { searchParams?: Promise<Record<string, string | string[] | undefined>> };
export const dynamic = "force-dynamic";
export const metadata = buildActivityKeywordMetadata("nhap-hang" as ActivitySlug, "/xem-ngay-tot-nhap-hang");
export default async function Page({ searchParams }: PageProps) {
  return <ActivityKeywordPage activitySlug={"nhap-hang" as ActivitySlug} path="/xem-ngay-tot-nhap-hang" params={(await searchParams) ?? {}} />;
}
