import Link from "next/link";
import { addDays, formatDisplayDate } from "@/lib/date";
import { amLichDayHref } from "@/lib/calendar/urls";
import { formatHours } from "@/lib/calendar/can-chi";
import type { DayInfo } from "@/lib/calendar/types";

type TodayPanelProps = {
  day: DayInfo;
  asH2?: boolean;
};

function lunarDisplay(day: DayInfo): string {
  return `${day.lunar.day}/${day.lunar.month}/${day.lunar.year}${day.lunar.isLeap ? " nhuận" : ""}`;
}

export function TodayPanel({ day, asH2 }: TodayPanelProps) {
  const Heading = asH2 ? "h2" : "h1";
  const previousDate = addDays(day.solar, -1);
  const nextDate = addDays(day.solar, 1);
  const displayDate = formatDisplayDate(day.solar);

  return (
    <section className="heroCard" aria-labelledby="today-title">
      <div className="heroTop">
        <Link className="circleNav" href={amLichDayHref(previousDate)} aria-label="Ngày trước">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>
        </Link>
        <div>
          <p className="eyebrow">{day.weekdayName} · {formatDisplayDate(day.solar)}</p>
          <Heading id="today-title">Lịch hôm nay {day.solar.day}/{day.solar.month}/{day.solar.year}</Heading>
        </div>
        <Link className="circleNav" href={amLichDayHref(nextDate)} aria-label="Ngày sau">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg>
        </Link>
      </div>

      <div className="todayGrid">
        <article className="dateBox solarBox">
          <span className="boxTitle">Lịch dương</span>
          <strong className="monthTitle">Tháng {day.solar.month}<small>Năm {day.solar.year}</small></strong>
          <span className="bigDate">{day.solar.day}</span>
          <span className="subDate">{day.weekdayName}</span>
          {day.events.length > 0 && (
            <div className="eventStack">
              {day.events.map((event) => (
                <span key={`${event.title}-${event.type}`} className={`eventPill ${event.color}`}>{event.title}</span>
              ))}
            </div>
          )}
        </article>

        <article className="dateBox lunarBox">
          <span className="boxTitle">Lịch âm</span>
          <strong className="monthTitle">
            Tháng {day.lunar.month}{day.lunar.isLeap ? " nhuận" : ""}
            <small>Năm {day.canChi.year}</small>
          </strong>
          <span className="bigDate">{day.lunar.day}</span>
          <span className="subDate">Tháng {day.canChi.month} · Ngày {day.canChi.day}</span>
          <span className="solarTerm">Tiết: {day.solarTerm}</span>
        </article>

        <article className="infoBox">
          <p>Ngày <strong>Dương lịch</strong>: <span>{formatDisplayDate(day.solar, "-")}</span></p>
          <p>Ngày <strong>Âm lịch</strong>: <span>{lunarDisplay(day)}</span></p>
          <p><strong>{day.quality.label}</strong>: {day.quality.note}</p>
          <p>Giờ <strong>Hoàng Đạo</strong>: {formatHours(day.goodHours)}</p>
          <p className="disclaimer">Thông tin ngày tốt, ngày xấu chỉ có giá trị tham khảo văn hóa dân gian.</p>
        </article>
      </div>

      <p className="converterIntro">Xem nhanh lịch âm dương ngày {displayDate}, tra giờ hoàng đạo, ngày tốt xấu và lịch tháng {day.solar.month} năm {day.solar.year} trên cùng một trang.</p>
    </section>
  );
}
