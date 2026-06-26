"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "ngaygio-saved-dates";
const MAX_SAVED = 20;

type SavedDate = {
  date: string;     // "YYYY-MM-DD"
  label: string;
  note?: string;
  savedAt: string;
};

export function SaveDateButton({ date, label, note }: { date: string; label: string; note?: string }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const list: SavedDate[] = raw ? JSON.parse(raw) : [];
      setSaved(list.some((item) => item.date === date));
    } catch {
      setSaved(false);
    }
  }, [date]);

  function toggle() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      let list: SavedDate[] = raw ? JSON.parse(raw) : [];
      if (saved) {
        list = list.filter((item) => item.date !== date);
      } else {
        list = [{ date, label, note, savedAt: new Date().toISOString() }, ...list].slice(0, MAX_SAVED);
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      setSaved(!saved);
    } catch {
      // ignore
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={`saveDateBtn ${saved ? "saved" : ""}`}
      aria-pressed={saved}
      title={saved ? "Bỏ lưu ngày này" : "Lưu ngày này để xem lại"}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      {saved ? "Đã lưu" : "Lưu ngày này"}
    </button>
  );
}

export function SavedDatesList() {
  const [list, setList] = useState<SavedDate[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      setList(raw ? JSON.parse(raw) : []);
    } catch {
      setList([]);
    }
  }, []);

  function remove(date: string) {
    const next = list.filter((item) => item.date !== date);
    setList(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  if (list.length === 0) {
    return (
      <div className="savedDatesList empty">
        <p>Bạn chưa lưu ngày nào. Khi xem lịch ngày cụ thể, nhấn "Lưu ngày này" để lưu vào đây.</p>
      </div>
    );
  }

  return (
    <ul className="savedDatesList">
      {list.map((item) => (
        <li key={item.date} className="savedDateItem">
          <a href={`/am-lich/nam/${item.date.slice(0, 4)}/thang/${Number(item.date.slice(5, 7))}/ngay/${Number(item.date.slice(8, 10))}`}>
            <strong>{item.label}</strong>
            {item.note && <span className="savedNote">{item.note}</span>}
            <span className="savedDateStr">{item.date.split("-").reverse().join("/")}</span>
          </a>
          <button type="button" onClick={() => remove(item.date)} className="removeBtn" aria-label="Xóa ngày đã lưu">✕</button>
        </li>
      ))}
    </ul>
  );
}
