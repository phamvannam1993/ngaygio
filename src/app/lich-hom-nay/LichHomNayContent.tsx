import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageHeroBanner } from "@/components/PageHeroBanner";
import { MiniMonthCalendar } from "@/components/MiniMonthCalendar";
import { CurrentHourCanChi } from "./CurrentHourCanChi";
import { dayOfYear, formatDisplayDate, isoWeekOfYear, type DateParts } from "@/lib/date";
import { formatHourRange, getHourCanChi } from "@/lib/calendar/can-chi";
import { amLichDayHref, amLichMonthHref, amLichYearHref, gioHoangDaoDayHref } from "@/lib/calendar/urls";
import type { CalendarMonth, DayInfo } from "@/lib/calendar/types";
import type { HolidayItem } from "@/lib/calendar/holidays";

const MONTH_VN = ["tháng một", "tháng hai", "tháng ba", "tháng tư", "tháng năm", "tháng sáu", "tháng bảy", "tháng tám", "tháng chín", "tháng mười", "tháng mười một", "tháng mười hai"];

const quickLinks: Array<{ href: string; icon: string; label: string; desc: string }> = [
  { href: "/xem-ngay-tot", icon: "/hom-nay/good-day.webp", label: "Xem ngày tốt", desc: "Xem ngày đẹp, ngày tốt cho mọi việc" },
  { href: "/dem-ngay", icon: "/hom-nay/day-counter.webp", label: "Đếm ngày", desc: "Tính khoảng cách giữa 2 ngày bất kỳ" },
  { href: "/lich-nghi-le", icon: "/hom-nay/gift.webp", label: "Lịch nghỉ lễ", desc: "Tra cứu lịch nghỉ lễ, tết trong năm" },
  { href: "/chuyen-doi-lich", icon: "/hom-nay/yin-yang.webp", label: "Chuyển đổi âm dương", desc: "Đổi ngày âm lịch sang dương lịch" },
];

function totalDaysInYear(year: number): number {
  return new Date(year, 1, 29).getMonth() === 1 ? 366 : 365;
}

type Props = {
  today: DateParts;
  day: DayInfo;
  allHolidays: HolidayItem[];
  monthCalendar: CalendarMonth;
  currentHour: number;
};

