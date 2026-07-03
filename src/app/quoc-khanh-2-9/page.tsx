import type { Metadata } from "next";
import { HolidaySeoPage, buildHolidaySeoMetadata } from "@/components/HolidaySeoPage";

export const dynamic = "force-dynamic";
export const metadata: Metadata = buildHolidaySeoMetadata("quoc-khanh-2-9");

export default function Page() {
  return <HolidaySeoPage slug="quoc-khanh-2-9" />;
}
