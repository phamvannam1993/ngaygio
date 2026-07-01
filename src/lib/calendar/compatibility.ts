import { CAN, CHI, getYearCanChi, type CanName } from "./can-chi";
import { getAgeCompatibility } from "./good-bad";
import { getAgeResult, getNapAmByCanChi, isValidBirthYear, type FiveElement } from "./age";
import type { ChiName } from "./types";

export type CompatibilityPurpose = "tong-quan" | "lam-an" | "vo-chong" | "sinh-con";
export type HouseCheckLevel = "good" | "ok" | "bad";
export type GenderValue = "nam" | "nu";

export type ScoreReason = {
  label: string;
  points: number;
  tone: "good" | "bad" | "neutral";
};

export type AgeCompatibilityResult = {
  purpose: CompatibilityPurpose;
  yearA: number;
  yearB: number;
  personA: ReturnType<typeof getAgeResult>;
  personB: ReturnType<typeof getAgeResult>;
  score: number;
  label: string;
  summary: string;
  reasons: ScoreReason[];
  goodNotes: string[];
  cautionNotes: string[];
};

export type ChildYearResult = {
  fatherYear?: number;
  motherYear?: number;
  childYear: number;
  child: ReturnType<typeof getAgeResult>;
  fatherResult?: AgeCompatibilityResult;
  motherResult?: AgeCompatibilityResult;
  parentResult?: AgeCompatibilityResult;
  score: number;
  label: string;
  summary: string;
  goodNotes: string[];
  cautionNotes: string[];
};

export type HouseAgeCheck = {
  birthYear: number;
  buildYear: number;
  lunarAge: number;
  ageInfo: ReturnType<typeof getAgeResult>;
  buildYearCanChi: string;
  score: number;
  level: HouseCheckLevel;
  label: string;
  summary: string;
  checks: Array<{ name: string; status: "good" | "bad"; description: string }>;
  suggestions: string[];
};

export type FengShuiAgeInfo = {
  birthYear: number;
  gender: GenderValue;
  ageInfo: ReturnType<typeof getAgeResult>;
  colors: {
    element: FiveElement;
    lucky: string[];
    support: string[];
    avoid: string[];
    note: string;
  };
  kua: {
    number: number;
    palace: string;
    group: "Đông tứ mệnh" | "Tây tứ mệnh";
    goodDirections: Array<{ name: string; direction: string; meaning: string }>;
    badDirections: Array<{ name: string; direction: string; meaning: string }>;
  };
};

export const COMPATIBILITY_PURPOSES: Array<{ slug: CompatibilityPurpose; title: string; shortTitle: string; description: string; href: string }> = [
  { slug: "tong-quan", title: "Xem tuổi hợp", shortTitle: "Tổng quan", description: "So sánh hai năm sinh theo can chi, con giáp, nạp âm và ngũ hành.", href: "/xem-tuoi-hop" },
  { slug: "lam-an", title: "Xem tuổi hợp làm ăn", shortTitle: "Làm ăn", description: "Chấm điểm tuổi hợp tác kinh doanh, mở việc, góp vốn hoặc làm chung.", href: "/xem-tuoi-hop-lam-an" },
  { slug: "vo-chong", title: "Xem tuổi vợ chồng", shortTitle: "Vợ chồng", description: "Tham khảo độ hòa hợp tuổi cưới hỏi, gia đạo và đồng hành lâu dài.", href: "/xem-tuoi-vo-chong" },
  { slug: "sinh-con", title: "Xem tuổi sinh con", shortTitle: "Sinh con", description: "Chọn năm sinh con tham khảo theo tuổi cha mẹ và nạp âm ngũ hành.", href: "/xem-tuoi-sinh-con" },
];

const CAN_ELEMENT: Record<CanName, FiveElement> = {
  Giáp: "Mộc",
  Ất: "Mộc",
  Bính: "Hỏa",
  Đinh: "Hỏa",
  Mậu: "Thổ",
  Kỷ: "Thổ",
  Canh: "Kim",
  Tân: "Kim",
  Nhâm: "Thủy",
  Quý: "Thủy",
};

