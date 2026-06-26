import Link from "next/link";
import { formatDisplayDate, type DateParts } from "@/lib/date";
import { CHI, formatHours } from "@/lib/calendar/can-chi";
import { getGoodBadDetails } from "@/lib/calendar/good-bad";
import { getDayInfo, getMonthCalendar } from "@/lib/calendar/service";
import type { CalendarEvent, CalendarMonth, DayInfo } from "@/lib/calendar/types";
import type { PerpetualYearSummary } from "@/lib/calendar/perpetual";
import { ZODIAC_BY_CHI } from "@/lib/calendar/zodiac";
import { amLichDayHref, amLichMonthHref, amLichYearHref, gioHoangDaoDayHref } from "@/lib/calendar/urls";
import { MonthCalendar } from "./MonthCalendar";

export { amLichDayHref, amLichMonthHref, amLichYearHref };

function dateLong(date: DateParts): string {
  return `ngày ${date.day} tháng ${date.month} năm ${date.year}`;
}

function lunarDisplay(day: DayInfo): string {
  return `${day.lunar.day}/${day.lunar.month}/${day.lunar.year}${day.lunar.isLeap ? " nhuận" : ""}`;
}

function lunarLong(day: DayInfo): string {
  return `ngày ${day.lunar.day} tháng ${day.lunar.month}${day.lunar.isLeap ? " nhuận" : ""} năm ${day.lunar.year}`;
}

