import Link from "next/link";
import { formatDisplayDate, type DateParts } from "@/lib/date";
import { formatHours } from "@/lib/calendar/can-chi";
import type { CalendarMonth, DayInfo } from "@/lib/calendar/types";
import type { PerpetualYearSummary } from "@/lib/calendar/perpetual";
import { amLichDayHref, amLichMonthHref, amLichYearHref } from "@/lib/calendar/urls";

export function lichVanNienHref(date: DateParts): string {
  return amLichDayHref(date);
}

function lunarDisplay(day: DayInfo): string {
  return `${day.lunar.day}/${day.lunar.month}/${day.lunar.year}${day.lunar.isLeap ? " nhuận" : ""}`;
}

export function PerpetualDayPanel({ day, prevDay, nextDay }: { day: DayInfo; prevDay: DateParts; nextDay: DateParts }) {
  const displayDate = formatDisplayDate(day.solar);

  return (
    <section className="heroCard perpetualDay" aria-labelledby="perpetual-day-title">
      <div className="heroTop">
        <Link className="circleNav" href={lichVanNienHref(prevDay)} aria-label="Ngày trước"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg></Link>
        <div>
          <p className="eyebrow">Lịch âm dương theo ngày</p>
          <h2 id="perpetual-day-title">Lịch ngày {displayDate}</h2>
          <p className="converterIntro">
            {day.weekdayName}, ngày {day.canChi.day}, tháng {day.canChi.month}, năm {day.canChi.year}. Âm lịch: {lunarDisplay(day)}.
          </p>
        </div>
        <Link className="circleNav" href={lichVanNienHref(nextDay)} aria-label="Ngày sau"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg></Link>
      </div>

      <div className="todayGrid converterGrid">
        <article className="dateBox solarBox">
          <span className="boxTitle">Lịch dương</span>
          <strong className="monthTitle">Tháng {day.solar.month}<small>Năm {day.solar.year}</small></strong>
          <span className="bigDate">{day.solar.day}</span>
          <span className="subDate">{day.weekdayName}</span>
        </article>

        <article className="dateBox lunarBox">
          <span className="boxTitle">Lịch âm</span>
          <strong className="monthTitle">
            Tháng {day.lunar.month}{day.lunar.isLeap ? " nhuận" : ""}
            <small>Năm {day.canChi.year}</small>
          </strong>
          <span className="bigDate">{day.lunar.day}</span>
          <span className="subDate">{day.canChi.day}</span>
          <span className="solarTerm">Tiết: {day.solarTerm}</span>
        </article>

        <article className="infoBox">
          <p>Ngày <strong>{day.quality.label}</strong>: {day.quality.note}</p>
          <p>Can chi: <strong>{day.canChi.day}</strong> · tháng <strong>{day.canChi.month}</strong> · năm <strong>{day.canChi.year}</strong></p>
          <p>Giờ <strong>Hoàng Đạo</strong>: {formatHours(day.goodHours)}</p>
          <p>Giờ <strong>Hắc Đạo</strong>: {formatHours(day.badHours)}</p>
          {day.events.length > 0 && <p>Sự kiện: {day.events.map((event) => event.title).join(", ")}</p>}
          <p className="disclaimer">Thông tin ngày tốt xấu chỉ mang tính tham khảo văn hóa dân gian.</p>
        </article>
      </div>

      <nav className="breadcrumb" aria-label="Đường dẫn">
        <Link href="/">Lịch âm</Link>
        <span aria-hidden="true">/</span>
        <Link href="/lich-van-nien">Lịch vạn niên</Link>
        <span aria-hidden="true">/</span>
        <Link href={amLichYearHref(day.solar.year)}>Năm {day.solar.year}</Link>
        <span aria-hidden="true">/</span>
        <Link href={amLichMonthHref(day.solar.year, day.solar.month)}>Tháng {day.solar.month}</Link>
        <span aria-hidden="true">/</span>
        <span>Ngày {displayDate}</span>
      </nav>
    </section>
  );
}

