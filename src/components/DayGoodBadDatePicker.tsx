"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { formatDateKey, parseDateKey, type DateParts } from "@/lib/date";

type DayGoodBadDatePickerProps = {
  defaultDate: DateParts;
  buttonLabel?: string;
  compact?: boolean;
};

export function DayGoodBadDatePicker({ defaultDate, buttonLabel = "Xem ngày", compact = false }: DayGoodBadDatePickerProps) {
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
    <form className={["ngdDatePicker", compact ? "ngdDatePickerCompact" : ""].filter(Boolean).join(" ")} onSubmit={handleSubmit}>
      <label>
        <span>Chọn ngày dương lịch</span>
        <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
      </label>
      <button type="submit">{buttonLabel}</button>
    </form>
  );
}
