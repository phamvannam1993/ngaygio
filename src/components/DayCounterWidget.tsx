"use client";

import { useMemo, useState } from "react";
import { formatDateKey, getVietnamTodayParts } from "@/lib/date";

function toDate(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function diffDays(from: string, to: string): { days: number; inclusive: number } | null {
  const start = toDate(from);
  const end = toDate(to);
  if (!start || !end) return null;
  const days = Math.round((end.getTime() - start.getTime()) / 86_400_000);
  return { days, inclusive: days >= 0 ? days + 1 : days - 1 };
}

export function DayCounterWidget() {
  const today = formatDateKey(getVietnamTodayParts());
  const [from, setFrom] = useState(today);
  const [to, setTo] = useState(today);
  const result = useMemo(() => diffDays(from, to), [from, to]);

  return (
    <section className="panelCard dayCounter" aria-labelledby="day-counter-title">
      <div>
        <p className="eyebrow">Đếm ngày</p>
        <h2 id="day-counter-title">Tính khoảng cách giữa hai ngày</h2>
        <p>Hữu ích khi tính còn bao nhiêu ngày đến lễ, cưới hỏi, khai trương, sinh nhật hoặc một mốc quan trọng.</p>
      </div>
      <div className="dayCounterGrid">
        <label>
          <span>Từ ngày</span>
          <input type="date" value={from} onChange={(event) => setFrom(event.target.value)} />
        </label>
        <label>
          <span>Đến ngày</span>
          <input type="date" value={to} onChange={(event) => setTo(event.target.value)} />
        </label>
        <article className="counterResult">
          <span>Khoảng cách</span>
          <strong>{result ? Math.abs(result.days) : 0} ngày</strong>
          <p>Tính cả ngày đầu và ngày cuối: <b>{result ? Math.abs(result.inclusive) : 1} ngày</b>.</p>
        </article>
      </div>
    </section>
  );
}
