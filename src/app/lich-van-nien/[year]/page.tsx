import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

export const metadata: Metadata = { robots: { index: false, follow: true } };
import { amLichYearHref } from "@/lib/calendar/urls";

type PageProps = { params: Promise<{ year: string }> };

export default async function LichVanNienYearRedirect({ params }: PageProps) {
  const year = Number((await params).year);
  if (!Number.isInteger(year) || year < 1900 || year > 2050) notFound();
  redirect(amLichYearHref(year));
}
