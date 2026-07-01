import { formatDisplayDate, isValidDateParts, type DateParts } from "@/lib/date";
import { CAN, CHI, canChiText, getDayCanChi, getMonthCanChi, getYearCanChi, positiveModulo, type CanName } from "./can-chi";
import { getAgeResult, getNapAmByCanChi, type FiveElement } from "./age";
import { convertLunar2Solar, convertSolar2Lunar, jdFromDate } from "./lunar";
import type { ChiName, LunarDate } from "./types";

export type TuViGender = "nam" | "nu";
export type TuViCalendarType = "solar" | "lunar";
export type StarTone = "major" | "good" | "bad" | "neutral" | "support" | "wealth";

export type TuViInput = {
  fullName: string;
  gender: TuViGender;
  calendarType: TuViCalendarType;
  birthDate: DateParts;
  birthTime: string;
  isLeapMonth?: boolean;
  viewYear: number;
};

export type TuViStar = {
  name: string;
  tone: StarTone;
  note?: string;
};

export type TuViPalaceKey =
  | "menh"
  | "phu-mau"
  | "phuc-duc"
  | "dien-trach"
  | "quan-loc"
  | "no-boc"
  | "thien-di"
  | "tat-ach"
  | "tai-bach"
  | "tu-tuc"
  | "phu-the"
  | "huynh-de";

export type TuViPalace = {
  key: TuViPalaceKey;
  name: string;
  shortName: string;
  branch: ChiName;
  branchIndex: number;
  can: CanName;
  canChi: string;
  element: FiveElement;
  decadeAge: number;
  lifeStage: string;
  isBodyPalace: boolean;
  mainStars: TuViStar[];
  supportStars: TuViStar[];
  warningStars: TuViStar[];
  otherStars: TuViStar[];
};

export type TuViChart = {
  input: TuViInput;
  solarDate: DateParts;
  lunarDate: LunarDate;
  canChi: {
    year: string;
    month: string;
    day: string;
    hour: string;
    yearCan: CanName;
    yearChi: ChiName;
    hourChi: ChiName;
  };
  genderLabel: string;
  yinYangLabel: string;
  age: number;
  napAm: string;
  element: FiveElement;
  cuc: {
    name: string;
    number: number;
    element: FiveElement;
    napAm: string;
  };
  menhBranch: ChiName;
  thanBranch: ChiName;
  thanResidence: string;
  bodyMaster: string;
  lifeMaster: string;
  laiNhanCung: string;
  canLuong: string;
  palaces: TuViPalace[];
  summary: string;
  reading: Array<{ title: string; text: string }>;
};

// Từ cung Mệnh, 11 cung còn lại được an theo chiều nghịch:
// Huynh Đệ → Phu Thê → Tử Tức → Tài Bạch → Tật Ách → Thiên Di → Nô Bộc
// → Quan Lộc → Điền Trạch → Phúc Đức → Phụ Mẫu.
const PALACE_SEQUENCE: Array<{ key: TuViPalaceKey; name: string; shortName: string }> = [
  { key: "menh", name: "MỆNH", shortName: "Mệnh" },
  { key: "huynh-de", name: "HUYNH ĐỆ", shortName: "Huynh" },
  { key: "phu-the", name: "PHU THÊ", shortName: "Phối" },
  { key: "tu-tuc", name: "TỬ TỨC", shortName: "Tử" },
  { key: "tai-bach", name: "TÀI BẠCH", shortName: "Tài" },
  { key: "tat-ach", name: "TẬT ÁCH", shortName: "Tật" },
  { key: "thien-di", name: "THIÊN DI", shortName: "Di" },
  { key: "no-boc", name: "NÔ BỘC", shortName: "Nô" },
  { key: "quan-loc", name: "QUAN LỘC", shortName: "Quan" },
  { key: "dien-trach", name: "ĐIỀN TRẠCH", shortName: "Điền" },
  { key: "phuc-duc", name: "PHÚC ĐỨC", shortName: "Phúc" },
  { key: "phu-mau", name: "PHỤ MẪU", shortName: "Phụ" },
];

const ELEMENT_BY_BRANCH: Record<ChiName, FiveElement> = {
  Tý: "Thủy",
  Sửu: "Thổ",
  Dần: "Mộc",
  Mão: "Mộc",
  Thìn: "Thổ",
  Tỵ: "Hỏa",
  Ngọ: "Hỏa",
  Mùi: "Thổ",
  Thân: "Kim",
  Dậu: "Kim",
  Tuất: "Thổ",
  Hợi: "Thủy",
};

