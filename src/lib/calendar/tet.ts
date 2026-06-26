import { convertLunar2Solar } from "./lunar";
import type { DateParts } from "@/lib/date";

export type TetInfo = {
  year: number;
  solarDate: DateParts;
  daysLeft: number;
  canChi: string;
};

const CAN = ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"];
const CHI = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"];

function yearCanChi(year: number): string {
  return `${CAN[(year + 6) % 10]} ${CHI[(year + 8) % 12]}`;
}

function diffDays(a: DateParts, b: DateParts): number {
  const da = new Date(a.year, a.month - 1, a.day);
  const db = new Date(b.year, b.month - 1, b.day);
  return Math.round((db.getTime() - da.getTime()) / 86400000);
}

export function getTetInfo(today: DateParts): TetInfo {
  // Mùng 1 Tết âm lịch = 1/1 âm năm lunar year
  // Nếu Tết năm nay đã qua, lấy năm sau
  for (let offset = 0; offset <= 1; offset++) {
    const lunarYear = today.year + offset;
    const tet = convertLunar2Solar(1, 1, lunarYear, false);
    if (!tet) continue;
    const days = diffDays(today, tet);
    if (days >= 0) {
      return { year: lunarYear, solarDate: tet, daysLeft: days, canChi: yearCanChi(lunarYear) };
    }
  }
  // fallback: Tết năm sau
  const lunarYear = today.year + 1;
  const tet = convertLunar2Solar(1, 1, lunarYear, false)!;
  return { year: lunarYear, solarDate: tet, daysLeft: diffDays(today, tet), canChi: yearCanChi(lunarYear) };
}

export function getTetInfoForYear(lunarYear: number, today: DateParts): TetInfo & { passed: boolean } {
  const tet = convertLunar2Solar(1, 1, lunarYear, false);
  if (!tet) {
    return { year: lunarYear, solarDate: { year: lunarYear, month: 1, day: 1 }, daysLeft: 0, canChi: yearCanChi(lunarYear), passed: false };
  }
  const days = diffDays(today, tet);
  return { year: lunarYear, solarDate: tet, daysLeft: Math.abs(days), canChi: yearCanChi(lunarYear), passed: days < 0 };
}
