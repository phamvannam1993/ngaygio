import { weekdayMonday0, type DateParts } from "@/lib/date";
import type { CalendarEvent, LunarDate } from "./types";

const SOLAR_EVENTS: Record<string, CalendarEvent[]> = {
  "01-01": [{ title: "Tết Dương lịch", type: "solar", color: "red" }],
  "02-03": [{ title: "Ngày thành lập Đảng Cộng sản Việt Nam", type: "solar", color: "red" }],
  "02-14": [{ title: "Valentine", type: "solar", color: "blue" }],
  "03-08": [{ title: "Ngày Quốc tế Phụ nữ", type: "solar", color: "red" }],
  "04-30": [{ title: "Ngày Giải phóng miền Nam", type: "solar", color: "red" }],
  "05-01": [{ title: "Ngày Quốc tế Lao động", type: "solar", color: "red" }],
  "05-19": [{ title: "Ngày sinh Chủ tịch Hồ Chí Minh", type: "solar", color: "red" }],
  "06-01": [{ title: "Ngày Quốc tế Thiếu nhi", type: "solar", color: "green" }],
  "06-05": [
    { title: "Ngày Bác Hồ ra đi tìm đường cứu nước", type: "solar", color: "blue" },
    { title: "Ngày Môi trường Thế giới", type: "solar", color: "green" },
  ],
  "06-21": [{ title: "Ngày Báo chí Cách mạng Việt Nam", type: "solar", color: "red" }],
  "06-28": [{ title: "Ngày Gia đình Việt Nam", type: "solar", color: "green" }],
  "09-02": [{ title: "Quốc khánh Việt Nam", type: "solar", color: "red" }],
  "10-20": [{ title: "Ngày Phụ nữ Việt Nam", type: "solar", color: "red" }],
  "11-20": [{ title: "Ngày Nhà giáo Việt Nam", type: "solar", color: "blue" }],
  "12-22": [{ title: "Ngày thành lập Quân đội nhân dân Việt Nam", type: "solar", color: "red" }],
};

const LUNAR_EVENTS: Record<string, CalendarEvent[]> = {
  "01-01": [{ title: "Tết Nguyên Đán", type: "lunar", color: "red" }],
  "01-15": [{ title: "Rằm tháng Giêng", type: "lunar", color: "yellow" }],
  "03-10": [{ title: "Giỗ Tổ Hùng Vương", type: "lunar", color: "red" }],
  "05-05": [{ title: "Tết Đoan Ngọ", type: "lunar", color: "blue" }],
  "07-15": [{ title: "Lễ Vu Lan", type: "lunar", color: "yellow" }],
  "08-15": [{ title: "Tết Trung Thu", type: "lunar", color: "yellow" }],
  "12-23": [{ title: "Ông Công Ông Táo", type: "lunar", color: "blue" }],
};

function key(month: number, day: number): string {
  return `${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function getDynamicEvents(date: DateParts): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  const isSunday = weekdayMonday0(date) === 6;

  if (date.month === 5 && isSunday && date.day >= 8 && date.day <= 14) {
    events.push({ title: "Ngày của Mẹ", type: "dynamic", color: "blue" });
  }

  if (date.month === 6 && isSunday && date.day >= 15 && date.day <= 21) {
    events.push({ title: "Ngày của Bố", type: "dynamic", color: "blue" });
  }

  return events;
}

export function getEvents(date: DateParts, lunar: LunarDate): CalendarEvent[] {
  const solarEvents = SOLAR_EVENTS[key(date.month, date.day)] ?? [];
  const lunarEvents = lunar.isLeap ? [] : LUNAR_EVENTS[key(lunar.month, lunar.day)] ?? [];
  return [...solarEvents, ...lunarEvents, ...getDynamicEvents(date)];
}