const CUC_BY_ELEMENT: Record<FiveElement, { name: string; number: number; element: FiveElement }> = {
  Thủy: { name: "Thủy Nhị Cục", number: 2, element: "Thủy" },
  Mộc: { name: "Mộc Tam Cục", number: 3, element: "Mộc" },
  Kim: { name: "Kim Tứ Cục", number: 4, element: "Kim" },
  Thổ: { name: "Thổ Ngũ Cục", number: 5, element: "Thổ" },
  Hỏa: { name: "Hỏa Lục Cục", number: 6, element: "Hỏa" },
};

const LIFE_STAGE = ["Tràng Sinh", "Mộc Dục", "Quan Đới", "Lâm Quan", "Đế Vượng", "Suy", "Bệnh", "Tử", "Mộ", "Tuyệt", "Thai", "Dưỡng"];
const LIFE_STAGE_START: Record<FiveElement, ChiName> = {
  Kim: "Tỵ",
  Mộc: "Hợi",
  Thủy: "Thân",
  Hỏa: "Dần",
  Thổ: "Thân",
};

const MAIN_STAR_TONES = new Set([
  "Tử Vi",
  "Thiên Cơ",
  "Thái Dương",
  "Vũ Khúc",
  "Thiên Đồng",
  "Liêm Trinh",
  "Thiên Phủ",
  "Thái Âm",
  "Tham Lang",
  "Cự Môn",
  "Thiên Tướng",
  "Thiên Lương",
  "Thất Sát",
  "Phá Quân",
]);

const GOOD_STARS = new Set([
  "Tả Phù",
  "Hữu Bật",
  "Văn Xương",
  "Văn Khúc",
  "Thiên Khôi",
  "Thiên Việt",
  "Lộc Tồn",
  "Hóa Lộc",
  "Hóa Quyền",
  "Hóa Khoa",
  "Long Đức",
  "Phúc Đức",
  "Thiên Đức",
  "Nguyệt Đức",
  "Đào Hoa",
  "Hồng Loan",
  "Thiên Hỷ",
  "Thiên Mã",
  "Bác Sĩ",
  "Lực Sĩ",
  "Thanh Long",
  "Tướng Quân",
  "Tấu Thư",
  "Hỷ Thần",
  "Quốc Ấn",
  "Đường Phù",
  "Thiên Quan",
  "Thiên Phúc",
  "Ân Quang",
  "Thiên Quý",
  "Thai Phụ",
  "Phong Cáo",
  "Tam Thai",
  "Bát Tọa",
]);

const BAD_STARS = new Set([
  "Hóa Kỵ",
  "Kình Dương",
  "Đà La",
  "Địa Không",
  "Địa Kiếp",
  "Thiên Hình",
  "Thiên Diêu",
  "Bạch Hổ",
  "Tang Môn",
  "Tuế Phá",
  "Điếu Khách",
  "Quan Phù",
  "Quan Phủ",
  "Tiểu Hao",
  "Đại Hao",
  "Bệnh Phù",
  "Phục Binh",
  "Hỏa Tinh",
  "Linh Tinh",
  "Tuần",
  "Triệt",
]);

const LIFE_MASTER_BY_YEAR_CHI: Record<ChiName, string> = {
  Tý: "Tham Lang",
  Sửu: "Cự Môn",
  Dần: "Lộc Tồn",
  Mão: "Văn Khúc",
  Thìn: "Liêm Trinh",
  Tỵ: "Vũ Khúc",
  Ngọ: "Phá Quân",
  Mùi: "Vũ Khúc",
  Thân: "Liêm Trinh",
  Dậu: "Văn Khúc",
  Tuất: "Lộc Tồn",
  Hợi: "Cự Môn",
};

const BODY_MASTER_BY_YEAR_CHI: Record<ChiName, string> = {
  Tý: "Linh Tinh",
  Sửu: "Thiên Tướng",
  Dần: "Thiên Lương",
  Mão: "Thiên Đồng",
  Thìn: "Văn Xương",
  Tỵ: "Thiên Cơ",
  Ngọ: "Hỏa Tinh",
  Mùi: "Thiên Tướng",
  Thân: "Thiên Lương",
  Dậu: "Thiên Đồng",
  Tuất: "Văn Xương",
  Hợi: "Thiên Cơ",
};

const LOC_TON_BY_CAN: Record<CanName, ChiName> = {
  Giáp: "Dần",
  Ất: "Mão",
  Bính: "Tỵ",
  Đinh: "Ngọ",
  Mậu: "Tỵ",
  Kỷ: "Ngọ",
  Canh: "Thân",
  Tân: "Dậu",
  Nhâm: "Hợi",
  Quý: "Tý",
};