export function LichHomNayContent({ today, day, allHolidays, monthCalendar, currentHour }: Props) {
  const ordinal = dayOfYear(today);
  const total = totalDaysInYear(today.year);
  const remaining = total - ordinal;
  const week = isoWeekOfYear(today).week;
  const quarter = Math.ceil(today.month / 3);
  const displayDate = formatDisplayDate(today);

  const todayHolidays = allHolidays.filter((h) => h.date.month === today.month && h.date.day === today.day);
  const todayTime = Date.UTC(today.year, today.month - 1, today.day);
  const nextHoliday = allHolidays.find((h) => h.isDayOff && Date.UTC(h.date.year, h.date.month - 1, h.date.day) > todayTime);
  const daysToNext = nextHoliday
    ? Math.round((Date.UTC(nextHoliday.date.year, nextHoliday.date.month - 1, nextHoliday.date.day) - todayTime) / 86400000)
    : null;

  return (
    <>
      <Header currentYear={today.year} />
      <main className="container mainStack lichHomNayPage">
        <PageHeroBanner
          eyebrow="Lịch hôm nay"
          title={`Lịch hôm nay ${today.day}/${today.month}/${today.year}`}
          description="Xem nhanh dương lịch, âm lịch, thứ trong tuần, ngày nghỉ, công cụ đếm ngày và các tiện ích liên quan trên một giao diện thân thiện và hiện đại."
          imageSrc="/hom-nay/hero-bg-clean.webp"
          mode="inset"
          backgroundSrc="/bg-page-calendar.png"
        >
          <div className="heroQuickLinks">
            {quickLinks.map((link) => (
              <Link href={link.href} className="heroQuickLink" key={link.href}>
                <span className="heroQuickIcon" aria-hidden="true">
                  <img src={link.icon} alt="" width={24} height={24} loading="lazy" decoding="async" />
                </span>
                <span className="heroQuickLabel">{link.label}</span>
              </Link>
            ))}
          </div>
        </PageHeroBanner>

        <section className="panelCard lichTodayPanel" aria-labelledby="lich-today-title">
          <h2 id="lich-today-title" className="lichHomNayH1">Lịch ngày hôm nay có gì?</h2>
          <p className="lichTodayAnswer">
            <img src="/hom-nay/calendar.webp" alt="" width={18} height={18} decoding="async" />
            Hôm nay là <strong>{day.weekdayName}</strong>, ngày <strong>{displayDate}</strong> dương lịch.
          </p>

          <div className="lichTodayGrid">
            <article className="solarDateCard">
              <p className="solarDateEyebrow">Dương lịch hôm nay</p>
              <p className="solarDateWeekday">{day.weekdayName}</p>
              <strong className="solarDateBig">{today.day}</strong>
              <p className="solarDateMonth">Tháng {today.month} / {today.year}</p>
              <span className="solarDateScenery" aria-hidden="true" />
            </article>

            <div className="lichStatGrid">
              <article className="lichStatTile">
                <span className="lichStatIcon" aria-hidden="true">
                  <img src="/hom-nay/flag.webp" alt="" width={26} height={26} loading="lazy" decoding="async" />
                </span>
                <div>
                  <strong>{ordinal}</strong>
                  <p>Ngày trong năm</p>
                </div>
              </article>
              <article className="lichStatTile">
                <span className="lichStatIcon" aria-hidden="true">
                  <img src="/hom-nay/hourglass.webp" alt="" width={26} height={26} loading="lazy" decoding="async" />
                </span>
                <div>
                  <strong>{remaining}</strong>
                  <p>Ngày còn lại</p>
                </div>
              </article>
              <article className="lichStatTile isFlipped">
                <span className="lichStatIcon" aria-hidden="true">
                  <img src="/hom-nay/week-calendar.webp" alt="" width={26} height={26} loading="lazy" decoding="async" />
                </span>
                <div>
                  <p>Tuần</p>
                  <strong>{week}</strong>
                </div>
              </article>
              <article className="lichStatTile isFlipped">
                <span className="lichStatIcon" aria-hidden="true">
                  <img src="/hom-nay/quarter.webp" alt="" width={26} height={26} loading="lazy" decoding="async" />
                </span>
                <div>
                  <p>Quý</p>
                  <strong>{quarter}</strong>
                </div>
              </article>
            </div>

            <MiniMonthCalendar calendar={monthCalendar} />
          </div>

          {todayHolidays.length > 0 && (
            <div className="lichTodayHoliday">
              {todayHolidays.map((h) => (
                <span key={h.title} className={`eventPill ${h.isDayOff ? "red" : "green"}`}>{h.title}</span>
              ))}
            </div>
          )}

          {nextHoliday && daysToNext !== null && daysToNext > 0 && (
            <p className="lichTodayNextHoliday">
              <strong>Ngày nghỉ tiếp theo:</strong>{" "}
              <Link href={amLichDayHref(nextHoliday.date)}>{nextHoliday.title}</Link> còn{" "}
              <strong>{daysToNext} ngày</strong>
              <span className="lichTodayNextSub"> ({nextHoliday.dateText})</span>
            </p>
          )}

          <div className="lunarBand">
            <div className="lunarBandMain">
              <p className="lunarBandEyebrow">
                <span className="lunarBandIcon" aria-hidden="true">
                  <img src="/hom-nay/lunar.webp" alt="" width={30} height={30} loading="lazy" decoding="async" />
                </span>
                Âm lịch hôm nay
              </p>
              <p className="lunarBandDate">
                {day.lunar.day} / {day.lunar.month}{day.lunar.isLeap ? " nhuận" : ""} / {day.canChi.year}
              </p>
              <ul className="lunarBandMeta">
                <li>Năm <strong>{day.canChi.year}</strong></li>
                <li>Tháng <strong>{day.canChi.month}</strong></li>
                <li>Ngày <strong>{day.canChi.day}</strong></li>
                <li>Giờ <strong><CurrentHourCanChi dayCan={day.canChi.dayCan} initialText={getHourCanChi(day.canChi.dayCan, currentHour).text} /></strong></li>
              </ul>
            </div>

            <div className="lunarBandHours">
              <p className="lunarBandEyebrow">Giờ hoàng đạo</p>
              <div className="lunarBandHourList">
                {day.goodHours.map((hour) => (
                  <span className="lunarHourPill" key={hour.branch}>
                    <b>{formatHourRange(hour.range)}</b>
                    <small>{hour.branch}</small>
                  </span>
                ))}
              </div>
              <Link href={gioHoangDaoDayHref(today)} className="lunarBandMore">
                Xem chi tiết giờ hoàng đạo
                <img src="/hom-nay/chevron-right.webp" alt="" width={12} height={12} loading="lazy" decoding="async" />
              </Link>
            </div>
          </div>
        </section>

        <section className="panelCard featureStrip" aria-labelledby="feature-strip-title">
          <p className="eyebrow" id="feature-strip-title">Tiện ích nổi bật</p>
          <div className="featureStripGrid">
            {quickLinks.map((link) => (
              <Link href={link.href} className="featureStripItem" key={link.href}>
                <span className="featureStripIcon" aria-hidden="true">
                  <img src={link.icon} alt="" width={26} height={26} loading="lazy" decoding="async" />
                </span>
                <span className="featureStripText">
                  <strong>{link.label}</strong>
                  <small>{link.desc}</small>
                </span>
                <img className="featureStripArrow" src="/hom-nay/chevron-right.webp" alt="" width={14} height={14} loading="lazy" decoding="async" />
              </Link>
            ))}
          </div>
        </section>

        <nav className="panelCard lichHomNayNav" aria-label="Điều hướng lịch">
          <p className="eyebrow">Xem thêm</p>
          <div className="lichHomNayNavGrid">
            <Link href={amLichDayHref(today)}>Lịch âm ngày {displayDate}</Link>
            <Link href="/lich-am-ngay-mai">Âm lịch ngày mai</Link>
            <Link href={amLichMonthHref(today.year, today.month)}>Lịch tháng {today.month}/{today.year}</Link>
            <Link href={amLichYearHref(today.year)}>Lịch năm {today.year}</Link>
            <Link href={`/lich-nghi-le/${today.year}`}>Ngày lễ năm {today.year}</Link>
          </div>
        </nav>

        <article className="seoArticle">
          <h2>Hôm nay thứ mấy ngày mấy tháng mấy?</h2>
          <p>Hôm nay là <strong>{day.weekdayName}</strong>, ngày <strong>{today.day} {MONTH_VN[today.month - 1]} năm {today.year}</strong> dương lịch — hay còn gọi là <strong>nay là ngày {displayDate}</strong>. Đây là ngày thứ {ordinal} trong năm, thuộc tuần {week} và Quý {quarter} của năm {today.year}.</p>
          <h2>Hôm nay ngày mấy âm lịch?</h2>
          <p>Ngày dương lịch {displayDate} tương đương <strong>ngày {day.lunar.day} tháng {day.lunar.month} năm {day.canChi.year}</strong> âm lịch, ngày <strong>{day.canChi.day}</strong>. Xem chi tiết tại trang <Link href="/am-lich-hom-nay">âm lịch hôm nay</Link>.</p>
          <h2>Lịch hôm nay và âm lịch hôm nay khác nhau thế nào?</h2>
          <p>Trang <strong>lịch hôm nay</strong> tập trung dương lịch: thứ trong tuần, ngày trong năm, tuần, quý. Trang <Link href="/am-lich-hom-nay">âm lịch hôm nay</Link> hiển thị can chi đủ bộ, tiết khí, sao ngày và 12 khung giờ hoàng đạo. Hai trang phục vụ hai nhu cầu khác nhau.</p>
          <h2>Đếm ngày đến sự kiện quan trọng</h2>
          <p>Dùng <Link href="/dem-ngay">công cụ đếm ngày</Link> để tính khoảng cách đến sinh nhật, cưới hỏi, deadline hoặc lễ Tết. Có thể xuất nhắc việc dạng file <Link href="/nhac-ngay-gio">.ics</Link> để thêm vào Google Calendar.</p>
        </article>
      </main>
      <Footer />
    </>
  );
}
