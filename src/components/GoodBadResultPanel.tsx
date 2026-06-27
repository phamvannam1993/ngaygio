import Link from "next/link";
import { formatDisplayDate } from "@/lib/date";
import { CHI, formatHours } from "@/lib/calendar/can-chi";
import type { CalendarMonth, DayInfo, HourInfo } from "@/lib/calendar/types";
import type { GoodBadDetails } from "@/lib/calendar/good-bad";

function lunarDisplay(day: DayInfo): string {
  return `${day.lunar.day}/${day.lunar.month}/${day.lunar.year}${day.lunar.isLeap ? " nhuận" : ""}`;
}

function goodBadHref(date: { year: number; month: number; day: number }) {
  return `/ngay-tot-xau/${date.year}/${date.month}/${date.day}`;
}

function HourPill({ hour }: { hour: HourInfo }) {
  return (
    <span className={["hourPill", hour.isGood ? "good" : "bad"].join(" ")}>
      <strong>{hour.branch}</strong>
      <small>{hour.range}</small>
    </span>
  );
}

export function GoodBadResultPanel({ day, details, isHomNay, isNgayMai }: { day: DayInfo; details: GoodBadDetails; isHomNay?: boolean; isNgayMai?: boolean }) {
  const displayDate = formatDisplayDate(day.solar);
  const Heading = (isHomNay || isNgayMai) ? "h1" : "h2";
  const h1Text = isHomNay
    ? `Ngày tốt xấu hôm nay ${displayDate}: ${details.overallLabel}`
    : isNgayMai
    ? `Ngày tốt xấu ngày mai ${displayDate}: ${details.overallLabel}`
    : `Ngày ${displayDate} tốt hay xấu?`;
  const eyebrow = isHomNay ? "Ngày tốt xấu hôm nay" : isNgayMai ? "Ngày tốt xấu ngày mai" : "Kết quả ngày tốt xấu";

  return (
    <section className="heroCard goodBadResult" aria-labelledby="good-bad-title">
      <div className="goodBadHeroTop">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <Heading id="good-bad-title">{h1Text}</Heading>
          <p className="converterIntro">
            Ngày {displayDate} dương lịch là {lunarDisplay(day)} âm lịch, {day.weekdayName}, ngày {day.canChi.day}, tháng {day.canChi.month}, năm {day.canChi.year}.
          </p>
        </div>
        <span className={["overallBadge", details.overallType].join(" ")}>{details.overallLabel}</span>
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
          <span className="subDate">Tháng {day.canChi.month} · Ngày {day.canChi.day}</span>
          <span className="solarTerm">Tiết: {day.solarTerm}</span>
        </article>

        <article className="infoBox">
          <p>Đánh giá: <strong>{details.overallLabel}</strong></p>
          <p>Ngày <strong>{day.quality.label}</strong>: {day.quality.note}</p>
          <p>Trực ngày: <strong>Trực {details.twelveDirect.name}</strong> — {details.twelveDirect.meaning}</p>
          <p>Giờ <strong>Hoàng Đạo</strong>: {formatHours(day.goodHours)}</p>
          <p className="disclaimer">Thông tin chỉ nên dùng để tham khảo văn hóa dân gian.</p>
        </article>
      </div>

      <div className="converterSummary goodBadSummary">
        <strong>Tổng luận:</strong>
        <p>{details.overallSummary}</p>
      </div>

      <div className="adviceGrid">
        <article className="adviceCard goodAdvice">
          <h2>Việc nên làm</h2>
          <ul>
            {details.shouldDo.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </article>
        <article className="adviceCard badAdvice">
          <h2>Việc không nên làm</h2>
          <ul>
            {details.shouldAvoid.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </article>
      </div>

      <section className="detailBlock" aria-labelledby="hours-title">
        <h2 id="hours-title">Giờ tốt xấu trong ngày</h2>
        <div className="hourGrid">
          {[...day.goodHours, ...day.badHours]
            .sort((a, b) => CHI.indexOf(a.branch) - CHI.indexOf(b.branch))
            .map((hour) => <HourPill key={hour.branch} hour={hour} />)}
        </div>
      </section>

      <div className="detailGrid">
        <article className="detailCard">
          <h2>Ngày kỵ cần lưu ý</h2>
          {details.specialWarnings.length > 0 ? (
            <ul>
              {details.specialWarnings.map((warning) => (
                <li key={warning.name}><strong>{warning.name}:</strong> {warning.description}</li>
              ))}
            </ul>
          ) : (
            <p>Không phạm Nguyệt kỵ, Tam nương, Dương Công kỵ nhật hoặc Nguyệt tận theo bộ kiểm tra hiện tại.</p>
          )}
        </article>

        <article className="detailCard">
          <h2>Bành Tổ bách kỵ</h2>
          <ul>
            {details.banhTo.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </article>

        <article className="detailCard">
          <h2>Tuổi hợp và xung</h2>
          <p>Ngày {day.canChi.day} có chi <strong>{day.canChi.dayChi}</strong>.</p>
          <ul>
            <li>Lục hợp với tuổi <strong>{details.ageCompatibility.lucHop}</strong>.</li>
            <li>Tam hợp với <strong>{details.ageCompatibility.tamHop.join(", ")}</strong>, thành cục {details.ageCompatibility.tamHopElement}.</li>
            <li>Xung với nhóm <strong>{details.ageCompatibility.xung.join(", ")}</strong>.</li>
            <li>Hại với tuổi <strong>{details.ageCompatibility.hai}</strong>.</li>
          </ul>
        </article>
      </div>

      <nav className="breadcrumb" aria-label="Đường dẫn">
        <Link href="/">Lịch âm</Link>
        <span aria-hidden="true">/</span>
        <Link href="/ngay-tot-xau">Ngày tốt xấu</Link>
        <span aria-hidden="true">/</span>
        <span>Ngày {displayDate}</span>
      </nav>
    </section>
  );
}

export function GoodBadMonthSummary({ calendar }: { calendar: CalendarMonth }) {
  const currentMonthCells = calendar.cells.filter((cell) => !cell.otherMonth);
  const goodDays = currentMonthCells.filter((cell) => cell.quality.type === "good").slice(0, 18);
  const badDays = currentMonthCells.filter((cell) => cell.quality.type === "bad").slice(0, 18);

  return (
    <section className="panelCard monthGoodBad" aria-labelledby="month-good-bad-title">
      <p className="eyebrow">Tổng hợp tháng</p>
      <h2 id="month-good-bad-title">Ngày tốt xấu tháng {calendar.month}/{calendar.year}</h2>
      <div className="monthGoodBadGrid">
        <article>
          <h3>Ngày Hoàng Đạo</h3>
          <div className="dayLinkList">
            {goodDays.map((cell) => (
              <Link key={`good-${cell.solar.day}`} href={goodBadHref(cell.solar)}>
                {cell.solar.day}/{cell.solar.month} · {cell.canChi.day}
              </Link>
            ))}
          </div>
        </article>
        <article>
          <h3>Ngày Hắc Đạo</h3>
          <div className="dayLinkList badList">
            {badDays.map((cell) => (
              <Link key={`bad-${cell.solar.day}`} href={goodBadHref(cell.solar)}>
                {cell.solar.day}/{cell.solar.month} · {cell.canChi.day}
              </Link>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