function uniqueEvents(events: Array<CalendarEvent & { solarDay?: number }>) {
  const seen = new Set<string>();
  return events.filter((event) => {
    const key = `${event.solarDay ?? ""}-${event.title}-${event.type}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function monthCells(calendar: CalendarMonth) {
  return calendar.cells.filter((cell) => !cell.otherMonth);
}

function MonthCalendarForAmLich({ calendar }: { calendar: CalendarMonth }) {
  return (
    <MonthCalendar
      calendar={calendar}
      makeHref={amLichDayHref}
      makeNavHref={(date) => amLichMonthHref(date.year, date.month)}
    />
  );
}

export function AmLichBreadcrumb({ date, mode }: { date: DateParts; mode: "year" | "month" | "day" }) {
  return (
    <nav className="breadcrumb" aria-label="Đường dẫn">
      <Link href="/">Lịch âm</Link>
      <span aria-hidden="true">/</span>
      <Link href={amLichYearHref(date.year)}>Năm {date.year}</Link>
      {(mode === "month" || mode === "day") && (
        <>
          <span aria-hidden="true">/</span>
          <Link href={amLichMonthHref(date.year, date.month)}>Tháng {date.month}</Link>
        </>
      )}
      {mode === "day" && (
        <>
          <span aria-hidden="true">/</span>
          <span>Ngày {date.day}</span>
        </>
      )}
    </nav>
  );
}

export function AmLichTagRow({ tags }: { tags: string[] }) {
  return (
    <div className="tagRow" aria-label="Từ khóa liên quan">
      {tags.map((tag) => <span key={tag}>{tag}</span>)}
    </div>
  );
}

export function AmLichDayHero({ day, prevDay, nextDay }: { day: DayInfo; prevDay: DateParts; nextDay: DateParts }) {
  const displayDate = formatDisplayDate(day.solar);
  const yearZodiac = ZODIAC_BY_CHI[day.canChi.yearChi];
  const monthZodiac = ZODIAC_BY_CHI[day.canChi.monthChi];
  const dayZodiac = ZODIAC_BY_CHI[day.canChi.dayChi];

  return (
    <section className="heroCard amLichHero" aria-labelledby="am-lich-day-title">
      <div className="heroTop">
        <Link className="circleNav" href={amLichDayHref(prevDay)} aria-label="Ngày trước">←</Link>
        <div>
          <p className="eyebrow">Lịch âm theo ngày</p>
          <h1 id="am-lich-day-title">Lịch âm {dateLong(day.solar)}</h1>
          <p className="converterIntro">
            Xem lịch âm ngày {displayDate}, giờ tốt xấu, can chi, tiết khí, ngày lễ và thông tin ngày Hoàng Đạo/Hắc Đạo.
          </p>
        </div>
        <Link className="circleNav" href={amLichDayHref(nextDay)} aria-label="Ngày sau">→</Link>
      </div>

      <div className="todayGrid converterGrid">
        <article className="dateBox solarBox">
          <span className="boxTitle">Lịch dương</span>
          <strong className="monthTitle">Tháng {day.solar.month}<small>Năm {day.solar.year}</small></strong>
          <span className="bigDate">{day.solar.day}</span>
          <span className="subDate">{day.weekdayName}</span>
          {day.events.length > 0 && (
            <span className="eventStack">
              {day.events.slice(0, 2).map((event) => <span key={event.title} className={`eventPill ${event.color}`}>{event.title}</span>)}
            </span>
          )}
        </article>

        <article className="dateBox lunarBox">
          <span className="boxTitle">Lịch âm</span>
          <strong className="monthTitle">
            Tháng {day.lunar.month}{day.lunar.isLeap ? " nhuận" : ""}
            <small>Năm {day.canChi.year}</small>
          </strong>
          <span className="bigDate">{day.lunar.day}</span>
          <span className="subDate">Ngày {day.canChi.day}</span>
          <span className="solarTerm">Tiết: {day.solarTerm}</span>
        </article>

        <article className="infoBox">
          <p>Ngày <strong>Dương lịch</strong>: <span>{displayDate}</span></p>
          <p>Ngày <strong>Âm lịch</strong>: <span>{lunarDisplay(day)}</span></p>
          <p>Can chi: ngày <strong>{day.canChi.day}</strong>, tháng <strong>{day.canChi.month}</strong>, năm <strong>{day.canChi.year}</strong>.</p>
          <p>Ngày <strong>{day.quality.label}</strong>: {day.quality.note}</p>
          <p>Giờ <strong>Hoàng Đạo</strong>: {formatHours(day.goodHours)}</p>
          <p className="danhNgon">Như vậy, {dateLong(day.solar)} dương lịch là {lunarLong(day)} âm lịch.</p>
        </article>
      </div>

      <div className="zodiacGrid compactZodiacGrid">
        <article className="zodiacCard"><span className="zodiacEmoji">{yearZodiac.emoji}</span><div><h3>Năm {day.canChi.year}</h3><p>{yearZodiac.animal}</p></div></article>
        <article className="zodiacCard"><span className="zodiacEmoji">{monthZodiac.emoji}</span><div><h3>Tháng {day.canChi.month}</h3><p>{monthZodiac.animal}</p></div></article>
        <article className="zodiacCard"><span className="zodiacEmoji">{dayZodiac.emoji}</span><div><h3>Ngày {day.canChi.day}</h3><p>{dayZodiac.animal}</p></div></article>
      </div>

      <AmLichTagRow tags={[`lịch âm ngày ${displayDate}`, `${displayDate} là ngày bao nhiêu âm`, `giờ hoàng đạo ngày ${displayDate}`, `ngày tốt tháng ${day.solar.month} năm ${day.solar.year}`]} />
      <AmLichBreadcrumb date={day.solar} mode="day" />
    </section>
  );
}

export function AmLichDayDetails({ day }: { day: DayInfo }) {
  const details = getGoodBadDetails(day);
  const displayDate = formatDisplayDate(day.solar);
  const sortedHours = [...day.goodHours, ...day.badHours].sort((a, b) => CHI.indexOf(a.branch) - CHI.indexOf(b.branch));

  return (
    <article className="seoArticle amLichDetailArticle">
      <h2>Tham khảo giờ tốt, xấu lịch âm ngày {displayDate}</h2>
      <p>
        Giờ hoàng đạo là các khung giờ được xem là thuận lợi theo quan niệm dân gian. Giờ hắc đạo là các khung giờ nên thận trọng hơn khi làm việc lớn.
      </p>
      <h3>Giờ Hoàng Đạo</h3>
      <p>{formatHours(day.goodHours)}.</p>
      <h3>Giờ Hắc Đạo</h3>
      <p>{formatHours(day.badHours)}.</p>
      <div className="hourGrid detailHourGrid">
        {sortedHours.map((hour) => (
          <span key={hour.branch} className={["hourPill", hour.isGood ? "good" : "bad"].join(" ")}>
            <strong>{hour.branch}</strong>
            <small>{hour.range}</small>
          </span>
        ))}
      </div>

      <h2>Ngày {displayDate} tốt hay xấu?</h2>
      <p><strong>{details.overallLabel}</strong>. {details.overallSummary}</p>

      <div className="adviceGrid">
        <section className="adviceCard goodAdvice">
          <h3>Việc nên làm</h3>
          <ul>{details.shouldDo.map((item) => <li key={item}>{item}</li>)}</ul>
        </section>
        <section className="adviceCard badAdvice">
          <h3>Việc không nên làm</h3>
          <ul>{details.shouldAvoid.map((item) => <li key={item}>{item}</li>)}</ul>
        </section>
      </div>

      <h2>Hôm nay có phạm ngày kỵ không?</h2>
      {details.specialWarnings.length > 0 ? (
        <ul>
          {details.specialWarnings.map((warning) => <li key={warning.name}><strong>{warning.name}:</strong> {warning.description}</li>)}
        </ul>
      ) : (
        <p>Không phạm Nguyệt kỵ, Tam nương, Dương Công kỵ nhật hoặc Nguyệt tận theo bộ kiểm tra hiện tại.</p>
      )}

      <h3>Bành Tổ bách kỵ nhật</h3>
      <ul>{details.banhTo.map((item) => <li key={item}>{item}</li>)}</ul>

      <h3>Thập Nhị Kiến Trực</h3>
      <p><strong>Trực {details.twelveDirect.name}</strong>: {details.twelveDirect.meaning}</p>

      <h3>Ngày {displayDate} hợp tuổi gì?</h3>
      <p>
        Ngày {day.canChi.day} có chi {day.canChi.dayChi}; lục hợp với {details.ageCompatibility.lucHop}, tam hợp với {details.ageCompatibility.tamHop.join(", ")} thành {details.ageCompatibility.tamHopElement} cục, xung với {details.ageCompatibility.xung.join(", ")}, hại {details.ageCompatibility.hai}.
      </p>
      <p className="smallNote">(*) Thông tin ngày tốt xấu chỉ mang tính tham khảo và chiêm nghiệm văn hóa dân gian.</p>
    </article>
  );
}

export function AmLichMonthHero({ calendar }: { calendar: CalendarMonth }) {
  const days = monthCells(calendar);
  const firstDay = days[0];
  const events = uniqueEvents(days.flatMap((cell) => cell.events.map((event) => ({ ...event, solarDay: cell.solar.day }))));
  const goodDays = days.filter((cell) => cell.quality.type === "good");

  return (
    <section className="heroCard amLichHero" aria-labelledby="am-lich-month-title">
      <p className="eyebrow">Lịch âm theo tháng</p>
      <h1 id="am-lich-month-title">Lịch âm tháng {calendar.month} năm {calendar.year}</h1>
      <p className="converterIntro">
        Tháng {calendar.month}/{calendar.year} có {days.length} ngày dương lịch. Ngày đầu tháng là {formatDisplayDate(firstDay.solar)}, tức {lunarDisplay(firstDay)} âm lịch, ngày {firstDay.canChi.day}, tháng {firstDay.canChi.month}, năm {firstDay.canChi.year}.
      </p>
      <div className="yearStatsGrid monthStatsGrid">
        <article><strong>{days.length}</strong><span>ngày trong tháng</span></article>
        <article><strong>{goodDays.length}</strong><span>ngày Hoàng Đạo</span></article>
        <article><strong>{days.length - goodDays.length}</strong><span>ngày Hắc Đạo</span></article>
        <article><strong>{events.length}</strong><span>sự kiện/lễ nổi bật</span></article>
      </div>
      <AmLichTagRow tags={[`lịch tháng ${calendar.month} năm ${calendar.year}`, `lịch âm tháng ${calendar.month} năm ${calendar.year}`, `ngày tốt tháng ${calendar.month}/${calendar.year}`, `lịch vạn niên tháng ${calendar.month}/${calendar.year}`]} />
      <AmLichBreadcrumb date={{ year: calendar.year, month: calendar.month, day: 1 }} mode="month" />
    </section>
  );
}

export function AmLichMonthExtra({ calendar }: { calendar: CalendarMonth }) {
  const days = monthCells(calendar);
  const events = uniqueEvents(days.flatMap((cell) => cell.events.map((event) => ({ ...event, solarDay: cell.solar.day }))));
  const goodDays = days.filter((cell) => cell.quality.type === "good");
  const badDays = days.filter((cell) => cell.quality.type === "bad");

  return (
    <section className="panelCard selectedMonthSummary" aria-labelledby="month-extra-title">
      <div>
        <p className="eyebrow">Tổng hợp tháng</p>
        <h2 id="month-extra-title">Ngày tốt, ngày lễ tháng {calendar.month}/{calendar.year}</h2>
      </div>
      <div className="monthSummaryColumns">
        <article>
          <h3>Ngày Hoàng Đạo trong tháng</h3>
          <div className="dayLinkList">
            {goodDays.map((cell) => <Link key={cell.solar.day} href={amLichDayHref(cell.solar)}>{cell.solar.day}/{cell.solar.month} · {cell.canChi.day}</Link>)}
          </div>
        </article>
        <article>
          <h3>Ngày Hắc Đạo trong tháng</h3>
          <div className="dayLinkList badList">
            {badDays.map((cell) => <Link key={cell.solar.day} href={amLichDayHref(cell.solar)}>{cell.solar.day}/{cell.solar.month} · {cell.canChi.day}</Link>)}
          </div>
        </article>
      </div>
      <div className="monthSummaryColumns">
        <article>
          <h3>Những ngày lễ, tết và kỷ niệm</h3>
          {events.length > 0 ? (
            <ul>{events.slice(0, 16).map((event) => <li key={`${event.solarDay}-${event.title}`}>Ngày {event.solarDay}/{calendar.month}: {event.title}</li>)}</ul>
          ) : <p>Chưa có sự kiện nổi bật trong tháng này.</p>}
        </article>
        <article>
          <h3>Xem lịch âm các tháng khác</h3>
          <div className="dayLinkList">
            {Array.from({ length: 12 }, (_, index) => index + 1).map((month) => (
              <Link key={month} href={amLichMonthHref(calendar.year, month)}>Tháng {month}/{calendar.year}</Link>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}

export function AmLichYearHero({ summary, tetDay }: { summary: PerpetualYearSummary; tetDay: DayInfo | null }) {
  return (
    <section className="heroCard amLichHero" aria-labelledby="am-lich-year-title">
      <div className="yearOverviewHead">
        <div>
          <p className="eyebrow">Lịch âm theo năm</p>
          <h1 id="am-lich-year-title">Lịch âm {summary.year}</h1>
          <p className="converterIntro yearIntroText">
            Năm {summary.year} là năm {summary.canChiYear} ({summary.animal}), có {summary.totalDays} ngày dương lịch, gồm {summary.goodDays} ngày Hoàng Đạo và {summary.badDays} ngày Hắc Đạo theo bộ lịch tham khảo.
            {tetDay ? ` Mùng 1 Tết âm lịch năm ${summary.year} rơi vào ${formatDisplayDate(tetDay.solar)} dương lịch.` : ""}
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
      <AmLichTagRow tags={[`âm lịch ${summary.year}`, `lịch năm ${summary.year}`, `lịch vạn niên ${summary.year}`, `ngày tốt năm ${summary.year}`, `năm ${summary.canChiYear}`]} />
      <AmLichBreadcrumb date={{ year: summary.year, month: 1, day: 1 }} mode="year" />
    </section>
  );
}

export function AmLichYearMonthLinks({ summary, selectedMonth }: { summary: PerpetualYearSummary; selectedMonth?: number }) {
  return (
    <section className="panelCard yearOverview" aria-labelledby="year-month-links-title">
      <p className="eyebrow">12 tháng trong năm</p>
      <h2 id="year-month-links-title">Xem lịch âm các tháng năm {summary.year}</h2>
      <div className="yearMonthGrid">
        {summary.months.map((month) => (
          <Link key={month.month} href={amLichMonthHref(summary.year, month.month)} className={["yearMonthCard", selectedMonth === month.month ? "active" : ""].filter(Boolean).join(" ")}>
            <span className="monthNumber">Tháng {month.month}</span>
            <strong>{month.goodDays} tốt · {month.badDays} xấu</strong>
            <small>Âm đầu tháng: {month.firstLunarText}</small>
            <small>Tiết khí: {month.solarTerms.join(", ")}</small>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function AmLichYearCalendars({ year, selectedDate }: { year: number; selectedDate?: DateParts }) {
  const calendars = Array.from({ length: 12 }, (_, index) => {
    const month = index + 1;
    const currentSelected = selectedDate?.year === year && selectedDate.month === month ? selectedDate : { year, month, day: -1 };
    return getMonthCalendar(year, month, currentSelected);
  });

  return (
    <section className="yearCalendarStack" aria-labelledby="year-calendars-title">
      <h2 id="year-calendars-title" className="sectionHeading">Lịch âm chi tiết 12 tháng năm {year}</h2>
      {calendars.map((calendar) => <MonthCalendarForAmLich key={calendar.month} calendar={calendar} />)}
    </section>
  );
}

export function RelatedYears({ year }: { year: number }) {
  const start = Math.max(1900, year - 7);
  const years = Array.from({ length: 15 }, (_, index) => start + index).filter((item) => item <= 2050);
  return (
    <section className="panelCard" aria-labelledby="related-years-title">
      <p className="eyebrow">Năm gần đây</p>
      <h2 id="related-years-title">Xem lịch âm những năm gần đây</h2>
      <div className="dayLinkList">
        {years.map((item) => <Link key={item} href={amLichYearHref(item)}>Lịch âm {item}</Link>)}
      </div>
    </section>
  );
}

export function SameSolarDateAcrossYears({ date }: { date: DateParts }) {
  const years = Array.from({ length: 22 }, (_, index) => date.year - 11 + index).filter((year) => year >= 1900 && year <= 2050);
  return (
    <section className="panelCard" aria-labelledby="same-date-title">
      <p className="eyebrow">Tra cùng ngày qua các năm</p>
      <h2 id="same-date-title">Ngày {date.day}/{date.month} dương lịch các năm khác</h2>
      <ul className="sameDateList">
        {years.map((year) => {
          const current = getDayInfo({ year, month: date.month, day: date.day });
          return (
            <li key={year}>
              <Link href={amLichDayHref(current.solar)}>{date.day}/{date.month}/{year}</Link>: {current.lunar.day}/{current.lunar.month}/{current.lunar.year}{current.lunar.isLeap ? " nhuận" : ""} ({current.canChi.year})
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function AmLichSeoArticle({ mode, year, month }: { mode: "year" | "month" | "day"; year: number; month?: number }) {
  return (
    <article className="seoArticle amLichArticle">
      <h2>{mode === "year" ? `Lịch âm năm ${year} dùng để làm gì?` : mode === "month" ? `Cách xem lịch âm tháng ${month}/${year}` : "Cách xem lịch âm theo ngày"}</h2>
      <p>
        Lịch âm trên Ngaygio.vn kết hợp ngày dương lịch, ngày âm lịch, can chi, tiết khí, giờ hoàng đạo, ngày Hoàng Đạo/Hắc Đạo và các ngày lễ quan trọng. Người dùng có thể tra nhanh theo ngày, theo tháng hoặc theo năm bằng cấu trúc URL rõ ràng, dễ nhớ và thân thiện SEO.
      </p>
      <h2>Lưu ý khi xem ngày tốt xấu</h2>
      <p>
        Thông tin ngày tốt, ngày xấu được tổng hợp theo quy ước văn hóa dân gian, phù hợp để tham khảo khi sắp xếp lịch trình. Với việc hệ trọng như cưới hỏi, động thổ, khai trương hoặc ký kết lớn, nên kết hợp thêm hoàn cảnh thực tế và tư vấn chuyên môn.
      </p>
    </article>
  );
}

export function DayInternalLinks({ day, prevDay, nextDay }: { day: DayInfo; prevDay: DateParts; nextDay: DateParts }) {
  const { solar } = day;
  return (
    <nav className="panelCard dayInternalLinks" aria-label="Xem thêm về ngày này">
      <p className="eyebrow">Xem thêm</p>
      <div className="dayLinksGrid">
        <div className="dayLinksGroup">
          <h3>Điều hướng ngày</h3>
          <Link href={amLichDayHref(prevDay)}>← Ngày {prevDay.day}/{prevDay.month}/{prevDay.year}</Link>
          <Link href={amLichDayHref(nextDay)}>Ngày {nextDay.day}/{nextDay.month}/{nextDay.year} →</Link>
          <Link href={amLichMonthHref(solar.year, solar.month)}>Lịch tháng {solar.month}/{solar.year}</Link>
          <Link href={amLichYearHref(solar.year)}>Lịch năm {solar.year}</Link>
        </div>
        <div className="dayLinksGroup">
          <h3>Công cụ cho ngày này</h3>
          <Link href={gioHoangDaoDayHref(solar)}>Giờ hoàng đạo ngày {solar.day}/{solar.month}/{solar.year}</Link>
          <Link href={`/ngay-tot-xau/${solar.year}/${solar.month}/${solar.day}`}>Ngày {solar.day}/{solar.month}/{solar.year} tốt hay xấu?</Link>
          <Link href={`/chuyen-doi-lich/duong-am/${solar.year}/${solar.month}/${solar.day}`}>Đổi dương → âm ngày này</Link>
          <Link href="/dem-ngay">Đếm ngày đến ngày này</Link>
        </div>
        <div className="dayLinksGroup">
          <h3>Cùng ngày năm khác</h3>
          {[-2, -1, 1, 2].map(offset => {
            const y = solar.year + offset;
            if (y < 1900 || y > 2050) return null;
            return <Link key={y} href={amLichDayHref({ ...solar, year: y })}>{solar.day}/{solar.month}/{y}</Link>;
          })}
        </div>
      </div>
    </nav>
  );
}

export { MonthCalendarForAmLich };