const KHOI_VIET_BY_CAN: Record<CanName, [ChiName, ChiName]> = {
  Giáp: ["Sửu", "Mùi"],
  Ất: ["Tý", "Thân"],
  Bính: ["Hợi", "Dậu"],
  Đinh: ["Hợi", "Dậu"],
  Mậu: ["Sửu", "Mùi"],
  Kỷ: ["Tý", "Thân"],
  Canh: ["Sửu", "Mùi"],
  Tân: ["Ngọ", "Dần"],
  Nhâm: ["Mão", "Tỵ"],
  Quý: ["Mão", "Tỵ"],
};

const HOA_KHI_BY_CAN: Record<CanName, { loc: string; quyen: string; khoa: string; ky: string }> = {
  Giáp: { loc: "Liêm Trinh", quyen: "Phá Quân", khoa: "Vũ Khúc", ky: "Thái Dương" },
  Ất: { loc: "Thiên Cơ", quyen: "Thiên Lương", khoa: "Tử Vi", ky: "Thái Âm" },
  Bính: { loc: "Thiên Đồng", quyen: "Thiên Cơ", khoa: "Văn Xương", ky: "Liêm Trinh" },
  Đinh: { loc: "Thái Âm", quyen: "Thiên Đồng", khoa: "Thiên Cơ", ky: "Cự Môn" },
  Mậu: { loc: "Tham Lang", quyen: "Thái Âm", khoa: "Hữu Bật", ky: "Thiên Cơ" },
  Kỷ: { loc: "Vũ Khúc", quyen: "Tham Lang", khoa: "Thiên Lương", ky: "Văn Khúc" },
  Canh: { loc: "Thái Dương", quyen: "Vũ Khúc", khoa: "Thái Âm", ky: "Thiên Đồng" },
  Tân: { loc: "Cự Môn", quyen: "Thái Dương", khoa: "Văn Khúc", ky: "Văn Xương" },
  Nhâm: { loc: "Thiên Lương", quyen: "Tử Vi", khoa: "Thiên Phủ", ky: "Vũ Khúc" },
  Quý: { loc: "Phá Quân", quyen: "Cự Môn", khoa: "Thái Âm", ky: "Tham Lang" },
};

const THAI_TUE_RING = ["Thái Tuế", "Thiếu Dương", "Tang Môn", "Thiếu Âm", "Quan Phù", "Tử Phù", "Tuế Phá", "Long Đức", "Bạch Hổ", "Phúc Đức", "Điếu Khách", "Trực Phù"];

function chiIndex(branch: ChiName): number {
  return CHI.indexOf(branch);
}

function canIndex(can: CanName): number {
  return CAN.indexOf(can);
}

function branchFromIndex(index: number): ChiName {
  return CHI[positiveModulo(index, 12)];
}

function addBranch(branch: ChiName, offset: number): ChiName {
  return branchFromIndex(chiIndex(branch) + offset);
}

function monthNumberFromBranch(branch: ChiName): number {
  return positiveModulo(chiIndex(branch) - chiIndex("Dần"), 12) + 1;
}

function formatTime(value: string): string {
  const [h = "0", m = "0"] = value.split(":");
  return `${Number(h)} giờ ${String(Number(m)).padStart(2, "0")} phút`;
}

function parseTimeToMinutes(value: string): number {
  const match = value.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return 0;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (!Number.isInteger(hour) || !Number.isInteger(minute) || hour < 0 || hour > 23 || minute < 0 || minute > 59) return 0;
  return hour * 60 + minute;
}

export function getHourBranch(time: string): ChiName {
  const minutes = parseTimeToMinutes(time);
  if (minutes >= 23 * 60 || minutes < 60) return "Tý";
  return branchFromIndex(Math.floor((minutes + 60) / 120));
}

function getHourCanChi(dayCan: CanName, hourChi: ChiName): string {
  const hIndex = chiIndex(hourChi);
  const dCanIndex = canIndex(dayCan);
  return canChiText(dCanIndex * 2 + hIndex, hIndex);
}

function getMenhThan(lunarMonth: number, hourChi: ChiName): { menhIndex: number; thanIndex: number } {
  const danIndex = chiIndex("Dần");
  const monthBase = danIndex + lunarMonth - 1;
  const hourIndex = chiIndex(hourChi);
  return {
    menhIndex: positiveModulo(monthBase - hourIndex, 12),
    thanIndex: positiveModulo(monthBase + hourIndex, 12),
  };
}