const ELEMENT_GENERATES: Record<FiveElement, FiveElement> = {
  Kim: "Thủy",
  Thủy: "Mộc",
  Mộc: "Hỏa",
  Hỏa: "Thổ",
  Thổ: "Kim",
};

const ELEMENT_CONTROLS: Record<FiveElement, FiveElement> = {
  Kim: "Mộc",
  Mộc: "Thổ",
  Thổ: "Thủy",
  Thủy: "Hỏa",
  Hỏa: "Kim",
};

const ELEMENT_COLORS: Record<FiveElement, { lucky: string[]; support: string[]; avoid: string[] }> = {
  Kim: { lucky: ["trắng", "xám", "ghi", "bạc"], support: ["vàng", "nâu đất"], avoid: ["đỏ", "hồng", "tím", "cam đậm"] },
  Mộc: { lucky: ["xanh lá", "xanh rêu", "xanh ngọc"], support: ["đen", "xanh dương"], avoid: ["trắng", "xám", "bạc"] },
  Thủy: { lucky: ["đen", "xanh dương", "xanh biển"], support: ["trắng", "xám", "bạc"], avoid: ["vàng đất", "nâu đất"] },
  Hỏa: { lucky: ["đỏ", "hồng", "tím", "cam"], support: ["xanh lá", "xanh rêu"], avoid: ["đen", "xanh dương"] },
  Thổ: { lucky: ["vàng", "nâu", "nâu đất", "be ấm"], support: ["đỏ", "hồng", "tím", "cam"], avoid: ["xanh lá", "xanh rêu"] },
};

const KUA_PALACE: Record<number, string> = {
  1: "Khảm",
  2: "Khôn",
  3: "Chấn",
  4: "Tốn",
  6: "Càn",
  7: "Đoài",
  8: "Cấn",
  9: "Ly",
};

const KUA_DIRECTIONS: Record<string, { group: "Đông tứ mệnh" | "Tây tứ mệnh"; good: [string, string, string, string]; bad: [string, string, string, string] }> = {
  Khảm: { group: "Đông tứ mệnh", good: ["Đông Nam", "Đông", "Nam", "Bắc"], bad: ["Tây Nam", "Đông Bắc", "Tây Bắc", "Tây"] },
  Ly: { group: "Đông tứ mệnh", good: ["Đông", "Đông Nam", "Bắc", "Nam"], bad: ["Tây Bắc", "Tây", "Tây Nam", "Đông Bắc"] },
  Chấn: { group: "Đông tứ mệnh", good: ["Nam", "Bắc", "Đông Nam", "Đông"], bad: ["Tây", "Tây Bắc", "Đông Bắc", "Tây Nam"] },
  Tốn: { group: "Đông tứ mệnh", good: ["Bắc", "Nam", "Đông", "Đông Nam"], bad: ["Đông Bắc", "Tây Nam", "Tây", "Tây Bắc"] },
  Càn: { group: "Tây tứ mệnh", good: ["Tây", "Đông Bắc", "Tây Nam", "Tây Bắc"], bad: ["Nam", "Đông", "Bắc", "Đông Nam"] },
  Đoài: { group: "Tây tứ mệnh", good: ["Tây Bắc", "Tây Nam", "Đông Bắc", "Tây"], bad: ["Đông", "Nam", "Đông Nam", "Bắc"] },
  Cấn: { group: "Tây tứ mệnh", good: ["Tây Nam", "Tây Bắc", "Tây", "Đông Bắc"], bad: ["Đông Nam", "Bắc", "Đông", "Nam"] },
  Khôn: { group: "Tây tứ mệnh", good: ["Đông Bắc", "Tây", "Tây Bắc", "Tây Nam"], bad: ["Bắc", "Đông Nam", "Nam", "Đông"] },
};

