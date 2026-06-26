"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { formatDateKey, parseDateKey, type DateParts } from "@/lib/date";
import type { ConversionMode } from "@/lib/calendar/conversion";

type CalendarConverterFormsProps = {
  defaultSolar: DateParts;
  defaultLunar: DateParts;
  defaultMode?: ConversionMode;
  defaultLunarLeap?: boolean;
};

function splitDateValue(value: string): DateParts | null {
  return parseDateKey(value);
}

export function CalendarConverterForms({
  defaultSolar,
  defaultLunar,
  defaultMode = "duong-am",
  defaultLunarLeap = false,
}: CalendarConverterFormsProps) {
  const router = useRouter();
  const [solarDate, setSolarDate] = useState(formatDateKey(defaultSolar));
  const [lunarDate, setLunarDate] = useState(formatDateKey(defaultLunar));
  const [lunarLeap, setLunarLeap] = useState(defaultLunarLeap);
  const [activeMode, setActiveMode] = useState<ConversionMode>(defaultMode);

  function submitSolar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = splitDateValue(solarDate);
    if (!value) {
      window.alert("Vui lòng chọn ngày dương lịch hợp lệ.");
      return;
    }
    setActiveMode("duong-am");
    router.push(`/chuyen-doi-lich/duong-am/${value.year}/${value.month}/${value.day}`);
  }

  function submitLunar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = splitDateValue(lunarDate);
    if (!value) {
      window.alert("Vui lòng chọn ngày âm lịch hợp lệ.");
      return;
    }
    setActiveMode("am-duong");
    const leapQuery = lunarLeap ? "?nhuan=1" : "";
    router.push(`/chuyen-doi-lich/am-duong/${value.year}/${value.month}/${value.day}${leapQuery}`);
  }

  return (
    <section className="converterForms" aria-label="Công cụ chuyển đổi lịch âm dương">
      <article className={["converterCard", activeMode === "duong-am" ? "active" : ""].filter(Boolean).join(" ")}>
        <p className="eyebrow">Dương lịch → Âm lịch</p>
        <h2>Chuyển dương sang âm</h2>
        <form onSubmit={submitSolar} className="converterForm">
          <label>
            <span>Chọn ngày dương lịch</span>
            <input type="date" value={solarDate} onChange={(event) => setSolarDate(event.target.value)} />
          </label>
          <button type="submit">Chuyển</button>
        </form>
      </article>

      <article className={["converterCard", activeMode === "am-duong" ? "active" : ""].filter(Boolean).join(" ")}>
        <p className="eyebrow">Âm lịch → Dương lịch</p>
        <h2>Chuyển âm sang dương</h2>
        <form onSubmit={submitLunar} className="converterForm">
          <label>
            <span>Nhập ngày âm lịch</span>
            <input type="date" value={lunarDate} onChange={(event) => setLunarDate(event.target.value)} />
          </label>
          <label className="checkboxRow">
            <input type="checkbox" checked={lunarLeap} onChange={(event) => setLunarLeap(event.target.checked)} />
            <span>Tháng nhuận âm lịch</span>
          </label>
          <button type="submit">Chuyển</button>
        </form>
      </article>
    </section>
  );
}
