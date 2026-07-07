import { getVietnamTodayParts, formatDisplayDate, isoWeekOfYear, dayOfYear, type DateParts } from "@/lib/date";
import { getDayInfo } from "@/lib/calendar/service";
import { getGoodBadDetails } from "@/lib/calendar/good-bad";
import { getTetInfo } from "@/lib/calendar/tet";

// Tổng hợp toàn bộ dữ liệu "Hôm nay" dùng chung cho /hom-nay và các biến thể.
export function getHomNayData() {
  const today: DateParts = getVietnamTodayParts();
  const info = getDayInfo(today);
  const details = getGoodBadDetails(info);
  const tet = getTetInfo(today);
  const { week, year: weekYear } = isoWeekOfYear(today);
  const doy = dayOfYear(today);
  const todayDisplay = formatDisplayDate(today);
  const goodHoursText = info.goodHours.map((h) => `${h.branch} (${h.range})`).join(", ");
  const goodHourBranches = info.goodHours.map((h) => h.branch).join(", ");
  const events = info.events ?? [];
  return { today, info, details, tet, week, weekYear, doy, todayDisplay, goodHoursText, goodHourBranches, events };
}

export type HomNayData = ReturnType<typeof getHomNayData>;
