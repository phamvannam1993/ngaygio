import type { ChiName, HourInfo } from "./types";

export const CAN = ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"] as const;
export const CHI = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"] as const;

export type CanName = (typeof CAN)[number];

export function canChiText(canIndex: number, chiIndex: number): string {
  return `${CAN[positiveModulo(canIndex, 10)]} ${CHI[positiveModulo(chiIndex, 12)]}`;
}

export function positiveModulo(value: number, modulo: number): number {
  return ((value % modulo) + modulo) % modulo;
}

export function getYearCanChi(lunarYear: number) {
  const canIndex = positiveModulo(lunarYear + 6, 10);
  const chiIndex = positiveModulo(lunarYear + 8, 12);
  return {
    can: CAN[canIndex],
    chi: CHI[chiIndex],
    text: canChiText(canIndex, chiIndex),
  };
}

export function getMonthCanChi(lunarYear: number, lunarMonth: number) {
  const canIndex = positiveModulo(lunarYear * 12 + lunarMonth + 3, 10);
  const chiIndex = positiveModulo(lunarMonth + 1, 12);
  return {
    can: CAN[canIndex],
    chi: CHI[chiIndex],
    text: canChiText(canIndex, chiIndex),
  };
}

export function getDayCanChi(jd: number) {
  const canIndex = positiveModulo(jd + 9, 10);
  const chiIndex = positiveModulo(jd + 1, 12);
  return {
    can: CAN[canIndex],
    chi: CHI[chiIndex],
    text: canChiText(canIndex, chiIndex),
  };
}

// Giờ Tý bắt đầu từ 23h, nên chi của giờ lệch nửa canh so với đồng hồ.
export function getHourChiIndex(hour: number): number {
  return Math.floor((positiveModulo(hour, 24) + 1) % 24 / 2);
}

// Ngũ thử độn nhật: can giờ Tý = (can ngày mod 5) * 2, các giờ sau tăng dần theo chi.
export function getHourCanChi(dayCan: CanName, hour: number) {
  const chiIndex = getHourChiIndex(hour);
  const canIndex = positiveModulo(positiveModulo(CAN.indexOf(dayCan), 5) * 2 + chiIndex, 10);
  return {
    can: CAN[canIndex],
    chi: CHI[chiIndex],
    text: canChiText(canIndex, chiIndex),
  };
}

const HOUR_RANGES: Array<{ branch: ChiName; range: string }> = [
  { branch: "Tý", range: "23-1" },
  { branch: "Sửu", range: "1-3" },
  { branch: "Dần", range: "3-5" },
  { branch: "Mão", range: "5-7" },
  { branch: "Thìn", range: "7-9" },
  { branch: "Tỵ", range: "9-11" },
  { branch: "Ngọ", range: "11-13" },
  { branch: "Mùi", range: "13-15" },
  { branch: "Thân", range: "15-17" },
  { branch: "Dậu", range: "17-19" },
  { branch: "Tuất", range: "19-21" },
  { branch: "Hợi", range: "21-23" },
];

const GOOD_HOURS_BY_DAY_CHI: Record<ChiName, readonly ChiName[]> = {
  Tý: ["Tý", "Sửu", "Mão", "Ngọ", "Thân", "Dậu"],
  Sửu: ["Dần", "Mão", "Tỵ", "Thân", "Tuất", "Hợi"],
  Dần: ["Tý", "Sửu", "Thìn", "Tỵ", "Mùi", "Tuất"],
  Mão: ["Tý", "Dần", "Mão", "Ngọ", "Mùi", "Dậu"],
  Thìn: ["Dần", "Thìn", "Tỵ", "Thân", "Dậu", "Hợi"],
  Tỵ: ["Sửu", "Thìn", "Ngọ", "Mùi", "Tuất", "Hợi"],
  Ngọ: ["Tý", "Sửu", "Mão", "Ngọ", "Thân", "Dậu"],
  Mùi: ["Dần", "Mão", "Tỵ", "Thân", "Tuất", "Hợi"],
  Thân: ["Tý", "Sửu", "Thìn", "Tỵ", "Mùi", "Tuất"],
  Dậu: ["Tý", "Dần", "Mão", "Ngọ", "Mùi", "Dậu"],
  Tuất: ["Dần", "Thìn", "Tỵ", "Thân", "Dậu", "Hợi"],
  Hợi: ["Sửu", "Thìn", "Ngọ", "Mùi", "Tuất", "Hợi"],
};

export function getHoursByDayChi(dayChi: ChiName): { goodHours: HourInfo[]; badHours: HourInfo[] } {
  const goodBranchSet = new Set(GOOD_HOURS_BY_DAY_CHI[dayChi]);
  const hours = HOUR_RANGES.map((hour) => ({ ...hour, isGood: goodBranchSet.has(hour.branch) }));

  return {
    goodHours: hours.filter((hour) => hour.isGood),
    badHours: hours.filter((hour) => !hour.isGood),
  };
}

// "23-1" -> "23-01h"
export function formatHourRange(range: string): string {
  return `${range.split("-").map((part) => part.trim().padStart(2, "0")).join("-")}h`;
}

export function formatHours(hours: HourInfo[]): string {
  return hours.map((hour) => `${hour.branch} (${hour.range.replace(":00", "")})`).join(", ");
}
