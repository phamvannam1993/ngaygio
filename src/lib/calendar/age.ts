import { CHI, getYearCanChi } from "./can-chi";
import { getAgeCompatibility } from "./good-bad";
import type { ChiName } from "./types";
import { ZODIAC_BY_CHI } from "./zodiac";

export type FiveElement = "Kim" | "Mộc" | "Thủy" | "Hỏa" | "Thổ";

export type AgeResult = {
  birthYear: number;
  viewYear: number;
  solarAge: number;
  lunarAge: number;
  birthCanChi: string;
  viewCanChi: string;
  birthCan: string;
  birthChi: ChiName;
  viewChi: ChiName;
  animal: string;
  animalEmoji: string;
  animalDescription: string;
  napAm: string;
  element: FiveElement;
  elementMeaning: string;
  relationWithViewYear: string;
  compatibleBranches: string[];
  conflictBranches: string[];
  summary: string;
};

const NAP_AM_BY_PAIR: Record<string, { name: string; element: FiveElement }> = {
  "Giáp Tý": { name: "Hải Trung Kim", element: "Kim" },
  "Ất Sửu": { name: "Hải Trung Kim", element: "Kim" },
  "Bính Dần": { name: "Lư Trung Hỏa", element: "Hỏa" },
  "Đinh Mão": { name: "Lư Trung Hỏa", element: "Hỏa" },
  "Mậu Thìn": { name: "Đại Lâm Mộc", element: "Mộc" },
  "Kỷ Tỵ": { name: "Đại Lâm Mộc", element: "Mộc" },
  "Canh Ngọ": { name: "Lộ Bàng Thổ", element: "Thổ" },
  "Tân Mùi": { name: "Lộ Bàng Thổ", element: "Thổ" },
  "Nhâm Thân": { name: "Kiếm Phong Kim", element: "Kim" },
  "Quý Dậu": { name: "Kiếm Phong Kim", element: "Kim" },
  "Giáp Tuất": { name: "Sơn Đầu Hỏa", element: "Hỏa" },
  "Ất Hợi": { name: "Sơn Đầu Hỏa", element: "Hỏa" },
  "Bính Tý": { name: "Giản Hạ Thủy", element: "Thủy" },
  "Đinh Sửu": { name: "Giản Hạ Thủy", element: "Thủy" },
  "Mậu Dần": { name: "Thành Đầu Thổ", element: "Thổ" },
  "Kỷ Mão": { name: "Thành Đầu Thổ", element: "Thổ" },
  "Canh Thìn": { name: "Bạch Lạp Kim", element: "Kim" },
  "Tân Tỵ": { name: "Bạch Lạp Kim", element: "Kim" },
  "Nhâm Ngọ": { name: "Dương Liễu Mộc", element: "Mộc" },
  "Quý Mùi": { name: "Dương Liễu Mộc", element: "Mộc" },
  "Giáp Thân": { name: "Tuyền Trung Thủy", element: "Thủy" },
  "Ất Dậu": { name: "Tuyền Trung Thủy", element: "Thủy" },
  "Bính Tuất": { name: "Ốc Thượng Thổ", element: "Thổ" },
  "Đinh Hợi": { name: "Ốc Thượng Thổ", element: "Thổ" },
  "Mậu Tý": { name: "Tích Lịch Hỏa", element: "Hỏa" },
  "Kỷ Sửu": { name: "Tích Lịch Hỏa", element: "Hỏa" },
  "Canh Dần": { name: "Tùng Bách Mộc", element: "Mộc" },
  "Tân Mão": { name: "Tùng Bách Mộc", element: "Mộc" },
  "Nhâm Thìn": { name: "Trường Lưu Thủy", element: "Thủy" },
  "Quý Tỵ": { name: "Trường Lưu Thủy", element: "Thủy" },
  "Giáp Ngọ": { name: "Sa Trung Kim", element: "Kim" },
  "Ất Mùi": { name: "Sa Trung Kim", element: "Kim" },
  "Bính Thân": { name: "Sơn Hạ Hỏa", element: "Hỏa" },
  "Đinh Dậu": { name: "Sơn Hạ Hỏa", element: "Hỏa" },
  "Mậu Tuất": { name: "Bình Địa Mộc", element: "Mộc" },
  "Kỷ Hợi": { name: "Bình Địa Mộc", element: "Mộc" },
  "Canh Tý": { name: "Bích Thượng Thổ", element: "Thổ" },
  "Tân Sửu": { name: "Bích Thượng Thổ", element: "Thổ" },
  "Nhâm Dần": { name: "Kim Bạch Kim", element: "Kim" },
  "Quý Mão": { name: "Kim Bạch Kim", element: "Kim" },
  "Giáp Thìn": { name: "Phú Đăng Hỏa", element: "Hỏa" },
  "Ất Tỵ": { name: "Phú Đăng Hỏa", element: "Hỏa" },
  "Bính Ngọ": { name: "Thiên Hà Thủy", element: "Thủy" },
  "Đinh Mùi": { name: "Thiên Hà Thủy", element: "Thủy" },
  "Mậu Thân": { name: "Đại Dịch Thổ", element: "Thổ" },
  "Kỷ Dậu": { name: "Đại Dịch Thổ", element: "Thổ" },
  "Canh Tuất": { name: "Thoa Xuyến Kim", element: "Kim" },
  "Tân Hợi": { name: "Thoa Xuyến Kim", element: "Kim" },
  "Nhâm Tý": { name: "Tang Đố Mộc", element: "Mộc" },
  "Quý Sửu": { name: "Tang Đố Mộc", element: "Mộc" },
  "Giáp Dần": { name: "Đại Khê Thủy", element: "Thủy" },
  "Ất Mão": { name: "Đại Khê Thủy", element: "Thủy" },
  "Bính Thìn": { name: "Sa Trung Thổ", element: "Thổ" },
  "Đinh Tỵ": { name: "Sa Trung Thổ", element: "Thổ" },
  "Mậu Ngọ": { name: "Thiên Thượng Hỏa", element: "Hỏa" },
  "Kỷ Mùi": { name: "Thiên Thượng Hỏa", element: "Hỏa" },
  "Canh Thân": { name: "Thạch Lựu Mộc", element: "Mộc" },
  "Tân Dậu": { name: "Thạch Lựu Mộc", element: "Mộc" },
  "Nhâm Tuất": { name: "Đại Hải Thủy", element: "Thủy" },
  "Quý Hợi": { name: "Đại Hải Thủy", element: "Thủy" },
};

