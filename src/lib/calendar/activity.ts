import { addDays, formatDateKey, type DateParts } from "@/lib/date";
import { getYearCanChi, type CanName } from "./can-chi";
import { getGoodBadDetails, getSpecialWarnings, type TwelveDirectName } from "./good-bad";
import { convertLunar2Solar } from "./lunar";
import { getDayInfo } from "./service";
import type { ChiName, DayInfo } from "./types";

export type ActivitySlug =
  | "khai-truong"
  | "cuoi-hoi"
  | "dong-tho"
  | "nhap-trach"
  | "mua-xe"
  | "ky-hop-dong"
  | "xuat-hanh"
  | "cat-toc"
  | "chuyen-nha"
  | "dat-ban-tho";

export type ActivityConfig = {
  slug: ActivitySlug;
  title: string;
  shortTitle: string;
  icon: string;
  description: string;
  seoKeyword: string;
  goodDirects: TwelveDirectName[];
  avoidDirects: TwelveDirectName[];
  preferredQuality: "good" | "any";
  goodForWords: string[];
  avoidWarnings: string[];
};

export type DirectionInfo = {
  hyThan: string;
  taiThan: string;
  hacThan: string;
  note: string;
};

export type DayStars = {
  goodStars: string[];
  badStars: string[];
};

export type DayScoreBreakdown = {
  label: string;
  points: number;
  tone: "good" | "bad" | "neutral";
};

export type ActivityRecommendation = {
  activity: ActivityConfig;
  day: DayInfo;
  score: number;
  level: "excellent" | "good" | "ok" | "avoid";
  label: string;
  summary: string;
  reasons: string[];
  cautions: string[];
  breakdown: DayScoreBreakdown[];
  directions: DirectionInfo;
  stars: DayStars;
  birthYear?: number;
  birthCanChi?: string;
  birthChi?: ChiName;
  ageNote?: string;
};

export type CountdownEvent = {
  slug: string;
  title: string;
  date: DateParts;
  dateType: "solar" | "lunar";
  icon: string;
  note: string;
  href: string;
};

