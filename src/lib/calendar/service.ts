import {
  addDays,
  addMonthsToFirstDay,
  daysInMonth,
  getVietnamTodayParts,
  isSameDate,
  type DateParts,
  weekdayMonday0,
  weekdayName,
} from "@/lib/date";
import { getDayCanChi, getHoursByDayChi, getMonthCanChi, getYearCanChi } from "./can-chi";
import { getEvents } from "./events";
import { convertSolar2Lunar, getSolarTermName } from "./lunar";
import { getDayQuality } from "./quality";
import type { CalendarMonth, DayInfo } from "./types";
import { amLichDayHref } from "./urls";

export function getDayInfo(solar: DateParts): DayInfo {
  const lunar = convertSolar2Lunar(solar.day, solar.month, solar.year);
  const dayCanChi = getDayCanChi(lunar.jd);
  const monthCanChi = getMonthCanChi(lunar.year, lunar.month);
  const yearCanChi = getYearCanChi(lunar.year);
  const hours = getHoursByDayChi(dayCanChi.chi);

  return {
    solar,
    lunar,
    weekdayName: weekdayName(solar),
    solarTerm: getSolarTermName(solar),
    canChi: {
      day: dayCanChi.text,
      month: monthCanChi.text,
      year: yearCanChi.text,
      dayCan: dayCanChi.can,
      dayChi: dayCanChi.chi,
      monthCan: monthCanChi.can,
      monthChi: monthCanChi.chi,
      yearCan: yearCanChi.can,
      yearChi: yearCanChi.chi,
    },
    quality: getDayQuality(lunar.month, dayCanChi.chi),
    goodHours: hours.goodHours,
    badHours: hours.badHours,
    events: getEvents(solar, lunar),
  };
}

export function getMonthCalendar(year: number, month: number, selectedDate: DateParts): CalendarMonth {
  const firstDay: DateParts = { year, month, day: 1 };
  const firstOffset = weekdayMonday0(firstDay);
  const totalDays = daysInMonth(year, month);
  const cellCount = Math.ceil((firstOffset + totalDays) / 7) * 7;
  const today = getVietnamTodayParts();

  const cells = Array.from({ length: cellCount }, (_, index) => {
    const date = addDays(firstDay, index - firstOffset);
    const info = getDayInfo(date);

    return {
      ...info,
      otherMonth: date.month !== month,
      isToday: isSameDate(date, today),
      isSelected: isSameDate(date, selectedDate),
      url: amLichDayHref(date),
    };
  });

  return {
    year,
    month,
    title: `Lịch âm tháng ${month} năm ${year}`,
    cells,
    selectedDate,
    prevMonthDate: addMonthsToFirstDay(year, month, -1),
    nextMonthDate: addMonthsToFirstDay(year, month, 1),
  };
}

export function getDayTags(day: DayInfo): string[] {
  return [
    `ngày ${day.solar.day} tháng ${day.solar.month} năm ${day.solar.year}`,
    `${day.solar.day}/${day.solar.month}/${day.solar.year}`,
    `giờ hoàng đạo ngày ${day.solar.day}/${day.solar.month}/${day.solar.year}`,
    `ngày tốt tháng ${day.solar.month} năm ${day.solar.year}`,
    `${day.quality.label.toLowerCase()}`,
  ];
}