type CucInfo = { name: string; number: number; element: FiveElement; napAm: string };

function getCuc(lunarYear: number, menhBranch: ChiName): CucInfo {
  const can = palaceCan(lunarYear, menhBranch);
  const napAm = getNapAmByCanChi(can, menhBranch);
  const cuc = CUC_BY_ELEMENT[napAm.element];
  return { ...cuc, napAm: napAm.name };
}

function isYangCan(can: CanName): boolean {
  return ["Giáp", "Bính", "Mậu", "Canh", "Nhâm"].includes(can);
}

function isForwardDecade(gender: TuViGender, yearCan: CanName): boolean {
  const yang = isYangCan(yearCan);
  return (yang && gender === "nam") || (!yang && gender === "nu");
}

function getLifeStage(branch: ChiName, element: FiveElement, forward: boolean): string {
  const start = LIFE_STAGE_START[element];
  const distance = forward ? positiveModulo(chiIndex(branch) - chiIndex(start), 12) : positiveModulo(chiIndex(start) - chiIndex(branch), 12);
  return LIFE_STAGE[distance];
}

function palaceCan(lunarYear: number, branch: ChiName): CanName {
  return getMonthCanChi(lunarYear, monthNumberFromBranch(branch)).can;
}

function starTone(name: string): StarTone {
  if (MAIN_STAR_TONES.has(name)) return "major";
  if (name.startsWith("Hóa Lộc")) return "wealth";
  if (name.startsWith("Hóa Quyền") || name.startsWith("Hóa Khoa")) return "good";
  if (name.startsWith("Hóa Kỵ")) return "bad";
  if (GOOD_STARS.has(name)) return name === "Lộc Tồn" ? "wealth" : "good";
  if (BAD_STARS.has(name)) return "bad";
  return "neutral";
}

function createStar(name: string, note?: string): TuViStar {
  return { name, tone: starTone(name), note };
}

function addStar(map: Map<ChiName, TuViStar[]>, branch: ChiName, name: string, note?: string) {
  const list = map.get(branch) ?? [];
  if (!list.some((item) => item.name === name && item.note === note)) list.push(createStar(name, note));
  map.set(branch, list);
}

function findStarBranch(map: Map<ChiName, TuViStar[]>, name: string): ChiName | null {
  for (const [branch, stars] of map.entries()) {
    if (stars.some((star) => star.name === name)) return branch;
  }
  return null;
}

function getTuViAnchor(cucNumber: number, lunarDay: number): ChiName {
  // An Tử Vi theo ngày sinh âm lịch và số Cục:
  // tìm a sao cho (ngày sinh + a) chia hết cho Cục; từ Dần đếm thuận đến b,
  // nếu a lẻ thì lùi a cung, nếu a chẵn thì tiến a cung, a = 0 giữ nguyên.
  let borrow = 0;
  while ((lunarDay + borrow) % cucNumber !== 0 && borrow <= 6) borrow += 1;
  const quotient = Math.floor((lunarDay + borrow) / cucNumber);
  const base = branchFromIndex(chiIndex("Dần") + quotient - 1);
  if (borrow === 0) return base;
  return addBranch(base, borrow % 2 === 1 ? -borrow : borrow);
}

function getPeachBlossomBranch(yearChi: ChiName): ChiName {
  if (["Thân", "Tý", "Thìn"].includes(yearChi)) return "Dậu";
  if (["Dần", "Ngọ", "Tuất"].includes(yearChi)) return "Mão";
  if (["Hợi", "Mão", "Mùi"].includes(yearChi)) return "Tý";
  return "Ngọ";
}

function getTravelHorseBranch(yearChi: ChiName): ChiName {
  if (["Thân", "Tý", "Thìn"].includes(yearChi)) return "Dần";
  if (["Dần", "Ngọ", "Tuất"].includes(yearChi)) return "Thân";
  if (["Hợi", "Mão", "Mùi"].includes(yearChi)) return "Tỵ";
  return "Hợi";
}

const BAC_SI_RING = ["Bác Sĩ", "Lực Sĩ", "Thanh Long", "Tiểu Hao", "Tướng Quân", "Tấu Thư", "Phi Liêm", "Hỷ Thần", "Bệnh Phù", "Đại Hao", "Phục Binh", "Quan Phủ"];

const TRIET_BY_CAN_GROUP: Record<string, [ChiName, ChiName]> = {
  "Giáp-Kỷ": ["Thân", "Dậu"],
  "Ất-Canh": ["Ngọ", "Mùi"],
  "Bính-Tân": ["Thìn", "Tỵ"],
  "Đinh-Nhâm": ["Dần", "Mão"],
  "Mậu-Quý": ["Tý", "Sửu"],
};