const GOOD_DIRECTION_NAMES = ["Sinh Khí", "Thiên Y", "Diên Niên", "Phục Vị"];
const GOOD_DIRECTION_MEANING = [
  "thuận cho phát triển, tài lộc và cơ hội mới",
  "tốt cho sức khỏe, sự nâng đỡ và bình an",
  "tốt cho quan hệ, hòa khí và sự bền lâu",
  "tốt cho ổn định, tinh thần và học tập",
];
const BAD_DIRECTION_NAMES = ["Tuyệt Mệnh", "Ngũ Quỷ", "Lục Sát", "Họa Hại"];
const BAD_DIRECTION_MEANING = [
  "nên hạn chế dùng cho việc trọng yếu",
  "dễ phát sinh nhiễu động, tranh cãi",
  "dễ vướng trở ngại trong quan hệ và đi lại",
  "dễ có việc nhỏ gây phiền lòng",
];

function clampScore(score: number) {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function elementRelation(a: FiveElement, b: FiveElement): "same" | "aGeneratesB" | "bGeneratesA" | "aControlsB" | "bControlsA" | "neutral" {
  if (a === b) return "same";
  if (ELEMENT_GENERATES[a] === b) return "aGeneratesB";
  if (ELEMENT_GENERATES[b] === a) return "bGeneratesA";
  if (ELEMENT_CONTROLS[a] === b) return "aControlsB";
  if (ELEMENT_CONTROLS[b] === a) return "bControlsA";
  return "neutral";
}

function relationLabelByChi(chiA: ChiName, chiB: ChiName) {
  const relation = getAgeCompatibility(chiA);
  if (relation.lucHop === chiB) return { label: "Lục hợp", points: 24, tone: "good" as const };
  if (relation.tamHop.includes(chiB)) return { label: `Tam hợp ${relation.tamHopElement}`, points: 20, tone: "good" as const };
  if (chiA === chiB) return { label: "Cùng địa chi", points: 8, tone: "neutral" as const };
  if (relation.xung.includes(chiB)) return { label: "Tứ hành xung", points: -24, tone: "bad" as const };
  if (relation.hai === chiB) return { label: "Lục hại", points: -16, tone: "bad" as const };
  return { label: "Bình hòa theo địa chi", points: 4, tone: "neutral" as const };
}

function purposeText(purpose: CompatibilityPurpose) {
  if (purpose === "lam-an") return "hợp tác làm ăn";
  if (purpose === "vo-chong") return "vợ chồng/cưới hỏi";
  if (purpose === "sinh-con") return "sinh con";
  return "mức độ hợp tuổi";
}

function canAmDuong(can: CanName) {
  return CAN.indexOf(can) % 2 === 0 ? "Dương" : "Âm";
}

export function getCompatibilityResult(yearA: number, yearB: number, purpose: CompatibilityPurpose = "tong-quan"): AgeCompatibilityResult {
  const safeYearA = isValidBirthYear(yearA) ? yearA : 1990;
  const safeYearB = isValidBirthYear(yearB) ? yearB : 1992;
  const viewYear = Math.max(new Date().getFullYear(), safeYearA, safeYearB);
  const personA = getAgeResult(safeYearA, viewYear);
  const personB = getAgeResult(safeYearB, viewYear);
  const canA = getYearCanChi(safeYearA);
  const canB = getYearCanChi(safeYearB);
  const reasons: ScoreReason[] = [];
  let score = purpose === "vo-chong" ? 54 : 52;

  const add = (label: string, points: number, tone: ScoreReason["tone"]) => {
    score += points;
    reasons.push({ label, points, tone });
  };

  const chiRelation = relationLabelByChi(canA.chi, canB.chi);
  add(`${chiRelation.label}: ${canA.chi} - ${canB.chi}`, chiRelation.points, chiRelation.tone);

  const canElementRelation = elementRelation(CAN_ELEMENT[canA.can], CAN_ELEMENT[canB.can]);
  if (canElementRelation === "same") add(`Thiên can cùng hành ${CAN_ELEMENT[canA.can]}`, 8, "good");
  else if (canElementRelation === "aGeneratesB" || canElementRelation === "bGeneratesA") add(`Thiên can có quan hệ tương sinh ${CAN_ELEMENT[canA.can]} - ${CAN_ELEMENT[canB.can]}`, 12, "good");
  else if (canElementRelation === "aControlsB" || canElementRelation === "bControlsA") add(`Thiên can có dấu hiệu tương khắc ${CAN_ELEMENT[canA.can]} - ${CAN_ELEMENT[canB.can]}`, -12, "bad");
  else add("Thiên can bình hòa", 4, "neutral");

  const napA = getNapAmByCanChi(canA.can, canA.chi);
  const napB = getNapAmByCanChi(canB.can, canB.chi);
  const napRelation = elementRelation(napA.element, napB.element);
  if (napRelation === "same") add(`Nạp âm cùng hành ${napA.element}`, 10, "good");
  else if (napRelation === "aGeneratesB" || napRelation === "bGeneratesA") add(`Nạp âm tương sinh ${napA.element} - ${napB.element}`, 18, "good");
  else if (napRelation === "aControlsB" || napRelation === "bControlsA") add(`Nạp âm tương khắc ${napA.element} - ${napB.element}`, -18, "bad");
  else add("Nạp âm bình hòa", 4, "neutral");

  if (purpose === "vo-chong") {
    if (canAmDuong(canA.can) !== canAmDuong(canB.can)) add("Thiên can âm dương bổ trợ", 7, "good");
    else add("Thiên can cùng âm/dương, nên chú trọng nhường nhịn", -3, "neutral");
  }

  if (purpose === "lam-an") {
    if (chiRelation.tone === "good" && (napRelation === "aGeneratesB" || napRelation === "bGeneratesA" || napRelation === "same")) add("Có cả chi hợp và ngũ hành thuận cho phối hợp", 8, "good");
    if (chiRelation.tone === "bad" && (napRelation === "aControlsB" || napRelation === "bControlsA")) add("Vừa xung chi vừa khắc nạp âm, cần phân vai rõ", -8, "bad");
  }

  const finalScore = clampScore(score);
  const label = finalScore >= 82 ? "Rất hợp" : finalScore >= 68 ? "Khá hợp" : finalScore >= 52 ? "Trung bình" : "Nên cân nhắc";
  const goodNotes = reasons.filter((r) => r.tone === "good").map((r) => r.label).slice(0, 5);
  const cautionNotes = reasons.filter((r) => r.tone === "bad").map((r) => r.label).slice(0, 5);

  return {
    purpose,
    yearA: safeYearA,
    yearB: safeYearB,
    personA,
    personB,
    score: finalScore,
    label,
    summary: `Tuổi ${personA.birthCanChi} và ${personB.birthCanChi} đạt ${finalScore}/100 khi xét ${purposeText(purpose)} theo can chi, địa chi và nạp âm ngũ hành.`,
    reasons,
    goodNotes,
    cautionNotes,
  };
}

export function getChildYearResult(opts: { fatherYear?: number; motherYear?: number; childYear: number }): ChildYearResult {
  const childYear = isValidBirthYear(opts.childYear) ? opts.childYear : new Date().getFullYear() + 1;
  const viewYear = Math.max(childYear, new Date().getFullYear());
  const child = getAgeResult(childYear, viewYear);
  const fatherResult = opts.fatherYear && isValidBirthYear(opts.fatherYear) ? getCompatibilityResult(opts.fatherYear, childYear, "sinh-con") : undefined;
  const motherResult = opts.motherYear && isValidBirthYear(opts.motherYear) ? getCompatibilityResult(opts.motherYear, childYear, "sinh-con") : undefined;
  const parentResult = opts.fatherYear && opts.motherYear && isValidBirthYear(opts.fatherYear) && isValidBirthYear(opts.motherYear) ? getCompatibilityResult(opts.fatherYear, opts.motherYear, "vo-chong") : undefined;
  const scores = [fatherResult?.score, motherResult?.score].filter((v): v is number => typeof v === "number");
  const base = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 60;
  const parentBonus = parentResult ? Math.round((parentResult.score - 60) * 0.15) : 0;
  const score = clampScore(base + parentBonus);
  const label = score >= 82 ? "Rất thuận" : score >= 68 ? "Khá thuận" : score >= 52 ? "Có thể cân nhắc" : "Nên xem kỹ thêm";
  const goodNotes = [fatherResult?.goodNotes[0], motherResult?.goodNotes[0], parentResult?.goodNotes[0]].filter((v): v is string => Boolean(v));
  const cautionNotes = [fatherResult?.cautionNotes[0], motherResult?.cautionNotes[0], parentResult?.cautionNotes[0]].filter((v): v is string => Boolean(v));
  return {
    fatherYear: opts.fatherYear,
    motherYear: opts.motherYear,
    childYear,
    child,
    fatherResult,
    motherResult,
    parentResult,
    score,
    label,
    summary: `Năm ${childYear} là tuổi ${child.birthCanChi}, con ${child.animal}, nạp âm ${child.napAm}. Điểm tham khảo theo tuổi cha mẹ là ${score}/100.`,
    goodNotes,
    cautionNotes,
  };
}

function sumDigitsToOne(year: number) {
  let n = String(year).split("").reduce((sum, digit) => sum + Number(digit), 0);
  while (n > 9) n = String(n).split("").reduce((sum, digit) => sum + Number(digit), 0);
  return n;
}

export function getKuaNumber(birthYear: number, gender: GenderValue) {
  const sum = sumDigitsToOne(birthYear);
  let kua = birthYear >= 2000 ? (gender === "nam" ? 9 - sum : 6 + sum) : (gender === "nam" ? 10 - sum : 5 + sum);
  while (kua > 9) kua = String(kua).split("").reduce((acc, digit) => acc + Number(digit), 0);
  if (kua === 0) kua = 9;
  if (kua === 5) kua = gender === "nam" ? 2 : 8;
  return kua;
}

export function getFengShuiAgeInfo(birthYear: number, gender: GenderValue = "nam"): FengShuiAgeInfo {
  const safeYear = isValidBirthYear(birthYear) ? birthYear : 1990;
  const ageInfo = getAgeResult(safeYear, new Date().getFullYear());
  const kuaNumber = getKuaNumber(safeYear, gender);
  const palace = KUA_PALACE[kuaNumber] ?? "Khôn";
  const directionTable = KUA_DIRECTIONS[palace];
  const colorData = ELEMENT_COLORS[ageInfo.element];

  return {
    birthYear: safeYear,
    gender,
    ageInfo,
    colors: {
      element: ageInfo.element,
      lucky: colorData.lucky,
      support: colorData.support,
      avoid: colorData.avoid,
      note: `Người sinh năm ${safeYear} thuộc nạp âm ${ageInfo.napAm}, hành ${ageInfo.element}. Màu hợp nên ưu tiên màu bản mệnh và màu tương sinh, màu kỵ chỉ nên dùng tiết chế.`,
    },
    kua: {
      number: kuaNumber,
      palace,
      group: directionTable.group,
      goodDirections: directionTable.good.map((direction, index) => ({ name: GOOD_DIRECTION_NAMES[index], direction, meaning: GOOD_DIRECTION_MEANING[index] })),
      badDirections: directionTable.bad.map((direction, index) => ({ name: BAD_DIRECTION_NAMES[index], direction, meaning: BAD_DIRECTION_MEANING[index] })),
    },
  };
}

const TAM_TAI_BY_GROUP: Array<{ group: ChiName[]; years: ChiName[] }> = [
  { group: ["Thân", "Tý", "Thìn"], years: ["Dần", "Mão", "Thìn"] },
  { group: ["Dần", "Ngọ", "Tuất"], years: ["Thân", "Dậu", "Tuất"] },
  { group: ["Hợi", "Mão", "Mùi"], years: ["Tỵ", "Ngọ", "Mùi"] },
  { group: ["Tỵ", "Dậu", "Sửu"], years: ["Hợi", "Tý", "Sửu"] },
];

function getHoangOc(lunarAge: number) {
  const names = ["Nhất Cát", "Nhì Nghi", "Tam Địa Sát", "Tứ Tấn Tài", "Ngũ Thọ Tử", "Lục Hoang Ốc"];
  const index = (lunarAge - 1) % 6;
  const name = names[index];
  const good = index === 0 || index === 1 || index === 3;
  return { name, good };
}

export function getHouseAgeCheck(birthYear: number, buildYear: number): HouseAgeCheck {
  const safeBirthYear = isValidBirthYear(birthYear) ? birthYear : 1990;
  const safeBuildYear = Number.isInteger(buildYear) && buildYear >= safeBirthYear && buildYear <= 2050 ? buildYear : new Date().getFullYear();
  const ageInfo = getAgeResult(safeBirthYear, safeBuildYear);
  const build = getYearCanChi(safeBuildYear);
  const lunarAge = Math.max(1, safeBuildYear - safeBirthYear + 1);
  const kimLauMod = lunarAge % 9;
  const kimLauBad = [1, 3, 6, 8].includes(kimLauMod);
  const hoangOc = getHoangOc(lunarAge);
  const tamTaiYears = TAM_TAI_BY_GROUP.find((item) => item.group.includes(ageInfo.birthChi))?.years ?? [];
  const tamTaiBad = tamTaiYears.includes(build.chi);
  const checks = [
    { name: "Kim Lâu", status: kimLauBad ? "bad" as const : "good" as const, description: kimLauBad ? `Tuổi âm ${lunarAge} phạm Kim Lâu theo phép chia 9.` : `Tuổi âm ${lunarAge} không rơi vào các số Kim Lâu 1, 3, 6, 8.` },
    { name: "Hoang Ốc", status: hoangOc.good ? "good" as const : "bad" as const, description: `${hoangOc.name}${hoangOc.good ? " là cung tốt để tham khảo làm nhà." : " là cung nên thận trọng khi làm nhà."}` },
    { name: "Tam Tai", status: tamTaiBad ? "bad" as const : "good" as const, description: tamTaiBad ? `Tuổi ${ageInfo.birthCanChi} gặp năm ${build.text} thuộc nhóm Tam Tai.` : `Năm ${build.text} không thuộc nhóm Tam Tai chính của tuổi ${ageInfo.birthCanChi}.` },
  ];
  let score = 100;
  if (kimLauBad) score -= 30;
  if (!hoangOc.good) score -= 30;
  if (tamTaiBad) score -= 25;
  score = clampScore(score);
  const level: HouseCheckLevel = score >= 80 ? "good" : score >= 55 ? "ok" : "bad";
  const label = level === "good" ? "Có thể tham khảo" : level === "ok" ? "Cần cân nhắc" : "Nên tránh hoặc mượn tuổi";
  const suggestions = [
    level === "good" ? "Có thể kết hợp thêm chọn ngày động thổ hợp tuổi để chốt lịch." : "Nên mở rộng sang năm khác hoặc cân nhắc mượn tuổi theo phong tục địa phương.",
    "Với việc xây sửa lớn, nên xét thêm pháp lý, tài chính, thời tiết, hướng nhà và lịch gia đình.",
  ];

  return {
    birthYear: safeBirthYear,
    buildYear: safeBuildYear,
    lunarAge,
    ageInfo,
    buildYearCanChi: build.text,
    score,
    level,
    label,
    summary: `Tuổi ${ageInfo.birthCanChi} làm nhà năm ${safeBuildYear} (${build.text}) đạt ${score}/100 khi xét Kim Lâu, Hoang Ốc và Tam Tai.`,
    checks,
    suggestions,
  };
}

export function nearbyYears(center: number, range = 4) {
  const years: number[] = [];
  for (let y = center - range; y <= center + range; y++) {
    if (y >= 1900 && y <= 2050 && y !== center) years.push(y);
  }
  return years;
}

export { CHI };
