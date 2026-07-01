"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { SiteIcon } from "./Icon";
import { defaultTuViInput, lapLaSoTuVi, normalizeTuViInput } from "@/lib/calendar/la-so-tu-vi";
import type { TuViCalendarType, TuViChart, TuViGender, TuViInput, TuViPalace, TuViStar } from "@/lib/calendar/la-so-tu-vi";

const PALACE_GRID: Record<string, { col: string; row: string }> = {
  Tỵ: { col: "1", row: "1" },
  Ngọ: { col: "2", row: "1" },
  Mùi: { col: "3", row: "1" },
  Thân: { col: "4", row: "1" },
  Thìn: { col: "1", row: "2" },
  Dậu: { col: "4", row: "2" },
  Mão: { col: "1", row: "3" },
  Tuất: { col: "4", row: "3" },
  Dần: { col: "1", row: "4" },
  Sửu: { col: "2", row: "4" },
  Tý: { col: "3", row: "4" },
  Hợi: { col: "4", row: "4" },
};

const elementLegend = ["Kim", "Mộc", "Thủy", "Hỏa", "Thổ"] as const;

function formatDateKey(d: { year: number; month: number; day: number }): string {
  return `${d.year}-${String(d.month).padStart(2, "0")}-${String(d.day).padStart(2, "0")}`;
}

function parseDateKey(s: string): { year: number; month: number; day: number } | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) return null;
  return { year: parseInt(m[1]), month: parseInt(m[2]), day: parseInt(m[3]) };
}

function StarList({ stars, limit }: { stars: TuViStar[]; limit?: number }) {
  const visible = limit ? stars.slice(0, limit) : stars;
  if (visible.length === 0) return null;
  return (
    <div className="tuViStarList">
      {visible.map((star) => (
        <span className={`tuViStar ${star.tone}`} key={`${star.name}-${star.note ?? ""}`} title={star.note}>{star.name}</span>
      ))}
    </div>
  );
}

function PalaceCard({ palace }: { palace: TuViPalace }) {
  const pos = PALACE_GRID[palace.branch];
  return (
    <article
      className={`tuViPalace palace-${palace.key}${palace.isBodyPalace ? " isThan" : ""}`}
      style={{ gridColumn: pos.col, gridRow: pos.row }}
      aria-label={`Cung ${palace.name} tại ${palace.branch}`}
    >
      <header className="tuViPalaceTop">
        <span>{palace.canChi}</span>
        <strong>{palace.name}{palace.isBodyPalace ? " · THÂN" : ""}</strong>
        <em>{palace.decadeAge}</em>
      </header>
      <div className="tuViPalaceMeta">
        <span>+{palace.element}</span>
        <span>{palace.lifeStage}</span>
      </div>
      <StarList stars={palace.mainStars} />
      <StarList stars={palace.supportStars} limit={5} />
      <StarList stars={palace.warningStars} limit={4} />
      <StarList stars={palace.otherStars} limit={5} />
      <footer className="tuViPalaceFooter">
        <span>ĐV.{palace.shortName.toUpperCase()}</span>
        <span>LN.{palace.branch}</span>
      </footer>
    </article>
  );
}

function ChartCenter({ chart }: { chart: TuViChart }) {
  return (
    <section className="tuViCenter" aria-label="Thông tin trung tâm lá số">
      <p className="eyebrow">NgayGio.vn · Lá số tham khảo</p>
      <h2>Lá Số Tử Vi</h2>
      <div className="tuViCenterRows">
        <span>Họ tên:</span><strong>{chart.input.fullName}</strong>
        <span>Năm:</span><strong>{chart.lunarDate.year} · {chart.canChi.year}</strong>
        <span>Tháng:</span><strong>{chart.lunarDate.month}{chart.lunarDate.isLeap ? " nhuận" : ""} · {chart.canChi.month}</strong>
        <span>Ngày:</span><strong>{chart.lunarDate.day} · {chart.canChi.day}</strong>
        <span>Giờ:</span><strong>{chart.input.birthTime} · {chart.canChi.hour}</strong>
        <span>Năm xem:</span><strong>{chart.input.viewYear}, {chart.age} tuổi âm</strong>
        <span>Âm dương:</span><strong>{chart.yinYangLabel}</strong>
        <span>Bản mệnh:</span><strong>{chart.napAm}</strong>
        <span>Cục:</span><strong>{chart.cuc.name} · {chart.cuc.napAm}</strong>
        <span>Cân lượng:</span><strong>{chart.canLuong}</strong>
        <span>Chủ mệnh:</span><strong>{chart.lifeMaster}</strong>
        <span>Chủ thân:</span><strong>{chart.bodyMaster}</strong>
        <span>Lai nhân cung:</span><strong>{chart.laiNhanCung}</strong>
      </div>
    </section>
  );
}

