import { formatDisplayDate, formatDateKey, getVietnamTodayParts, isSameDate, isValidDateParts, type DateParts } from "@/lib/date";
import { getDayInfo } from "./service";
import { convertLunar2Solar, convertSolar2Lunar } from "./lunar";
import type { DayInfo, LunarDate } from "./types";

export type ConversionMode = "duong-am" | "am-duong";

export type ConversionSuccess = {
  status: "success";
  mode: ConversionMode;
  input: DateParts;
  inputIsLeapMonth: boolean;
  solar: DateParts;
  lunar: LunarDate;
  day: DayInfo;
  heading: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  summary: string;
  tags: string[];
  canonicalPath: string;
  breadcrumbCurrent: string;
  inputLabel: string;
  outputLabel: string;
  isToday: boolean;
};

export type ConversionInvalid = {
  status: "invalid";
  mode: ConversionMode;
  input: DateParts;
  inputIsLeapMonth: boolean;
  heading: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  errorMessage: string;
  canonicalPath: string;
};

export type CalendarConversion = ConversionSuccess | ConversionInvalid;

export function normalizeConversionMode(value?: string): ConversionMode | null {
  if (value === "duong-am" || value === "am-duong") return value;
  return null;
}

function fullLunarText(lunar: LunarDate): string {
  return `${lunar.day} tháng ${lunar.month}${lunar.isLeap ? " nhuận" : ""} năm ${lunar.year}`;
}

function lunarDateKey(lunar: LunarDate | DateParts, isLeap = "isLeap" in lunar ? lunar.isLeap : false): string {
  return `${lunar.day}/${lunar.month}${isLeap ? " nhuận" : ""}/${lunar.year}`;
}

function buildSolarToLunar(input: DateParts): CalendarConversion {
  if (!isValidDateParts(input)) {
    return {
      status: "invalid",
      mode: "duong-am",
      input,
      inputIsLeapMonth: false,
      heading: "Chuyển dương lịch sang âm lịch",
      metaTitle: "Chuyển dương lịch sang âm lịch | Ngày Giờ",
      metaDescription: "Công cụ đổi ngày dương sang ngày âm theo lịch Việt Nam.",
      intro: "Vui lòng chọn một ngày dương lịch hợp lệ để chuyển sang âm lịch.",
      errorMessage: "Ngày dương lịch không hợp lệ hoặc nằm ngoài phạm vi hỗ trợ.",
      canonicalPath: "/chuyen-doi-lich",
    };
  }

  const day = getDayInfo(input);
  const displaySolar = formatDisplayDate(input);
  const displayLunar = lunarDateKey(day.lunar);
  const today = getVietnamTodayParts();
  const canonicalPath = `/chuyen-doi-lich/duong-am/${input.year}/${input.month}/${input.day}`;

  return {
    status: "success",
    mode: "duong-am",
    input,
    inputIsLeapMonth: false,
    solar: input,
    lunar: day.lunar,
    day,
    heading: `Chuyển ngày ${displaySolar} dương lịch sang âm lịch`,
    metaTitle: `${displaySolar} dương lịch là ngày bao nhiêu âm? | Ngày Giờ`,
    metaDescription: `Ngày ${displaySolar} dương lịch đổi sang âm lịch là ${displayLunar}, ngày ${day.canChi.day}, tháng ${day.canChi.month}, năm ${day.canChi.year}.`,
    intro: "Công cụ chuyển đổi ngày dương lịch sang âm lịch, hiển thị ngày âm tương ứng, can chi, tiết khí, ngày tốt xấu và giờ hoàng đạo để bạn tiện tra cứu.",
    summary: `Như vậy, ngày ${input.day} tháng ${input.month} năm ${input.year} dương lịch khi chuyển sang âm lịch sẽ là ${day.weekdayName} ngày ${fullLunarText(day.lunar)} âm lịch, tức ngày ${day.canChi.day}, tháng ${day.canChi.month}, năm ${day.canChi.year}.`,
    tags: [
      `${formatDisplayDate(input)} dương lịch là bao nhiêu âm`,
      `chuyển dương sang âm ${input.year}`,
      `đổi ngày âm dương`,
      `ngày ${day.canChi.day}`,
    ],
    canonicalPath,
    breadcrumbCurrent: `${displaySolar} dương sang âm`,
    inputLabel: `Dương lịch: ${displaySolar}`,
    outputLabel: `Âm lịch: ${displayLunar}`,
    isToday: isSameDate(input, today),
  };
}