export const ACTIVITIES: ActivityConfig[] = [
  {
    slug: "khai-truong",
    title: "Xem ngày tốt khai trương",
    shortTitle: "Khai trương",
    icon: "🏮",
    description: "Chọn ngày mở cửa, mở hàng, ra mắt cửa hàng hoặc khởi sự kinh doanh.",
    seoKeyword: "xem ngày tốt khai trương",
    goodDirects: ["Khai", "Thành", "Mãn", "Định"],
    avoidDirects: ["Phá", "Bế", "Nguy"],
    preferredQuality: "good",
    goodForWords: ["Khai trương", "Mở hàng", "Cầu tài", "Ký kết", "Xuất hành"],
    avoidWarnings: ["Tam nương", "Nguyệt kỵ", "Dương Công kỵ nhật"],
  },
  {
    slug: "cuoi-hoi",
    title: "Xem ngày tốt cưới hỏi",
    shortTitle: "Cưới hỏi",
    icon: "💍",
    description: "Tìm ngày phù hợp cho ăn hỏi, lễ cưới, đăng ký kết hôn hoặc gặp mặt hai họ.",
    seoKeyword: "xem ngày tốt cưới hỏi",
    goodDirects: ["Thành", "Định", "Mãn", "Khai"],
    avoidDirects: ["Phá", "Bế", "Nguy", "Trừ"],
    preferredQuality: "good",
    goodForWords: ["Cưới hỏi", "Gặp gỡ", "Ký kết", "Cầu phúc"],
    avoidWarnings: ["Tam nương", "Nguyệt kỵ", "Dương Công kỵ nhật", "Nguyệt tận"],
  },
  {
    slug: "dong-tho",
    title: "Xem ngày tốt động thổ",
    shortTitle: "Động thổ",
    icon: "🏗️",
    description: "Lọc ngày hợp để động thổ, khởi công, sửa chữa hoặc bắt đầu xây dựng.",
    seoKeyword: "xem ngày tốt động thổ",
    goodDirects: ["Thành", "Định", "Khai", "Mãn"],
    avoidDirects: ["Phá", "Nguy", "Bế"],
    preferredQuality: "good",
    goodForWords: ["Động thổ", "Khởi công", "Sửa sang", "Lập kế hoạch"],
    avoidWarnings: ["Tam nương", "Nguyệt kỵ", "Dương Công kỵ nhật"],
  },
  {
    slug: "nhap-trach",
    title: "Xem ngày tốt nhập trạch",
    shortTitle: "Nhập trạch",
    icon: "🏠",
    description: "Chọn ngày vào nhà mới, an cư, chuyển đồ chính hoặc làm lễ nhập trạch.",
    seoKeyword: "xem ngày tốt nhập trạch",
    goodDirects: ["Định", "Thành", "Khai", "Mãn"],
    avoidDirects: ["Phá", "Bế", "Nguy"],
    preferredQuality: "good",
    goodForWords: ["Nhập trạch", "An vị", "Sắp xếp nhà cửa", "Cầu an"],
    avoidWarnings: ["Tam nương", "Nguyệt kỵ", "Nguyệt tận"],
  },
  {
    slug: "mua-xe",
    title: "Xem ngày tốt mua xe",
    shortTitle: "Mua xe",
    icon: "🚗",
    description: "Tìm ngày đẹp để nhận xe, mua xe, đăng ký xe hoặc xuất hành chuyến đầu.",
    seoKeyword: "xem ngày tốt mua xe",
    goodDirects: ["Thành", "Khai", "Mãn", "Thu"],
    avoidDirects: ["Phá", "Nguy", "Bế"],
    preferredQuality: "good",
    goodForWords: ["Mua sắm", "Xuất hành", "Cầu tài", "Nhận tài sản"],
    avoidWarnings: ["Tam nương", "Nguyệt kỵ"],
  },
  {
    slug: "ky-hop-dong",
    title: "Xem ngày tốt ký hợp đồng",
    shortTitle: "Ký hợp đồng",
    icon: "🖋️",
    description: "Chọn ngày ký kết, thỏa thuận, nộp hồ sơ hoặc chốt giao dịch quan trọng.",
    seoKeyword: "xem ngày tốt ký hợp đồng",
    goodDirects: ["Định", "Thành", "Khai", "Thu"],
    avoidDirects: ["Phá", "Bế", "Nguy"],
    preferredQuality: "good",
    goodForWords: ["Ký kết", "Thỏa thuận", "Nộp hồ sơ", "Gặp gỡ"],
    avoidWarnings: ["Tam nương", "Nguyệt kỵ", "Dương Công kỵ nhật"],
  },
  {
    slug: "xuat-hanh",
    title: "Xem ngày tốt xuất hành",
    shortTitle: "Xuất hành",
    icon: "🧭",
    description: "Tra ngày và giờ thuận để đi xa, đi công việc, du lịch hoặc mở đầu hành trình.",
    seoKeyword: "xem ngày tốt xuất hành",
    goodDirects: ["Khai", "Thành", "Mãn", "Kiến"],
    avoidDirects: ["Nguy", "Bế"],
    preferredQuality: "good",
    goodForWords: ["Xuất hành", "Gặp gỡ", "Cầu tài", "Đi xa"],
    avoidWarnings: ["Nguyệt kỵ", "Dương Công kỵ nhật"],
  },
  {
    slug: "cat-toc",
    title: "Xem ngày tốt cắt tóc",
    shortTitle: "Cắt tóc",
    icon: "✂️",
    description: "Gợi ý ngày nhẹ nhàng để cắt tóc, làm đẹp, thay đổi diện mạo hoặc chăm sóc bản thân.",
    seoKeyword: "xem ngày tốt cắt tóc",
    goodDirects: ["Trừ", "Khai", "Thành", "Bình"],
    avoidDirects: ["Nguy", "Bế", "Phá"],
    preferredQuality: "any",
    goodForWords: ["Làm đẹp", "Dọn dẹp", "Làm mới", "Việc cá nhân"],
    avoidWarnings: ["Nguyệt kỵ"],
  },
  {
    slug: "chuyen-nha",
    title: "Xem ngày tốt chuyển nhà",
    shortTitle: "Chuyển nhà",
    icon: "📦",
    description: "Tìm ngày phù hợp để chuyển nhà, chuyển văn phòng, sắp xếp nơi ở mới.",
    seoKeyword: "xem ngày tốt chuyển nhà",
    goodDirects: ["Định", "Thành", "Khai", "Trừ"],
    avoidDirects: ["Phá", "Bế", "Nguy"],
    preferredQuality: "good",
    goodForWords: ["Nhập trạch", "Sắp xếp nhà cửa", "Dọn dẹp", "Cầu an"],
    avoidWarnings: ["Tam nương", "Nguyệt kỵ", "Nguyệt tận"],
  },
  {
    slug: "dat-ban-tho",
    title: "Xem ngày tốt đặt bàn thờ",
    shortTitle: "Đặt bàn thờ",
    icon: "🪔",
    description: "Gợi ý ngày an vị, đặt bàn thờ, sửa soạn không gian thờ cúng theo phong tục.",
    seoKeyword: "xem ngày tốt đặt bàn thờ",
    goodDirects: ["Định", "Thành", "Khai", "Trừ"],
    avoidDirects: ["Phá", "Bế", "Nguy"],
    preferredQuality: "good",
    goodForWords: ["An vị bàn thờ", "Cầu an", "Dọn dẹp", "Sửa sang"],
    avoidWarnings: ["Tam nương", "Nguyệt kỵ", "Dương Công kỵ nhật"],
  },
];