function ChartLegend() {
  return (
    <div className="tuViLegend" aria-label="Chú giải màu sao">
      <span className="tuViStar major">Chính tinh</span>
      <span className="tuViStar good">Cát tinh</span>
      <span className="tuViStar wealth">Lộc tinh</span>
      <span className="tuViStar bad">Sát/bại tinh</span>
      <span className="tuViStar neutral">Phụ tinh</span>
      {elementLegend.map((element) => <span key={element} className={`elementDot element-${element}`}>{element}</span>)}
    </div>
  );
}

function TuViChartView({ chart, onReset }: { chart: TuViChart; onReset: () => void }) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  async function handleDownloadImage() {
    const node = gridRef.current;
    if (!node) return;
    setDownloading(true);
    try {
      const html2canvas = (await import("html2canvas")).default;

      // html2canvas doesn't support oklch — inline computed colors on all descendants
      const all = [node, ...Array.from(node.querySelectorAll<HTMLElement>("*"))];
      const origColors: Array<{ el: HTMLElement; color: string; bg: string }> = [];
      for (const el of all) {
        const cs = window.getComputedStyle(el);
        const color = cs.color;
        const bg = cs.backgroundColor;
        const needsPatch = color.includes("oklch") || bg.includes("oklch");
        if (needsPatch) {
          origColors.push({ el, color: el.style.color, bg: el.style.backgroundColor });
          if (color.includes("oklch")) el.style.color = color; // force re-resolve via cascade
          if (bg.includes("oklch")) el.style.backgroundColor = bg;
        }
      }

      const canvas = await html2canvas(node, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#fff",
        logging: false,
        onclone: (clonedDoc) => {
          // Strip any oklch from cloned stylesheets by replacing with transparent fallback
          clonedDoc.querySelectorAll<HTMLStyleElement>("style").forEach((s) => {
            if (s.textContent?.includes("oklch")) {
              s.textContent = s.textContent.replace(/oklch\([^)]+\)/g, "transparent");
            }
          });
        },
      });

      // Restore original inline styles
      for (const { el, color, bg } of origColors) {
        el.style.color = color;
        el.style.backgroundColor = bg;
      }
      const a = document.createElement("a");
      a.download = `La-so-tu-vi-${chart.input.fullName.replace(/\s+/g, "-") || "chua-nhap-ten"}.png`;
      a.href = canvas.toDataURL("image/png");
      a.click();
    } catch (err) {
      console.error("Lỗi tải ảnh:", err);
      alert("Không thể xuất ảnh. Vui lòng thử lại hoặc dùng chức năng chụp màn hình.");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <section className="panelCard tuViChartPanel" aria-labelledby="la-so-chart-title">
      <div className="sectionHeaderRow noPrint">
        <div>
          <p className="eyebrow">Kết quả</p>
          <h2 id="la-so-chart-title">Lá số tử vi của {chart.input.fullName}</h2>
          <p className="tuViChartSummary">{chart.summary}</p>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button type="button" className="tuViPrintBtn" onClick={() => window.print()} aria-label="In lá số">
            🖨 In lá số
          </button>
          <button type="button" className="tuViPrintBtn" onClick={handleDownloadImage} disabled={downloading} aria-label="Tải ảnh lá số">
            {downloading ? "Đang xuất…" : "⬇ Tải ảnh"}
          </button>
          <button type="button" className="sectionHeaderLink" onClick={onReset} style={{ background: "none", border: "none", cursor: "pointer" }}>
            Lập lá số mới
          </button>
        </div>
      </div>
      <ChartLegend />
      <div className="tuViChartGrid" ref={gridRef}>
        {chart.palaces.map((palace) => <PalaceCard palace={palace} key={palace.key} />)}
        <ChartCenter chart={chart} />
      </div>
    </section>
  );
}

