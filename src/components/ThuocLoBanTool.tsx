"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

type SubPalace = {
  name: string;
  good: boolean;
  meaning: string;
};

type Palace = {
  name: string;
  good: boolean;
  meaning: string;
  children: SubPalace[];
};

type RulerConfig = {
  key: string;
  title: string;
  label: string;
  short: string;
  cycleCm: number;
  usage: string;
  useCases: string[];
  palaces: Palace[];
};

type RulerResult = {
  ruler: RulerConfig;
  cycleIndex: number;
  position: number;
  palaceIndex: number;
  subIndex: number;
  palace: Palace;
  subPalace: SubPalace;
  palaceFrom: number;
  palaceTo: number;
};

const PX_PER_CM = 42;
const START_CM = 0;
const END_CM = 300;
const INITIAL_CM = 81;
const EPSILON = 0.000001;

const RULERS: RulerConfig[] = [
  {
    key: "522",
    title: "Thước Lỗ Ban 52.2cm",
    label: "52.2cm - Thông thủy",
    short: "52.2cm",
    cycleCm: 52.2,
    usage: "Khoảng không thông thủy như cửa chính, cửa phòng, cửa sổ, ô thoáng, khoảng lọt lòng.",
    useCases: ["Cửa chính", "Cửa phòng", "Cửa sổ", "Ô thoáng"],
    palaces: [
      {
        name: "Quý Nhân",
        good: true,
        meaning: "Gặp quý nhân, gia đạo thuận, công việc dễ có người nâng đỡ.",
        children: [
          { name: "Quyền Lộc", good: true, meaning: "Có quyền, có lộc, thuận việc lớn." },
          { name: "Trung Tín", good: true, meaning: "Bạn bè trung tín, việc làm bền." },
          { name: "Tác Quan", good: true, meaning: "Thuận đường danh vị, chức phận." },
          { name: "Phát Đạt", good: true, meaning: "Làm ăn hanh thông, dễ phát triển." },
        ],
      },
      {
        name: "Hiểm Họa",
        good: false,
        meaning: "Dễ gặp bất lợi, va vấp, nên tránh khi chọn kích thước quan trọng.",
        children: [
          { name: "Án Thành", good: false, meaning: "Dễ vướng việc phiền hà." },
          { name: "Hỗn Tạp", good: false, meaning: "Công việc dễ rối, khó yên." },
          { name: "Quan Tài", good: false, meaning: "Không cát lợi, nên tránh." },
          { name: "Thất Thoát", good: false, meaning: "Dễ hao tài, mất mát." },
        ],
      },
      {
        name: "Thiên Tai",
        good: false,
        meaning: "Không thuận cho việc lớn, dễ hao tổn hoặc phát sinh trở ngại.",
        children: [
          { name: "Hỏa Tai", good: false, meaning: "Dễ nóng vội, hư hao." },
          { name: "Bệnh Lâm", good: false, meaning: "Không tốt cho sức khỏe." },
          { name: "Tử Tuyệt", good: false, meaning: "Điềm suy giảm, nên tránh." },
          { name: "Khẩu Thiệt", good: false, meaning: "Dễ sinh tranh cãi." },
        ],
      },
      {
        name: "Thiên Tài",
        good: true,
        meaning: "Có tài lộc, cơ hội và sự hanh thông trong công việc.",
        children: [
          { name: "Thiên Đức", good: true, meaning: "Có phúc, được hỗ trợ." },
          { name: "Hỷ Sự", good: true, meaning: "Dễ có tin vui." },
          { name: "Tiến Bảo", good: true, meaning: "Tài vật thêm vào." },
          { name: "Nạp Phúc", good: true, meaning: "Tích phúc, thuận hòa." },
        ],
      },
      {
        name: "Nhân Lộc",
        good: true,
        meaning: "Phúc lộc, nhân duyên tốt, dễ tích tụ may mắn.",
        children: [
          { name: "Trí Tồn", good: true, meaning: "Trí tuệ sáng, việc bền." },
          { name: "Phú Quý", good: true, meaning: "Tài lộc, sung túc." },
          { name: "Tiến Ích", good: true, meaning: "Công việc thêm lợi." },
          { name: "Thông Minh", good: true, meaning: "Con cháu thông sáng." },
        ],
      },
      {
        name: "Cô Độc",
        good: false,
        meaning: "Ít trợ lực, dễ cô lập, không nên ưu tiên cho việc quan trọng.",
        children: [
          { name: "Cô Quả", good: false, meaning: "Ít người trợ giúp." },
          { name: "Lao Chấp", good: false, meaning: "Vất vả, khó nhọc." },
          { name: "Thoái Tài", good: false, meaning: "Dễ hao hụt tiền của." },
          { name: "Tử Biệt", good: false, meaning: "Không cát lợi." },
        ],
      },
      {
        name: "Thiên Tặc",
        good: false,
        meaning: "Dễ thất thoát, hao tài, không cát lợi.",
        children: [
          { name: "Tai Chí", good: false, meaning: "Dễ gặp trắc trở." },
          { name: "Hại Nhân", good: false, meaning: "Dễ có người phá." },
          { name: "Thất Tài", good: false, meaning: "Không thuận tiền bạc." },
          { name: "Đạo Tặc", good: false, meaning: "Dễ mất mát, hao tổn." },
        ],
      },
      {
        name: "Tể Tướng",
        good: true,
        meaning: "Quyền quý, vững vàng, dễ thành việc và có vị thế.",
        children: [
          { name: "Đại Cát", good: true, meaning: "Rất tốt, thuận việc lớn." },
          { name: "Tài Vượng", good: true, meaning: "Tài khí thịnh." },
          { name: "Ích Lợi", good: true, meaning: "Có lợi, dễ sinh lộc." },
          { name: "Thiên Khố", good: true, meaning: "Tích tụ phúc tài." },
        ],
      },
    ],
  },
  {
    key: "429",
    title: "Thước Lỗ Ban 42.9cm (Dương trạch)",
    label: "42.9cm - Dương trạch",
    short: "42.9cm",
    cycleCm: 42.9,
    usage: "Khối xây dựng, bếp, bệ, bậc, tủ kệ, đồ nội thất tính theo phủ bì.",
    useCases: ["Bếp", "Tủ/kệ", "Bậc thang", "Khối xây"],
    palaces: [
      {
        name: "Tài",
        good: true,
        meaning: "Tài lộc, thuận lợi về tiền bạc và công việc.",
        children: [
          { name: "Tài Đức", good: true, meaning: "Có tài, có đức, việc thuận." },
          { name: "Bảo Khố", good: true, meaning: "Kho của, tích lũy." },
          { name: "Lục Hợp", good: true, meaning: "Hòa hợp, thuận duyên." },
          { name: "Nghênh Phúc", good: true, meaning: "Đón phúc, gặp may." },
        ],
      },
      {
        name: "Bệnh",
        good: false,
        meaning: "Không tốt cho sức khỏe, nên tránh khi có thể.",
        children: [
          { name: "Thoái Tài", good: false, meaning: "Dễ hao tài." },
          { name: "Công Sự", good: false, meaning: "Dễ vướng việc rắc rối." },
          { name: "Lao Chấp", good: false, meaning: "Nhọc nhằn, vướng bận." },
          { name: "Cô Quả", good: false, meaning: "Ít trợ lực." },
        ],
      },
      {
        name: "Ly",
        good: false,
        meaning: "Dễ chia lìa, bất ổn, không nên ưu tiên.",
        children: [
          { name: "Trường Bệnh", good: false, meaning: "Bệnh kéo dài, khí xấu." },
          { name: "Kiếp Tài", good: false, meaning: "Dễ bị mất của." },
          { name: "Quan Quỷ", good: false, meaning: "Dễ vướng chuyện thị phi." },
          { name: "Thất Thoát", good: false, meaning: "Hao hụt, thất thoát." },
        ],
      },
      {
        name: "Nghĩa",
        good: true,
        meaning: "Thuận hòa, nhân nghĩa, ổn định.",
        children: [
          { name: "Thêm Đinh", good: true, meaning: "Tốt cho nhân đinh." },
          { name: "Ích Lợi", good: true, meaning: "Tăng lợi ích." },
          { name: "Quý Tử", good: true, meaning: "Tốt cho con cháu." },
          { name: "Đại Cát", good: true, meaning: "Cát lợi lớn." },
        ],
      },
      {
        name: "Quan",
        good: true,
        meaning: "Danh vị, công việc, sự nghiệp hanh thông.",
        children: [
          { name: "Thuận Khoa", good: true, meaning: "Thuận học hành, thi cử." },
          { name: "Hoành Tài", good: true, meaning: "Tài lộc bất ngờ." },
          { name: "Tiến Ích", good: true, meaning: "Càng làm càng có lợi." },
          { name: "Phú Quý", good: true, meaning: "Sung túc, danh giá." },
        ],
      },
      {
        name: "Kiếp",
        good: false,
        meaning: "Dễ mất mát, cản trở, rủi ro.",
        children: [
          { name: "Tử Biệt", good: false, meaning: "Không cát lợi." },
          { name: "Thoái Khẩu", good: false, meaning: "Suy giảm nhân khí." },
          { name: "Ly Hương", good: false, meaning: "Dễ xa cách, bất ổn." },
          { name: "Tài Thất", good: false, meaning: "Hao hụt tài sản." },
        ],
      },
      {
        name: "Hại",
        good: false,
        meaning: "Bất lợi, hao tổn, nên tránh.",
        children: [
          { name: "Tai Chí", good: false, meaning: "Dễ gặp tai ách." },
          { name: "Tử Tuyệt", good: false, meaning: "Suy khí, nên tránh." },
          { name: "Bệnh Lâm", good: false, meaning: "Không tốt sức khỏe." },
          { name: "Khẩu Thiệt", good: false, meaning: "Dễ tranh cãi." },
        ],
      },
      {
        name: "Bản",
        good: true,
        meaning: "Nền tảng vững, gia đạo yên ổn.",
        children: [
          { name: "Tài Chí", good: true, meaning: "Có chí và có tài." },
          { name: "Đăng Khoa", good: true, meaning: "Thuận học hành, danh vị." },
          { name: "Tiến Bảo", good: true, meaning: "Tài vật tăng thêm." },
          { name: "Hưng Vượng", good: true, meaning: "Hưng thịnh, bền vững." },
        ],
      },
    ],
  },
  {
    key: "388",
    title: "Thước Lỗ Ban 38.8cm (Âm phần)",
    label: "38.8cm - Âm phần / đồ thờ",
    short: "38.8cm",
    cycleCm: 38.8,
    usage: "Tham khảo cho bàn thờ, đồ thờ, mộ phần, tiểu quách và các kích thước âm phần.",
    useCases: ["Bàn thờ", "Đồ thờ", "Mộ phần", "Tiểu quách"],
    palaces: [
      {
        name: "Đinh",
        good: true,
        meaning: "Tốt cho nhân đinh, gia đạo và hậu vận.",
        children: [
          { name: "Phúc Tinh", good: true, meaning: "Có phúc tinh chiếu." },
          { name: "Cập Đệ", good: true, meaning: "Thuận học hành, danh vị." },
          { name: "Tài Vượng", good: true, meaning: "Tài lộc tăng." },
          { name: "Đăng Khoa", good: true, meaning: "Thi cử, công danh thuận." },
        ],
      },
      {
        name: "Hại",
        good: false,
        meaning: "Bất lợi, hao tổn, nên tránh.",
        children: [
          { name: "Khẩu Thiệt", good: false, meaning: "Dễ sinh tranh cãi." },
          { name: "Bệnh Lâm", good: false, meaning: "Không tốt sức khỏe." },
          { name: "Tử Tuyệt", good: false, meaning: "Suy khí, không cát." },
          { name: "Tai Chí", good: false, meaning: "Dễ gặp trở ngại." },
        ],
      },
      {
        name: "Vượng",
        good: true,
        meaning: "Thịnh vượng, sinh khí tốt.",
        children: [
          { name: "Thiên Đức", good: true, meaning: "Có phúc đức." },
          { name: "Hỷ Sự", good: true, meaning: "Dễ có tin vui." },
          { name: "Tiến Bảo", good: true, meaning: "Tài vật tăng thêm." },
          { name: "Nạp Phúc", good: true, meaning: "Đón phúc khí." },
        ],
      },
      {
        name: "Khổ",
        good: false,
        meaning: "Vất vả, trắc trở, không nên ưu tiên.",
        children: [
          { name: "Thất Thoát", good: false, meaning: "Dễ hao hụt." },
          { name: "Quan Quỷ", good: false, meaning: "Dễ thị phi." },
          { name: "Kiếp Tài", good: false, meaning: "Dễ mất của." },
          { name: "Vô Tự", good: false, meaning: "Không thuận nhân đinh." },
        ],
      },
      {
        name: "Nghĩa",
        good: true,
        meaning: "Thuận hòa, ổn định, có tình nghĩa.",
        children: [
          { name: "Đại Cát", good: true, meaning: "Rất cát lợi." },
          { name: "Tài Vượng", good: true, meaning: "Tài khí thịnh." },
          { name: "Ích Lợi", good: true, meaning: "Sinh lợi, thêm phúc." },
          { name: "Thiên Khố", good: true, meaning: "Tích tụ phúc tài." },
        ],
      },
      {
        name: "Quan",
        good: true,
        meaning: "Danh vị, phúc khí và sự nâng đỡ.",
        children: [
          { name: "Phú Quý", good: true, meaning: "Giàu sang, danh giá." },
          { name: "Tiến Bảo", good: true, meaning: "Tài vật thêm vào." },
          { name: "Hoạnh Tài", good: true, meaning: "Tài lộc bất ngờ." },
          { name: "Thuận Khoa", good: true, meaning: "Thuận học hành, công danh." },
        ],
      },
      {
        name: "Tử",
        good: false,
        meaning: "Không cát lợi, nên tránh khi chọn kích thước.",
        children: [
          { name: "Ly Hương", good: false, meaning: "Dễ xa cách." },
          { name: "Tài Thất", good: false, meaning: "Dễ thất tài." },
          { name: "Thoái Khẩu", good: false, meaning: "Suy nhân khí." },
          { name: "Tử Biệt", good: false, meaning: "Không cát lợi." },
        ],
      },
      {
        name: "Hưng",
        good: true,
        meaning: "Hưng thịnh, phát triển, bền vững.",
        children: [
          { name: "Đăng Khoa", good: true, meaning: "Công danh thuận." },
          { name: "Quý Tử", good: true, meaning: "Tốt cho con cháu." },
          { name: "Thêm Đinh", good: true, meaning: "Tăng nhân đinh." },
          { name: "Hưng Vượng", good: true, meaning: "Thịnh vượng." },
        ],
      },
      {
        name: "Thất",
        good: false,
        meaning: "Thất thoát, suy giảm, không nên dùng.",
        children: [
          { name: "Cô Quả", good: false, meaning: "Ít trợ lực." },
          { name: "Lao Chấp", good: false, meaning: "Nhọc nhằn, khó yên." },
          { name: "Công Sự", good: false, meaning: "Dễ vướng việc." },
          { name: "Thoái Tài", good: false, meaning: "Hao hụt tiền của." },
        ],
      },
      {
        name: "Tài",
        good: true,
        meaning: "Tài lộc, may mắn, dễ sinh phúc.",
        children: [
          { name: "Tài Đức", good: true, meaning: "Có tài, có đức." },
          { name: "Bảo Khố", good: true, meaning: "Tích tụ của cải." },
          { name: "Lục Hợp", good: true, meaning: "Hòa hợp, thuận duyên." },
          { name: "Nghênh Phúc", good: true, meaning: "Đón phúc, gặp may." },
        ],
      },
    ],
  },
];

