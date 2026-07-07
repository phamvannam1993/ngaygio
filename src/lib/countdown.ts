import { getVietnamTodayParts, formatDisplayDate, type DateParts } from "@/lib/date";
import { convertLunar2Solar, convertSolar2Lunar } from "@/lib/calendar/lunar";
import { getTetInfoForYear } from "@/lib/calendar/tet";

export type CountdownEvent = {
  slug: string;
  name: string; // tên ngắn: "Tết 2026"
  longName: string; // tên đầy đủ cho H1
  target: DateParts; // ngày dương lịch mục tiêu
  lunarLabel: string; // "1/1 âm lịch" / "25/12 dương lịch"
  daysLeft: number;
  weeksLeft: number;
  passed: boolean;
  meaning: string;
};

function diffDays(from: DateParts, to: DateParts): number {
  const a = Date.UTC(from.year, from.month - 1, from.day);
  const b = Date.UTC(to.year, to.month - 1, to.day);
  return Math.round((b - a) / 86400000);
}

// Ngày dương kế tiếp cho sự kiện dương lịch cố định (vd 25/12, 2/9, 30/4).
function nextSolar(today: DateParts, month: number, day: number): DateParts {
  const thisYear: DateParts = { year: today.year, month, day };
  return diffDays(today, thisYear) >= 0 ? thisYear : { year: today.year + 1, month, day };
}

// Ngày dương kế tiếp cho sự kiện âm lịch cố định (vd 15/8 âm — Trung thu).
function nextLunar(today: DateParts, lunarMonth: number, lunarDay: number): DateParts {
  for (let y = today.year; y <= today.year + 1; y += 1) {
    const solar = convertLunar2Solar(lunarDay, lunarMonth, y);
    if (solar && diffDays(today, solar) >= 0) return solar;
  }
  return convertLunar2Solar(lunarDay, lunarMonth, today.year + 1) ?? { year: today.year + 1, month: 1, day: 1 };
}

// Danh sách slug hỗ trợ (dùng cho generateStaticParams).
export const COUNTDOWN_SLUGS = [
  "tet-2026", "tet-2027", "tet-2028", "tet-2029",
  "trung-thu-2026", "trung-thu-2027",
  "noel", "quoc-khanh", "30-4",
];

export function getCountdownEvent(slug: string): CountdownEvent | null {
  const today = getVietnamTodayParts();

  const build = (name: string, longName: string, target: DateParts, lunarLabel: string, meaning: string): CountdownEvent => {
    const d = diffDays(today, target);
    return { slug, name, longName, target, lunarLabel, daysLeft: Math.abs(d), weeksLeft: Math.ceil(Math.abs(d) / 7), passed: d < 0, meaning };
  };

  const tetMatch = slug.match(/^tet-(\d{4})$/);
  if (tetMatch) {
    const y = Number(tetMatch[1]);
    const tet = getTetInfoForYear(y, today);
    return build(`Tết ${y}`, `Còn bao nhiêu ngày nữa đến Tết Nguyên Đán ${tet.canChi} ${y}`, tet.solarDate, "mùng 1 Tết (1/1 âm lịch)", `Tết Nguyên Đán ${tet.canChi} ${y} là ngày đầu năm mới âm lịch — dịp sum họp gia đình, thờ cúng tổ tiên và đón năm mới.`);
  }

  const ttMatch = slug.match(/^trung-thu-(\d{4})$/);
  if (ttMatch) {
    const y = Number(ttMatch[1]);
    const solar = convertLunar2Solar(15, 8, y) ?? { year: y, month: 9, day: 1 };
    return build(`Trung thu ${y}`, `Còn bao nhiêu ngày nữa đến Tết Trung Thu ${y}`, solar, "15/8 âm lịch", `Tết Trung Thu ${y} (Rằm tháng 8) là tết đoàn viên, phá cỗ trông trăng, rước đèn cho thiếu nhi.`);
  }

  if (slug === "noel") {
    const target = nextSolar(today, 12, 25);
    return build("Noel", "Còn bao nhiêu ngày nữa đến Noel (Giáng sinh)", target, "25/12 dương lịch", "Noel (Lễ Giáng sinh) 25/12 là dịp lễ quốc tế được nhiều bạn trẻ Việt Nam đón mừng.");
  }
  if (slug === "quoc-khanh") {
    const target = nextSolar(today, 9, 2);
    return build("Quốc khánh 2/9", "Còn bao nhiêu ngày nữa đến Quốc khánh 2/9", target, "2/9 dương lịch", "Quốc khánh nước CHXHCN Việt Nam 2/9 kỷ niệm ngày Bác Hồ đọc Tuyên ngôn Độc lập năm 1945.");
  }
  if (slug === "30-4") {
    const target = nextSolar(today, 4, 30);
    return build("Ngày 30/4", "Còn bao nhiêu ngày nữa đến ngày 30/4", target, "30/4 dương lịch", "Ngày Giải phóng miền Nam, thống nhất đất nước 30/4, thường nghỉ cùng ngày Quốc tế Lao động 1/5.");
  }

  return null;
}

// Tính lại "hôm nay" cho hiển thị.
export function countdownToday() {
  const today = getVietnamTodayParts();
  return { today, todayDisplay: formatDisplayDate(today), lunar: convertSolar2Lunar(today.day, today.month, today.year) };
}