function ReadingPanel({ chart }: { chart: TuViChart }) {
  return (
    <section className="tuViReadingGrid" aria-label="Luận giải nhanh lá số">
      {chart.reading.map((item) => (
        <article className="panelCard tuViReadingCard" key={item.title}>
          <p className="eyebrow">Luận giải nhanh</p>
          <h2>{item.title}</h2>
          <p>{item.text}</p>
        </article>
      ))}
    </section>
  );
}

function TuViForm({ input, onSubmit }: { input: TuViInput; onSubmit: (input: TuViInput) => void }) {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const dateStr = fd.get("date") as string;
    const birthDate = parseDateKey(dateStr) ?? input.birthDate;
    const viewYear = parseInt(fd.get("viewYear") as string);

    const newInput: TuViInput = normalizeTuViInput({
      fullName: (fd.get("name") as string).trim() || "Chưa nhập tên",
      gender: (fd.get("gender") as TuViGender) || "nam",
      calendarType: (fd.get("calendar") as TuViCalendarType) || "solar",
      birthDate,
      birthTime: (fd.get("time") as string) || "00:00",
      isLeapMonth: fd.get("leap") === "1",
      viewYear: Number.isInteger(viewYear) ? viewYear : new Date().getFullYear(),
    });
    onSubmit(newInput);
  }

  return (
    <section className="panelCard tuViFormPanel" aria-labelledby="la-so-form-title">
      <div className="sectionHeaderRow">
        <div>
          <p className="eyebrow"><SiteIcon name="bagua" /> Công cụ</p>
          <h2 id="la-so-form-title">Nhập thông tin để lập lá số</h2>
        </div>
      </div>
      <form className="tuViForm" onSubmit={handleSubmit}>
        <div className="tuViFormRow">
          <label>
            Họ tên
            <input name="name" type="text" placeholder="Ví dụ: Nguyễn Văn A" defaultValue={input.fullName} />
          </label>
          <label>
            Giới tính
            <select name="gender" defaultValue={input.gender}>
              <option value="nam">Nam</option>
              <option value="nu">Nữ</option>
            </select>
          </label>
          <label>
            Loại ngày sinh
            <select name="calendar" defaultValue={input.calendarType}>
              <option value="solar">Ngày dương lịch</option>
              <option value="lunar">Ngày âm lịch</option>
            </select>
          </label>
        </div>
        <div className="tuViFormRow">
          <label>
            Ngày sinh
            <input name="date" type="date" defaultValue={formatDateKey(input.birthDate)} min="1900-01-01" max="2199-12-31" required />
          </label>
          <label>
            Giờ sinh
            <input name="time" type="time" defaultValue={input.birthTime} required />
          </label>
          <label>
            Năm xem
            <input name="viewYear" type="number" min="1900" max="2199" defaultValue={input.viewYear} />
          </label>
          <label className="tuViCheckLabel">
            <input name="leap" type="checkbox" value="1" defaultChecked={Boolean(input.isLeapMonth)} />
            <span>Tháng âm nhuận</span>
          </label>
          <button type="submit">Lập lá số</button>
        </div>
      </form>
      <p className="smallNote">Nếu chọn ngày âm lịch, ô "Ngày sinh" vẫn nhập theo định dạng ngày/tháng/năm nhưng được hiểu là ngày âm. Lá số và phần luận giải chỉ nên dùng để tham khảo văn hóa dân gian.</p>
    </section>
  );
}