const HY_THAN_BY_CAN: Record<CanName, string> = {
  Giáp: "Đông Bắc",
  Ất: "Tây Bắc",
  Bính: "Tây Nam",
  Đinh: "Chính Nam",
  Mậu: "Đông Nam",
  Kỷ: "Đông Bắc",
  Canh: "Tây Bắc",
  Tân: "Tây Nam",
  Nhâm: "Chính Nam",
  Quý: "Đông Nam",
};

const TAI_THAN_BY_CAN: Record<CanName, string> = {
  Giáp: "Đông Nam",
  Ất: "Đông Nam",
  Bính: "Chính Tây",
  Đinh: "Chính Tây",
  Mậu: "Chính Bắc",
  Kỷ: "Chính Bắc",
  Canh: "Chính Đông",
  Tân: "Chính Đông",
  Nhâm: "Chính Nam",
  Quý: "Chính Nam",
};

const HAC_THAN_BY_CAN: Record<CanName, string> = {
  Giáp: "Đông Nam",
  Ất: "Đông Nam",
  Bính: "Chính Bắc",
  Đinh: "Chính Bắc",
  Mậu: "Tây Nam",
  Kỷ: "Tây Nam",
  Canh: "Chính Đông",
  Tân: "Chính Đông",
  Nhâm: "Đông Bắc",
  Quý: "Đông Bắc",
};

const GOOD_STAR_POOL = [
  "Thiên Đức",
  "Nguyệt Đức",
  "Thiên Hỷ",
  "Sinh Khí",
  "Minh Đường",
  "Kim Quỹ",
  "Ngọc Đường",
  "Phúc Sinh",
  "Thiên Quý",
  "Lộc Mã",
  "Ích Hậu",
  "Tam Hợp",
];

const BAD_STAR_POOL = [
  "Thiên Hình",
  "Chu Tước",
  "Cô Thần",
  "Ngũ Quỷ",
  "Địa Phá",
  "Hoang Vu",
  "Không Phòng",
  "Sát Chủ",
  "Thiên Cẩu",
  "Bạch Hổ",
  "Huyền Vũ",
  "Tiểu Hao",
];

function mod(value: number, base: number) {
  return ((value % base) + base) % base;
}

function unique<T>(values: T[]): T[] {
  return [...new Set(values)];
}

export function getActivity(slug?: string | null): ActivityConfig {
  return ACTIVITIES.find((item) => item.slug === slug) ?? ACTIVITIES[0];
}

export function isActivitySlug(value: string): value is ActivitySlug {
  return ACTIVITIES.some((item) => item.slug === value);
}

export function activityHref(slug: ActivitySlug): string {
  return `/xem-ngay-tot/${slug}`;
}

export function activityKeywordHref(slug: ActivitySlug): string {
  return `/xem-ngay-tot-${slug}`;
}

export function getDirectionInfo(day: DayInfo): DirectionInfo {
  return {
    hyThan: HY_THAN_BY_CAN[day.canChi.dayCan],
    taiThan: TAI_THAN_BY_CAN[day.canChi.dayCan],
    hacThan: HAC_THAN_BY_CAN[day.canChi.dayCan],
    note: "Hướng xuất hành chỉ mang tính tham khảo theo lịch dân gian; nên ưu tiên an toàn, thời tiết và điều kiện thực tế.",
  };
}

