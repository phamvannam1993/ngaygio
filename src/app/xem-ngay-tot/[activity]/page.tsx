import { redirect } from "next/navigation";
import { isActivitySlug } from "@/lib/calendar/activity";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ activity: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export const dynamic = "force-dynamic";

export default async function XemNgayTotActivityPage({ params, searchParams }: PageProps) {
  const { activity } = await params;
  if (!isActivitySlug(activity)) notFound();

  const sp = await searchParams;
  const query = sp ? new URLSearchParams(
    Object.entries(sp).flatMap(([k, v]) =>
      Array.isArray(v) ? v.map((val) => [k, val]) : v ? [[k, v]] : []
    )
  ).toString() : "";

  const dest = `/xem-ngay-tot-${activity}${query ? `?${query}` : ""}`;
  redirect(dest);
}