export function LaSoTuViTool({ defaultYear }: { defaultYear: number }) {
  const [chart, setChart] = useState<TuViChart | null>(null);
  const [input] = useState<TuViInput>(() => defaultTuViInput(defaultYear));

  function handleSubmit(newInput: TuViInput) {
    const result = lapLaSoTuVi(newInput);
    setChart(result);
    setTimeout(() => {
      document.getElementById("la-so-chart-title")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }

  function handleReset() {
    setChart(null);
    setTimeout(() => {
      document.getElementById("la-so-form-title")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }

  return (
    <>
      <section className="heroCard tuViLapHero" aria-labelledby="la-so-tu-vi-title">
        <div>
          <p className="eyebrow"><SiteIcon name="bagua" /> Lập lá số tử vi</p>
          <h1 id="la-so-tu-vi-title">Lập lá số tử vi theo ngày giờ sinh</h1>
          <p className="converterIntro yearIntroText">Nhập họ tên, giới tính, ngày sinh, giờ sinh và năm xem để dựng lá số 12 cung: Mệnh, Phụ Mẫu, Phúc Đức, Điền Trạch, Quan Lộc, Tài Bạch, Phu Thê và các cung liên quan.</p>
          <div className="activityHeroBadges">
            <span>12 cung tử vi</span>
            <span>Can chi · âm lịch</span>
            <span>An cung Mệnh/Thân</span>
            <span>Luận giải tham khảo</span>
          </div>
        </div>
        <aside className="tuViHeroPreview" aria-label="Minh họa lá số tử vi">
          <SiteIcon name="bagua" />
          <strong>Lá số</strong>
          <span>12 cung · sao · đại vận</span>
        </aside>
      </section>

      <TuViForm input={input} onSubmit={handleSubmit} />

      {chart ? (
        <>
          <TuViChartView chart={chart} onReset={handleReset} />
          <ReadingPanel chart={chart} />
          <article className="seoArticle">
            <h2>Lưu ý khi xem lá số tử vi</h2>
            <p>Lá số tử vi trên Ngaygio.vn là công cụ tham khảo theo văn hóa dân gian, giúp bạn có thêm góc nhìn về 12 cung, can chi, Mệnh, Thân và một số sao thường gặp. Không nên dùng nội dung này làm căn cứ duy nhất cho quyết định sức khỏe, tài chính, pháp lý hoặc việc hệ trọng.</p>
            <h2>Nên xem thêm gì?</h2>
            <p>Sau khi lập lá số, bạn có thể xem thêm tử vi hôm nay, ngày tốt xấu hôm nay và công cụ xem ngày tốt theo tuổi để có thêm lớp tham khảo theo ngày hiện tại.</p>
            <div className="resultActions wideActions">
              <Link href="/tu-vi-hom-nay">Tử vi hôm nay</Link>
              <Link href="/xem-ngay-tot-theo-tuoi">Xem ngày tốt theo tuổi</Link>
              <Link href="/ngay-tot-xau-hom-nay">Ngày tốt xấu hôm nay</Link>
            </div>
          </article>
        </>
      ) : (
        <section className="panelCard tuViEmptyState">
          <p className="eyebrow">Gợi ý</p>
          <h2>Cách dùng công cụ lập lá số</h2>
          <p>Điền đủ ngày sinh và giờ sinh để hệ thống đổi sang âm lịch, tính can chi năm/tháng/ngày/giờ, xác định Mệnh – Thân, cục, đại vận và dựng bảng 12 cung. Phần sao đã an theo bộ quy tắc phổ thông: 14 chính tinh, Tuần/Triệt, Lộc Tồn – Bác Sĩ, Thái Tuế, Tràng Sinh và một số sao phụ thường dùng.</p>
          <div className="fortunePills large">
            <span>Ngày sinh càng chính xác, lá số càng có giá trị tham khảo</span>
            <span>Giờ Tý: 23h–1h</span>
            <span>Dùng cho tham khảo, không phải kết luận tuyệt đối</span>
          </div>
        </section>
      )}
    </>
  );
}
