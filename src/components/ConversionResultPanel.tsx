import Link from "next/link";
import { formatDisplayDate } from "@/lib/date";
import { formatHours } from "@/lib/calendar/can-chi";
import { ZODIAC_BY_CHI } from "@/lib/calendar/zodiac";
import type { CalendarConversion, ConversionSuccess } from "@/lib/calendar/conversion";
import type { ChiName } from "@/lib/calendar/types";
import { ZodiacIcon } from "./Icon";

function lunarDisplay(result: ConversionSuccess): string {
  return `${result.lunar.day}/${result.lunar.month}/${result.lunar.year}${result.lunar.isLeap ? " nhuận" : ""}`;
}

function CanChiCard({ title, text, chi }: { title: string; text: string; chi: ChiName }) {
  const zodiac = ZODIAC_BY_CHI[chi];
  return (
    <article className="zodiacCard">
      <span className="zodiacEmoji" aria-hidden="true"><ZodiacIcon branch={chi} /></span>
      <div>
        <h3>{title} {text}</h3>
        <p>{zodiac.animal}: {zodiac.description}</p>
      </div>
    </article>
  );
}

function Breadcrumbs({ result }: { result: ConversionSuccess }) {
  return (
    <nav className="breadcrumb" aria-label="Đường dẫn">
      <Link href="/">Lịch âm</Link>
      <span aria-hidden="true">/</span>
      <Link href="/chuyen-doi-lich">Chuyển đổi lịch âm dương</Link>
      <span aria-hidden="true">/</span>
      <span>{result.breadcrumbCurrent}</span>
    </nav>
  );
}

export function ConversionResultPanel({ result }: { result: CalendarConversion }) {
  if (result.status === "invalid") {
    return (
      <section className="heroCard converterResult" aria-labelledby="converter-result-title">
        <p className="eyebrow">Kết quả chuyển đổi</p>
        <h1 id="converter-result-title">{result.heading}</h1>
        <p className="converterIntro">{result.intro}</p>
        <div className="resultNotice errorNotice">
          <strong>Không thể chuyển đổi ngày này.</strong>
          <p>{result.errorMessage}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="heroCard converterResult" aria-labelledby="converter-result-title">
      <p className="eyebrow">Kết quả chuyển đổi</p>
      <h1 id="converter-result-title">{result.heading}</h1>
      <p className="converterIntro">{result.intro}</p>

      <div className="quickBadges" aria-label="Từ khóa nhanh">
        {result.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>

      <div className="todayGrid converterGrid">
        <article className="dateBox solarBox">
          <span className="boxTitle">Lịch dương</span>
          <strong className="monthTitle">Tháng {String(result.solar.month).padStart(2, "0")}<small>Năm {result.solar.year}</small></strong>
          <span className="bigDate">{result.solar.day}</span>
          <span className="subDate">{result.day.weekdayName}</span>
        </article>

        <article className="dateBox lunarBox">
          <span className="boxTitle">Lịch âm</span>
          <strong className="monthTitle">
            Tháng {result.lunar.month}{result.lunar.isLeap ? " nhuận" : ""}
            <small>Năm {result.day.canChi.year}</small>
          </strong>
          <span className="bigDate">{result.lunar.day}</span>
          <span className="subDate">Tháng {result.day.canChi.month} · Ngày {result.day.canChi.day}</span>
          <span className="solarTerm">Tiết: {result.day.solarTerm}</span>
        </article>

        <article className="infoBox">
          <p>Ngày <strong>Dương lịch</strong>: <span>{formatDisplayDate(result.solar, "-")}</span></p>
          <p>Ngày <strong>Âm lịch</strong>: <span>{lunarDisplay(result)}</span></p>
          <p>Ngày <strong>{result.day.quality.label}</strong>: {result.day.quality.note}</p>
          <p>Giờ <strong>Hoàng Đạo</strong>: {formatHours(result.day.goodHours)}</p>
          <p className="danhNgon">{result.isToday ? "Ngày bạn đang tra chính là hôm nay." : "Ngày bạn đang tra không phải ngày hôm nay."}</p>
        </article>
      </div>

      <div className="converterSummary">
        <p>{result.summary}</p>
      </div>

      <div className="zodiacGrid" aria-label="Thông tin can chi">
        <CanChiCard title="Năm" text={result.day.canChi.year} chi={result.day.canChi.yearChi} />
        <CanChiCard title="Tháng" text={result.day.canChi.month} chi={result.day.canChi.monthChi} />
        <CanChiCard title="Ngày" text={result.day.canChi.day} chi={result.day.canChi.dayChi} />
      </div>

      <Breadcrumbs result={result} />
    </section>
  );
}
