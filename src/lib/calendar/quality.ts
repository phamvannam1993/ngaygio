import type { ChiName, DayQuality } from "./types";

const HOANG_DAO_BY_LUNAR_MONTH: Record<number, readonly ChiName[]> = {
  1: ["Tý", "Sửu", "Thìn", "Tỵ", "Mùi", "Tuất"],
  2: ["Dần", "Mão", "Ngọ", "Mùi", "Dậu", "Tý"],
  3: ["Thìn", "Tỵ", "Thân", "Dậu", "Hợi", "Dần"],
  4: ["Ngọ", "Mùi", "Tuất", "Hợi", "Sửu", "Thìn"],
  5: ["Thân", "Dậu", "Tý", "Sửu", "Mão", "Ngọ"],
  6: ["Tuất", "Hợi", "Dần", "Mão", "Tỵ", "Thân"],
  7: ["Tý", "Sửu", "Thìn", "Tỵ", "Mùi", "Tuất"],
  8: ["Dần", "Mão", "Ngọ", "Mùi", "Dậu", "Tý"],
  9: ["Thìn", "Tỵ", "Thân", "Dậu", "Hợi", "Dần"],
  10: ["Ngọ", "Mùi", "Tuất", "Hợi", "Sửu", "Thìn"],
  11: ["Thân", "Dậu", "Tý", "Sửu", "Mão", "Ngọ"],
  12: ["Tuất", "Hợi", "Dần", "Mão", "Tỵ", "Thân"],
};

export function getDayQuality(lunarMonth: number, dayChi: ChiName): DayQuality {
  const isGood = HOANG_DAO_BY_LUNAR_MONTH[lunarMonth]?.includes(dayChi) ?? false;

  if (isGood) {
    return {
      type: "good",
      label: "Ngày Hoàng Đạo",
      shortLabel: "Tốt",
      note: "Ngày có cát thần theo bảng hoàng đạo truyền thống, phù hợp để tham khảo khi sắp xếp việc quan trọng.",
    };
  }

  return {
    type: "bad",
    label: "Ngày Hắc Đạo",
    shortLabel: "Xấu",
    note: "Ngày thuộc nhóm hắc đạo theo bảng truyền thống; thông tin chỉ nên dùng để tham khảo, không thay thế tư vấn chuyên môn.",
  };
}
