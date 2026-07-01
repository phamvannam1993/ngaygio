import type { ChiName } from "./types";

export type ZodiacIconName = "rat" | "ox" | "tiger" | "cat" | "dragon" | "snake" | "horse" | "goat" | "monkey" | "rooster" | "dog" | "pig";

export const ZODIAC_BY_CHI: Record<ChiName, { animal: string; iconName: ZodiacIconName; description: string }> = {
  Tý: {
    animal: "Chuột",
    iconName: "rat",
    description: "Tý tượng trưng cho sự nhanh nhẹn, linh hoạt và khả năng thích nghi tốt.",
  },
  Sửu: {
    animal: "Trâu",
    iconName: "ox",
    description: "Sửu gắn với sự bền bỉ, chăm chỉ, chắc chắn và tinh thần chịu khó.",
  },
  Dần: {
    animal: "Hổ",
    iconName: "tiger",
    description: "Dần đại diện cho khí chất mạnh mẽ, chủ động, quyết đoán và giàu năng lượng.",
  },
  Mão: {
    animal: "Mèo",
    iconName: "cat",
    description: "Mão thường được liên tưởng tới sự mềm mại, khéo léo, tinh tế và hòa nhã.",
  },
  Thìn: {
    animal: "Rồng",
    iconName: "dragon",
    description: "Thìn mang ý nghĩa uy nghi, sáng tạo, tham vọng và nhiều sức sống.",
  },
  Tỵ: {
    animal: "Rắn",
    iconName: "snake",
    description: "Tỵ gắn với sự quan sát, thận trọng, sắc bén và khả năng phân tích.",
  },
  Ngọ: {
    animal: "Ngựa",
    iconName: "horse",
    description: "Ngọ tượng trưng cho tinh thần tự do, năng động, nhiệt tình và thích khám phá.",
  },
  Mùi: {
    animal: "Dê",
    iconName: "goat",
    description: "Mùi thường gợi sự hiền hòa, mềm mỏng, chu đáo và giàu cảm xúc.",
  },
  Thân: {
    animal: "Khỉ",
    iconName: "monkey",
    description: "Thân đại diện cho sự lanh lợi, vui vẻ, ứng biến nhanh và giàu ý tưởng.",
  },
  Dậu: {
    animal: "Gà",
    iconName: "rooster",
    description: "Dậu gắn với sự đúng giờ, chỉn chu, thẳng thắn và tinh thần trách nhiệm.",
  },
  Tuất: {
    animal: "Chó",
    iconName: "dog",
    description: "Tuất tượng trưng cho lòng trung thành, sự bảo vệ, chân thành và đáng tin.",
  },
  Hợi: {
    animal: "Heo",
    iconName: "pig",
    description: "Hợi mang ý nghĩa phúc hậu, rộng rãi, an hòa và biết tận hưởng cuộc sống.",
  },
};
