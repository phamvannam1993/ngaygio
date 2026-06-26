"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { formatDateKey, parseDateKey, type DateParts } from "@/lib/date";

export function GoodBadDateForm({ defaultDate }: { defaultDate: DateParts }) {
  const router = useRouter();
  const [date, setDate] = useState(formatDateKey(defaultDate));

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = parseDateKey(date);

    if (!value) {
      window.alert("Vui lòng chọn ngày dương lịch hợp lệ.");
      return;
    }

    router.push(`/ngay-tot-xau/${value.year}/${value.month}/${value.day}`);
  }

  return (
    <section className="panelCard goodBadSearch" aria-labelledby="good-bad-search-title">
      <div>
        <p className="eyebrow">Tra cứu nhanh</p>
        <h2 id="good-bad-search-title">Xem ngày tốt xấu</h2>
        <p>Chọn ngày dương lịch để xem âm lịch, can chi, giờ hoàng đạo, ngày kỵ và việc nên làm.</p>
      </div>
      <form className="goodBadSearchForm" onSubmit={handleSubmit}>
        <label>
          <span>Chọn ngày cần xem</span>
          <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
        </label>
        <button type="submit">Xem ngày</button>
      </form>
    </section>
  );
}
