"use client";

import { useRef, useState } from "react";

type Props = {
  name: string;
  lifePath: number;
  keyword: string;
  dob: string;
  expression: number;
  soul: number;
};

export function NumerologyShareCard({ name, lifePath, keyword, dob, expression, soul }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);

  async function handleDownload() {
    const node = cardRef.current;
    if (!node) return;
    setBusy(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      // html2canvas không hỗ trợ oklch — inline lại màu computed cho toàn bộ node con.
      const all = [node, ...Array.from(node.querySelectorAll<HTMLElement>("*"))];
      const orig: Array<{ el: HTMLElement; color: string; bg: string }> = [];
      for (const el of all) {
        const cs = window.getComputedStyle(el);
        if (cs.color.includes("oklch") || cs.backgroundColor.includes("oklch")) {
          orig.push({ el, color: el.style.color, bg: el.style.backgroundColor });
          if (cs.color.includes("oklch")) el.style.color = cs.color;
          if (cs.backgroundColor.includes("oklch")) el.style.backgroundColor = cs.backgroundColor;
        }
      }
      const canvas = await html2canvas(node, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
        logging: false,
        onclone: (doc) => {
          doc.querySelectorAll<HTMLStyleElement>("style").forEach((s) => {
            if (s.textContent?.includes("oklch")) {
              s.textContent = s.textContent.replace(/oklch\([^)]+\)/g, "transparent");
            }
          });
        },
      });
      for (const { el, color, bg } of orig) {
        el.style.color = color;
        el.style.backgroundColor = bg;
      }
      const a = document.createElement("a");
      a.download = `than-so-hoc-${name.replace(/\s+/g, "-") || "ket-qua"}.png`;
      a.href = canvas.toDataURL("image/png");
      a.click();
    } catch {
      alert("Không thể tạo ảnh. Bạn có thể dùng chức năng chụp màn hình để lưu kết quả.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="tshShareReal">
      <div className="tshShareMock" ref={cardRef}>
        <small>NgayGio.vn • Thần số học</small>
        <strong>{name}</strong>
        <span className="tshShareBig">{lifePath}</span>
        <b>Số chủ đạo • {keyword}</b>
        <div className="tshShareMeta">
          <span>Ngày sinh: {dob}</span>
          <span>Sứ mệnh {expression} • Linh hồn {soul}</span>
        </div>
      </div>
      <button type="button" onClick={handleDownload} disabled={busy} className="tshShareBtn">
        {busy ? "Đang tạo ảnh…" : "⬇ Tải ảnh kết quả"}
      </button>
    </div>
  );
}
