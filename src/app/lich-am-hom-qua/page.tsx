import { permanentRedirect } from "next/navigation";
import { addDays, getVietnamTodayParts } from "@/lib/date";
import { amLichDayHref } from "@/lib/calendar/urls";

export const dynamic = "force-dynamic";

export default function LichAmHomQuaPage() {
  const yesterday = addDays(getVietnamTodayParts(), -1);
  permanentRedirect(amLichDayHref(yesterday));
}
