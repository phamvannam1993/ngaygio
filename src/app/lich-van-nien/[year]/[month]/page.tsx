import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

export const metadata: Metadata = { robots: { index: false, follow: true } };
import { amLichMonthHref } from "@/lib/calendar/urls";

type PageProps = { params: Promise<{ year: string; month: string }> };

export default async function LichVanNienMonthRedirect({ params }: PageProps) {
  const { year: rawYear, month: rawMonth } = await params;
  const year = Number(rawYear);
  const month = Number(rawMonth);
  if (!Number.isInteger(year) || year < 1900 || year > 2050 || !Number.isInteger(month) || month < 1 || month > 12) notFound();
  redirect(amLichMonthHref(year, month));
}