export function getDayStars(day: DayInfo): DayStars {
  const seed = day.lunar.jd + day.lunar.month * 7 + day.solar.day;
  const goodStars = [0, 3, 7, 10]
    .map((offset) => GOOD_STAR_POOL[mod(seed + offset, GOOD_STAR_POOL.length)]);
  const badStars = [1, 4, 8]
    .map((offset) => BAD_STAR_POOL[mod(seed + offset, BAD_STAR_POOL.length)]);

  if (day.quality.type === "good") {
    goodStars.unshift(day.quality.label);
  } else {
    badStars.unshift(day.quality.label);
  }

  return {
    goodStars: unique(goodStars).slice(0, 5),
    badStars: unique(badStars).slice(0, 4),
  };
}

function getBirthChi(birthYear?: number): { chi?: ChiName; text?: string } {
  if (!birthYear || !Number.isInteger(birthYear) || birthYear < 1800 || birthYear > 2199) return {};
  const canChi = getYearCanChi(birthYear);
  return { chi: canChi.chi, text: canChi.text };
}

export function getDayScore100(day: DayInfo, activity = ACTIVITIES[0], birthYear?: number): { score: number; breakdown: DayScoreBreakdown[]; ageNote?: string; birthCanChi?: string; birthChi?: ChiName } {
  const details = getGoodBadDetails(day);
  const warnings = getSpecialWarnings(day);
  const birth = getBirthChi(birthYear);
  const breakdown: DayScoreBreakdown[] = [];
  let score = 50;

  const add = (label: string, points: number, tone: DayScoreBreakdown["tone"]) => {
    score += points;
    breakdown.push({ label, points, tone });
  };

  if (day.quality.type === "good") add("Ngày Hoàng Đạo", 18, "good");
  else add("Ngày Hắc Đạo", -18, "bad");

  if (activity.goodDirects.includes(details.twelveDirect.name)) add(`Trực ${details.twelveDirect.name} hợp với ${activity.shortTitle.toLowerCase()}`, 18, "good");
  else if (activity.avoidDirects.includes(details.twelveDirect.name)) add(`Trực ${details.twelveDirect.name} nên tránh cho ${activity.shortTitle.toLowerCase()}`, -22, "bad");
  else add(`Trực ${details.twelveDirect.name} ở mức trung tính`, 3, "neutral");

  const avoidWarnings = warnings.filter((warning) => activity.avoidWarnings.includes(warning.name));
  avoidWarnings.forEach((warning) => add(`Phạm ${warning.name}`, -14, "bad"));
  warnings.filter((warning) => !activity.avoidWarnings.includes(warning.name)).forEach((warning) => add(`Có ${warning.name}`, -7, "bad"));

  if (day.goodHours.length >= 6) add("Có đủ 6 khung giờ hoàng đạo", 8, "good");

  const shouldText = [...details.shouldDo, ...details.twelveDirect.goodFor].join(" ").toLowerCase();
  if (activity.goodForWords.some((word) => shouldText.includes(word.toLowerCase()))) {
    add(`Có việc nên làm liên quan ${activity.shortTitle.toLowerCase()}`, 10, "good");
  }

  let ageNote: string | undefined;
  if (birth.chi && birth.text) {
    if (details.ageCompatibility.xung.includes(birth.chi) || details.ageCompatibility.hai === birth.chi) {
      add(`Tuổi ${birth.text} xung/hại với ngày ${day.canChi.day}`, -18, "bad");
      ageNote = `Tuổi ${birth.text} nên cân nhắc thêm vì có dấu hiệu xung/hại với chi ngày ${day.canChi.dayChi}.`;
    } else if (details.ageCompatibility.lucHop === birth.chi || details.ageCompatibility.tamHop.includes(birth.chi)) {
      add(`Tuổi ${birth.text} hợp với ngày ${day.canChi.day}`, 14, "good");
      ageNote = `Tuổi ${birth.text} có dấu hiệu hợp với chi ngày ${day.canChi.dayChi}.`;
    } else {
      add(`Tuổi ${birth.text} không xung mạnh với ngày`, 4, "neutral");
      ageNote = `Tuổi ${birth.text} không nằm trong nhóm xung/hại mạnh theo chi ngày.`;
    }
  }

  return {
    score: Math.max(0, Math.min(100, Math.round(score))),
    breakdown,
    ageNote,
    birthCanChi: birth.text,
    birthChi: birth.chi,
  };
}

