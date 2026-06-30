"use client";

export function CalendarPrintActions() {
  return (
    <div className="printActions noPrint">
      <button type="button" onClick={() => window.print()}>In / Lưu PDF</button>
      <button type="button" className="secondaryPrintButton" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Lên đầu trang</button>
    </div>
  );
}
