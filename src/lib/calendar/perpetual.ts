import { addDays, daysInMonth, type DateParts } from "@/lib/date";
import { getYearCanChi } from "./can-chi";
import { getDayInfo, getMonthCalendar } from "./service";
import type { CalendarEvent, CalendarMonth, DayInfo } from "./types";
import { ZODIAC_BY_CHI } from "./zodiac";
import { amLichMonthHref } from "./urls";

export type MonthOverview = {
  year: number;
  month: number;
  href: string;
  title: string;
  totalDays: number;
  goodDays: number;
  badDays: number;
  eventCount: number;
  firstLunarText: string;
  solarTerms: string[];
  importantEvents: CalendarEvent[];
};

export type PerpetualYearSummary = {
  year: number;
  canChiYear: string;
  animal: string;
  animalEmoji: string;
  animalDescription: string;
  totalDays: number;
  isSolarLeapYear: boolean;
  goodDays: number;
  badDays: number;
  eventCount: number;
  leapLunarMonths: string[];
  months: MonthOverview[];
};

function monthHref(date: DateParts): string {
  return amLichMonthHref(date.year, date.month);
}

function unique<T>(items: T[]): T[] {
  return Array.from(new Set(items));
}

function getMonthDays(year: number, month: number): DayInfo[] {
  const totalDays = daysInMonth(year, month);
  return Array.from({ length: totalDays }, (_, index) => getDayInfo({ year, month, day: index + 1 }));
}

export function getMonthOverview(year: number, month: number): MonthOverview {
  const days = getMonthDays(year, month);
  const firstDay = days[0];
  const solarTerms = unique(days.map((day) => day.solarTerm)).slice(0, 3);
  const events = days.flatMap((day) => day.events);
  const importantEvents = events
    .filter((event) => event.color === "red" || event.color === "green" || event.type === "solar" || event.type === "lunar")
    .slice(0, 4);

  return {
    year,
    month,
    href: monthHref({ year, month, day: 1 }),
    title: `Tháng ${month}/${year}`,
    totalDays: days.length,
    goodDays: days.filter((day) => day.quality.type === "good").length,
    badDays: days.filter((day) => day.quality.type === "bad").length,
    eventCount: events.length,
    firstLunarText: `${firstDay.lunar.day}/${firstDay.lunar.month}${firstDay.lunar.isLeap ? " nhuận" : ""}`,
    solarTerms,
    importantEvents,
  };
}

export function getPerpetualYearSummary(year: number): PerpetualYearSummary {
  const months = Array.from({ length: 12 }, (_, index) => getMonthOverview(year, index + 1));
  const totalDays = daysInMonth(year, 2) === 29 ? 366 : 365;
  const yearCanChi = getYearCanChi(year);
  const zodiac = ZODIAC_BY_CHI[yearCanChi.chi];

  const leapLunarMonths: string[] = [];
  let goodDays = 0;
  let badDays = 0;
  let eventCount = 0;

  months.forEach((month) => {
    goodDays += month.goodDays;
    badDays += month.badDays;
    eventCount += month.eventCount;
  });

  let cursor: DateParts = { year, month: 1, day: 1 };
  for (let i = 0; i < totalDays; i += 1) {
    const day = getDayInfo(cursor);
    if (day.lunar.isLeap) {
      leapLunarMonths.push(`Tháng ${day.lunar.month} nhuận`);
    }
    cursor = addDays(cursor, 1);
  }

  return {
    year,
    canChiYear: yearCanChi.text,
    animal: zodiac.animal,
    animalEmoji: zodiac.emoji,
    animalDescription: zodiac.description,
    totalDays,
    isSolarLeapYear: totalDays === 366,
    goodDays,
    badDays,
    eventCount,
    leapLunarMonths: unique(leapLunarMonths),
    months,
  };
}

export function getPerpetualCalendarData(selectedDate: DateParts): {
  selectedDate: DateParts;
  selectedDay: DayInfo;
  selectedMonth: CalendarMonth;
  yearSummary: PerpetualYearSummary;
  prevDay: DateParts;
  nextDay: DateParts;
} {
  return {
    selectedDate,
    selectedDay: getDayInfo(selectedDate),
    selectedMonth: getMonthCalendar(selectedDate.year, selectedDate.month, selectedDate),
    yearSummary: getPerpetualYearSummary(selectedDate.year),
    prevDay: addDays(selectedDate, -1),
    nextDay: addDays(selectedDate, 1),
  };
}
