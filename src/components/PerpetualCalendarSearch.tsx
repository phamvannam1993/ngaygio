"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatDateKey, type DateParts } from "@/lib/date";

type PerpetualCalendarSearchProps = {
  defaultDate: DateParts;
};

export function PerpetualCalendarSearch({ defaultDate }: PerpetualCalendarSearchProps) {
  const router = useRouter();
  const [date, setDate] = useState(formatDateKey(defaultDate));
  const [month, setMonth] = useState(String(defaultDate.month));
  const [year, setYear] = useState(String(defaultDate.year));

  return (
    <section className="panelCard perpetualSearch" aria-labelledby="perpetual-search-title">
      <div>
        <p className="eyebrow">Tra cứu lịch vạn niên</p>
        <h1 id="perpetual-search-title">Lịch vạn niên</h1>
        <p>
          Xem lịch âm dương theo ngày, tháng, năm; tra can chi, tiết khí, ngày Hoàng Đạo/Hắc Đạo, giờ tốt và các ngày lễ trong năm.
        </p>
      </div>

      <div className="perpetualSearchForms">
        <form
          className="compactDateForm"
          onSubmit={(event) => {
            event.preventDefault();
            const [selectedYear, selectedMonth, selectedDay] = date.split("-").map(Number);
            if (!selectedYear || !selectedMonth || !selectedDay) return;
            router.push(`/am-lich/nam/${selectedYear}/thang/${selectedMonth}/ngay/${selectedDay}`);
          }}
        >
          <label>
            Chọn ngày cần xem
            <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
          </label>
          <button type="submit">Xem ngày</button>
        </form>

        <form
          className="monthYearForm"
          onSubmit={(event) => {
            event.preventDefault();
            router.push(`/am-lich/nam/${year}/thang/${month}`);
          }}
        >
          <label>
            Tháng
            <select value={month} onChange={(event) => setMonth(event.target.value)}>
              {Array.from({ length: 12 }, (_, index) => index + 1).map((item) => (
                <option key={item} value={item}>Tháng {item}</option>
              ))}
            </select>
          </label>
          <label>
            Năm
            <input
              type="number"
              min="1900"
              max="2099"
              value={year}
              onChange={(event) => setYear(event.target.value)}
              className="yearInput"
            />
          </label>
          <button type="submit">Xem tháng</button>
        </form>
      </div>
    </section>
  );
}
