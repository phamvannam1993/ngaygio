import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import { getVietnamTodayParts } from "@/lib/date";
import { amLichDayHref } from "@/lib/calendar/urls";

export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

export default function AmLichIndexPage() {
  permanentRedirect(amLichDayHref(getVietnamTodayParts()));
}
