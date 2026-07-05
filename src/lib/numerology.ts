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

// ---- Dữ liệu chi tiết cho từng SỐ CHỦ ĐẠO (Số Đường Đời) ----
export type LifePathDetail = {
  number: number;
  title: string;
  overview: string;
  love: string;
  career: string;
  finance: string;
  strengths: string[];
  weaknesses: string[];
  careers: string[];
  celebrities?: string;
};

export const LIFE_PATH_DETAILS: Record<number, LifePathDetail> = {
  1: {
    number: 1,
    title: "Người tiên phong – Lãnh đạo độc lập",
    overview: "Số chủ đạo 1 là biểu tượng của sự khởi đầu, độc lập và ý chí mạnh mẽ. Người số 1 sinh ra để dẫn đầu, tự mở lối đi riêng và không thích phụ thuộc. Bạn có tham vọng lớn, quyết đoán và khả năng biến ý tưởng thành hành động.",
    love: "Trong tình yêu, người số 1 chủ động, chân thành nhưng khá cái tôi. Bạn cần một người bạn đời tôn trọng sự độc lập của mình; hãy học cách lắng nghe và mềm mỏng hơn để mối quan hệ bền vững.",
    career: "Phù hợp với vai trò lãnh đạo, khởi nghiệp, quản lý. Bạn tỏa sáng khi được tự chủ và chịu trách nhiệm; môi trường gò bó, rập khuôn dễ khiến bạn mất động lực.",
    finance: "Khả năng kiếm tiền tốt nhờ sự chủ động và dám nghĩ dám làm. Nên tránh quyết định bốc đồng và học cách kiên nhẫn tích lũy.",
    strengths: ["Lãnh đạo bẩm sinh", "Quyết đoán, tự tin", "Sáng tạo, tiên phong", "Ý chí mạnh"],
    weaknesses: ["Cái tôi cao", "Bướng bỉnh", "Dễ nóng vội", "Ngại nhờ vả người khác"],
    careers: ["Giám đốc, quản lý", "Khởi nghiệp, kinh doanh", "Chính trị, lãnh đạo", "Nhà sáng chế, thiết kế"],
  },
  2: {
    number: 2,
    title: "Người kết nối – Hòa giải tinh tế",
    overview: "Số chủ đạo 2 mang năng lượng của sự hợp tác, nhạy cảm và cân bằng. Người số 2 khéo léo, biết lắng nghe và là cầu nối hòa giải tuyệt vời. Bạn coi trọng các mối quan hệ và thường đứng sau hỗ trợ hơn là tranh giành ánh hào quang.",
    love: "Bạn lãng mạn, tận tâm và giàu tình cảm, luôn đặt người thương lên hàng đầu. Cần tránh phụ thuộc cảm xúc quá mức và học cách nói lên nhu cầu của bản thân.",
    career: "Tỏa sáng trong các vai trò cần sự phối hợp, ngoại giao, chăm sóc. Bạn làm việc nhóm rất tốt và tạo bầu không khí hài hòa.",
    finance: "Thận trọng, biết tính toán nhưng đôi khi thiếu quyết đoán. Nên có kế hoạch tài chính rõ ràng và tin vào trực giác của mình.",
    strengths: ["Nhạy cảm, tinh tế", "Giỏi hợp tác", "Kiên nhẫn, chu đáo", "Ngoại giao khéo léo"],
    weaknesses: ["Thiếu quyết đoán", "Dễ tự ti", "Nhạy cảm thái quá", "Ngại xung đột"],
    careers: ["Ngoại giao, nhân sự", "Tư vấn, chăm sóc khách hàng", "Y tá, giáo viên", "Nghệ thuật, âm nhạc"],
  },
  3: {
    number: 3,
    title: "Người truyền cảm hứng – Sáng tạo lạc quan",
    overview: "Số chủ đạo 3 tràn đầy năng lượng sáng tạo, giao tiếp và niềm vui. Người số 3 có khiếu nghệ thuật, ngôn ngữ và khả năng lan tỏa sự tích cực. Bạn thu hút người khác bằng sự duyên dáng và tinh thần lạc quan.",
    love: "Bạn nồng nhiệt, vui vẻ và biết cách làm mới tình cảm. Tuy nhiên cần sự chung thủy và chiều sâu; tránh hời hợt hay né tránh các vấn đề nghiêm túc.",
    career: "Hợp với sáng tạo nội dung, truyền thông, nghệ thuật, giải trí. Bạn tỏa sáng ở nơi được thể hiện bản thân và tương tác với nhiều người.",
    finance: "Kiếm tiền tốt nhưng dễ tiêu hoang. Nên lập ngân sách và kiềm chế chi tiêu cảm hứng.",
    strengths: ["Sáng tạo, nghệ thuật", "Giao tiếp cuốn hút", "Lạc quan, vui vẻ", "Truyền cảm hứng"],
    weaknesses: ["Thiếu tập trung", "Hời hợt", "Tiêu xài phóng khoáng", "Dễ nản khi gặp khó"],
    careers: ["Truyền thông, marketing", "Nghệ sĩ, ca sĩ, diễn viên", "Nhà văn, MC", "Thiết kế, quảng cáo"],
  },
  4: {
    number: 4,
    title: "Người xây dựng – Nền tảng vững chắc",
    overview: "Số chủ đạo 4 đại diện cho sự thực tế, kỷ luật và bền bỉ. Người số 4 chăm chỉ, đáng tin cậy và giỏi tổ chức, luôn xây dựng nền móng vững chắc cho tương lai. Bạn coi trọng sự ổn định và trật tự.",
    love: "Bạn chung thủy, nghiêm túc và trách nhiệm trong tình cảm. Đôi khi hơi cứng nhắc; hãy học cách lãng mạn và linh hoạt hơn với nửa kia.",
    career: "Hợp với công việc đòi hỏi tính chính xác, quản lý, kỹ thuật, tài chính. Bạn hoàn thành nhiệm vụ kỷ luật và đáng tin.",
    finance: "Quản lý tiền bạc rất tốt, tiết kiệm và có kế hoạch dài hạn. Nên dám đầu tư đúng thời điểm thay vì quá thận trọng.",
    strengths: ["Kỷ luật, kiên trì", "Đáng tin cậy", "Tổ chức tốt", "Thực tế, chắc chắn"],
    weaknesses: ["Cứng nhắc", "Bảo thủ", "Ngại thay đổi", "Ôm đồm, khắt khe"],
    careers: ["Kế toán, tài chính", "Kỹ sư, xây dựng", "Quản lý dự án", "Luật, hành chính"],
  },
  5: {
    number: 5,
    title: "Người tự do – Khám phá và thích nghi",
    overview: "Số chủ đạo 5 mang năng lượng của tự do, năng động và khám phá. Người số 5 linh hoạt, thích trải nghiệm mới và thích nghi rất nhanh. Bạn ghét sự gò bó và luôn tìm kiếm sự đổi mới.",
    love: "Bạn cuốn hút, thú vị nhưng cần không gian riêng. Hãy học cách cam kết và ổn định để giữ mối quan hệ lâu dài.",
    career: "Hợp với công việc đa dạng, di chuyển, giao tiếp rộng như kinh doanh, du lịch, truyền thông. Bạn chán nản với sự lặp lại nhàm chán.",
    finance: "Thu nhập biến động do thích mạo hiểm và trải nghiệm. Nên có quỹ dự phòng và kỷ luật chi tiêu.",
    strengths: ["Năng động, linh hoạt", "Thích nghi nhanh", "Ưa khám phá", "Giao tiếp rộng"],
    weaknesses: ["Thiếu kiên định", "Dễ chán", "Bốc đồng", "Ngại ràng buộc"],
    careers: ["Kinh doanh, bán hàng", "Du lịch, hàng không", "Truyền thông, báo chí", "Marketing, sự kiện"],
  },
  6: {
    number: 6,
    title: "Người chăm sóc – Trách nhiệm và yêu thương",
    overview: "Số chủ đạo 6 là biểu tượng của tình yêu thương, trách nhiệm và sự hài hòa. Người số 6 ấm áp, tận tụy vì gia đình và cộng đồng, luôn muốn che chở và mang lại sự cân bằng cho mọi người.",
    love: "Bạn giàu tình cảm, chung thủy và hết lòng vì tổ ấm. Cần tránh hi sinh quá mức hay kiểm soát; hãy yêu thương cả bản thân mình.",
    career: "Hợp với chăm sóc, giáo dục, y tế, dịch vụ và các công việc vì cộng đồng. Bạn tạo môi trường ấm áp, gắn kết.",
    finance: "Chi tiêu vì gia đình và người thân, khá rộng rãi. Nên cân bằng giữa cho đi và tích lũy cho bản thân.",
    strengths: ["Yêu thương, trách nhiệm", "Tận tụy, chu đáo", "Tạo sự hài hòa", "Đáng tin cậy"],
    weaknesses: ["Hi sinh quá mức", "Hay lo lắng", "Dễ ôm đồm", "Kiểm soát người thân"],
    careers: ["Giáo dục, y tế", "Tư vấn tâm lý", "Dịch vụ, chăm sóc", "Đầu bếp, nội trợ chuyên nghiệp"],
  },
  7: {
    number: 7,
    title: "Người suy tưởng – Trí tuệ và trực giác",
    overview: "Số chủ đạo 7 mang năng lượng của chiều sâu, trí tuệ và trực giác. Người số 7 thích tìm hiểu bản chất, ham học hỏi và có đời sống nội tâm phong phú. Bạn tìm kiếm ý nghĩa và chân lý phía sau mọi việc.",
    love: "Bạn kín đáo, sâu sắc và cần một người thật sự thấu hiểu. Hãy mở lòng và chia sẻ nhiều hơn thay vì thu mình.",
    career: "Hợp với nghiên cứu, phân tích, chuyên môn sâu, tâm linh, công nghệ. Bạn xuất sắc khi được làm việc độc lập và đào sâu vấn đề.",
    finance: "Không quá coi trọng vật chất nhưng biết quản lý hợp lý. Nên chủ động lập kế hoạch tài chính rõ ràng.",
    strengths: ["Trí tuệ, phân tích", "Trực giác mạnh", "Ham học hỏi", "Độc lập, sâu sắc"],
    weaknesses: ["Khép kín", "Hoài nghi", "Xa cách cảm xúc", "Cầu toàn"],
    careers: ["Nghiên cứu, khoa học", "Công nghệ, lập trình", "Phân tích dữ liệu", "Triết học, tâm linh"],
  },
  8: {
    number: 8,
    title: "Người quyền lực – Thành tựu và thịnh vượng",
    overview: "Số chủ đạo 8 đại diện cho tham vọng, quyền lực và khả năng làm giàu. Người số 8 bản lĩnh, giỏi tổ chức và quản lý nguồn lực, hướng đến thành công và địa vị. Bạn có tư duy chiến lược và năng lực điều hành mạnh mẽ.",
    love: "Bạn mạnh mẽ, che chở nhưng khá bận rộn với sự nghiệp. Hãy dành thời gian và sự dịu dàng cho người thương để cân bằng.",
    career: "Hợp với quản trị, tài chính, kinh doanh quy mô lớn, lãnh đạo. Bạn có khả năng gây dựng và điều hành hệ thống, doanh nghiệp.",
    finance: "Năng lực tài chính nổi bật, biết kiếm và giữ tiền. Cần tránh tham vọng thái quá và cân bằng giữa vật chất – tinh thần.",
    strengths: ["Tham vọng, bản lĩnh", "Tư duy chiến lược", "Quản lý tài chính giỏi", "Chịu áp lực tốt"],
    weaknesses: ["Coi trọng vật chất", "Độc đoán", "Tham công tiếc việc", "Áp lực thành tích"],
    careers: ["Quản trị, CEO", "Tài chính, ngân hàng", "Bất động sản", "Kinh doanh, đầu tư"],
  },
  9: {
    number: 9,
    title: "Người nhân ái – Lý tưởng và phụng sự",
    overview: "Số chủ đạo 9 là biểu tượng của lòng nhân ái, lý tưởng và tinh thần phụng sự. Người số 9 bao dung, giàu trắc ẩn và sống vì những điều lớn lao. Bạn có tầm nhìn rộng và mong muốn cống hiến cho cộng đồng.",
    love: "Bạn yêu sâu sắc, vị tha và lãng mạn. Cần tránh lý tưởng hóa hay hi sinh quá mức; hãy chọn người trân trọng tấm lòng của bạn.",
    career: "Hợp với công việc nhân đạo, giáo dục, nghệ thuật, các hoạt động vì cộng đồng. Bạn truyền cảm hứng và tạo ảnh hưởng tích cực.",
    finance: "Rộng lượng, sẵn sàng cho đi. Nên cân bằng giữa giúp đỡ người khác và bảo đảm tài chính cá nhân.",
    strengths: ["Nhân ái, bao dung", "Lý tưởng cao đẹp", "Tầm nhìn rộng", "Truyền cảm hứng"],
    weaknesses: ["Lý tưởng hóa", "Dễ tổn thương", "Ôm đồm việc thiên hạ", "Khó buông bỏ quá khứ"],
    careers: ["Hoạt động xã hội", "Giáo dục, đào tạo", "Nghệ thuật, sáng tác", "Y tế, thiện nguyện"],
  },
  11: {
    number: 11,
    title: "Số master – Bậc thầy trực giác",
    overview: "Số chủ đạo 11 là số master mang trực giác phi thường và nguồn cảm hứng mạnh mẽ. Người số 11 nhạy bén, giàu tâm linh và có khả năng truyền cảm hứng, dẫn dắt tinh thần cho người khác. Đây là con số của tầm nhìn và sự thức tỉnh.",
    love: "Bạn nhạy cảm, sâu sắc và cần sự đồng điệu tinh thần. Hãy giữ vững cảm xúc và tìm người thật sự thấu hiểu chiều sâu của bạn.",
    career: "Hợp với công việc truyền cảm hứng, cố vấn, tâm linh, nghệ thuật, giảng dạy. Bạn có sức ảnh hưởng đặc biệt đến tư tưởng người khác.",
    finance: "Trực giác giúp bạn nắm bắt cơ hội, nhưng cảm xúc thất thường có thể ảnh hưởng tài chính. Nên có cố vấn hoặc kế hoạch rõ ràng.",
    strengths: ["Trực giác phi thường", "Truyền cảm hứng", "Tầm nhìn xa", "Nhạy bén tâm linh"],
    weaknesses: ["Cảm xúc thất thường", "Nhạy cảm quá mức", "Áp lực kỳ vọng", "Dễ căng thẳng"],
    careers: ["Cố vấn, diễn giả", "Tâm linh, chữa lành", "Nghệ thuật, sáng tạo", "Giảng dạy, đào tạo"],
  },
  22: {
    number: 22,
    title: "Số master – Bậc thầy kiến tạo",
    overview: "Số chủ đạo 22 là số master mạnh nhất, kết hợp tầm nhìn lớn với năng lực hiện thực hóa. Người số 22 có thể biến những giấc mơ lớn thành công trình, hệ thống có ảnh hưởng rộng và lâu dài. Đây là con số của người kiến tạo bậc thầy.",
    love: "Bạn nghiêm túc, tận tụy nhưng thường dồn tâm sức cho sự nghiệp. Hãy cân bằng và dành sự quan tâm cho người thương.",
    career: "Hợp với các dự án lớn, lãnh đạo, kiến trúc, xây dựng hệ thống, tổ chức quy mô. Bạn có khả năng tạo ra di sản bền vững.",
    finance: "Năng lực tạo dựng tài sản lớn nếu kiên trì. Cần quản trị rủi ro và không ôm đồm quá sức.",
    strengths: ["Tầm nhìn vĩ mô", "Năng lực hiện thực hóa", "Kiên định, thực tế", "Lãnh đạo mạnh"],
    weaknesses: ["Áp lực khổng lồ", "Ôm đồm", "Cầu toàn", "Dễ kiệt sức"],
    careers: ["Lãnh đạo tổ chức lớn", "Kiến trúc, xây dựng", "Khởi nghiệp quy mô", "Quản trị chiến lược"],
  },
  33: {
    number: 33,
    title: "Số master – Bậc thầy dẫn dắt",
    overview: "Số chủ đạo 33 là số master của tình yêu thương vô điều kiện và tinh thần phụng sự cao cả. Người số 33 chữa lành, nâng đỡ và cống hiến cho lợi ích chung của nhân loại. Đây là con số hiếm gặp, mang sứ mệnh lớn lao.",
    love: "Bạn yêu thương bao la và luôn chăm lo cho người khác. Hãy nhớ chăm sóc cả bản thân và đặt ranh giới lành mạnh.",
    career: "Hợp với giáo dục, chữa lành, hoạt động nhân đạo, dẫn dắt tinh thần. Bạn tạo ảnh hưởng sâu rộng và tích cực.",
    finance: "Không đặt nặng vật chất, thường dùng nguồn lực để giúp đỡ. Nên bảo đảm nền tảng tài chính để phụng sự bền vững.",
    strengths: ["Yêu thương vô điều kiện", "Tinh thần phụng sự", "Chữa lành, nâng đỡ", "Ảnh hưởng tích cực"],
    weaknesses: ["Hi sinh quá mức", "Gánh nặng trách nhiệm", "Bỏ quên bản thân", "Áp lực kỳ vọng"],
    careers: ["Giáo dục, đào tạo", "Chữa lành, y tế", "Hoạt động nhân đạo", "Lãnh đạo tinh thần"],
  },
};

export function getLifePathDetail(number: number): LifePathDetail | null {
  return LIFE_PATH_DETAILS[number] ?? null;
}

export const LIFE_PATH_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33];