function buildLunarToSolar(input: DateParts, inputIsLeapMonth: boolean): CalendarConversion {
  const canonicalPath = `/chuyen-doi-lich/am-duong/${input.year}/${input.month}/${input.day}${inputIsLeapMonth ? "?nhuan=1" : ""}`;

  if (input.year < 1800 || input.year > 2199 || input.month < 1 || input.month > 12 || input.day < 1 || input.day > 30) {
    return {
      status: "invalid",
      mode: "am-duong",
      input,
      inputIsLeapMonth,
      heading: "Chuyển âm lịch sang dương lịch",
      metaTitle: "Chuyển âm lịch sang dương lịch | Ngày Giờ",
      metaDescription: "Công cụ đổi ngày âm sang ngày dương theo lịch Việt Nam.",
      intro: "Vui lòng nhập ngày âm lịch hợp lệ, tháng từ 1 đến 12 và ngày từ 1 đến 30.",
      errorMessage: "Ngày âm lịch không hợp lệ hoặc nằm ngoài phạm vi hỗ trợ.",
      canonicalPath: "/chuyen-doi-lich",
    };
  }

  const solar = convertLunar2Solar(input.day, input.month, input.year, inputIsLeapMonth);

  if (!solar) {
    return {
      status: "invalid",
      mode: "am-duong",
      input,
      inputIsLeapMonth,
      heading: "Chuyển âm lịch sang dương lịch",
      metaTitle: "Chuyển âm lịch sang dương lịch | Ngày Giờ",
      metaDescription: "Công cụ đổi ngày âm sang ngày dương theo lịch Việt Nam.",
      intro: "Ngày âm lịch bạn chọn không tồn tại trong năm này, có thể do chọn sai tháng nhuận.",
      errorMessage: "Không tìm thấy ngày dương lịch tương ứng. Hãy bỏ chọn hoặc chọn đúng tùy chọn tháng nhuận.",
      canonicalPath: "/chuyen-doi-lich",
    };
  }

  const checkLunar = convertSolar2Lunar(solar.day, solar.month, solar.year);
  const isExactLunarDate =
    checkLunar.day === input.day &&
    checkLunar.month === input.month &&
    checkLunar.year === input.year &&
    checkLunar.isLeap === inputIsLeapMonth;

  if (!isExactLunarDate) {
    return {
      status: "invalid",
      mode: "am-duong",
      input,
      inputIsLeapMonth,
      heading: "Chuyển âm lịch sang dương lịch",
      metaTitle: "Chuyển âm lịch sang dương lịch | Ngày Giờ",
      metaDescription: "Công cụ đổi ngày âm sang ngày dương theo lịch Việt Nam.",
      intro: "Ngày âm lịch bạn chọn không tồn tại trong năm này hoặc thuộc tháng âm khác.",
      errorMessage: `Ngày ${input.day}/${input.month}${inputIsLeapMonth ? " nhuận" : ""}/${input.year} âm lịch không hợp lệ.`,
      canonicalPath: "/chuyen-doi-lich",
    };
  }

  const day = getDayInfo(solar);
  const displaySolar = formatDisplayDate(solar);
  const displayLunar = `${input.day}/${input.month}${inputIsLeapMonth ? " nhuận" : ""}/${input.year}`;
  const today = getVietnamTodayParts();

  return {
    status: "success",
    mode: "am-duong",
    input,
    inputIsLeapMonth,
    solar,
    lunar: day.lunar,
    day,
    heading: `Chuyển ngày ${displayLunar} âm lịch sang dương lịch`,
    metaTitle: `${displayLunar} âm lịch là ngày bao nhiêu dương? | Ngày Giờ`,
    metaDescription: `Ngày ${displayLunar} âm lịch đổi sang dương lịch là ${displaySolar}, nhằm ${day.weekdayName}, ngày ${day.canChi.day}, tháng ${day.canChi.month}, năm ${day.canChi.year}.`,
    intro: "Công cụ chuyển đổi ngày âm lịch sang dương lịch, hỗ trợ kiểm tra ngày âm, tháng nhuận và hiển thị đầy đủ thông tin ngày tương ứng.",
    summary: `Như vậy, ngày ${input.day} tháng ${input.month}${inputIsLeapMonth ? " nhuận" : ""} năm ${input.year} âm lịch khi chuyển sang dương lịch sẽ là ${day.weekdayName} ngày ${displaySolar}. Ngày này ứng với ${day.canChi.day}, tháng ${day.canChi.month}, năm ${day.canChi.year}.`,
    tags: [
      `${displayLunar} âm lịch là ngày bao nhiêu dương`,
      `chuyển âm sang dương ${input.year}`,
      `đổi ngày âm dương`,
      `ngày ${day.canChi.day}`,
    ],
    canonicalPath,
    breadcrumbCurrent: `${displayLunar} âm sang dương`,
    inputLabel: `Âm lịch: ${displayLunar}`,
    outputLabel: `Dương lịch: ${displaySolar}`,
    isToday: isSameDate(solar, today),
  };
}

export function convertCalendarDate(mode: ConversionMode, input: DateParts, inputIsLeapMonth = false): CalendarConversion {
  return mode === "duong-am" ? buildSolarToLunar(input) : buildLunarToSolar(input, inputIsLeapMonth);
}

export function getDefaultConversion(): ConversionSuccess {
  const today = getVietnamTodayParts();
  const result = convertCalendarDate("duong-am", today);
  if (result.status === "invalid") {
    throw new Error("Không thể tạo dữ liệu chuyển đổi mặc định.");
  }
  return result;
}

export function conversionShareUrl(result: CalendarConversion): string {
  return result.status === "success" ? result.canonicalPath : "/chuyen-doi-lich";
}

export function makeInputDateValue(date: DateParts): string {
  return formatDateKey(date);
}
