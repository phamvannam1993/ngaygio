import type { Metadata } from "next";
import Link from "next/link";
import { formatDisplayDate, getVietnamTodayParts } from "@/lib/date";
import { formatHours } from "@/lib/calendar/can-chi";
import { getDayInfo } from "@/lib/calendar/service";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Widget lịch âm hôm nay – Ngaygio.vn",
  robots: { index: false, follow: false },
};

export default function LunarTodayWidget() {
  const today = getVietnamTodayParts();
  const day = getDayInfo(today);

  return (
    <>
      <style>{`body{margin:0!important;padding:0!important;background:transparent!important;overflow:hidden}`}</style>
      <div style={{
        minHeight: "100vh",
        boxSizing: "border-box",
        padding: 16,
        display: "grid",
        placeItems: "center",
        color: "#17221b",
        fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
        background: "linear-gradient(135deg,#eefbf2 0%,#fff7df 100%)",
      }}>
        <div style={{ width: "100%", maxWidth: 340, background: "rgba(255,255,255,.92)", border: "1px solid #dce8df", borderRadius: 20, padding: 18, boxShadow: "0 16px 36px rgba(23,34,27,.12)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
            <div>
              <p style={{ margin: "0 0 6px", fontSize: 12, letterSpacing: ".12em", textTransform: "uppercase", color: "#166a2b", fontWeight: 900 }}>Âm lịch hôm nay</p>
              <strong style={{ fontSize: 16 }}>{day.weekdayName}, {formatDisplayDate(today)}</strong>
            </div>
            <span style={{ background: "#208a3a", color: "#fff", borderRadius: 999, padding: "6px 10px", fontSize: 12, fontWeight: 800 }}>{day.quality.label}</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "96px 1fr", gap: 14, alignItems: "center", marginTop: 14 }}>
            <span style={{ fontSize: 72, lineHeight: .9, color: "#208a3a", fontWeight: 900 }}>{day.lunar.day}</span>
            <div style={{ fontSize: 14, color: "#637267", lineHeight: 1.5, fontWeight: 700 }}>
              <div>Tháng {day.lunar.month}{day.lunar.isLeap ? " nhuận" : ""} năm {day.canChi.year}</div>
              <div>Ngày {day.canChi.day}</div>
              <div>Tiết khí: {day.solarTerm}</div>
            </div>
          </div>
          <p style={{ margin: "12px 0 8px", fontSize: 13, color: "#637267", lineHeight: 1.45 }}><strong style={{ color: "#166a2b" }}>Giờ tốt:</strong> {formatHours(day.goodHours)}</p>
          <Link href={siteConfig.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: "#166a2b", fontWeight: 800 }}>Nguồn: {siteConfig.domain}</Link>
        </div>
      </div>
    </>
  );
}