function canChiCycleIndex(can: CanName, chi: ChiName): number {
  for (let index = 0; index < 60; index += 1) {
    if (CAN[index % 10] === can && CHI[index % 12] === chi) return index;
  }
  return 0;
}

function getTuanBranches(yearCan: CanName, yearChi: ChiName): [ChiName, ChiName] {
  const cycleIndex = canChiCycleIndex(yearCan, yearChi);
  const groupStartIndex = cycleIndex - canIndex(yearCan);
  const groupStartChi = CHI[positiveModulo(groupStartIndex, 12)];
  return [addBranch(groupStartChi, -2), addBranch(groupStartChi, -1)];
}

function getTrietBranches(yearCan: CanName): [ChiName, ChiName] {
  if (yearCan === "Giáp" || yearCan === "Kỷ") return TRIET_BY_CAN_GROUP["Giáp-Kỷ"];
  if (yearCan === "Ất" || yearCan === "Canh") return TRIET_BY_CAN_GROUP["Ất-Canh"];
  if (yearCan === "Bính" || yearCan === "Tân") return TRIET_BY_CAN_GROUP["Bính-Tân"];
  if (yearCan === "Đinh" || yearCan === "Nhâm") return TRIET_BY_CAN_GROUP["Đinh-Nhâm"];
  return TRIET_BY_CAN_GROUP["Mậu-Quý"];
}

function placeRing(map: Map<ChiName, TuViStar[]>, start: ChiName, names: string[], forward: boolean, note?: string) {
  names.forEach((name, index) => addStar(map, addBranch(start, forward ? index : -index), name, note));
}

function getHoaLinhStart(yearChi: ChiName): { hoa: ChiName; linh: ChiName } {
  if (["Dần", "Ngọ", "Tuất"].includes(yearChi)) return { hoa: "Sửu", linh: "Mão" };
  if (["Hợi", "Mão", "Mùi"].includes(yearChi)) return { hoa: "Dậu", linh: "Tuất" };
  if (["Thân", "Tý", "Thìn"].includes(yearChi)) return { hoa: "Dần", linh: "Tuất" };
  return { hoa: "Mão", linh: "Tuất" };
}

function placeHoaLinh(map: Map<ChiName, TuViStar[]>, yearChi: ChiName, hourChi: ChiName, forward: boolean) {
  const { hoa, linh } = getHoaLinhStart(yearChi);
  const hourOffset = chiIndex(hourChi);
  addStar(map, addBranch(hoa, forward ? hourOffset : -hourOffset), "Hỏa Tinh");
  addStar(map, addBranch(linh, forward ? -hourOffset : hourOffset), "Linh Tinh");
}

