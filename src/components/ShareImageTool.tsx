"use client";

import { useEffect, useMemo, useState } from "react";

type Props = {
  dateText: string;
  weekday: string;
  lunarText: string;
  canChiDay: string;
  canChiMonth: string;
  canChiYear: string;
  qualityLabel: string;
  goodHours: string;
  siteName: string;
};

function safeXml(text: string) {
  return text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

/** Chia chuỗi giờ hoàng đạo thành tối đa 2 dòng, ~40 ký tự/dòng */
function splitHours(hours: string): [string, string] {
  if (hours.length <= 42) return [hours, ""];
  const mid = hours.lastIndexOf(",", 42);
  if (mid < 0) return [hours.slice(0, 42), hours.slice(42)];
  return [hours.slice(0, mid + 1).trim(), hours.slice(mid + 1).trim()];
}

const BG_OPTIONS = [
  { value: "/bg-page-calendar.png", label: "Lịch" },
  { value: "/bg-page-clock.png", label: "Đồng hồ" },
  { value: "/bg-page-perpetual.png", label: "Vạn niên" },
  { value: "/bg-page-goodbad.png", label: "Ngày tốt" },
];

export function ShareImageTool(props: Props) {
  const [title, setTitle] = useState("Lịch hôm nay");
  const [note, setNote] = useState("Thông tin chỉ mang tính tham khảo");
  const [bgSrc, setBgSrc] = useState(BG_OPTIONS[0].value);
  const [bgDataUrl, setBgDataUrl] = useState<string>("");

  useEffect(() => {
    fetch(bgSrc)
      .then((r) => r.blob())
      .then((blob) => {
        const reader = new FileReader();
        reader.onload = () => setBgDataUrl(reader.result as string);
        reader.readAsDataURL(blob);
      })
      .catch(() => setBgDataUrl(""));
  }, [bgSrc]);

  const svg = useMemo(() => {
    const [day, month, year] = props.dateText.split("/");
    const [hoursLine1, hoursLine2] = splitHours(props.goodHours);

    const bgImg = bgDataUrl
      ? `<image href="${bgDataUrl}" width="1200" height="630" preserveAspectRatio="xMidYMid slice"/>`
      : `<rect width="1200" height="630" fill="#1a4d2e"/>`;

    const isGood = !props.qualityLabel.toLowerCase().includes("hắc");
    const badgeColor = isGood ? "#196030" : "#7a4820";
    const starColor  = isGood ? "#c9a844" : "#c9a844";
    return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <filter id="sh" x="-5%" y="-8%" width="110%" height="120%">
      <feDropShadow dx="0" dy="16" stdDeviation="28" flood-color="#050e06" flood-opacity="0.40"/>
    </filter>
  </defs>

  ${bgImg}
  <rect width="1200" height="630" fill="rgba(4,14,6,0.28)"/>

  <!-- Card: cream background -->
  <rect x="32" y="18" width="1136" height="594" rx="46" fill="#f2efe6" filter="url(#sh)"/>

  <!-- Green left panel — LEFT-rounded only (path), right edge straight at x=520 -->
  <path d="M78,18 L520,18 L520,612 L78,612 Q32,612 32,566 L32,64 Q32,18 78,18 Z" fill="#1b5e30"/>

  <!-- Decorative leaf shapes top-right of green panel -->
  <path d="M505,20 C483,9 477,42 501,37 C489,35 491,18 505,20 Z" fill="#175228" opacity="0.55"/>
  <path d="M519,18 C493,7 487,42 513,36 C501,34 503,17 519,18 Z" fill="#175228" opacity="0.40"/>
  <path d="M520,34 C498,22 494,54 514,49 C504,47 506,30 520,34 Z" fill="#175228" opacity="0.30"/>
  <!-- Bottom-left corner leaves -->
  <path d="M40,602 C62,613 68,581 46,585 C58,583 56,600 40,602 Z" fill="#175228" opacity="0.45"/>
  <path d="M32,612 C58,625 64,590 40,596 C52,594 50,614 32,612 Z" fill="#175228" opacity="0.32"/>

  <!-- ══ LEFT PANEL  center-x=276 ══ -->

  <!-- Number: baseline y=234, top≈97, pad=79px từ card top(18) — an toàn qua góc bo rx=46 -->
  <text x="276" y="234" text-anchor="middle" font-family="Georgia,serif" font-size="190" font-weight="900" fill="#ffffff" letter-spacing="-5">${safeXml(day || "")}</text>

  <!-- Ornament: y=282, gap=48px từ baseline — không đè -->
  <line x1="86" y1="278" x2="240" y2="278" stroke="#c9a844" stroke-width="1.5" opacity="0.55"/>
  <path d="M276,280 C274,273 270,267 268,263 C272,266 275,274 276,280 Z" fill="none" stroke="#c9a844" stroke-width="1.2"/>
  <path d="M276,280 C275,272 273,266 276,262 C279,266 277,272 276,280 Z" fill="none" stroke="#c9a844" stroke-width="1.4"/>
  <path d="M276,280 C276,271 276,265 276,261 C278,265 276,271 276,280 Z" fill="none" stroke="#c9a844" stroke-width="1.6"/>
  <path d="M276,280 C277,272 279,266 276,262 C273,266 275,272 276,280 Z" fill="none" stroke="#c9a844" stroke-width="1.4"/>
  <path d="M276,280 C278,273 282,267 284,263 C280,266 277,274 276,280 Z" fill="none" stroke="#c9a844" stroke-width="1.2"/>
  <circle cx="276" cy="281" r="2.2" fill="#c9a844"/>
  <line x1="312" y1="278" x2="466" y2="278" stroke="#c9a844" stroke-width="1.5" opacity="0.55"/>

  <!-- Weekday -->
  <text x="276" y="325" text-anchor="middle" font-family="Georgia,serif" font-size="31" font-weight="700" fill="#ffffff">${safeXml(props.weekday)}</text>
  <!-- Month gold -->
  <text x="276" y="361" text-anchor="middle" font-family="Arial,sans-serif" font-size="25" font-weight="700" fill="#c9a844">Tháng ${safeXml(month || "")} / ${safeXml(year || "")}</text>

  <line x1="96" y1="384" x2="456" y2="384" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>

  <!-- Calendar icon + Âm lịch — căn giữa tại x=276 -->
  <!-- icon: 22×20, placed so center of [icon + text] ≈ x=276; icon left=146 -->
  <rect x="146" y="397" width="22" height="20" rx="3" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="1.5"/>
  <line x1="152" y1="397" x2="152" y2="393" stroke="rgba(255,255,255,0.5)" stroke-width="1.8" stroke-linecap="round"/>
  <line x1="163" y1="397" x2="163" y2="393" stroke="rgba(255,255,255,0.5)" stroke-width="1.8" stroke-linecap="round"/>
  <line x1="146" y1="403" x2="168" y2="403" stroke="rgba(255,255,255,0.3)" stroke-width="1"/>
  <text x="174" y="413" font-family="Arial,sans-serif" font-size="18" fill="rgba(255,255,255,0.72)">Âm lịch: ${safeXml(props.lunarText)}</text>

  <!-- Can chi -->
  <text x="276" y="449" text-anchor="middle" font-family="Arial,sans-serif" font-size="18" fill="rgba(255,255,255,0.58)">Ngày ${safeXml(props.canChiDay)} - Tháng ${safeXml(props.canChiMonth)}</text>
  <text x="276" y="475" text-anchor="middle" font-family="Arial,sans-serif" font-size="18" fill="rgba(255,255,255,0.58)">Năm ${safeXml(props.canChiYear)}</text>

  <line x1="96" y1="497" x2="456" y2="497" stroke="rgba(255,255,255,0.11)" stroke-width="1"/>
  <!-- site name centered in 497→612, mid=554 -->
  <text x="276" y="560" text-anchor="middle" font-family="Arial,sans-serif" font-size="16" font-weight="600" fill="rgba(255,255,255,0.30)">${safeXml(props.siteName)}</text>

  <!-- ══ RIGHT PANEL  starts x=548 ══ -->

  <!-- Botanical leaf decoration bottom-right (light green, faint) -->
  <!-- Main stem -->
  <path d="M1088,535 C1072,515 1080,490 1094,476" fill="none" stroke="#a8c8a0" stroke-width="1.5" opacity="0.3"/>
  <!-- Leaves on stem -->
  <path d="M1078,522 C1068,510 1076,498 1082,504 C1078,510 1070,518 1078,522 Z" fill="#a8c8a0" opacity="0.22"/>
  <path d="M1086,508 C1074,498 1080,484 1088,490 C1084,496 1076,504 1086,508 Z" fill="#a8c8a0" opacity="0.18"/>
  <path d="M1094,492 C1082,484 1086,470 1094,476 C1090,482 1084,490 1094,492 Z" fill="#a8c8a0" opacity="0.16"/>
  <!-- Second branch -->
  <path d="M1110,545 C1096,525 1108,500 1122,488" fill="none" stroke="#a8c8a0" stroke-width="1.2" opacity="0.22"/>
  <path d="M1106,530 C1098,520 1106,508 1112,514 C1108,520 1100,528 1106,530 Z" fill="#a8c8a0" opacity="0.18"/>

  <!-- Leaf icon: upright symmetric leaf + stem -->
  <path d="M557,160 C550,152 548,141 552,135 C555,129 563,129 566,135 C570,141 568,153 557,160 Z" fill="#3d7250"/>
  <line x1="557" y1="160" x2="555" y2="167" stroke="#3d7250" stroke-width="1.6" stroke-linecap="round"/>
  <text x="573" y="154" font-family="Arial,sans-serif" font-size="15" font-weight="700" fill="#7a9280" letter-spacing="3">${safeXml(title.toUpperCase())}</text>

  <!-- Divider under title. Tiny dot on right end (like reference) -->
  <line x1="548" y1="168" x2="1152" y2="168" stroke="#cbc7bb" stroke-width="1"/>
  <circle cx="1152" cy="168" r="2.5" fill="#cbc7bb"/>

  <!-- Quality badge: outlined pill + dark circle with star on left -->
  <rect x="548" y="228" width="320" height="68" rx="34" fill="none" stroke="${badgeColor}" stroke-width="2"/>
  <!-- Dark green circle on left inside badge -->
  <circle cx="592" cy="262" r="24" fill="#0f3b1e"/>
  <!-- 4-pointed star inside circle -->
  <path d="M592,253 L595,261 L603,262 L595,263 L592,271 L589,263 L581,262 L589,261 Z" fill="${starColor}"/>
  <!-- Quality text -->
  <text x="626" y="270" font-family="Arial,sans-serif" font-size="27" font-weight="800" fill="${badgeColor}">${safeXml(props.qualityLabel)}</text>

  <!-- Clock icon -->
  <circle cx="552" cy="357" r="14" fill="none" stroke="#3a6048" stroke-width="1.8"/>
  <line x1="552" y1="349" x2="552" y2="358" stroke="#3a6048" stroke-width="2" stroke-linecap="round"/>
  <line x1="552" y1="358" x2="560" y2="363" stroke="#3a6048" stroke-width="2" stroke-linecap="round"/>
  <text x="576" y="364" font-family="Arial,sans-serif" font-size="22" font-weight="800" fill="#15211a">Giờ hoàng đạo</text>

  <!-- Hours text -->
  <text x="550" y="403" font-family="Arial,sans-serif" font-size="19" fill="#4a6858">${safeXml(hoursLine1)}</text>
  ${hoursLine2 ? `<text x="550" y="430" font-family="Arial,sans-serif" font-size="19" fill="#4a6858">${safeXml(hoursLine2)}</text>` : ""}

  <!-- Footer divider -->
  <line x1="548" y1="542" x2="1152" y2="542" stroke="#cbc7bb" stroke-width="1"/>

  <!-- Info circle icon -->
  <circle cx="563" cy="580" r="12" fill="none" stroke="#9aab9e" stroke-width="1.5"/>
  <text x="563" y="585" text-anchor="middle" font-family="Georgia,serif" font-size="13" font-weight="700" fill="#9aab9e">i</text>
  <text x="585" y="585" font-family="Arial,sans-serif" font-size="16" fill="#9aab9e">${safeXml(note)}</text>
  <!-- Vertical separator -->
  <line x1="1040" y1="566" x2="1040" y2="594" stroke="#c0bcb0" stroke-width="1"/>
  <!-- Site name right-anchored to avoid overflow -->
  <text x="1148" y="585" text-anchor="end" font-family="Arial,sans-serif" font-size="19" font-weight="800" fill="#196030">${safeXml(props.siteName)}</text>
</svg>`;
  }, [bgDataUrl, note, props, title]);

  const svgHref = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

  async function downloadPng() {
    const image = new Image();
    const svgBlob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 1200;
      canvas.height = 630;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(image, 0, 0);
      URL.revokeObjectURL(url);
      const link = document.createElement("a");
      link.download = `lich-ngay-${props.dateText.replaceAll("/", "-")}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
    image.src = url;
  }

  return (
    <section className="shareImageBuilder">
      <div className="shareImageControls panelCard">
        <p className="eyebrow">Tùy chỉnh ảnh</p>
        <h2>Tạo ảnh lịch 1200×630</h2>
        <label>
          <span>Tiêu đề</span>
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
        <label>
          <span>Ghi chú</span>
          <input value={note} onChange={(e) => setNote(e.target.value)} />
        </label>
        <label>
          <span>Ảnh nền</span>
          <div className="bgPickerRow">
            {BG_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={["bgPickerBtn", bgSrc === opt.value ? "active" : ""].join(" ")}
                style={{ backgroundImage: `url(${opt.value})` }}
                onClick={() => setBgSrc(opt.value)}
                aria-label={opt.label}
                title={opt.label}
              />
            ))}
          </div>
        </label>
        <div className="shareImageActions">
          <button type="button" onClick={downloadPng}>Tải PNG</button>
          <a href={svgHref} download={`lich-ngay-${props.dateText.replaceAll("/", "-")}.svg`}>Tải SVG</a>
        </div>
        <p className="smallNote">Dùng ảnh này để chia sẻ trên Facebook, Zalo, website hoặc fanpage.</p>
      </div>
      <div className="shareImagePreview panelCard">
        <img src={svgHref} alt={`Ảnh lịch ngày ${props.dateText}`} />
      </div>
    </section>
  );
}
