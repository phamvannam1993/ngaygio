import Link from "next/link";
import { addDays, formatDisplayDate } from "@/lib/date";
import { amLichDayHref } from "@/lib/calendar/urls";
import { formatHours } from "@/lib/calendar/can-chi";
import { getDayTags } from "@/lib/calendar/service";
import type { DayInfo } from "@/lib/calendar/types";

type TodayPanelProps = {
  day: DayInfo;
};

function lunarDisplay(day: DayInfo): string {
  return `${day.lunar.day}/${day.lunar.month}/${day.lunar.year}${day.lunar.isLeap ? " nhuận" : ""}`;
}

export function TodayPanel({ day }: TodayPanelProps) {
  const previousDate = addDays(day.solar, -1);
  const nextDate = addDays(day.solar, 1);
  const tags = getDayTags(day);

  return (
    <section className="heroCard" aria-labelledby="today-title">
      <div className="heroTop">
        <Link className="circleNav" href={amLichDayHref(previousDate)} aria-label="Ngày trước">
          ←
        </Link>
        <div>
          <p className="eyebrow">{day.weekdayName} · {formatDisplayDate(day.solar)}</p>
          <h1 id="today-title">Lịch hôm nay {day.solar.day}/{day.solar.month}/{day.solar.year}</h1>
        </div>
        <Link className="circleNav" href={amLichDayHref(nextDate)} aria-label="Ngày sau">
          →
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

      <div className="tagRow" aria-label="Từ khóa liên quan">
        {tags.map((tag) => (
          <span key={tag}>#{tag}</span>
        ))}
      </div>
    </section>
  );
}