const ELEMENT_MEANING: Record<FiveElement, string> = {
  Kim: "Mệnh Kim gợi sự nguyên tắc, rõ ràng, bền bỉ và có khả năng tập trung tốt.",
  Mộc: "Mệnh Mộc gợi sự phát triển, linh hoạt, nhân hòa và thích nghi với môi trường mới.",
  Thủy: "Mệnh Thủy gợi sự mềm mại, giao tiếp, trí tuệ và khả năng kết nối.",
  Hỏa: "Mệnh Hỏa gợi sự nhiệt huyết, chủ động, nhanh nhạy và giàu năng lượng.",
  Thổ: "Mệnh Thổ gợi sự ổn định, chắc chắn, thực tế và biết nâng đỡ người khác.",
};

function relationByBranch(birthChi: ChiName, viewChi: ChiName): string {
  const relation = getAgeCompatibility(birthChi);
  if (relation.lucHop === viewChi) return "Lục hợp";
  if (relation.tamHop.includes(viewChi)) return `Tam hợp ${relation.tamHopElement}`;
  if (relation.xung.includes(viewChi)) return "Tứ hành xung";
  if (relation.hai === viewChi) return "Lục hại";
  return "Bình hòa";
}

export function isValidBirthYear(year: number): boolean {
  return Number.isInteger(year) && year >= 1900 && year <= 2050;
}

export function getAgeResult(birthYear: number, viewYear: number): AgeResult {
  const birth = getYearCanChi(birthYear);
  const view = getYearCanChi(viewYear);
  const zodiac = ZODIAC_BY_CHI[birth.chi];
  const napAm = NAP_AM_BY_PAIR[birth.text] ?? { name: "Chưa rõ", element: "Thổ" as FiveElement };
  const compatibility = getAgeCompatibility(birth.chi);
  const solarAge = Math.max(0, viewYear - birthYear);
  const lunarAge = Math.max(1, solarAge + 1);
  const relation = relationByBranch(birth.chi, view.chi);

  return {
    birthYear,
    viewYear,
    solarAge,
    lunarAge,
    birthCanChi: birth.text,
    viewCanChi: view.text,
    birthCan: birth.can,
    birthChi: birth.chi,
    viewChi: view.chi,
    animal: zodiac.animal,
    animalEmoji: zodiac.emoji,
    animalDescription: zodiac.description,
    napAm: napAm.name,
    element: napAm.element,
    elementMeaning: ELEMENT_MEANING[napAm.element],
    relationWithViewYear: relation,
    compatibleBranches: [...new Set([compatibility.lucHop, ...compatibility.tamHop])],
    conflictBranches: [...new Set([...compatibility.xung, compatibility.hai])],
    summary: `Người sinh năm ${birthYear} là tuổi ${birth.text}, cầm tinh con ${zodiac.animal}, nạp âm ${napAm.name}. Tính đến năm ${viewYear}, tuổi dương là ${solarAge}, tuổi âm/tuổi mụ tham khảo là ${lunarAge}.`,
  };
}

export function yearOptions(start = 1900, end = 2050): number[] {
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

export { CHI };
