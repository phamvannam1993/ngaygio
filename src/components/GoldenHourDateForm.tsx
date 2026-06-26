"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { formatDateKey, parseDateKey, type DateParts } from "@/lib/date";
import { gioHoangDaoDayHref } from "@/lib/calendar/urls";

export function GoldenHourDateForm({ defaultDate }: { defaultDate: DateParts }) {
  const router = useRouter();
  const [date, setDate] = useState(formatDateKey(defaultDate));

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = parseDateKey(date);
    if (!value) {
      window.alert("Vui lòng chọn ngày hợp lệ.");
      return;
    }
    router.push(gioHoangDaoDayHref(value));
  }

  return (
    <section className="panelCard goodBadSearch" aria-labelledby="golden-hour-form-title">
      <div>
        <p className="eyebrow">Giờ hoàng đạo</p>
        <h2 id="golden-hour-form-title">Tra giờ tốt trong ngày</h2>
        <p>Chọn ngày dương lịch để xem khung giờ hoàng đạo, giờ hắc đạo, can chi ngày và lưu ý khi xuất hành.</p>
      </div>
      <form className="goodBadSearchForm" onSubmit={handleSubmit}>
        <label>
          <span>Chọn ngày</span>
          <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
        </label>
        <button type="submit">Xem giờ</button>
      </form>
    </section>
  );
}
