// Thần số học (Numerology) — tính theo hệ Pythagoras.
// Thuần tính toán từ họ tên + ngày sinh, không phụ thuộc dữ liệu ngoài.

export type NumerologyInput = {
  fullName: string;
  day: number;
  month: number;
  year: number;
};

export type NumberMeaning = {
  keyword: string;
  description: string;
};

export type NumerologyIndex = {
  key: string;
  label: string;
  short: string; // giải thích cách tính ngắn
  value: number;
  isMaster: boolean;
  meaning: NumberMeaning;
};

export type NumerologyResult = {
  name: string;
  dob: { day: number; month: number; year: number };
  indices: NumerologyIndex[];
};

const MASTER_NUMBERS = new Set([11, 22, 33]);

// Bảng giá trị chữ cái Pythagoras: A-I = 1-9, J-R = 1-9, S-Z = 1-8.
const LETTER_VALUES: Record<string, number> = {
  a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9,
  j: 1, k: 2, l: 3, m: 4, n: 5, o: 6, p: 7, q: 8, r: 9,
  s: 1, t: 2, u: 3, v: 4, w: 5, x: 6, y: 7, z: 8,
};

const VOWELS = new Set(["a", "e", "i", "o", "u", "y"]);

// Bỏ dấu tiếng Việt → chữ Latin cơ bản (đ → d) để áp bảng Pythagoras.
export function normalizeVietnamese(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Rút gọn về 1 chữ số, giữ lại master number 11/22/33.
export function reduceNumber(n: number, keepMaster = true): number {
  let value = Math.abs(n);
  while (value > 9) {
    if (keepMaster && MASTER_NUMBERS.has(value)) return value;
    value = String(value)
      .split("")
      .reduce((sum, d) => sum + Number(d), 0);
  }
  return value;
}

function sumLetters(letters: string[]): number {
  return letters.reduce((sum, ch) => sum + (LETTER_VALUES[ch] ?? 0), 0);
}

function lettersOf(name: string): string[] {
  return normalizeVietnamese(name).replace(/\s/g, "").split("");
}

// Số Đường Đời: cộng dồn ngày + tháng + năm (rút gọn từng phần rồi cộng).
export function lifePathNumber(day: number, month: number, year: number): number {
  const d = reduceNumber(day);
  const m = reduceNumber(month);
  const y = reduceNumber(year);
  return reduceNumber(d + m + y);
}

// Số Sứ Mệnh (Vận Mệnh): tổng toàn bộ chữ cái trong tên.
export function expressionNumber(name: string): number {
  return reduceNumber(sumLetters(lettersOf(name)));
}

// Số Linh Hồn: tổng các nguyên âm.
export function soulUrgeNumber(name: string): number {
  return reduceNumber(sumLetters(lettersOf(name).filter((ch) => VOWELS.has(ch))));
}

// Số Nhân Cách: tổng các phụ âm.
export function personalityNumber(name: string): number {
  return reduceNumber(sumLetters(lettersOf(name).filter((ch) => !VOWELS.has(ch))));
}

// Số Ngày Sinh: rút gọn ngày sinh.
export function birthdayNumber(day: number): number {
  return reduceNumber(day);
}

// Số Thái Độ: ngày + tháng sinh.
export function attitudeNumber(day: number, month: number): number {
  return reduceNumber(reduceNumber(day) + reduceNumber(month));
}

// Số Trưởng Thành: Đường đời + Sứ mệnh.
export function maturityNumber(lifePath: number, expression: number): number {
  return reduceNumber(lifePath + expression);
}

// Năm cá nhân: ngày + tháng sinh + năm hiện tại.
export function personalYearNumber(day: number, month: number, currentYear: number): number {
  return reduceNumber(reduceNumber(day) + reduceNumber(month) + reduceNumber(currentYear));
}

export const NUMBER_MEANINGS: Record<number, NumberMeaning> = {
  1: { keyword: "Người tiên phong", description: "Độc lập, quyết đoán, giàu tham vọng và khả năng lãnh đạo. Thích tự mình khởi xướng, dẫn dắt và không ngại đi con đường riêng." },
  2: { keyword: "Người kết nối", description: "Nhạy cảm, khéo léo, giỏi hợp tác và làm trung gian hòa giải. Coi trọng mối quan hệ, sự cân bằng và tinh thần đồng đội." },
  3: { keyword: "Người truyền cảm hứng", description: "Sáng tạo, lạc quan, giao tiếp tốt và giàu biểu cảm. Có năng khiếu nghệ thuật, ngôn ngữ và lan tỏa niềm vui cho người xung quanh." },
  4: { keyword: "Người xây dựng", description: "Thực tế, kỷ luật, chăm chỉ và đáng tin cậy. Giỏi tổ chức, kiên trì và xây dựng nền tảng vững chắc cho tương lai." },
  5: { keyword: "Người tự do", description: "Năng động, linh hoạt, ưa khám phá và thay đổi. Thích trải nghiệm, thích nghi nhanh và không thích bị gò bó." },
  6: { keyword: "Người chăm sóc", description: "Ấm áp, trách nhiệm, giàu tình yêu thương và tinh thần vì gia đình, cộng đồng. Luôn muốn che chở và mang lại sự hài hòa." },
  7: { keyword: "Người suy tưởng", description: "Sâu sắc, trực giác mạnh, ham học hỏi và tìm kiếm chân lý. Thiên về nội tâm, phân tích và khám phá những điều ẩn sâu." },
  8: { keyword: "Người quyền lực", description: "Tham vọng, bản lĩnh, giỏi quản lý tiền bạc và tổ chức lớn. Hướng đến thành công, quyền lực và sự thịnh vượng vật chất." },
  9: { keyword: "Người nhân ái", description: "Bao dung, lý tưởng, giàu lòng trắc ẩn và tinh thần phụng sự. Sống vì điều lớn lao, sẵn sàng cho đi và giúp đỡ cộng đồng." },
  11: { keyword: "Bậc thầy trực giác", description: "Số master: trực giác phi thường, nhạy bén tâm linh và giàu cảm hứng. Có khả năng truyền cảm hứng, dẫn dắt tinh thần cho người khác." },
  22: { keyword: "Bậc thầy kiến tạo", description: "Số master: kết hợp tầm nhìn lớn với năng lực hiện thực hóa. Có thể xây dựng những công trình, hệ thống có ảnh hưởng rộng và lâu dài." },
  33: { keyword: "Bậc thầy dẫn dắt", description: "Số master: tình yêu thương vô điều kiện và tinh thần phụng sự cao cả. Chữa lành, nâng đỡ và cống hiến cho lợi ích chung của nhân loại." },
};

function meaningOf(value: number): NumberMeaning {
  return NUMBER_MEANINGS[value] ?? { keyword: "Đang cập nhật", description: "Ý nghĩa con số đang được cập nhật." };
}

export function calculateNumerology(input: NumerologyInput): NumerologyResult {
  const { fullName, day, month, year } = input;
  const lifePath = lifePathNumber(day, month, year);
  const expression = expressionNumber(fullName);
  const soul = soulUrgeNumber(fullName);
  const personality = personalityNumber(fullName);
  const birthday = birthdayNumber(day);
  const attitude = attitudeNumber(day, month);
  const maturity = maturityNumber(lifePath, expression);

  const make = (key: string, label: string, short: string, value: number): NumerologyIndex => ({
    key,
    label,
    short,
    value,
    isMaster: MASTER_NUMBERS.has(value),
    meaning: meaningOf(value),
  });

  return {
    name: fullName.trim(),
    dob: { day, month, year },
    indices: [
      make("duong-doi", "Số Đường Đời", "Từ ngày tháng năm sinh — chỉ số quan trọng nhất, phản ánh con đường và bài học cả đời.", lifePath),
      make("su-menh", "Số Sứ Mệnh", "Từ toàn bộ chữ cái trong họ tên — mục tiêu, tài năng và sứ mệnh sống.", expression),
      make("linh-hon", "Số Linh Hồn", "Từ các nguyên âm trong tên — khát khao, động lực sâu thẳm bên trong.", soul),
      make("nhan-cach", "Số Nhân Cách", "Từ các phụ âm trong tên — hình ảnh, ấn tượng bạn tạo ra với người khác.", personality),
      make("ngay-sinh", "Số Ngày Sinh", "Từ ngày sinh — tài năng thiên bẩm nổi bật.", birthday),
      make("thai-do", "Số Thái Độ", "Từ ngày + tháng sinh — cách bạn phản ứng và tiếp cận cuộc sống.", attitude),
      make("truong-thanh", "Số Trưởng Thành", "Đường đời + Sứ mệnh — mục tiêu và con người bạn hướng tới khi trưởng thành.", maturity),
    ],
  };
}
