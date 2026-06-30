"use client";

import { useMemo, useState } from "react";

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

export function ShareImageTool(props: Props) {
  const [title, setTitle] = useState("Lịch hôm nay");
  const [note, setNote] = useState("Thông tin chỉ mang tính tham khảo");

  const svg = useMemo(() => {
    const [day, month, year] = props.dateText.split("/");
    return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="#f4fff7"/>
      <stop offset="0.55" stop-color="#fff8e5"/>
      <stop offset="1" stop-color="#e8f7ee"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="20" stdDeviation="25" flood-color="#14351f" flood-opacity="0.16"/>
    </filter>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <circle cx="1060" cy="80" r="180" fill="#208a3a" opacity="0.08"/>
  <circle cx="80" cy="560" r="220" fill="#f3bc3d" opacity="0.18"/>
  <rect x="72" y="66" width="1056" height="498" rx="42" fill="#ffffff" filter="url(#shadow)"/>
  <rect x="96" y="90" width="1008" height="450" rx="32" fill="none" stroke="#dce8df" stroke-width="2"/>
  <text x="126" y="150" font-family="Arial, sans-serif" font-size="34" font-weight="800" fill="#166a2b">${safeXml(title)}</text>
  <text x="126" y="196" font-family="Arial, sans-serif" font-size="24" font-weight="700" fill="#637267">${safeXml(props.weekday)} · ${safeXml(props.dateText)}</text>
  <text x="126" y="402" font-family="Arial, sans-serif" font-size="190" font-weight="900" fill="#208a3a">${safeXml(day || "")}</text>
  <text x="330" y="324" font-family="Arial, sans-serif" font-size="42" font-weight="800" fill="#17221b">Tháng ${safeXml(month || "")} / ${safeXml(year || "")}</text>
  <text x="330" y="378" font-family="Arial, sans-serif" font-size="30" font-weight="700" fill="#637267">Âm lịch: ${safeXml(props.lunarText)}</text>
  <text x="330" y="426" font-family="Arial, sans-serif" font-size="28" font-weight="700" fill="#637267">Ngày ${safeXml(props.canChiDay)} · Tháng ${safeXml(props.canChiMonth)}</text>
  <rect x="748" y="140" width="292" height="78" rx="24" fill="#eefbf2" stroke="#bfe8cb"/>
  <text x="894" y="187" text-anchor="middle" font-family="Arial, sans-serif" font-size="30" font-weight="900" fill="#166a2b">${safeXml(props.qualityLabel)}</text>
  <text x="748" y="282" font-family="Arial, sans-serif" font-size="28" font-weight="900" fill="#17221b">Giờ hoàng đạo</text>
  <foreignObject x="748" y="304" width="310" height="112">
    <div xmlns="http://www.w3.org/1999/xhtml" style="font-family:Arial,sans-serif;font-size:22px;line-height:1.45;color:#637267;font-weight:700;">${safeXml(props.goodHours)}</div>
  </foreignObject>
  <text x="126" y="500" font-family="Arial, sans-serif" font-size="22" fill="#637267">${safeXml(note)}</text>
  <text x="1040" y="500" text-anchor="end" font-family="Arial, sans-serif" font-size="24" font-weight="900" fill="#166a2b">${safeXml(props.siteName)}</text>
</svg>`;
  }, [note, props, title]);

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
          <input value={title} onChange={(event) => setTitle(event.target.value)} />
        </label>
        <label>
          <span>Ghi chú</span>
          <input value={note} onChange={(event) => setNote(event.target.value)} />
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
