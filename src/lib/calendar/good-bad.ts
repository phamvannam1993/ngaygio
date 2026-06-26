import { addDays } from "@/lib/date";
import { CAN, CHI, type CanName } from "./can-chi";
import { convertSolar2Lunar } from "./lunar";
import type { ChiName, DayInfo } from "./types";

export type OverallDayType = "good" | "neutral" | "bad";
export type TwelveDirectName = "Kiến" | "Trừ" | "Mãn" | "Bình" | "Định" | "Chấp" | "Phá" | "Nguy" | "Thành" | "Thu" | "Khai" | "Bế";

type DirectInfo = {
  name: TwelveDirectName;
  tone: OverallDayType;
  meaning: string;
  goodFor: string[];
  avoid: string[];
};

export type SpecialWarning = {
  name: string;
  description: string;
};

export type AgeCompatibility = {
  lucHop: ChiName;
  tamHop: ChiName[];
  xung: ChiName[];
  hai: ChiName;
  tamHopElement: string;
};

export type GoodBadDetails = {
  score: number;
  overallType: OverallDayType;
  overallLabel: "Ngày tốt" | "Ngày trung bình" | "Ngày xấu";
  overallSummary: string;
  twelveDirect: DirectInfo;
  specialWarnings: SpecialWarning[];
  banhTo: string[];
  shouldDo: string[];
  shouldAvoid: string[];
  ageCompatibility: AgeCompatibility;
};

const TWELVE_DIRECT_ORDER: TwelveDirectName[] = ["Kiến", "Trừ", "Mãn", "Bình", "Định", "Chấp", "Phá", "Nguy", "Thành", "Thu", "Khai", "Bế"];

const DIRECT_DETAILS: Record<TwelveDirectName, Omit<DirectInfo, "name">> = {
  Kiến: {
    tone: "neutral",
    meaning: "Trực mở đầu chu kỳ, hợp với việc khởi tạo, lập kế hoạch và bắt đầu việc vừa sức.",
    goodFor: ["Khai bút, lập kế hoạch", "Xuất hành gần", "Gặp gỡ, trao đổi công việc"],
    avoid: ["Việc đại sự còn thiếu chuẩn bị", "Chi tiền lớn khi chưa kiểm tra kỹ"],
  },
  Trừ: {
    tone: "good",
    meaning: "Trực mang ý nghĩa loại bỏ điều cũ, tẩy trừ điều xấu và làm mới không gian sống.",
    goodFor: ["Dọn dẹp, sửa sang", "Cầu an, giải hạn", "Chữa bệnh, thăm khám", "Xuất hành, giao dịch nhỏ"],
    avoid: ["Cưới hỏi", "Ký hợp đồng lớn", "Nhậm chức, nhận việc trọng đại"],
  },
  Mãn: {
    tone: "good",
    meaning: "Trực biểu thị sự đầy đủ, viên mãn, thích hợp với việc cầu tài và hoàn thiện việc đang làm.",
    goodFor: ["Cầu tài, thu nợ", "Khai trương nhỏ", "Hoàn tất hồ sơ", "Mua sắm vật dụng"],
    avoid: ["Khởi kiện", "Việc cần cắt bỏ, chấm dứt"],
  },
  Bình: {
    tone: "neutral",
    meaning: "Trực bình hòa, hợp với việc thường ngày, ít đột phá nhưng ổn định.",
    goodFor: ["Việc hành chính", "Gặp gỡ, trao đổi", "Sắp xếp nhà cửa"],
    avoid: ["Việc cần kết quả nhanh", "Mạo hiểm tài chính"],
  },
  Định: {
    tone: "good",
    meaning: "Trực có tính ổn định, phù hợp với việc an vị, ký kết và củng cố nền tảng.",
    goodFor: ["Ký kết, thỏa thuận", "Nhập trạch", "An vị bàn thờ", "Lập kế hoạch dài hạn"],
    avoid: ["Tranh chấp", "Việc cần phá bỏ cái cũ"],
  },
  Chấp: {
    tone: "neutral",
    meaning: "Trực thiên về giữ gìn, tiếp nhận và duy trì việc đang có.",
    goodFor: ["Nhận việc", "Bảo trì, sửa chữa", "Thu xếp giấy tờ"],
    avoid: ["Khai trương lớn", "Việc cần mở rộng nhanh"],
  },
  Phá: {
    tone: "bad",
    meaning: "Trực có nghĩa phá bỏ, dễ phát sinh xáo trộn; chỉ hợp với việc dỡ bỏ cái cũ.",
    goodFor: ["Phá dỡ, tháo bỏ", "Loại bỏ thói quen xấu", "Thanh lý đồ cũ"],
    avoid: ["Cưới hỏi", "Khai trương", "Động thổ", "Ký hợp đồng quan trọng"],
  },
  Nguy: {
    tone: "bad",
    meaning: "Trực biểu thị sự thận trọng, nên hạn chế việc nhiều rủi ro.",
    goodFor: ["Cúng lễ", "Kiểm tra an toàn", "Chuẩn bị phương án dự phòng"],
    avoid: ["Đi xa", "Đầu tư lớn", "Việc mạo hiểm"],
  },
  Thành: {
    tone: "good",
    meaning: "Trực thành tựu, tốt cho việc hoàn thành, khai mở và cầu kết quả hanh thông.",
    goodFor: ["Khai trương", "Ký kết", "Cưới hỏi", "Nhập học, nhận việc", "Xuất hành"],
    avoid: ["Kiện tụng", "Phá dỡ"],
  },
  Thu: {
    tone: "neutral",
    meaning: "Trực chủ về thu gom, kết nạp và nhận về, phù hợp với việc tài chính vừa phải.",
    goodFor: ["Thu nợ", "Nhận tiền", "Mua hàng", "Lưu kho, nhập kho"],
    avoid: ["An táng", "Việc cần giải tán"],
  },
  Khai: {
    tone: "good",
    meaning: "Trực khai mở, hợp với việc bắt đầu, mở hàng, mở cửa và tạo cơ hội mới.",
    goodFor: ["Khai trương", "Mở hàng", "Cầu tài", "Xuất hành", "Nộp hồ sơ"],
    avoid: ["An táng", "Việc đóng lại, kết thúc"],
  },
  Bế: {
    tone: "bad",
    meaning: "Trực đóng lại, thích hợp thu xếp nội bộ hơn là khởi sự việc mới.",
    goodFor: ["Hoàn tất việc cũ", "Lưu trữ giấy tờ", "Nghỉ ngơi, tĩnh dưỡng"],
    avoid: ["Khai trương", "Cưới hỏi", "Xuất hành xa", "Ký kết lớn"],
  },
};

