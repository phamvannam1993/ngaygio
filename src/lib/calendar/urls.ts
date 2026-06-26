import type { DateParts } from "@/lib/date";

export function amLichYearHref(year: number): string {
  return `/am-lich/nam/${year}`;
}

export function amLichMonthHref(year: number, month: number): string {
  return `/am-lich/nam/${year}/thang/${month}`;
}

export function amLichDayHref(date: DateParts): string {
  return `/am-lich/nam/${date.year}/thang/${date.month}/ngay/${date.day}`;
}

export function lichVanNienDayHref(date: DateParts): string {
  return `/lich-van-nien/${date.year}/${date.month}/${date.day}`;
}

export function lichVanNienMonthHref(year: number, month: number): string {
  return `/lich-van-nien/${year}/${month}`;
}

export function lichVanNienYearHref(year: number): string {
  return `/lich-van-nien/${year}`;
}

export function gioHoangDaoDayHref(date: DateParts): string {
  return `/gio-hoang-dao/${date.year}/${date.month}/${date.day}`;
}