export function getActivityRecommendation(day: DayInfo, activitySlug?: string | null, birthYear?: number): ActivityRecommendation {
  const activity = getActivity(activitySlug);
  const scoreData = getDayScore100(day, activity, birthYear);
  const details = getGoodBadDetails(day);
  const directions = getDirectionInfo(day);
  const stars = getDayStars(day);

  const level: ActivityRecommendation["level"] =
    scoreData.score >= 82 ? "excellent" : scoreData.score >= 68 ? "good" : scoreData.score >= 50 ? "ok" : "avoid";
  const label = level === "excellent" ? "Rất nên tham khảo" : level === "good" ? "Khá tốt" : level === "ok" ? "Cân nhắc" : "Nên tránh";

  const reasons = unique([
    ...scoreData.breakdown.filter((item) => item.tone === "good").map((item) => item.label),
    `Giờ hoàng đạo: ${day.goodHours.map((hour) => `${hour.branch} ${hour.range}`).join(", ")}`,
  ]).slice(0, 6);

  const cautions = unique([
    ...scoreData.breakdown.filter((item) => item.tone === "bad").map((item) => item.label),
    ...details.specialWarnings.map((warning) => `${warning.name}: ${warning.description}`),
  ]).slice(0, 6);

  const summary =
    level === "excellent"
      ? `Ngày này đạt ${scoreData.score}/100 cho việc ${activity.shortTitle.toLowerCase()}, có nhiều yếu tố thuận để tham khảo.`
      : level === "good"
        ? `Ngày này đạt ${scoreData.score}/100 cho việc ${activity.shortTitle.toLowerCase()}, có thể cân nhắc nếu lịch trình phù hợp.`
        : level === "ok"
          ? `Ngày này đạt ${scoreData.score}/100, nên kiểm tra thêm tuổi, giờ và điều kiện thực tế trước khi chốt.`
          : `Ngày này chỉ đạt ${scoreData.score}/100 cho việc ${activity.shortTitle.toLowerCase()}, nên tìm ngày khác đẹp hơn.`;

  return {
    activity,
    day,
    score: scoreData.score,
    level,
    label,
    summary,
    reasons,
    cautions,
    breakdown: scoreData.breakdown,
    directions,
    stars,
    birthYear,
    birthCanChi: scoreData.birthCanChi,
    birthChi: scoreData.birthChi,
    ageNote: scoreData.ageNote,
  };
}

export function searchGoodDates(opts: { activitySlug?: string | null; from: DateParts; to: DateParts; birthYear?: number; limit?: number }): ActivityRecommendation[] {
  const limit = opts.limit ?? 12;
  const results: ActivityRecommendation[] = [];
  const fromTime = Date.UTC(opts.from.year, opts.from.month - 1, opts.from.day);
  const toTime = Date.UTC(opts.to.year, opts.to.month - 1, opts.to.day);
  const maxSpan = 370;
  let cursor = opts.from;
  let count = 0;

  while (Date.UTC(cursor.year, cursor.month - 1, cursor.day) <= toTime && count < maxSpan) {
    if (Date.UTC(cursor.year, cursor.month - 1, cursor.day) >= fromTime) {
      const day = getDayInfo(cursor);
      const recommendation = getActivityRecommendation(day, opts.activitySlug, opts.birthYear);
      if (recommendation.score >= 50) results.push(recommendation);
    }
    cursor = addDays(cursor, 1);
    count += 1;
  }

  return results
    .sort((a, b) => b.score - a.score || a.day.lunar.jd - b.day.lunar.jd)
    .slice(0, limit);
}

export function getCurrentMonthRange(today: DateParts): { from: DateParts; to: DateParts } {
  const nextMonth = today.month === 12 ? { year: today.year + 1, month: 1 } : { year: today.year, month: today.month + 1 };
  const lastDay = addDays({ ...nextMonth, day: 1 }, -1);
  return { from: { year: today.year, month: today.month, day: 1 }, to: lastDay };
}

