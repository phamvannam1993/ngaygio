import { permanentRedirect } from "next/navigation";
import { isValidBirthYear } from "@/lib/calendar/age";
import { notFound } from "next/navigation";

type PageProps = { params: Promise<{ year: string }> };

export default async function TinhTuoiAmYearRedirect({ params }: PageProps) {
  const { year } = await params;
  if (!isValidBirthYear(Number(year))) notFound();
  permanentRedirect(`/sinh-nam/${year}`);
}
