import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HolidaySeoPage, buildHolidaySeoMetadata } from "@/components/HolidaySeoPage";

type PageProps = { params: Promise<{ year: string }> };

function resolveYear(value: string): number | null {
  const year = Number(value);
  if (!Number.isInteger(year) || year < 1900 || year > 2050) return null;
  return year;
}

export function generateStaticParams() {
  const year = new Date().getFullYear();
  return Array.from({ length: 5 }, (_, index) => ({ year: String(year - 1 + index) }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { year: rawYear } = await params;
  const year = resolveYear(rawYear);
  if (!year) return { title: "Năm không hợp lệ | Ngày Giờ", robots: { index: false, follow: false } };
  return buildHolidaySeoMetadata("trung-thu", year);
}

export default async function Page({ params }: PageProps) {
  const { year: rawYear } = await params;
  const year = resolveYear(rawYear);
  if (!year) notFound();
  return <HolidaySeoPage slug="trung-thu" fixedYear={year} />;
}
