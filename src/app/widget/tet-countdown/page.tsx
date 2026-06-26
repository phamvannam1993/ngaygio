import type { Metadata } from "next";
import Link from "next/link";
import { getVietnamTodayParts, formatDisplayDate } from "@/lib/date";
import { getTetInfo } from "@/lib/calendar/tet";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Widget đếm ngược Tết – Ngaygio.vn",
  robots: { index: false, follow: false },
};

export default function TetCountdownWidget() {
  const today = getVietnamTodayParts();
  const tet = getTetInfo(today);
  const tetDisplay = formatDisplayDate(tet.solarDate);

  return (
    <>
      {/* Reset body for iframe embedding — override root layout styles */}
      <style>{`
        body { margin: 0 !important; padding: 0 !important; background: transparent !important; overflow: hidden; }
      `}</style>
    <div style={{
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      background: "linear-gradient(135deg, #c62a2a 0%, #8b0000 100%)",
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      margin: 0,
      padding: "16px",
      boxSizing: "border-box",
    }}>
      <div style={{ textAlign: "center", maxWidth: "320px", width: "100%" }}>
        <p style={{ fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", opacity: 0.8, marginBottom: "8px" }}>
          Còn
        </p>
        <p style={{ fontSize: "clamp(3rem, 15vw, 5rem)", fontWeight: 900, lineHeight: 1, marginBottom: "4px" }}>
          {tet.daysLeft}
        </p>
        <p style={{ fontSize: "1.1rem", opacity: 0.85, marginBottom: "16px" }}>
          ngày nữa đến Tết {tet.canChi} {tet.year}
        </p>
        <p style={{ fontSize: "0.85rem", opacity: 0.75, marginBottom: "12px" }}>
          Mùng 1 Tết: {tetDisplay}
        </p>
        <Link
          href={siteConfig.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: "0.7rem", opacity: 0.55, color: "inherit" }}
        >
          Ngaygio.vn
        </Link>
      </div>
    </div>
    </>
  );
}
