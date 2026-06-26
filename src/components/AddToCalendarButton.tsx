"use client";

import { useEffect, useState } from "react";

type Props = {
  title: string;
  date: string;         // "YYYY-MM-DD"
  description?: string;
  url?: string;
};

function toGCalDate(d: string) {
  return d.replace(/-/g, "");
}

function toIcs(title: string, date: string, description: string, url: string) {
  const d = date.replace(/-/g, "");
  const stamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//ngaygio.vn//Lich//VI",
    "BEGIN:VEVENT",
    `UID:${d}@ngaygio.vn`,
    `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${d}`,
    `DTEND;VALUE=DATE:${d}`,
    `SUMMARY:${esc(title)}`,
    `DESCRIPTION:${esc(description || "")}`,
    url ? `URL:${url}` : "",
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean).join("\r\n");
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(lines)}`;
}

export function AddToCalendarButton({ title, date, description = "", url = "" }: Props) {
  const [open, setOpen] = useState(false);
  const [icsHref, setIcsHref] = useState("#");
  const d = toGCalDate(date);
  const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${d}/${d}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(url)}`;

  useEffect(() => {
    setIcsHref(toIcs(title, date, description, url));
  }, [title, date, description, url]);

  return (
    <div className="calDropdown" style={{ position: "relative", display: "inline-block" }}>
      <button
        type="button"
        className="calBtn"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="true"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
        Thêm vào lịch
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>

      {open && (
        <>
          <div className="calDropdownBackdrop" onClick={() => setOpen(false)} />
          <div className="calDropdownMenu" role="menu">
            <a
              href={gcalUrl}
              target="_blank"
              rel="noopener noreferrer"
              role="menuitem"
              className="calDropdownItem"
              onClick={() => setOpen(false)}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 0C5.372 0 0 5.373 0 12s5.372 12 12 12 12-5.373 12-12S18.628 0 12 0zm0 2a10 10 0 110 20A10 10 0 0112 2zm-1 5v6l5 3-.75 1.25L10 14V7h1z" fillRule="evenodd"/>
              </svg>
              Google Calendar
            </a>
            <a
              href={icsHref}
              download={`${date}.ics`}
              role="menuitem"
              className="calDropdownItem"
              onClick={() => setOpen(false)}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
              </svg>
              Tải file .ics (Apple, Outlook)
            </a>
          </div>
        </>
      )}
    </div>
  );
}
