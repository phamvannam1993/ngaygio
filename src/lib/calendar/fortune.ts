import { formatDisplayDate, getVietnamTodayParts, type DateParts } from "@/lib/date";
import { CHI } from "./can-chi";
import { getAgeCompatibility, getGoodBadDetails } from "./good-bad";
import { getDayInfo } from "./service";
import type { ChiName, HourInfo } from "./types";
import { ZODIAC_BY_CHI } from "./zodiac";

export type FortuneTone = "good" | "neutral" | "careful";

export type FortuneCategory = {
  key: "work" | "money" | "love" | "health";
  label: string;
  score: number;
  summary: string;
};

export type ZodiacFortuneProfile = {
  chi: ChiName;
  slug: string;
  animal: string;
  title: string;
  shortTitle: string;
  description: string;
};

export type DailyFortune = ZodiacFortuneProfile & {
  date: DateParts;
  dateLabel: string;
  dayCanChi: string;
  lunarLabel: string;
  relationLabel: string;
  relationNote: string;
  tone: FortuneTone;
  score: number;
  headline: string;
  overview: string;
  categories: FortuneCategory[];
  luckyColor: string;
  luckyNumber: number;
  goodHours: HourInfo[];
  compatibleToday: string[];
  carefulToday: string[];
  shouldDo: string[];
  shouldAvoid: string[];
};

const ZODIAC_SLUG_BY_CHI: Record<ChiName, string> = {
  Tý: "ty",
  Sửu: "suu",
  Dần: "dan",
  Mão: "mao",
  Thìn: "thin",
  Tỵ: "ti",
  Ngọ: "ngo",
  Mùi: "mui",
  Thân: "than",
  Dậu: "dau",
  Tuất: "tuat",
  Hợi: "hoi",
};

export const ZODIAC_FORTUNES: ZodiacFortuneProfile[] = CHI.map((chi) => {
  const zodiac = ZODIAC_BY_CHI[chi];
  return {
    chi,
    slug: ZODIAC_SLUG_BY_CHI[chi],
    animal: zodiac.animal,
    title: `Tử vi tuổi ${chi} hôm nay`,
    shortTitle: `Tuổi ${chi}`,
    description: zodiac.description,
  };
});

const PROFILE_BY_SLUG = new Map(ZODIAC_FORTUNES.map((item) => [item.slug, item]));
const PROFILE_BY_CHI = new Map(ZODIAC_FORTUNES.map((item) => [item.chi, item]));

const COLORS = ["xanh lá", "vàng ấm", "nâu đất", "trắng ngà", "xanh dương", "đỏ trầm", "cam đất", "tím nhạt", "ghi bạc", "xanh ngọc"];

const GOOD_HEADLINES = [
  "Vận khí khá sáng, thuận để xử lý việc quan trọng vừa sức.",
  "Ngày có nhiều tín hiệu tích cực, hợp với sự chủ động và rõ ràng.",
  "Hôm nay dễ mở ra cơ hội nhỏ nhưng có ích nếu biết nắm bắt đúng lúc.",
];

const NEUTRAL_HEADLINES = [
  "Ngày ở mức bình hòa, càng chuẩn bị kỹ càng dễ giữ nhịp ổn định.",
  "Vận trình không quá mạnh nhưng phù hợp để hoàn thiện việc đang dang dở.",
  "Hôm nay nên đi chậm, chắc và ưu tiên những việc có kế hoạch rõ ràng.",
];

const CAREFUL_HEADLINES = [
  "Ngày cần tiết chế nóng vội, tránh quyết định lớn khi thông tin chưa đủ.",
  "Vận khí có điểm phải thận trọng, nên chọn cách mềm mỏng và an toàn.",
  "Hôm nay nên ưu tiên giữ ổn định, hạn chế tranh luận hoặc mạo hiểm tài chính.",
];

function seedNumber(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash >>> 0);
}

