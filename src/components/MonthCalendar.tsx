import Link from "next/link";
import type { DateParts } from "@/lib/date";
import { amLichDayHref } from "@/lib/calendar/urls";
import type { CalendarMonth } from "@/lib/calendar/types";

const dayNames = ["Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy", "Chủ Nhật"];

type MonthCalendarProps = {
  calendar: CalendarMonth;
  makeHref?: (date: DateParts) => string;
  makeNavHref?: (date: DateParts) => string;
};

function lunarText(day: number, month: number): string {
  return day === 1 ? `${day}/${month}` : String(day);
}

export function MonthCalendar({ calendar, makeHref, makeNavHref }: MonthCalendarProps) {
  const hrefFor = (date: DateParts, fallback?: string) => makeHref?.(date) ?? fallback ?? amLichDayHref(date);
  const navHrefFor = (date: DateParts) => makeNavHref?.(date) ?? hrefFor(date);

  return (
    <section className="calendarCard" aria-labelledby="month-calendar-title">
      <div className="calendarHeader">
        <Link className="monthNav" href={navHrefFor(calendar.prevMonthDate)} aria-label="Tháng trước"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg></Link>
        <div>
          <p className="eyebrow">Lịch tháng</p>
          <h2 id="month-calendar-title">{calendar.title}</h2>
        </div>
        <Link className="monthNav" href={navHrefFor(calendar.nextMonthDate)} aria-label="Tháng sau"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg></Link>
      </div>

      <div className="calendarGrid" role="grid" aria-label={calendar.title}>
        {dayNames.map((name) => (
          <div key={name} className="dayName" role="columnheader">{name}</div>
        ))}
        {calendar.cells.map((cell) => (
          <Link
            key={`${cell.solar.year}-${cell.solar.month}-${cell.solar.day}`}
            href={hrefFor(cell.solar, cell.url)}
            className={[
              "dayCell",
              cell.otherMonth ? "otherMonth" : "",
              cell.isToday ? "today" : "",
              cell.isSelected ? "selected" : "",
              cell.quality.type === "good" ? "goodDay" : "badDay",
            ].filter(Boolean).join(" ")}
            aria-label={`${cell.solar.day}/${cell.solar.month}/${cell.solar.year}, âm lịch ${cell.lunar.day}/${cell.lunar.month}`}
          >
            <span className="solarNumber">{cell.solar.day}</span>
            <span className="qualityStar" title={cell.quality.label}>☆</span>
            <span className="lunarLine"><b>{lunarText(cell.lunar.day, cell.lunar.month)}</b> {cell.canChi.day}</span>
            {cell.events.slice(0, 2).map((event) => (
              <span key={`${event.title}-${event.type}`} className={`miniEvent ${event.color}`}>{event.title}</span>
            ))}
            {cell.events.length > 2 && <span className="moreEvent">+{cell.events.length - 2} sự kiện</span>}
          </Link>
        ))}
      </div>
    </section>
  );
}
