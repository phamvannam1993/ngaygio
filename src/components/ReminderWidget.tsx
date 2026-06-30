"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { convertLunar2Solar, convertSolar2Lunar } from "@/lib/calendar/lunar";

type Reminder = {
  title: string;
  date: string;
  time: string;
  note: string;
  mode: ReminderMode;
};

type ReminderMode = "once-solar" | "yearly-solar" | "yearly-lunar" | "monthly-lunar";

type Occurrence = {
  date: string;
  summary: string;
};

function toIcsDate(date: string, time: string) {
  const cleanDate = date.replaceAll("-", "");
  const cleanTime = (time || "08:00").replace(":", "") + "00";
  return `${cleanDate}T${cleanTime}`;
}

function escapeIcs(text: string) {
  return text.replaceAll("\\", "\\\\").replaceAll(";", "\\;").replaceAll(",", "\\,").replaceAll("\n", "\\n");
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function isoFromParts(date: { year: number; month: number; day: number }) {
  return `${date.year}-${String(date.month).padStart(2, "0")}-${String(date.day).padStart(2, "0")}`;
}

function compareIso(a: string, b: string) {
  return a.localeCompare(b);
}

function addYearsIso(date: string, years: number) {
  const [y, m, d] = date.split("-").map(Number);
  return `${y + years}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function buildLunarOccurrences(opts: { title: string; lunarDay: number; lunarMonth: number; mode: ReminderMode; limit: number }) {
  const today = todayIso();
  const solarToday = new Date();
  const currentLunar = convertSolar2Lunar(solarToday.getDate(), solarToday.getMonth() + 1, solarToday.getFullYear());
  const occurrences: Occurrence[] = [];

  if (opts.mode === "yearly-lunar") {
    for (let year = currentLunar.year; year <= currentLunar.year + opts.limit + 2; year += 1) {
      const solar = convertLunar2Solar(opts.lunarDay, opts.lunarMonth, year, false);
      if (!solar) continue;
      const iso = isoFromParts(solar);
      if (compareIso(iso, today) >= 0) occurrences.push({ date: iso, summary: `${opts.title} âm lịch ${opts.lunarDay}/${opts.lunarMonth}/${year}` });
      if (occurrences.length >= opts.limit) break;
    }
  }

  if (opts.mode === "monthly-lunar") {
    for (let year = currentLunar.year; year <= currentLunar.year + 4; year += 1) {
      for (let month = 1; month <= 12; month += 1) {
        const solar = convertLunar2Solar(opts.lunarDay, month, year, false);
        if (!solar) continue;
        const iso = isoFromParts(solar);
        if (compareIso(iso, today) >= 0) occurrences.push({ date: iso, summary: `${opts.title} âm lịch ${opts.lunarDay}/${month}/${year}` });
      }
    }
  }

  return occurrences.sort((a, b) => a.date.localeCompare(b.date)).slice(0, opts.limit);
}

export function ReminderWidget() {
  const [title, setTitle] = useState("Việc cần nhớ");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("08:00");
  const [note, setNote] = useState("");
  const [mode, setMode] = useState<ReminderMode>("once-solar");
  const [lunarDay, setLunarDay] = useState(1);
  const [lunarMonth, setLunarMonth] = useState(1);
  const [saved, setSaved] = useState<Reminder[]>([]);

  useEffect(() => {
    const initialDate = todayIso();
    setDate(initialDate);
    const [year, month, day] = initialDate.split("-").map(Number);
    const lunar = convertSolar2Lunar(day, month, year);
    setLunarDay(lunar.day);
    setLunarMonth(lunar.month);
    try {
      const raw = window.localStorage.getItem("ngaygio-reminders");
      if (raw) setSaved(JSON.parse(raw));
    } catch {
      setSaved([]);
    }
  }, []);

  const occurrences = useMemo<Occurrence[]>(() => {
    if (!date) return [];
    if (mode === "once-solar") return [{ date, summary: title }];
    if (mode === "yearly-solar") return Array.from({ length: 20 }, (_, index) => ({ date: addYearsIso(date, index), summary: `${title} hằng năm` })).filter((item) => compareIso(item.date, todayIso()) >= 0);
    return buildLunarOccurrences({ title, lunarDay, lunarMonth, mode, limit: mode === "monthly-lunar" ? 24 : 20 });
  }, [date, lunarDay, lunarMonth, mode, title]);

  const icsContent = useMemo(() => {
    const stamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    const events = occurrences.map((item, index) => {
      const start = toIcsDate(item.date, time);
      return [
        "BEGIN:VEVENT",
        `UID:${item.date}-${index}@ngaygio.vn`,
        `DTSTAMP:${stamp}`,
        `DTSTART:${start}`,
        `SUMMARY:${escapeIcs(item.summary)}`,
        `DESCRIPTION:${escapeIcs(note || "Nhắc từ Ngaygio.vn")}`,
        "END:VEVENT",
      ].join("\r\n");
    });
    return ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//ngaygio.vn//Nhac ngay am//VI", ...events, "END:VCALENDAR"].join("\r\n");
  }, [note, occurrences, time]);

  const downloadHref = `data:text/calendar;charset=utf-8,${encodeURIComponent(icsContent)}`;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const firstDate = occurrences[0]?.date ?? date;
    const next = [{ title, date: firstDate, time, note, mode }, ...saved].slice(0, 10);
    setSaved(next);
    window.localStorage.setItem("ngaygio-reminders", JSON.stringify(next));
  }

  function quickLunar(day: number, month: number, quickTitle: string, nextMode: ReminderMode) {
    setTitle(quickTitle);
    setLunarDay(day);
    setLunarMonth(month);
    setMode(nextMode);
  }

  return (
    <section className="panelCard reminderTool enhancedReminder" aria-labelledby="reminder-title">
      <div>
        <p className="eyebrow">Nhắc ngày âm · ngày dương</p>
        <h2 id="reminder-title">Tạo nhắc giỗ, rằm, mùng 1, sinh nhật âm</h2>
        <p>Công cụ lưu nhắc việc trên trình duyệt và xuất file .ics để thêm vào Google Calendar, Apple Calendar hoặc Outlook. Lịch âm lặp lại được tạo sẵn nhiều lần trong file .ics.</p>
        <div className="quickReminderRow">
          <button type="button" onClick={() => quickLunar(1, lunarMonth, "Mùng 1 âm lịch", "monthly-lunar")}>Mùng 1 hằng tháng</button>
          <button type="button" onClick={() => quickLunar(15, lunarMonth, "Rằm âm lịch", "monthly-lunar")}>Rằm hằng tháng</button>
          <button type="button" onClick={() => quickLunar(23, 12, "Ông Công Ông Táo", "yearly-lunar")}>Ông Công Ông Táo</button>
          <button type="button" onClick={() => quickLunar(10, 1, "Vía Thần Tài", "yearly-lunar")}>Vía Thần Tài</button>
        </div>
      </div>
      <form className="reminderForm" onSubmit={handleSubmit}>
        <label>
          <span>Tên việc</span>
          <input value={title} onChange={(event) => setTitle(event.target.value)} />
        </label>
        <label>
          <span>Kiểu nhắc</span>
          <select value={mode} onChange={(event) => setMode(event.target.value as ReminderMode)}>
            <option value="once-solar">Một lần theo dương lịch</option>
            <option value="yearly-solar">Lặp hằng năm theo dương lịch</option>
            <option value="yearly-lunar">Lặp hằng năm theo âm lịch</option>
            <option value="monthly-lunar">Lặp hằng tháng theo âm lịch</option>
          </select>
        </label>
        <label>
          <span>Giờ</span>
          <input type="time" value={time} onChange={(event) => setTime(event.target.value)} />
        </label>
        {(mode === "once-solar" || mode === "yearly-solar") && (
          <label className="wideField">
            <span>Ngày dương</span>
            <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
          </label>
        )}
        {(mode === "yearly-lunar" || mode === "monthly-lunar") && (
          <div className="lunarReminderFields wideField">
            <label>
              <span>Ngày âm</span>
              <input type="number" min="1" max="30" value={lunarDay} onChange={(event) => setLunarDay(Number(event.target.value))} />
            </label>
            <label>
              <span>Tháng âm</span>
              <input type="number" min="1" max="12" value={lunarMonth} onChange={(event) => setLunarMonth(Number(event.target.value))} disabled={mode === "monthly-lunar"} />
            </label>
          </div>
        )}
        <label className="wideField">
          <span>Ghi chú</span>
          <textarea value={note} onChange={(event) => setNote(event.target.value)} rows={3} />
        </label>
        <button type="submit">Lưu nhắc việc</button>
        <a className="secondaryButton" href={downloadHref} download="nhac-ngay-am-ngaygio.ics">Tải file .ics</a>
      </form>
      {occurrences.length > 0 && (
        <div className="savedReminders occurrencePreview">
          <h3>Các lần nhắc sắp tạo</h3>
          <ul>
            {occurrences.slice(0, 8).map((item) => <li key={`${item.date}-${item.summary}`}><strong>{item.summary}</strong> · {item.date} {time}</li>)}
          </ul>
        </div>
      )}
      {saved.length > 0 && (
        <div className="savedReminders">
          <h3>Nhắc việc đã lưu trên trình duyệt</h3>
          <ul>
            {saved.map((item, index) => <li key={`${item.date}-${item.time}-${index}`}><strong>{item.title}</strong> · {item.date} {item.time}</li>)}
          </ul>
        </div>
      )}
    </section>
  );
}
