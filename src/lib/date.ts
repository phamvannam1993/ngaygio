export type DateParts = {
  year: number;
  month: number;
  day: number;
};

export const VIETNAM_TIMEZONE = "Asia/Ho_Chi_Minh";

export function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

export function formatDateKey(date: DateParts): string {
  return `${date.year}-${pad2(date.month)}-${pad2(date.day)}`;
}

export function formatDisplayDate(date: DateParts, separator = "/"): string {
  return `${pad2(date.day)}${separator}${pad2(date.month)}${separator}${date.year}`;
}

export function parseDateKey(value?: string | null): DateParts | null {
  if (!value) return null;
  const match = value.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  if (!isValidDateParts({ year, month, day })) return null;
  return { year, month, day };
}

export function isValidDateParts(date: DateParts): boolean {
  if (!Number.isInteger(date.year) || !Number.isInteger(date.month) || !Number.isInteger(date.day)) {
    return false;
  }
  if (date.year < 1800 || date.year > 2199) return false;
  if (date.month < 1 || date.month > 12) return false;
  return date.day >= 1 && date.day <= daysInMonth(date.year, date.month);
}

export function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

export function addDays(date: DateParts, amount: number): DateParts {
  const value = new Date(Date.UTC(date.year, date.month - 1, date.day));
  value.setUTCDate(value.getUTCDate() + amount);
  return {
    year: value.getUTCFullYear(),
    month: value.getUTCMonth() + 1,
    day: value.getUTCDate(),
  };
}

export function addMonthsToFirstDay(year: number, month: number, amount: number): DateParts {
  const value = new Date(Date.UTC(year, month - 1 + amount, 1));
  return {
    year: value.getUTCFullYear(),
    month: value.getUTCMonth() + 1,
    day: 1,
  };
}

export function isSameDate(a: DateParts, b: DateParts): boolean {
  return a.year === b.year && a.month === b.month && a.day === b.day;
}

export function weekdayMonday0(date: DateParts): number {
  const day = new Date(Date.UTC(date.year, date.month - 1, date.day)).getUTCDay();
  return (day + 6) % 7;
}

export function weekdayName(date: DateParts): string {
  const names = ["Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy", "Chủ Nhật"];
  return names[weekdayMonday0(date)];
}

export function getVietnamTodayParts(): DateParts {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: VIETNAM_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const get = (type: string) => Number(parts.find((part) => part.type === type)?.value);
  return {
    year: get("year"),
    month: get("month"),
    day: get("day"),
  };
}

export function getVietnamNowHour(): number {
  const value = new Intl.DateTimeFormat("en-GB", {
    timeZone: VIETNAM_TIMEZONE,
    hour: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date()).find((part) => part.type === "hour")?.value;

  return Number(value);
}

export function clampYear(year: number, min = 1900, max = 2050): number {
  if (!Number.isFinite(year)) return getVietnamTodayParts().year;
  return Math.min(max, Math.max(min, Math.trunc(year)));
}

// Tuần thứ mấy trong năm theo chuẩn ISO-8601 (tuần bắt đầu từ thứ Hai; tuần 1 là tuần chứa thứ Năm đầu tiên).
export function isoWeekOfYear(date: DateParts): { week: number; year: number } {
  const d = new Date(Date.UTC(date.year, date.month - 1, date.day));
  const dayNum = (d.getUTCDay() + 6) % 7; // Thứ Hai = 0 … Chủ Nhật = 6
  d.setUTCDate(d.getUTCDate() - dayNum + 3); // về thứ Năm cùng tuần
  const isoYear = d.getUTCFullYear();
  const firstThursday = new Date(Date.UTC(isoYear, 0, 4));
  const firstDayNum = (firstThursday.getUTCDay() + 6) % 7;
  firstThursday.setUTCDate(firstThursday.getUTCDate() - firstDayNum + 3);
  const week = 1 + Math.round((d.getTime() - firstThursday.getTime()) / (7 * 24 * 3600 * 1000));
  return { week, year: isoYear };
}

// Ngày thứ mấy trong năm (day-of-year, 1–366).
export function dayOfYear(date: DateParts): number {
  const start = Date.UTC(date.year, 0, 1);
  const cur = Date.UTC(date.year, date.month - 1, date.day);
  return Math.floor((cur - start) / (24 * 3600 * 1000)) + 1;
}
