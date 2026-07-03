import type { DateParts } from "@/lib/date";
import { convertLunar2Solar } from "./lunar";

export type HolidayPageSlug = "trung-thu" | "vu-lan" | "gio-to-hung-vuong" | "ngay-30-4" | "quoc-khanh-2-9";

export type HolidayPageConfig = {
  slug: HolidayPageSlug;
  title: string;
  shortTitle: string;
  dateLabel: string;
  type: "solar" | "lunar";
  solarMonth?: number;
  solarDay?: number;
  lunarMonth?: number;
  lunarDay?: number;
  isOfficialDayOff: boolean;
  description: string;
  meaning: string;
  customs: string[];
  dayOffNote: string;
  keywords: string[];
};

export const HOLIDAY_PAGE_CONFIGS: HolidayPageConfig[] = [
  {
    slug: "trung-thu",
    title: "Tết Trung Thu",
    shortTitle: "Trung Thu",
    dateLabel: "15/8 âm lịch",
    type: "lunar",
    lunarMonth: 8,
    lunarDay: 15,
    isOfficialDayOff: false,
    description: "Tết Trung Thu diễn ra vào ngày 15 tháng 8 âm lịch hằng năm, gắn với trăng rằm, rước đèn, phá cỗ và sum họp gia đình.",
    meaning: "Đây là dịp hướng về trẻ em, gia đình và sự đoàn viên dưới trăng rằm tháng Tám.",
    customs: ["Rước đèn lồng, đèn ông sao", "Phá cỗ trông trăng", "Múa lân, múa sư tử", "Tặng bánh nướng, bánh dẻo"],
    dayOffNote: "Tết Trung Thu không phải ngày nghỉ lễ chính thức tại Việt Nam; lịch nghỉ thực tế tùy cơ quan, trường học hoặc gia đình.",
    keywords: ["tết trung thu", "trung thu ngày mấy", "rằm tháng tám", "tết thiếu nhi"],
  },
  {
    slug: "vu-lan",
    title: "Lễ Vu Lan",
    shortTitle: "Vu Lan",
    dateLabel: "15/7 âm lịch",
    type: "lunar",
    lunarMonth: 7,
    lunarDay: 15,
    isOfficialDayOff: false,
    description: "Lễ Vu Lan vào ngày rằm tháng Bảy âm lịch, thường gắn với tinh thần hiếu hạnh, tưởng nhớ cha mẹ và tổ tiên.",
    meaning: "Ngày Vu Lan nhắc mỗi người sống biết ơn, báo hiếu và nuôi dưỡng lòng hiếu kính với cha mẹ, ông bà, tổ tiên.",
    customs: ["Đi chùa, cầu an", "Tưởng nhớ tổ tiên", "Cài hoa hồng trong mùa Vu Lan", "Làm việc thiện, hồi hướng công đức"],
    dayOffNote: "Lễ Vu Lan không phải ngày nghỉ lễ chính thức; đây là ngày lễ truyền thống và Phật giáo được nhiều gia đình, chùa chiền tổ chức.",
    keywords: ["vu lan", "lễ vu lan ngày mấy", "rằm tháng bảy", "ngày báo hiếu"],
  },
  {
    slug: "gio-to-hung-vuong",
    title: "Giỗ Tổ Hùng Vương",
    shortTitle: "Giỗ Tổ",
    dateLabel: "10/3 âm lịch",
    type: "lunar",
    lunarMonth: 3,
    lunarDay: 10,
    isOfficialDayOff: true,
    description: "Giỗ Tổ Hùng Vương diễn ra vào ngày 10 tháng 3 âm lịch, là ngày tưởng nhớ công lao các Vua Hùng dựng nước.",
    meaning: "Đây là ngày hướng về cội nguồn dân tộc, nhắc nhớ truyền thống uống nước nhớ nguồn của người Việt.",
    customs: ["Dâng hương tưởng niệm", "Hướng về Đền Hùng", "Tổ chức hoạt động giáo dục truyền thống", "Sum họp gia đình và tri ân cội nguồn"],
    dayOffNote: "Giỗ Tổ Hùng Vương là ngày nghỉ lễ chính thức; lịch nghỉ bù cụ thể cần đối chiếu thông báo từng năm.",
    keywords: ["giỗ tổ hùng vương", "giỗ tổ ngày mấy", "10 tháng 3 âm lịch", "lịch nghỉ giỗ tổ"],
  },
  {
    slug: "ngay-30-4",
    title: "Ngày 30/4",
    shortTitle: "30/4",
    dateLabel: "30/4 dương lịch",
    type: "solar",
    solarMonth: 4,
    solarDay: 30,
    isOfficialDayOff: true,
    description: "Ngày 30/4 là Ngày Giải phóng miền Nam, thống nhất đất nước, diễn ra cố định vào ngày 30 tháng 4 dương lịch hằng năm.",
    meaning: "Đây là dịp tưởng nhớ mốc son thống nhất đất nước và nhìn lại giá trị hòa bình, độc lập, đoàn kết dân tộc.",
    customs: ["Treo cờ Tổ quốc", "Tham gia hoạt động kỷ niệm", "Du lịch, thăm thân", "Ôn lại lịch sử dân tộc"],
    dayOffNote: "Ngày 30/4 là ngày nghỉ lễ chính thức; lịch nghỉ gộp với 1/5 và nghỉ bù cần theo thông báo từng năm.",
    keywords: ["ngày 30/4", "30/4 là ngày gì", "lịch nghỉ 30/4", "giải phóng miền nam"],
  },
  {
    slug: "quoc-khanh-2-9",
    title: "Quốc khánh 2/9",
    shortTitle: "Quốc khánh",
    dateLabel: "2/9 dương lịch",
    type: "solar",
    solarMonth: 9,
    solarDay: 2,
    isOfficialDayOff: true,
    description: "Quốc khánh Việt Nam diễn ra vào ngày 2 tháng 9 dương lịch hằng năm, kỷ niệm ngày nước Việt Nam Dân chủ Cộng hòa ra đời.",
    meaning: "Đây là ngày lễ lớn của đất nước, nhắc nhớ tinh thần độc lập, tự do và trách nhiệm xây dựng Tổ quốc.",
    customs: ["Treo cờ Tổ quốc", "Tham gia hoạt động kỷ niệm", "Theo dõi chương trình nghệ thuật, diễu hành nếu có", "Du lịch, sum họp gia đình"],
    dayOffNote: "Quốc khánh 2/9 là ngày nghỉ lễ chính thức; số ngày nghỉ và ngày nghỉ bù cần theo thông báo từng năm.",
    keywords: ["quốc khánh 2/9", "2/9 là ngày gì", "lịch nghỉ 2/9", "ngày quốc khánh việt nam"],
  },
];

export function getHolidayPageConfig(slug: string): HolidayPageConfig | undefined {
  return HOLIDAY_PAGE_CONFIGS.find((item) => item.slug === slug);
}

export function isHolidayPageSlug(value: string): value is HolidayPageSlug {
  return HOLIDAY_PAGE_CONFIGS.some((item) => item.slug === value);
}

export function getHolidayDate(config: HolidayPageConfig, year: number): DateParts | null {
  if (config.type === "solar") {
    return { year, month: config.solarMonth ?? 1, day: config.solarDay ?? 1 };
  }

  return convertLunar2Solar(config.lunarDay ?? 1, config.lunarMonth ?? 1, year, false);
}

export function getHolidayCanonical(slug: HolidayPageSlug, year?: number) {
  return year ? `/${slug}/${year}` : `/${slug}`;
}
