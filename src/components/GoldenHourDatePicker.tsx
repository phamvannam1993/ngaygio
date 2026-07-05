"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { formatDateKey, parseDateKey, type DateParts } from "@/lib/date";
import { gioHoangDaoDayHref } from "@/lib/calendar/urls";

type GoldenHourDatePickerProps = {
  defaultDate: DateParts;
  buttonLabel?: string;
  compact?: boolean;
};

export function GoldenHourDatePicker({ defaultDate, buttonLabel = "Xem giờ", compact = false }: GoldenHourDatePickerProps) {
  const router = useRouter();
  const [date, setDate] = useState(formatDateKey(defaultDate));

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = parseDateKey(date);

    if (!value) {
      window.alert("Vui lòng chọn ngày dương lịch hợp lệ.");
      return;
    }

    router.push(gioHoangDaoDayHref(value));
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
