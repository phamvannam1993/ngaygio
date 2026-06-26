"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";

type Reminder = {
  title: string;
  date: string;
  time: string;
  note: string;
};

function toIcsDate(date: string, time: string) {
  const cleanDate = date.replaceAll("-", "");
  const cleanTime = (time || "08:00").replace(":", "") + "00";
  return `${cleanDate}T${cleanTime}`;
}

function escapeIcs(text: string) {
  return text.replaceAll("\\", "\\\\").replaceAll(";", "\\;").replaceAll(",", "\\,").replaceAll("\n", "\\n");
}

export function ReminderWidget() {
  const [title, setTitle] = useState("Việc cần nhớ");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState("08:00");
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState<Reminder[]>([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("ngaygio-reminders");
      if (raw) setSaved(JSON.parse(raw));
    } catch {
      setSaved([]);
    }
  }, []);

  const icsContent = useMemo(() => {
    const start = toIcsDate(date, time);
    return [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//ngaygio.vn//Nhac ngay gio//VI",
      "BEGIN:VEVENT",
      `UID:${Date.now()}@ngaygio.vn`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z`,
      `DTSTART:${start}`,
      `SUMMARY:${escapeIcs(title)}`,
      `DESCRIPTION:${escapeIcs(note || "Nhắc từ Ngaygio.vn")}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
  }, [date, note, time, title]);

  const downloadHref = `data:text/calendar;charset=utf-8,${encodeURIComponent(icsContent)}`;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = [{ title, date, time, note }, ...saved].slice(0, 8);
    setSaved(next);
    window.localStorage.setItem("ngaygio-reminders", JSON.stringify(next));
  }

  return (
    <section className="panelCard reminderTool" aria-labelledby="reminder-title">
      <div>
        <p className="eyebrow">Nhắc ngày giờ</p>
        <h2 id="reminder-title">Tạo nhắc việc theo ngày giờ</h2>
        <p>Công cụ này lưu nhắc việc trên trình duyệt và cho phép xuất file lịch .ics để thêm vào Google Calendar, Apple Calendar hoặc Outlook.</p>
      </div>
      <form className="reminderForm" onSubmit={handleSubmit}>
        <label>
          <span>Tên việc</span>
          <input value={title} onChange={(event) => setTitle(event.target.value)} />
        </label>
        <label>
          <span>Ngày</span>
          <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
        </label>
        <label>
          <span>Giờ</span>
          <input type="time" value={time} onChange={(event) => setTime(event.target.value)} />
        </label>
        <label className="wideField">
          <span>Ghi chú</span>
          <textarea value={note} onChange={(event) => setNote(event.target.value)} rows={3} />
        </label>
        <button type="submit">Lưu nhắc việc</button>
        <a className="secondaryButton" href={downloadHref} download="nhac-ngay-gio.ics">Tải file .ics</a>
      </form>
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