function placeStars(input: {
  lunarDay: number;
  lunarMonth: number;
  hourChi: ChiName;
  yearCan: CanName;
  yearChi: ChiName;
  cucNumber: number;
  forward: boolean;
}): Map<ChiName, TuViStar[]> {
  const starMap = new Map<ChiName, TuViStar[]>();
  const tuVi = getTuViAnchor(input.cucNumber, input.lunarDay);
  const tuViIndex = chiIndex(tuVi);

  const tuViGroup: Array<[string, number]> = [
    ["Tử Vi", 0],
    ["Thiên Cơ", -1],
    ["Thái Dương", -3],
    ["Vũ Khúc", -4],
    ["Thiên Đồng", -5],
    ["Liêm Trinh", -8],
  ];
  tuViGroup.forEach(([name, offset]) => addStar(starMap, branchFromIndex(tuViIndex + offset), name, "Chính tinh"));

  const phuAnchor = branchFromIndex(16 - tuViIndex);
  const phuIndex = chiIndex(phuAnchor);
  const phuGroup: Array<[string, number]> = [
    ["Thiên Phủ", 0],
    ["Thái Âm", 1],
    ["Tham Lang", 2],
    ["Cự Môn", 3],
    ["Thiên Tướng", 4],
    ["Thiên Lương", 5],
    ["Thất Sát", 6],
    ["Phá Quân", 10],
  ];
  phuGroup.forEach(([name, offset]) => addStar(starMap, branchFromIndex(phuIndex + offset), name, "Chính tinh"));

  const locTon = LOC_TON_BY_CAN[input.yearCan];
  addStar(starMap, locTon, "Lộc Tồn");
  addStar(starMap, addBranch(locTon, 1), "Kình Dương");
  addStar(starMap, addBranch(locTon, -1), "Đà La");
  placeRing(starMap, locTon, BAC_SI_RING, input.forward, "Vòng Bác Sĩ");
  addStar(starMap, addBranch(locTon, 8), "Quốc Ấn");
  addStar(starMap, addBranch(locTon, -7), "Đường Phù");

  const hourOffset = chiIndex(input.hourChi);
  addStar(starMap, branchFromIndex(chiIndex("Tuất") - hourOffset), "Văn Xương");
  addStar(starMap, branchFromIndex(chiIndex("Thìn") + hourOffset), "Văn Khúc");
  addStar(starMap, branchFromIndex(chiIndex("Hợi") + hourOffset), "Địa Kiếp");
  addStar(starMap, branchFromIndex(chiIndex("Hợi") - hourOffset), "Địa Không");

  addStar(starMap, branchFromIndex(chiIndex("Thìn") + input.lunarMonth - 1), "Tả Phù");
  addStar(starMap, branchFromIndex(chiIndex("Tuất") - input.lunarMonth + 1), "Hữu Bật");
  addStar(starMap, branchFromIndex(chiIndex("Dậu") + input.lunarMonth - 1), "Thiên Hình");
  const thienDieu = branchFromIndex(chiIndex("Sửu") + input.lunarMonth - 1);
  addStar(starMap, thienDieu, "Thiên Diêu");
  addStar(starMap, thienDieu, "Thiên Y");

  const [khoi, viet] = KHOI_VIET_BY_CAN[input.yearCan];
  addStar(starMap, khoi, "Thiên Khôi");
  addStar(starMap, viet, "Thiên Việt");

  THAI_TUE_RING.forEach((name, index) => addStar(starMap, branchFromIndex(chiIndex(input.yearChi) + index), name));
  addStar(starMap, getPeachBlossomBranch(input.yearChi), "Đào Hoa");
  addStar(starMap, branchFromIndex(chiIndex("Mão") - chiIndex(input.yearChi)), "Hồng Loan");
  addStar(starMap, branchFromIndex(chiIndex("Dậu") - chiIndex(input.yearChi)), "Thiên Hỷ");
  addStar(starMap, getTravelHorseBranch(input.yearChi), "Thiên Mã");
  addStar(starMap, branchFromIndex(chiIndex(input.yearChi) + 5), "Thiên Đức");
  addStar(starMap, branchFromIndex(chiIndex(input.yearChi) + 9), "Nguyệt Đức");

  placeHoaLinh(starMap, input.yearChi, input.hourChi, input.forward);
  getTuanBranches(input.yearCan, input.yearChi).forEach((branch) => addStar(starMap, branch, "Tuần"));
  getTrietBranches(input.yearCan).forEach((branch) => addStar(starMap, branch, "Triệt"));

  const hoa = HOA_KHI_BY_CAN[input.yearCan];
  const hoaEntries: Array<[string, string]> = [
    [hoa.loc, "Hóa Lộc"],
    [hoa.quyen, "Hóa Quyền"],
    [hoa.khoa, "Hóa Khoa"],
    [hoa.ky, "Hóa Kỵ"],
  ];
  hoaEntries.forEach(([targetStar, transform]) => {
    const branch = findStarBranch(starMap, targetStar);
    if (branch) addStar(starMap, branch, transform, `Theo ${targetStar}`);
  });

  return starMap;
}

function splitStars(stars: TuViStar[]): Pick<TuViPalace, "mainStars" | "supportStars" | "warningStars" | "otherStars"> {
  return {
    mainStars: stars.filter((star) => star.tone === "major"),
    supportStars: stars.filter((star) => ["good", "wealth", "support"].includes(star.tone)),
    warningStars: stars.filter((star) => star.tone === "bad"),
    otherStars: stars.filter((star) => star.tone === "neutral"),
  };
}

function getCanLuong(lunar: LunarDate, hourChi: ChiName): string {
  const yearWeight = [7, 8, 9, 12, 8, 7, 13, 5, 14, 5, 9, 7][positiveModulo(lunar.year, 12)];
  const monthWeight = [6, 7, 18, 9, 5, 16, 9, 15, 18, 8, 9, 5][lunar.month - 1] ?? 8;
  const dayWeight = ((lunar.day * 3) % 16) + 4;
  const hourWeight = ((chiIndex(hourChi) * 2) % 10) + 4;
  const total = yearWeight + monthWeight + dayWeight + hourWeight;
  return `${Math.floor(total / 10)} lượng ${total % 10 ? `${total % 10} chỉ` : ""}`.trim();
}