const BACH_KY_CAN: Record<CanName, string> = {
  Giáp: "Ngày can Giáp không nên mở kho, dễ hao tán tài vật.",
  Ất: "Ngày can Ất không nên gieo trồng lớn, cây cối dễ khó sinh trưởng.",
  Bính: "Ngày can Bính không nên tu sửa bếp núc, dễ phát sinh việc không yên.",
  Đinh: "Ngày can Đinh không nên cạo đầu, làm đẹp lớn hoặc can thiệp thân thể.",
  Mậu: "Ngày can Mậu không nên nhận đất, mua đất hoặc việc liên quan điền sản khi chưa xét kỹ.",
  Kỷ: "Ngày can Kỷ không nên phá khoán, lập khế ước vội vàng.",
  Canh: "Ngày can Canh không nên dệt vải, quay tơ hoặc khởi sự việc cần sự bền bỉ lâu dài.",
  Tân: "Ngày can Tân không nên pha chế, nếm thử đồ lạ hoặc dùng thuốc tùy tiện.",
  Nhâm: "Ngày can Nhâm không nên tháo nước, khai thông dòng chảy lớn.",
  Quý: "Ngày can Quý không nên kiện tụng, tranh biện hoặc việc dễ sinh thị phi.",
};

const BACH_KY_CHI: Record<ChiName, string> = {
  Tý: "Ngày Tý không nên hỏi quẻ, gieo quẻ hoặc quá tin vào việc bói toán.",
  Sửu: "Ngày Sửu không nên đi xa khi chưa chuẩn bị đầy đủ.",
  Dần: "Ngày Dần không nên tế tự tùy tiện hoặc làm việc liên quan thần linh thiếu trang nghiêm.",
  Mão: "Ngày Mão không nên đào giếng, mở mạch nước hoặc việc đào sâu.",
  Thìn: "Ngày Thìn không nên khóc lóc, làm tang việc không cần thiết.",
  Tỵ: "Ngày Tỵ không nên đi xa đường thủy hoặc di chuyển thiếu thận trọng.",
  Ngọ: "Ngày Ngọ không nên lợp nhà, sửa mái hoặc việc liên quan mái che khi chưa chọn kỹ.",
  Mùi: "Ngày Mùi không nên dùng thuốc tùy tiện hoặc ăn uống thiếu điều độ.",
  Thân: "Ngày Thân không nên kê giường, chuyển giường hoặc thay đổi chỗ ngủ lớn.",
  Dậu: "Ngày Dậu không nên hội họp đông người khi dễ sinh tranh luận.",
  Tuất: "Ngày Tuất không nên ăn thịt chó hoặc việc sát sinh theo quan niệm dân gian.",
  Hợi: "Ngày Hợi không nên cưới gả vội vàng hoặc đưa sính lễ thiếu cân nhắc.",
};

