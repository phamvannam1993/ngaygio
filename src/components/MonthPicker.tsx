"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

type MonthPickerProps = {
  month: number;
  year: number;
};

export function MonthPicker({ month, year }: MonthPickerProps) {
  const router = useRouter();
  const [selectedMonth, setSelectedMonth] = useState(month);
  const [selectedYear, setSelectedYear] = useState(year);
  const years = useMemo(() => Array.from({ length: 151 }, (_, index) => 1900 + index), []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push(`/am-lich/nam/${selectedYear}/thang/${selectedMonth}`);
  }

  return (
    <article className="panelCard">
      <h2>Xem lịch tháng</h2>
      <form className="pickerForm" onSubmit={handleSubmit}>
        <label>
          <span>Tháng</span>
          <select value={selectedMonth} onChange={(event) => setSelectedMonth(Number(event.target.value))}>
            {Array.from({ length: 12 }, (_, index) => index + 1).map((value) => (
              <option key={value} value={value}>Tháng {value}</option>
            ))}
          </select>
        </label>
        <label>
          <span>Năm</span>
          <select value={selectedYear} onChange={(event) => setSelectedYear(Number(event.target.value))}>
            {years.map((value) => (
              <option key={value} value={value}>Năm {value}</option>
            ))}
          </select>
        </label>
        <button type="submit">Xem lịch</button>
      </form>
      <div className="legend">
        <span><i className="legendStar good">☆</i> Ngày Hoàng Đạo</span>
        <span><i className="legendStar bad">☆</i> Ngày Hắc Đạo</span>
      </div>
      <p className="smallNote">
        Nên dùng lịch như một công cụ tra cứu và tham khảo. Với việc hệ trọng, hãy kiểm chứng thêm từ nguồn chuyên môn phù hợp.
      </p>
    </article>
  );
}
