import type { Metadata } from "next";
import { HolidaySeoPage, buildHolidaySeoMetadata } from "@/components/HolidaySeoPage";

export const dynamic = "force-dynamic";
export const metadata: Metadata = buildHolidaySeoMetadata("gio-to-hung-vuong");

export default function Page() {
  return <HolidaySeoPage slug="gio-to-hung-vuong" />;
}