function getLaiNhanCung(yearCan: CanName): string {
  const map: Record<CanName, string> = {
    Giáp: "Mệnh",
    Ất: "Phụ Mẫu",
    Bính: "Phúc Đức",
    Đinh: "Điền Trạch",
    Mậu: "Quan Lộc",
    Kỷ: "Nô Bộc",
    Canh: "Thiên Di",
    Tân: "Tật Ách",
    Nhâm: "Tài Bạch",
    Quý: "Tử Tức",
  };
  return map[yearCan];
}

function buildPalaces(input: {
  lunarYear: number;
  menhIndex: number;
  thanIndex: number;
  cuc: CucInfo;
  forward: boolean;
  starMap: Map<ChiName, TuViStar[]>;
}): TuViPalace[] {
  return PALACE_SEQUENCE.map((palace, offset) => {
    const branchIndex = positiveModulo(input.menhIndex - offset, 12);
    const branch = branchFromIndex(branchIndex);
    const stars = input.starMap.get(branch) ?? [];
    const decadeOffset = input.forward
      ? positiveModulo(branchIndex - input.menhIndex, 12)
      : positiveModulo(input.menhIndex - branchIndex, 12);
    const decadeAge = input.cuc.number + decadeOffset * 10;
    const parts = splitStars(stars);
    const can = palaceCan(input.lunarYear, branch);
    return {
      ...palace,
      branch,
      branchIndex,
      can,
      canChi: `${can}.${branch}`,
      element: ELEMENT_BY_BRANCH[branch],
      decadeAge,
      lifeStage: getLifeStage(branch, input.cuc.element, input.forward),
      isBodyPalace: branchIndex === input.thanIndex,
      ...parts,
    };
  });
}

function readingForPalace(palace: TuViPalace, fallback: string) {
  const main = palace.mainStars.map((star) => star.name).join(", ") || fallback;
  const good = palace.supportStars.slice(0, 3).map((star) => star.name).join(", ");
  const bad = palace.warningStars.slice(0, 2).map((star) => star.name).join(", ");
  return { main, good, bad };
}

function buildReading(chart: Omit<TuViChart, "reading" | "summary">): Array<{ title: string; text: string }> {
  const palaceByKey = new Map(chart.palaces.map((palace) => [palace.key, palace]));
  const menh = readingForPalace(palaceByKey.get("menh")!, "các sao phụ tinh");
  const quan = readingForPalace(palaceByKey.get("quan-loc")!, "các sao về công việc");
  const tai = readingForPalace(palaceByKey.get("tai-bach")!, "các sao về tài lộc");
  const phoi = readingForPalace(palaceByKey.get("phu-the")!, "các sao về tình cảm");

  return [
    {
      title: "Tổng quan bản mệnh",
      text: `Mệnh an tại ${chart.menhBranch}, Thân cư ${chart.thanResidence}. Bản mệnh ${chart.napAm}, thuộc ${chart.element}; cục là ${chart.cuc.name}. Cung Mệnh có ${menh.main}${menh.good ? `, thêm bộ hỗ trợ ${menh.good}` : ""}${menh.bad ? `; nên lưu ý ${menh.bad}` : ""}.`,
    },
    {
      title: "Công danh – sự nghiệp",
      text: `Cung Quan Lộc có ${quan.main}${quan.good ? `, gặp ${quan.good}` : ""}. Đây là phần tham khảo để nhìn xu hướng làm việc, sự chủ động và khả năng được hỗ trợ trong môi trường nghề nghiệp.`,
    },
    {
      title: "Tài bạch – tiền bạc",
      text: `Cung Tài Bạch có ${tai.main}${tai.good ? `, kèm ${tai.good}` : ""}${tai.bad ? `; tránh quyết định nóng khi gặp ${tai.bad}` : ""}. Nên dùng phần này như gợi ý quản trị rủi ro, không phải kết luận tài chính.`,
    },
    {
      title: "Tình duyên – gia đạo",
      text: `Cung Phu Thê có ${phoi.main}${phoi.good ? `, thêm ${phoi.good}` : ""}. Khi xem tình cảm, nên đọc cùng cung Mệnh, Phúc Đức và hoàn cảnh thực tế của mỗi người.`,
    },
  ];
}

export function normalizeTuViInput(input: TuViInput): TuViInput {
  return {
    ...input,
    fullName: input.fullName.trim() || "Chưa nhập tên",
    birthTime: /^\d{1,2}:\d{2}$/.test(input.birthTime) ? input.birthTime.padStart(5, "0") : "00:00",
    viewYear: Number.isInteger(input.viewYear) && input.viewYear >= 1900 && input.viewYear <= 2199 ? input.viewYear : new Date().getFullYear(),
  };
}