const RULER_BY_KEY = Object.fromEntries(RULERS.map((ruler) => [ruler.key, ruler])) as Record<string, RulerConfig>;

const QUICK_SIZES = [
  { label: "Cửa phổ biến", value: 81, rulerKey: "522" },
  { label: "Bàn thờ", value: 127, rulerKey: "388" },
  { label: "Tủ/kệ", value: 89, rulerKey: "429" },
  { label: "Bậc thang", value: 17, rulerKey: "429" },
];

const TICKS = Array.from({ length: (END_CM - START_CM) * 2 + 1 }, (_, index) => START_CM + index / 2);

function cn(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function clampSize(value: number) {
  if (!Number.isFinite(value)) return INITIAL_CM;
  return Math.min(END_CM, Math.max(START_CM, value));
}

function parseSize(raw: string) {
  const normalized = raw.trim().replace(",", ".");
  if (!normalized) return Number.NaN;
  return Number(normalized);
}

function formatCm(value: number, digits = 2) {
  return value.toFixed(digits).replace(/\.00$/, "").replace(/(\.\d)0$/, "$1");
}

function getResult(valueCm: number, ruler: RulerConfig): RulerResult {
  const palaceSize = ruler.cycleCm / ruler.palaces.length;
  const cycleIndex = Math.max(0, Math.floor((valueCm - EPSILON) / ruler.cycleCm));
  let position = valueCm % ruler.cycleCm;
  if (position < 0) position += ruler.cycleCm;
  if (Math.abs(position) < EPSILON) position = ruler.cycleCm;

  const positionForIndex = Math.min(position - EPSILON, ruler.cycleCm - EPSILON);
  const palaceIndex = Math.min(ruler.palaces.length - 1, Math.floor(positionForIndex / palaceSize));
  const palace = ruler.palaces[palaceIndex];
  const subSize = palaceSize / palace.children.length;
  const palaceOffset = Math.max(0, positionForIndex - palaceIndex * palaceSize);
  const subIndex = Math.min(palace.children.length - 1, Math.floor(palaceOffset / subSize));
  const subPalace = palace.children[subIndex];

  return {
    ruler,
    cycleIndex,
    position,
    palaceIndex,
    subIndex,
    palace,
    subPalace,
    palaceFrom: palaceIndex * palaceSize,
    palaceTo: (palaceIndex + 1) * palaceSize,
  };
}

function getNearbyGoodSizes(valueCm: number, ruler: RulerConfig) {
  if (!Number.isFinite(valueCm) || valueCm <= 0) return [];

  const candidates: Array<{ size: number; distance: number }> = [];
  const min = Math.max(START_CM + 0.1, valueCm - 20);
  const max = Math.min(END_CM, valueCm + 20);

  for (let size = min; size <= max; size += 0.5) {
    const rounded = Number(size.toFixed(1));
    const result = getResult(rounded, ruler);
    if (!result.palace.good) continue;
    candidates.push({ size: rounded, distance: Math.abs(rounded - valueCm) });
  }

  return candidates
    .sort((a, b) => a.distance - b.distance || a.size - b.size)
    .slice(0, 12)
    .sort((a, b) => a.size - b.size)
    .map((item) => item.size);
}

function RulerIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="lobanIcon">
      <path d="M4.7 15.6 15.6 4.7a2.2 2.2 0 0 1 3.1 0l.6.6a2.2 2.2 0 0 1 0 3.1L8.4 19.3a2.2 2.2 0 0 1-3.1 0l-.6-.6a2.2 2.2 0 0 1 0-3.1Z" />
      <path d="m8 13 2 2m1-5 2 2m1-5 2 2M6.5 17.5l2 2" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="lobanIcon">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function getCycleCount(ruler: RulerConfig) {
  return Math.ceil((END_CM - START_CM) / ruler.cycleCm) + 1;
}

function renderTicks() {
  return TICKS.map((tick) => {
    const isInteger = Number.isInteger(tick);
    const isMajor = isInteger && tick % 10 === 0;
    const isFive = isInteger && tick % 5 === 0;
    const label = isInteger ? `${tick} cm` : "";

    return (
      <span
        key={tick}
        className={cn("lobanDragTick", isMajor && "major", isFive && "five")}
        style={{ left: `${(tick - START_CM) * PX_PER_CM}px` }}
      >
        {label && <b>{label}</b>}
      </span>
    );
  });
}

function DragRulerRow({ ruler, currentCm }: { ruler: RulerConfig; currentCm: number }) {
  const result = getResult(currentCm, ruler);
  const palaceSize = ruler.cycleCm / ruler.palaces.length;
  const activeCycleIndex = Math.max(0, Math.floor((currentCm - EPSILON) / ruler.cycleCm));
  const cycleCount = getCycleCount(ruler);

  return (
    <section className="lobanDragRow" aria-label={ruler.title}>
      <div className="lobanDragRowTitle">
        <strong>{ruler.title}:</strong> <span>{ruler.usage}</span>
      </div>
      <div className="lobanDragTicks" aria-hidden="true">
        {renderTicks()}
      </div>
      <div className="lobanDragSegments" aria-hidden="true">
        {Array.from({ length: cycleCount }).flatMap((_, cycleIndex) => {
          const cycleStartCm = START_CM + cycleIndex * ruler.cycleCm;

          return ruler.palaces.flatMap((palace, palaceIndex) => {
            const palaceLeft = (cycleStartCm + palaceIndex * palaceSize - START_CM) * PX_PER_CM;
            const palaceWidth = palaceSize * PX_PER_CM;
            const subWidth = palaceWidth / palace.children.length;
            const activePalace = activeCycleIndex === cycleIndex && result.palaceIndex === palaceIndex;

            return [
              <div
                key={`${cycleIndex}-${palace.name}-main`}
                className={cn("lobanDragMajor", palace.good ? "good" : "bad", activePalace && "active")}
                style={{ left: `${palaceLeft}px`, width: `${palaceWidth}px` }}
              >
                {palace.name}
              </div>,
              ...palace.children.map((child, subIndex) => {
                const activeSub = activePalace && result.subIndex === subIndex;

                return (
                  <div
                    key={`${cycleIndex}-${palace.name}-${child.name}`}
                    className={cn("lobanDragSub", child.good ? "good" : "bad", activeSub && "active")}
                    style={{ left: `${palaceLeft + subIndex * subWidth}px`, width: `${subWidth}px` }}
                  >
                    {child.name}
                  </div>
                );
              }),
            ];
          });
        })}
      </div>
    </section>
  );
}

export function ThuocLoBanTool() {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const dragStateRef = useRef({ isDragging: false, startX: 0, startScrollLeft: 0 });
  const initialScrollDoneRef = useRef(false);

  const [currentCm, setCurrentCm] = useState(INITIAL_CM);
  const [inputValue, setInputValue] = useState(String(INITIAL_CM));
  const [rulerKey, setRulerKey] = useState("522");
  const [viewportWidth, setViewportWidth] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const selectedRuler = RULER_BY_KEY[rulerKey] ?? RULERS[0];
  const selectedResult = useMemo(() => getResult(currentCm, selectedRuler), [currentCm, selectedRuler]);
  const allResults = useMemo(() => RULERS.map((ruler) => getResult(currentCm, ruler)), [currentCm]);
  const suggestions = useMemo(() => getNearbyGoodSizes(currentCm, selectedRuler), [currentCm, selectedRuler]);
  const sidePad = Math.max(160, viewportWidth / 2);
  const scaleWidth = (END_CM - START_CM) * PX_PER_CM;

  const scrollToSize = (size: number, behavior: ScrollBehavior = "smooth") => {
    const el = scrollRef.current;
    if (!el) return;
    const clamped = clampSize(size);
    el.scrollTo({ left: (clamped - START_CM) * PX_PER_CM, behavior });
  };

  const setSize = (size: number, behavior: ScrollBehavior = "smooth") => {
    const clamped = clampSize(size);
    setCurrentCm(clamped);
    setInputValue(formatCm(clamped));
    scrollToSize(clamped, behavior);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const updateViewport = () => setViewportWidth(el.clientWidth);
    updateViewport();

    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(updateViewport) : null;
    observer?.observe(el);
    window.addEventListener("resize", updateViewport);

    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", updateViewport);
    };
  }, []);

  useEffect(() => {
    if (!viewportWidth || initialScrollDoneRef.current) return;
    initialScrollDoneRef.current = true;
    scrollToSize(INITIAL_CM, "auto");
  }, [viewportWidth]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onScroll = () => {
      const value = START_CM + el.scrollLeft / PX_PER_CM;
      const clamped = clampSize(Number(value.toFixed(2)));
      setCurrentCm(clamped);
      setInputValue(formatCm(clamped));
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const handleInputChange = (raw: string) => {
    setInputValue(raw);
    const next = parseSize(raw);
    if (!Number.isFinite(next)) return;
    setCurrentCm(clampSize(next));
    scrollToSize(next, "smooth");
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    const el = scrollRef.current;
    if (!el) return;

    dragStateRef.current = {
      isDragging: true,
      startX: event.clientX,
      startScrollLeft: el.scrollLeft,
    };
    setIsDragging(true);
    el.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    const state = dragStateRef.current;
    if (!el || !state.isDragging) return;

    event.preventDefault();
    const distance = event.clientX - state.startX;
    el.scrollLeft = state.startScrollLeft - distance;
  };

  const endDragging = (event: ReactPointerEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    if (!el || !dragStateRef.current.isDragging) return;

    dragStateRef.current.isDragging = false;
    setIsDragging(false);
    if (el.hasPointerCapture(event.pointerId)) {
      el.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <section className="lobanToolShell lobanDragTool" aria-labelledby="loban-tool-title">
      <div className="lobanToolGlow one" aria-hidden="true" />
      <div className="lobanToolGlow two" aria-hidden="true" />

      <div className="lobanDragIntro">
        <div>
          <span className="lobanMiniBadge"><RulerIcon /> Thước Lỗ Ban online</span>
          <h2 id="loban-tool-title">Kéo thước ngang để tìm cung đẹp</h2>
          <p>Giữ vạch vàng ở giữa làm mốc. Kéo thước sang trái/phải hoặc nhập số cm để xem đồng thời cả 3 loại thước Lỗ Ban.</p>
        </div>
        <div className="lobanCurrentBox" aria-live="polite">
          <span>Kích thước hiện tại</span>
          <strong>{formatCm(currentCm)} cm</strong>
        </div>
      </div>

      <div className="lobanDragControls" aria-label="Điều khiển thước Lỗ Ban">
        <label className="lobanDragInput">
          <span>Nhập kích thước</span>
          <div>
            <input
              value={inputValue}
              onChange={(event) => handleInputChange(event.target.value)}
              onBlur={() => setInputValue(formatCm(currentCm))}
              inputMode="decimal"
              placeholder="Ví dụ: 81"
              aria-label="Nhập kích thước theo cm"
            />
            <b>cm</b>
          </div>
        </label>

        <div className="lobanNudgeGroup" aria-label="Tăng giảm kích thước">
          <button type="button" onClick={() => setSize(currentCm - 1)}>−1</button>
          <button type="button" onClick={() => setSize(currentCm - 0.1)}>−0.1</button>
          <button type="button" onClick={() => setSize(currentCm + 0.1)}>+0.1</button>
          <button type="button" onClick={() => setSize(currentCm + 1)}>+1</button>
        </div>

        <div className="lobanSegmented lobanDragSelector" role="tablist" aria-label="Chọn loại thước chính để gợi ý kích thước đẹp">
          {RULERS.map((ruler) => (
            <button
              key={ruler.key}
              type="button"
              role="tab"
              aria-selected={rulerKey === ruler.key}
              className={rulerKey === ruler.key ? "active" : undefined}
              onClick={() => setRulerKey(ruler.key)}
            >
              {ruler.short}
            </button>
          ))}
        </div>

        <div className="lobanQuickInline">
          {QUICK_SIZES.map((item) => (
            <button
              type="button"
              key={`${item.label}-${item.value}`}
              onClick={() => {
                setRulerKey(item.rulerKey);
                setSize(item.value);
              }}
            >
              <small>{item.label}</small>
              <strong>{item.value}cm</strong>
            </button>
          ))}
        </div>
      </div>

      <div className="lobanDragStage">
        <div className="lobanDragHelp">Hoặc kéo thước Lỗ Ban để tìm cung đẹp</div>
        <div className="lobanCenterNeedle" aria-hidden="true">
          <i />
        </div>
        <div
          ref={scrollRef}
          className={cn("lobanDragViewport", isDragging && "grabbing")}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endDragging}
          onPointerCancel={endDragging}
          onPointerLeave={endDragging}
        >
          <div
            className="lobanDragCanvas"
            style={{ width: `${scaleWidth + sidePad * 2}px`, paddingInline: `${sidePad}px` }}
          >
            <div className="lobanDragScale" style={{ width: `${scaleWidth}px` }}>
              {RULERS.map((ruler) => (
                <DragRulerRow key={ruler.key} ruler={ruler} currentCm={currentCm} />
              ))}
            </div>
          </div>
        </div>
        <div className="lobanDragScrollbarHint" aria-hidden="true" />
      </div>

      <div className="lobanDragSummary">
        <div className={cn("lobanResultCard", selectedResult.palace.good ? "good" : "bad")}> 
          <div className="lobanResultPattern" aria-hidden="true" />
          <div className="lobanResultTop">
            <span><CheckIcon /> Kết quả theo {selectedRuler.label}</span>
            <strong>{selectedResult.palace.good ? "Cung tốt" : "Cung xấu"}</strong>
          </div>
          <h3>{selectedResult.palace.name}</h3>
          <p>{selectedResult.subPalace.name}: {selectedResult.subPalace.meaning}</p>
          <div className="lobanResultFacts">
            <div>
              <span>Kích thước hiện tại</span>
              <strong>{formatCm(currentCm)}cm</strong>
            </div>
            <div>
              <span>Vị trí trong chu kỳ</span>
              <strong>{formatCm(selectedResult.position)}cm / {selectedRuler.cycleCm}cm</strong>
            </div>
          </div>
        </div>

        <div className="lobanSuggestBox lobanDragSuggest">
          <div className="lobanSectionHead compact">
            <h3>Gợi ý kích thước đẹp gần {formatCm(currentCm)}cm</h3>
            <p>Dựa theo thước {selectedRuler.label}.</p>
          </div>
          <div className="lobanSuggestList">
            {suggestions.map((size) => (
              <button
                type="button"
                key={size}
                className={Math.abs(size - currentCm) < 0.001 ? "active" : undefined}
                onClick={() => setSize(size)}
              >
                {formatCm(size, 1)}cm
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="lobanDragResultList" aria-label="Kết quả 3 loại thước Lỗ Ban">
        <h3>Kết quả</h3>
        {allResults.map((result) => (
          <article key={result.ruler.key}>
            <h4>{result.ruler.title}: <span>{result.ruler.usage}</span></h4>
            <p>
              Độ dài <strong>{formatCm(currentCm)} cm</strong> thuộc Cung{" "}
              <strong className={result.subPalace.good ? "goodText" : "badText"}>{result.subPalace.name.toUpperCase()}</strong>{" "}
              nằm trong khoảng <strong className={result.palace.good ? "goodText" : "badText"}>{result.palace.name.toUpperCase()} - {result.palace.good ? "TỐT" : "XẤU"}</strong>.
              <span> {result.subPalace.meaning}</span>
            </p>
          </article>
        ))}
      </div>

      <div className="lobanDragNote">
        <strong>Lưu ý:</strong> Kết quả chỉ mang tính tham khảo phong thủy dân gian. Khi thi công, nên ưu tiên công năng, an toàn, kết cấu và điều kiện sử dụng thực tế trước khi cân chỉnh kích thước đẹp.
      </div>
    </section>
  );
}
