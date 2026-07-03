import type { Metadata } from "next";
import { HolidaySeoPage, buildHolidaySeoMetadata } from "@/components/HolidaySeoPage";

export const dynamic = "force-dynamic";
export const metadata: Metadata = buildHolidaySeoMetadata("ngay-30-4");

export default function Page() {
  return <HolidaySeoPage slug="ngay-30-4" />;
}
