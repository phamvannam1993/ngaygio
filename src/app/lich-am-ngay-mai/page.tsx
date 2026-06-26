import { permanentRedirect } from "next/navigation";
import { addDays, getVietnamTodayParts } from "@/lib/date";
import { amLichDayHref } from "@/lib/calendar/urls";

export const dynamic = "force-dynamic";

export default function LichAmNgayMaiPage() {
  const tomorrow = addDays(getVietnamTodayParts(), 1);
  permanentRedirect(amLichDayHref(tomorrow));
}