const DUONG_CONG_KY: Record<number, number[]> = {
  1: [13],
  2: [11],
  3: [9],
  4: [7],
  5: [5],
  6: [3],
  7: [8, 29],
  8: [27],
  9: [25],
  10: [23],
  11: [21],
  12: [19],
};

const LUC_HOP: Record<ChiName, ChiName> = {
  Tý: "Sửu",
  Sửu: "Tý",
  Dần: "Hợi",
  Mão: "Tuất",
  Thìn: "Dậu",
  Tỵ: "Thân",
  Ngọ: "Mùi",
  Mùi: "Ngọ",
  Thân: "Tỵ",
  Dậu: "Thìn",
  Tuất: "Mão",
  Hợi: "Dần",
};

const HAI: Record<ChiName, ChiName> = {
  Tý: "Mùi",
  Sửu: "Ngọ",
  Dần: "Tỵ",
  Mão: "Thìn",
  Thìn: "Mão",
  Tỵ: "Dần",
  Ngọ: "Sửu",
  Mùi: "Tý",
  Thân: "Hợi",
  Dậu: "Tuất",
  Tuất: "Dậu",
  Hợi: "Thân",
};

const TAM_HOP_GROUPS: { branches: ChiName[]; element: string }[] = [
  { branches: ["Thân", "Tý", "Thìn"], element: "Thủy" },
  { branches: ["Dần", "Ngọ", "Tuất"], element: "Hỏa" },
  { branches: ["Hợi", "Mão", "Mùi"], element: "Mộc" },
  { branches: ["Tỵ", "Dậu", "Sửu"], element: "Kim" },
];

const TU_HANH_XUNG_GROUPS: ChiName[][] = [
  ["Tý", "Ngọ", "Mão", "Dậu"],
  ["Thìn", "Tuất", "Sửu", "Mùi"],
  ["Dần", "Thân", "Tỵ", "Hợi"],
];

function unique(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))];
}

export function getTwelveDirect(lunarMonth: number, dayChi: ChiName): DirectInfo {
  const chiIndex = CHI.indexOf(dayChi);
  const directIndex = ((chiIndex - lunarMonth) % 12 + 12) % 12;
  const name = TWELVE_DIRECT_ORDER[directIndex];
  return { name, ...DIRECT_DETAILS[name] };
}

function isLunarMonthLastDay(day: DayInfo): boolean {
  const nextSolar = addDays(day.solar, 1);
  const nextLunar = convertSolar2Lunar(nextSolar.day, nextSolar.month, nextSolar.year);
  return nextLunar.day === 1;
}

export function getSpecialWarnings(day: DayInfo): SpecialWarning[] {
  const warnings: SpecialWarning[] = [];
  const lunarDay = day.lunar.day;
  const lunarMonth = day.lunar.month;

  if ([5, 14, 23].includes(lunarDay)) {
    warnings.push({
      name: "Nguyệt kỵ",
      description: "Dân gian thường kiêng khởi sự việc lớn vào các ngày mùng 5, 14, 23 âm lịch.",
    });
  }

  if ([3, 7, 13, 18, 22, 27].includes(lunarDay)) {
    warnings.push({
      name: "Tam nương",
      description: "Ngày Tam nương thường được xem là ngày nên thận trọng, hạn chế cưới hỏi, khai trương hoặc động thổ.",
    });
  }

  if (DUONG_CONG_KY[lunarMonth]?.includes(lunarDay)) {
    warnings.push({
      name: "Dương Công kỵ nhật",
      description: "Một nhóm ngày kỵ theo lịch dân gian, nên tránh quyết định đại sự nếu không có tư vấn chuyên môn.",
    });
  }

  if (isLunarMonthLastDay(day)) {
    warnings.push({
      name: "Nguyệt tận",
      description: "Ngày cuối tháng âm lịch, phù hợp tổng kết, dọn dẹp, hạn chế mở việc mới quá lớn.",
    });
  }

  return warnings;
}