function pick<T>(items: readonly T[], seed: number, offset = 0): T {
  return items[(seed + offset) % items.length];
}

function clamp(value: number, min = 35, max = 96): number {
  return Math.max(min, Math.min(max, Math.round(value)));
}

function branchRelation(birthChi: ChiName, dayChi: ChiName) {
  const compatibility = getAgeCompatibility(birthChi);
  if (birthChi === dayChi) {
    return {
      points: 7,
      label: "Đồng khí",
      note: `Ngày ${dayChi} cùng địa chi với tuổi ${birthChi}, hợp với việc quen thuộc, củng cố việc đang làm.`,
    };
  }
  if (compatibility.lucHop === dayChi) {
    return {
      points: 18,
      label: "Lục hợp",
      note: `Ngày ${dayChi} lục hợp với tuổi ${birthChi}, dễ có sự hỗ trợ, hòa khí và kết nối tốt.`,
    };
  }
  if (compatibility.tamHop.includes(dayChi)) {
    return {
      points: 14,
      label: `Tam hợp ${compatibility.tamHopElement}`,
      note: `Ngày ${dayChi} nằm trong nhóm tam hợp với tuổi ${birthChi}, thuận cho hợp tác và mở rộng việc đang có.`,
    };
  }
  if (compatibility.xung.includes(dayChi)) {
    return {
      points: -18,
      label: "Tứ hành xung",
      note: `Ngày ${dayChi} thuộc nhóm xung với tuổi ${birthChi}, nên thận trọng lời nói, giấy tờ và quyết định vội.`,
    };
  }
  if (compatibility.hai === dayChi) {
    return {
      points: -12,
      label: "Lục hại",
      note: `Ngày ${dayChi} có yếu tố hại với tuổi ${birthChi}, nên giữ an toàn, tránh cả tin hoặc hứa quá nhanh.`,
    };
  }
  return {
    points: 2,
    label: "Bình hòa",
    note: `Ngày ${dayChi} bình hòa với tuổi ${birthChi}; kết quả phụ thuộc nhiều vào sự chuẩn bị và cách ứng xử.`,
  };
}

function toneFromScore(score: number): FortuneTone {
  if (score >= 74) return "good";
  if (score >= 58) return "neutral";
  return "careful";
}

function categorySummary(label: string, score: number, chi: ChiName): string {
  if (score >= 76) return `${label} của tuổi ${chi} có điểm sáng, nên tận dụng để xử lý việc cần sự chủ động.`;
  if (score >= 60) return `${label} của tuổi ${chi} khá ổn, hợp với cách làm đều đặn và giữ lời hứa.`;
  return `${label} của tuổi ${chi} cần chậm lại, tránh nóng vội hoặc kỳ vọng quá cao trong hôm nay.`;
}

export function fortuneHref(slug: string): string {
  return `/tu-vi-tuoi-${slug}-hom-nay`;
}

export function getFortuneProfileBySlug(slug: string): ZodiacFortuneProfile | null {
  return PROFILE_BY_SLUG.get(slug) ?? null;
}

export function getFortuneProfileByChi(chi: ChiName): ZodiacFortuneProfile {
  return PROFILE_BY_CHI.get(chi) ?? ZODIAC_FORTUNES[0];
}

