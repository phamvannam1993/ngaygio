"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export function DateConverter() {
  const router = useRouter();
  const [date, setDate] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!date) return;
    const [year, month, day] = date.split("-").map(Number);
    if (!year || !month || !day) return;
    router.push(`/chuyen-doi-lich/duong-am/${year}/${month}/${day}`);
  }

  return (
    <form className="dateConverter" aria-label="Đổi ngày âm dương nhanh" onSubmit={handleSubmit}>
      <input
        aria-label="Chọn ngày dương lịch để đổi âm lịch"
        type="date"
        value={date}
        onChange={(event) => setDate(event.target.value)}
      />
      <button type="submit">Đổi</button>
    </form>
  );
}