export function getAgeCompatibility(dayChi: ChiName): AgeCompatibility {
  const tamHopGroup = TAM_HOP_GROUPS.find((group) => group.branches.includes(dayChi)) ?? TAM_HOP_GROUPS[0];
  const xungGroup = TU_HANH_XUNG_GROUPS.find((group) => group.includes(dayChi)) ?? [];

  return {
    lucHop: LUC_HOP[dayChi],
    tamHop: tamHopGroup.branches.filter((branch) => branch !== dayChi),
    xung: xungGroup.filter((branch) => branch !== dayChi),
    hai: HAI[dayChi],
    tamHopElement: tamHopGroup.element,
  };
}

export function getGoodBadDetails(day: DayInfo): GoodBadDetails {
  const twelveDirect = getTwelveDirect(day.lunar.month, day.canChi.dayChi);
  const specialWarnings = getSpecialWarnings(day);
  const banhTo = [BACH_KY_CAN[day.canChi.dayCan], BACH_KY_CHI[day.canChi.dayChi]];

  let score = day.quality.type === "good" ? 2 : -2;
  if (twelveDirect.tone === "good") score += 1;
  if (twelveDirect.tone === "bad") score -= 1;
  score -= specialWarnings.length;

  const overallType: OverallDayType = score >= 2 ? "good" : score >= 0 ? "neutral" : "bad";
  const overallLabel = overallType === "good" ? "Ngày tốt" : overallType === "neutral" ? "Ngày trung bình" : "Ngày xấu";
  const warningText = specialWarnings.length > 0 ? ` Tuy nhiên ngày này có ${specialWarnings.map((item) => item.name).join(", ")}, nên cân nhắc kỹ trước việc lớn.` : "";

  const overallSummary =
    overallType === "good"
      ? `Ngày có nhiều yếu tố cát lợi để tham khảo, gồm ${day.quality.label} và Trực ${twelveDirect.name}.${warningText}`
      : overallType === "neutral"
        ? `Ngày có cả yếu tố tốt và yếu tố cần thận trọng. Nên ưu tiên việc vừa phải, chuẩn bị kỹ giấy tờ, thời gian và người liên quan.${warningText}`
        : `Ngày có nhiều dấu hiệu nên thận trọng. Nếu là việc hệ trọng, bạn nên chọn ngày khác hoặc hỏi thêm người có chuyên môn.${warningText}`;

  const shouldDo = unique([
    ...(day.quality.type === "good" ? ["Xuất hành, gặp gỡ, làm việc cần sự hanh thông", "Sắp xếp việc quan trọng ở khung giờ hoàng đạo"] : ["Việc nhỏ, việc nội bộ, rà soát kế hoạch"]),
    ...twelveDirect.goodFor,
  ]).slice(0, 8);

  const shouldAvoid = unique([
    ...(day.quality.type === "bad" ? ["Khai trương, cưới hỏi, động thổ khi chưa xem xét thêm", "Quyết định tài chính lớn trong lúc vội vàng"] : []),
    ...specialWarnings.map((warning) => `${warning.name}: hạn chế đại sự`),
    ...twelveDirect.avoid,
    ...banhTo,
  ]).slice(0, 10);

  return {
    score,
    overallType,
    overallLabel,
    overallSummary,
    twelveDirect,
    specialWarnings,
    banhTo,
    shouldDo,
    shouldAvoid,
    ageCompatibility: getAgeCompatibility(day.canChi.dayChi),
  };
}

export function getCanChiIndex(text: string): number {
  const [can, chi] = text.split(" ");
  const canIndex = CAN.indexOf(can as CanName);
  const chiIndex = CHI.indexOf(chi as ChiName);
  if (canIndex < 0 || chiIndex < 0) return -1;
  return canIndex * 12 + chiIndex;
}
