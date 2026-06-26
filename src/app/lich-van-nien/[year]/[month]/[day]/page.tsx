import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

export const metadata: Metadata = { robots: { index: false, follow: true } };
import { isValidDateParts } from "@/lib/date";
import { amLichDayHref } from "@/lib/calendar/urls";

type PageProps = { params: Promise<{ year: string; month: string; day: string }> };

export default async function LichVanNienDayRedirect({ params }: PageProps) {
  const p = await params;
  const date = { year: Number(p.year), month: Number(p.month), day: Number(p.day) };
  if (date.year < 1900 || date.year > 2050 || !isValidDateParts(date)) notFound();
  redirect(amLichDayHref(date));
}