export function lapLaSoTuVi(rawInput: TuViInput): TuViChart | null {
  const input = normalizeTuViInput(rawInput);
  if (!isValidDateParts(input.birthDate)) return null;

  const solarDate = input.calendarType === "solar"
    ? input.birthDate
    : convertLunar2Solar(input.birthDate.day, input.birthDate.month, input.birthDate.year, input.isLeapMonth) ?? input.birthDate;

  if (!isValidDateParts(solarDate)) return null;

  const lunarDate = convertSolar2Lunar(solarDate.day, solarDate.month, solarDate.year);
  const jd = jdFromDate(solarDate.day, solarDate.month, solarDate.year);
  const yearCanChi = getYearCanChi(lunarDate.year);
  const monthCanChi = getMonthCanChi(lunarDate.year, lunarDate.month);
  const dayCanChi = getDayCanChi(jd);
  const hourChi = getHourBranch(input.birthTime);
  const hourCanChi = getHourCanChi(dayCanChi.can, hourChi);
  const ageResult = getAgeResult(lunarDate.year, input.viewYear);
  const { menhIndex, thanIndex } = getMenhThan(lunarDate.month, hourChi);
  const menhBranch = branchFromIndex(menhIndex);
  const thanBranch = branchFromIndex(thanIndex);
  const cuc = getCuc(lunarDate.year, menhBranch);
  const forward = isForwardDecade(input.gender, yearCanChi.can);
  const starMap = placeStars({
    lunarDay: lunarDate.day,
    lunarMonth: lunarDate.month,
    hourChi,
    yearCan: yearCanChi.can,
    yearChi: yearCanChi.chi,
    cucNumber: cuc.number,
    forward,
  });
  const palaces = buildPalaces({ lunarYear: lunarDate.year, menhIndex, thanIndex, cuc, forward, starMap });
  const bodyPalace = palaces.find((palace) => palace.isBodyPalace) ?? palaces[0];
  const baseChart = {
    input,
    solarDate,
    lunarDate,
    canChi: {
      year: yearCanChi.text,
      month: monthCanChi.text,
      day: dayCanChi.text,
      hour: hourCanChi,
      yearCan: yearCanChi.can,
      yearChi: yearCanChi.chi,
      hourChi,
    },
    genderLabel: input.gender === "nam" ? "Nam" : "Nữ",
    yinYangLabel: `${isYangCan(yearCanChi.can) ? "Dương" : "Âm"} ${input.gender === "nam" ? "Nam" : "Nữ"}`,
    age: Math.max(1, input.viewYear - lunarDate.year + 1),
    napAm: ageResult.napAm,
    element: ageResult.element,
    cuc,
    menhBranch,
    thanBranch,
    thanResidence: bodyPalace.shortName,
    bodyMaster: BODY_MASTER_BY_YEAR_CHI[yearCanChi.chi],
    lifeMaster: LIFE_MASTER_BY_YEAR_CHI[yearCanChi.chi],
    laiNhanCung: getLaiNhanCung(yearCanChi.can),
    canLuong: getCanLuong(lunarDate, hourChi),
    palaces,
  } satisfies Omit<TuViChart, "reading" | "summary">;

  const reading = buildReading(baseChart);
  const chart: TuViChart = {
    ...baseChart,
    summary: `Lá số của ${input.fullName} sinh ${formatDisplayDate(solarDate)} dương lịch, giờ ${formatTime(input.birthTime)}, tuổi ${yearCanChi.text}. Mệnh an tại ${menhBranch}, Thân an tại ${thanBranch}, ${baseChart.yinYangLabel}, bản mệnh ${ageResult.napAm}.`,
    reading,
  };
  return chart;
}

export function defaultTuViInput(viewYear: number): TuViInput {
  return {
    fullName: "",
    gender: "nam",
    calendarType: "solar",
    birthDate: { year: 1990, month: 1, day: 1 },
    birthTime: "09:00",
    viewYear,
  };
}

export function chartQueryFromInput(input: TuViInput): string {
  const params = new URLSearchParams();
  params.set("name", input.fullName);
  params.set("gender", input.gender);
  params.set("calendar", input.calendarType);
  params.set("date", `${input.birthDate.year}-${String(input.birthDate.month).padStart(2, "0")}-${String(input.birthDate.day).padStart(2, "0")}`);
  params.set("time", input.birthTime);
  params.set("viewYear", String(input.viewYear));
  if (input.isLeapMonth) params.set("leap", "1");
  return params.toString();
}
