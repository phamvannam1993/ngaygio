import type { DateParts } from "@/lib/date";

export type CanName = "Giáp" | "Ất" | "Bính" | "Đinh" | "Mậu" | "Kỷ" | "Canh" | "Tân" | "Nhâm" | "Quý";
export type ChiName = "Tý" | "Sửu" | "Dần" | "Mão" | "Thìn" | "Tỵ" | "Ngọ" | "Mùi" | "Thân" | "Dậu" | "Tuất" | "Hợi";

export type LunarDate = {
  day: number;
  month: number;
  year: number;
  isLeap: boolean;
  jd: number;
};

export type CalendarEvent = {
  title: string;
  type: "solar" | "lunar" | "dynamic";
  color: "green" | "blue" | "red" | "yellow";
  href?: string;
};

export type DayQuality = {
  type: "good" | "bad";
  label: "Hoàng Đạo" | "Hắc Đạo";
  shortLabel: "Tốt" | "Xấu";
  note: string;
};

export type HourInfo = {
  branch: ChiName;
  range: string;
  isGood: boolean;
};

export type DayInfo = {
  solar: DateParts;
  lunar: LunarDate;
  weekdayName: string;
  solarTerm: string;
  canChi: {
    day: string;
    month: string;
    year: string;
    dayCan: CanName;
    dayChi: ChiName;
    monthCan: CanName;
    monthChi: ChiName;
    yearCan: CanName;
    yearChi: ChiName;
  };
  quality: DayQuality;
  goodHours: HourInfo[];
  badHours: HourInfo[];
  events: CalendarEvent[];
};

export type CalendarCell = DayInfo & {
  otherMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  url: string;
};

export type CalendarMonth = {
  year: number;
  month: number;
  title: string;
  cells: CalendarCell[];
  selectedDate: DateParts;
  prevMonthDate: DateParts;
  nextMonthDate: DateParts;
};