export function PerpetualYearOverview({ summary, selectedMonth }: { summary: PerpetualYearSummary; selectedMonth: number }) {
  return (
    <section className="panelCard yearOverview" aria-labelledby="year-overview-title">
      <div className="yearOverviewHead">
        <div>
          <p className="eyebrow">Tổng quan năm</p>
          <h2 id="year-overview-title">Lịch vạn niên năm {summary.year}</h2>
          <p>
            Năm {summary.year} là năm {summary.canChiYear} ({summary.animal}), có {summary.totalDays} ngày dương lịch.
            {summary.leapLunarMonths.length > 0
              ? ` Trong năm có ${summary.leapLunarMonths.join(", ")}.`
              : " Không ghi nhận tháng âm nhuận trong phần lịch dương năm này."}
          </p>
        </div>
        <div className="yearAnimal" aria-label={`Con giáp năm ${summary.canChiYear}`}>
          <span>{summary.animalEmoji}</span>
          <strong>{summary.canChiYear}</strong>
          <small>Năm {summary.animal}</small>
        </div>
      </div>

      <div className="yearStatsGrid">
        <article><strong>{summary.totalDays}</strong><span>ngày dương lịch</span></article>
        <article><strong>{summary.goodDays}</strong><span>ngày Hoàng Đạo</span></article>
        <article><strong>{summary.badDays}</strong><span>ngày Hắc Đạo</span></article>
        <article><strong>{summary.eventCount}</strong><span>sự kiện/lễ nổi bật</span></article>
      </div>

      <p className="animalDescription">{summary.animalDescription}</p>

      <div className="yearMonthGrid">
        {summary.months.map((month) => (
          <Link
            key={month.month}
            href={month.href}
            className={["yearMonthCard", month.month === selectedMonth ? "active" : ""].filter(Boolean).join(" ")}
          >
            <span className="monthNumber">Tháng {month.month}</span>
            <strong>{month.goodDays} tốt · {month.badDays} xấu</strong>
            <small>Âm đầu tháng: {month.firstLunarText}</small>
            <small>Tiết khí: {month.solarTerms.join(", ")}</small>
            {month.importantEvents.length > 0 && (
              <em>{month.importantEvents.slice(0, 2).map((event) => event.title).join(" · ")}</em>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}

export function SelectedMonthSummary({ calendar }: { calendar: CalendarMonth }) {
  const days = calendar.cells.filter((cell) => !cell.otherMonth);
  const goodDays = days.filter((cell) => cell.quality.type === "good");
  const events = days.flatMap((cell) => cell.events.map((event) => ({ ...event, day: cell.solar.day })));

  return (
    <section className="panelCard selectedMonthSummary" aria-labelledby="selected-month-summary-title">
      <div>
        <p className="eyebrow">Tóm tắt tháng</p>
        <h2 id="selected-month-summary-title">Tháng {calendar.month}/{calendar.year}</h2>
        <p>
          Tháng {calendar.month} năm {calendar.year} có {days.length} ngày, trong đó có {goodDays.length} ngày Hoàng Đạo và {days.length - goodDays.length} ngày Hắc Đạo.
        </p>
      </div>
      <div className="monthSummaryColumns">
        <article>
          <h3>Ngày Hoàng Đạo trong tháng</h3>
          <div className="dayLinkList">
            {goodDays.slice(0, 20).map((cell) => (
              <Link key={cell.solar.day} href={lichVanNienHref(cell.solar)}>
                {cell.solar.day}/{cell.solar.month} · {cell.canChi.day}
              </Link>
            ))}
          </div>
        </article>
        <article>
          <h3>Sự kiện nổi bật</h3>
          {events.length > 0 ? (
            <ul>
              {events.slice(0, 8).map((event) => (
                <li key={`${event.day}-${event.title}`}>Ngày {event.day}/{calendar.month}: {event.title}</li>
              ))}
            </ul>
          ) : (
            <p className="smallNote">Chưa có sự kiện nổi bật trong bộ dữ liệu hiện tại.</p>
          )}
        </article>
      </div>
    </section>
  );
}

export function PerpetualCalendarArticle() {
  return (
    <article className="seoArticle perpetualArticle">
      <h2>Lịch vạn niên là gì?</h2>
      <p>
        Lịch vạn niên là bảng tra cứu kết hợp ngày dương lịch, ngày âm lịch, can chi, tiết khí, ngày lễ và thông tin ngày tốt xấu. Với trang này, người dùng có thể xem nhanh một ngày cụ thể hoặc mở lịch theo tháng, theo năm để chủ động sắp xếp công việc.
      </p>
      <h2>Cách dùng lịch vạn niên trên Ngaygio.vn</h2>
      <p>
        Bạn có thể chọn một ngày bất kỳ để xem ngày âm tương ứng, can chi ngày tháng năm, giờ hoàng đạo và các sự kiện trong ngày. Khi xem theo tháng, lịch hiển thị cả ngày âm dưới từng ô ngày dương, giúp tra cứu nhanh ngày rằm, mùng một, lễ Tết và ngày Hoàng Đạo/Hắc Đạo.
      </p>
      <h2>Lưu ý khi xem ngày tốt xấu</h2>
      <p>
        Các thông tin như ngày Hoàng Đạo, Hắc Đạo, giờ tốt, giờ xấu được tổng hợp theo quy ước dân gian và chỉ nên dùng làm tư liệu tham khảo. Với việc quan trọng như cưới hỏi, động thổ, khai trương hoặc ký kết lớn, bạn nên kết hợp thêm điều kiện thực tế và ý kiến người có chuyên môn.
      </p>
    </article>
  );
}
