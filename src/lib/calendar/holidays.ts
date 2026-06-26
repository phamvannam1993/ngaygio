import { addDays, daysInMonth, type DateParts } from "@/lib/date";
import { convertLunar2Solar } from "./lunar";
import { getDayInfo } from "./service";
import type { CalendarEvent } from "./types";
import { amLichDayHref } from "./urls";

export type HolidayItem = {
  title: string;
  date: DateParts;
  dateText: string;
  type: "solar" | "lunar" | "extended";
  isDayOff: boolean;
  note: string;
  href: string;
};

export type YearEventItem = {
  title: string;
  date: DateParts;
  month: number;
  type: CalendarEvent["type"];
  color: CalendarEvent["color"];
  href: string;
};

function format(date: DateParts) {
  return `${date.day}/${date.month}/${date.year}`;
}

function addHoliday(title: string, date: DateParts | null, type: HolidayItem["type"], isDayOff: boolean, note: string): HolidayItem | null {
  if (!date) return null;
  return {
    title,
    date,
    dateText: format(date),
    type,
    isDayOff,
    note,
    href: amLichDayHref(date),
  };
}

export function getHolidayItems(year: number): HolidayItem[] {
  const tet = convertLunar2Solar(1, 1, year, false);
  const gioTo = convertLunar2Solar(10, 3, year, false);
  const tetDays = tet
    ? Array.from({ length: 5 }, (_, index) => addHoliday(`Tết Nguyên Đán ngày ${index + 1}`, addDays(tet, index), "extended", true, "Lịch nghỉ thực tế từng năm cần đối chiếu thông báo chính thức."))
    : [];

  return [
    addHoliday("Tết Dương lịch", { year, month: 1, day: 1 }, "solar", true, "Ngày nghỉ cố định theo dương lịch."),
    ...tetDays,
    addHoliday("Giỗ Tổ Hùng Vương", gioTo, "lunar", true, "Ngày 10/3 âm lịch."),
    addHoliday("Ngày Giải phóng miền Nam", { year, month: 4, day: 30 }, "solar", true, "Ngày nghỉ cố định theo dương lịch."),
    addHoliday("Ngày Quốc tế Lao động", { year, month: 5, day: 1 }, "solar", true, "Ngày nghỉ cố định theo dương lịch."),
    addHoliday("Quốc khánh Việt Nam", { year, month: 9, day: 2 }, "solar", true, "Ngày nghỉ cố định theo dương lịch."),
  ].filter(Boolean).sort((a, b) => new Date(Date.UTC(a!.date.year, a!.date.month - 1, a!.date.day)).getTime() - new Date(Date.UTC(b!.date.year, b!.date.month - 1, b!.date.day)).getTime()) as HolidayItem[];
}

export function getYearEvents(year: number): YearEventItem[] {
  const events: YearEventItem[] = [];
  for (let month = 1; month <= 12; month += 1) {
    for (let day = 1; day <= daysInMonth(year, month); day += 1) {
      const date = { year, month, day };
      const info = getDayInfo(date);
      info.events.forEach((event) => {
        events.push({
          title: event.title,
          date,
          month,
          type: event.type,
          color: event.color,
          href: event.href ?? amLichDayHref(date),
        });
      });
    }
  }
  return events;
}

export function groupEventsByMonth(events: YearEventItem[]) {
  return Array.from({ length: 12 }, (_, index) => {
    const month = index + 1;
    return {
      month,
      events: events.filter((event) => event.month === month),
    };
  });
}