export function getCountdownEvents(year: number): CountdownEvent[] {
  const events: CountdownEvent[] = [];
  const add = (event: CountdownEvent | null) => {
    if (event) events.push(event);
  };

  add({ slug: "tet-duong-lich", title: "Tết Dương lịch", date: { year, month: 1, day: 1 }, dateType: "solar", icon: "🎆", note: "Ngày đầu năm dương lịch.", href: `/dem-ngay?to=${year}-01-01` });
  add({ slug: "ngay-30-4", title: "Ngày 30/4", date: { year, month: 4, day: 30 }, dateType: "solar", icon: "🇻🇳", note: "Ngày Giải phóng miền Nam.", href: `/dem-ngay?to=${year}-04-30` });
  add({ slug: "quoc-khanh", title: "Quốc khánh 2/9", date: { year, month: 9, day: 2 }, dateType: "solar", icon: "⭐", note: "Ngày Quốc khánh Việt Nam.", href: `/dem-ngay?to=${year}-09-02` });
  add({ slug: "noel", title: "Noel", date: { year, month: 12, day: 25 }, dateType: "solar", icon: "🎄", note: "Lễ Giáng sinh.", href: `/dem-ngay?to=${year}-12-25` });

  const lunarEvents: Array<{ slug: string; title: string; lunarDay: number; lunarMonth: number; icon: string; note: string }> = [
    { slug: "ong-cong-ong-tao", title: "Ông Công Ông Táo", lunarDay: 23, lunarMonth: 12, icon: "🔥", note: "Ngày 23 tháng Chạp âm lịch." },
    { slug: "tet-nguyen-dan", title: "Tết Nguyên Đán", lunarDay: 1, lunarMonth: 1, icon: "🧧", note: "Mùng 1 Tết âm lịch." },
    { slug: "than-tai", title: "Vía Thần Tài", lunarDay: 10, lunarMonth: 1, icon: "💰", note: "Mùng 10 tháng Giêng âm lịch." },
    { slug: "gio-to-hung-vuong", title: "Giỗ Tổ Hùng Vương", lunarDay: 10, lunarMonth: 3, icon: "🏛️", note: "Mùng 10 tháng 3 âm lịch." },
    { slug: "vu-lan", title: "Vu Lan", lunarDay: 15, lunarMonth: 7, icon: "🌕", note: "Rằm tháng 7 âm lịch." },
    { slug: "trung-thu", title: "Trung thu", lunarDay: 15, lunarMonth: 8, icon: "🏮", note: "Rằm tháng 8 âm lịch." },
  ];

  lunarEvents.forEach((item) => {
    const date = convertLunar2Solar(item.lunarDay, item.lunarMonth, year, false);
    if (!date) return;
    add({
      slug: item.slug,
      title: item.title,
      date,
      dateType: "lunar",
      icon: item.icon,
      note: item.note,
      href: `/dem-ngay?to=${dateToIso(date)}`,
    });
  });

  return events.sort((a, b) => Date.UTC(a.date.year, a.date.month - 1, a.date.day) - Date.UTC(b.date.year, b.date.month - 1, b.date.day));
}

export function getGeneralDayScore100(day: DayInfo): { score: number; breakdown: DayScoreBreakdown[]; label: string } {
  const details = getGoodBadDetails(day);
  const breakdown: DayScoreBreakdown[] = [];
  let score = 50;
  const add = (label: string, points: number, tone: DayScoreBreakdown["tone"]) => {
    score += points;
    breakdown.push({ label, points, tone });
  };

  if (day.quality.type === "good") add("Ngày Hoàng Đạo", 22, "good");
  else add("Ngày Hắc Đạo", -22, "bad");

  if (details.twelveDirect.tone === "good") add(`Trực ${details.twelveDirect.name} là trực tốt`, 16, "good");
  else if (details.twelveDirect.tone === "bad") add(`Trực ${details.twelveDirect.name} cần thận trọng`, -18, "bad");
  else add(`Trực ${details.twelveDirect.name} trung tính`, 4, "neutral");

  details.specialWarnings.forEach((warning) => add(`Có ${warning.name}`, -10, "bad"));
  if (day.goodHours.length >= 6) add("Có 6 giờ hoàng đạo", 8, "good");
  if (details.shouldDo.length >= 4) add("Có nhiều việc nên làm tham khảo", 6, "good");

  const finalScore = Math.max(0, Math.min(100, Math.round(score)));
  return {
    score: finalScore,
    breakdown,
    label: finalScore >= 80 ? "Rất tốt" : finalScore >= 65 ? "Tốt" : finalScore >= 50 ? "Trung bình" : "Nên thận trọng",
  };
}

export function dateToIso(date: DateParts): string {
  return formatDateKey(date);
}
