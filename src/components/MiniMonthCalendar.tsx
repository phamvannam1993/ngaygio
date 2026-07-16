import Link from "next/link";
import type { DateParts } from "@/lib/date";
import { amLichDayHref, amLichMonthHref } from "@/lib/calendar/urls";
import type { CalendarMonth } from "@/lib/calendar/types";

const dayNames = [
  { full: "Thứ Hai", short: "T2" },
  { full: "Thứ Ba", short: "T3" },
  { full: "Thứ Tư", short: "T4" },
  { full: "Thứ Năm", short: "T5" },
  { full: "Thứ Sáu", short: "T6" },
  { full: "Thứ Bảy", short: "T7" },
  { full: "Chủ Nhật", short: "CN" },
];

type Props = {
  calendar: CalendarMonth;
  makeHref?: (date: DateParts) => string;
};

export function MiniMonthCalendar({ calendar, makeHref = amLichDayHref }: Props) {
  return (
    <section className="miniCalendar" aria-labelledby="mini-calendar-title">
      <div className="miniCalendarHead">
        <Link
          className="miniCalendarNav"
          href={amLichMonthHref(calendar.prevMonthDate.year, calendar.prevMonthDate.month)}
          aria-label={`Tháng ${calendar.prevMonthDate.month}/${calendar.prevMonthDate.year}`}
        >
          <img src="/hom-nay/chevron-left.webp" alt="" width={14} height={14} loading="lazy" decoding="async" />
        </Link>
        <h3 id="mini-calendar-title">Tháng {calendar.month} / {calendar.year}</h3>
        <Link
          className="miniCalendarNav"
          href={amLichMonthHref(calendar.nextMonthDate.year, calendar.nextMonthDate.month)}
          aria-label={`Tháng ${calendar.nextMonthDate.month}/${calendar.nextMonthDate.year}`}
        >
          <img src="/hom-nay/chevron-right.webp" alt="" width={14} height={14} loading="lazy" decoding="async" />
        </Link>
      </div>

      <div className="miniCalendarGrid" role="grid" aria-label={`Lịch tháng ${calendar.month} năm ${calendar.year}`}>
        {dayNames.map((name) => (
          <span key={name.full} className="miniDayName" role="columnheader" aria-label={name.full} title={name.full}>
            {name.short}
          </span>
        ))}
        {calendar.cells.map((cell, index) => (
          <Link
            key={`${cell.solar.year}-${cell.solar.month}-${cell.solar.day}`}
            href={makeHref(cell.solar)}
            className={[
              "miniDayCell",
              cell.otherMonth ? "isOther" : "",
              cell.isToday ? "isToday" : "",
              index % 7 === 6 ? "isSunday" : "",
            ].filter(Boolean).join(" ")}
            aria-label={`Ngày ${cell.solar.day}/${cell.solar.month}/${cell.solar.year}, âm lịch ${cell.lunar.day}/${cell.lunar.month}`}
            aria-current={cell.isToday ? "date" : undefined}
          >
            {cell.solar.day}
          </Link>
        ))}
      </div>
    </section>
  );
}