export function getDailyFortune(chi: ChiName, date: DateParts = getVietnamTodayParts()): DailyFortune {
  const profile = getFortuneProfileByChi(chi);
  const day = getDayInfo(date);
  const details = getGoodBadDetails(day);
  const relation = branchRelation(chi, day.canChi.dayChi);
  const seed = seedNumber(`${date.year}-${date.month}-${date.day}-${chi}-${day.canChi.day}`);

  const dayQualityPoints = day.quality.type === "good" ? 8 : -7;
  const directPoints = details.twelveDirect.tone === "good" ? 6 : details.twelveDirect.tone === "bad" ? -7 : 1;
  const warningPenalty = details.specialWarnings.length * 4;
  const seedBalance = (seed % 9) - 4;
  const score = clamp(62 + relation.points + dayQualityPoints + directPoints - warningPenalty + seedBalance);
  const tone = toneFromScore(score);
  const headline = tone === "good" ? pick(GOOD_HEADLINES, seed) : tone === "neutral" ? pick(NEUTRAL_HEADLINES, seed) : pick(CAREFUL_HEADLINES, seed);

  const work = clamp(score + ((seed >> 1) % 11) - 5);
  const money = clamp(score + ((seed >> 3) % 13) - 7);
  const love = clamp(score + ((seed >> 5) % 11) - 4);
  const health = clamp(score + ((seed >> 7) % 9) - 5);
  const compatibility = getAgeCompatibility(chi);
  const todayCompatibility = getAgeCompatibility(day.canChi.dayChi);

  return {
    ...profile,
    date,
    dateLabel: formatDisplayDate(date),
    dayCanChi: day.canChi.day,
    lunarLabel: `${day.lunar.day}/${day.lunar.month}${day.lunar.isLeap ? " nhuận" : ""}/${day.lunar.year}`,
    relationLabel: relation.label,
    relationNote: relation.note,
    tone,
    score,
    headline,
    overview: `${headline} Xét theo ngày ${day.canChi.day} (${day.quality.label}, Trực ${details.twelveDirect.name}), tuổi ${chi} đang ở trạng thái ${relation.label.toLowerCase()}. Thông tin này nên dùng như gợi ý văn hóa dân gian để tham khảo, không thay thế quyết định thực tế.`,
    categories: [
      { key: "work", label: "Công việc", score: work, summary: categorySummary("Công việc", work, chi) },
      { key: "money", label: "Tài lộc", score: money, summary: categorySummary("Tài lộc", money, chi) },
      { key: "love", label: "Tình cảm", score: love, summary: categorySummary("Tình cảm", love, chi) },
      { key: "health", label: "Sức khỏe", score: health, summary: categorySummary("Sức khỏe", health, chi) },
    ],
    luckyColor: pick(COLORS, seed, CHI.indexOf(chi)),
    luckyNumber: ((seed + CHI.indexOf(chi) * 3) % 9) + 1,
    goodHours: day.goodHours,
    compatibleToday: [...new Set([todayCompatibility.lucHop, ...todayCompatibility.tamHop])],
    carefulToday: [...new Set([...compatibility.xung, compatibility.hai])],
    shouldDo: [
      "Ưu tiên việc đã có kế hoạch rõ ràng, tránh ôm quá nhiều đầu việc cùng lúc.",
      "Sắp xếp việc quan trọng vào khung giờ hoàng đạo nếu cần thêm sự an tâm.",
      score >= 72 ? "Có thể chủ động gặp gỡ, trao đổi hoặc hoàn thiện thỏa thuận nhỏ." : "Nên rà soát kỹ giấy tờ, lịch hẹn và lời hứa trước khi quyết định.",
    ],
    shouldAvoid: [
      "Không nên xem tử vi như kết luận tuyệt đối cho tài chính, sức khỏe hoặc pháp lý.",
      relation.points < 0 ? "Hạn chế tranh luận căng thẳng, nhất là với người có quan điểm trái chiều." : "Tránh chủ quan vì ngày có điểm thuận vẫn cần chuẩn bị kỹ.",
      details.specialWarnings.length > 0 ? `Lưu ý ${details.specialWarnings.map((item) => item.name).join(", ")}, hạn chế đại sự nếu chưa thật chắc.` : "Không nên vội thay đổi kế hoạch lớn chỉ vì một tín hiệu nhỏ.",
    ],
  };
}

export function getAllDailyFortunes(date: DateParts = getVietnamTodayParts()): DailyFortune[] {
  return ZODIAC_FORTUNES.map((profile) => getDailyFortune(profile.chi, date));
}
