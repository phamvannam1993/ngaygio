"use client";

import { PageHeroBanner } from "@/components/PageHeroBanner";
import { SiteIcon } from "@/components/Icon";

import Link from "next/link";
import { type ReactNode, useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { formatDisplayDate, type DateParts } from "@/lib/date";
import { amLichDayHref, amLichMonthHref, amLichYearHref, gioHoangDaoDayHref } from "@/lib/calendar/urls";
import type { DayInfo } from "@/lib/calendar/types";
import type { HolidayItem } from "@/lib/calendar/holidays";

const WEEKDAY_FULL = ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"];
const MONTH_VN = ["tháng một", "tháng hai", "tháng ba", "tháng tư", "tháng năm", "tháng sáu", "tháng bảy", "tháng tám", "tháng chín", "tháng mười", "tháng mười một", "tháng mười hai"];

function dayOfYear(d: Date): number {
  const start = new Date(d.getFullYear(), 0, 0);
  return Math.floor((d.getTime() - start.getTime()) / 86400000);
}

function totalDaysInYear(year: number): number {
  return new Date(year, 1, 29).getMonth() === 1 ? 366 : 365;
}

type Props = { today: DateParts; day: DayInfo; allHolidays: HolidayItem[]; calendarSlot?: ReactNode };

export function LichHomNayClient({ today, day, allHolidays, calendarSlot }: Props) {
  const [clientDate, setClientDate] = useState<Date | null>(null);

  useEffect(() => {
    setClientDate(new Date());
    const t = setInterval(() => setClientDate(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const d = clientDate ?? new Date(today.year, today.month - 1, today.day);
  const wd = WEEKDAY_FULL[d.getDay()];
  const ordinal = dayOfYear(d);
  const total = totalDaysInYear(d.getFullYear());
  const remaining = total - ordinal;
  const displayDate = formatDisplayDate(today);

  const todayHolidays = allHolidays.filter(h => h.date.month === today.month && h.date.day === today.day);
  const nextHoliday = allHolidays.find(h => {
    const hd = new Date(h.date.year, h.date.month - 1, h.date.day);
    return hd > d && h.isDayOff;
  });
  const daysToNext = nextHoliday
    ? Math.round((new Date(nextHoliday.date.year, nextHoliday.date.month - 1, nextHoliday.date.day).getTime() - d.getTime()) / 86400000)
    : null;

  return (
    <>
      <Header currentYear={today.year} />
      <main className="container mainStack">
        <PageHeroBanner
          eyebrow="Lịch hôm nay"
          title="Hôm nay thứ mấy, ngày mấy?"
          description="Xem nhanh ngày hiện tại, thứ trong tuần, âm lịch, ngày nghỉ, công cụ đếm ngày và các tiện ích liên quan trên một giao diện thân thiện và hiện đại."
          imageSrc="/bg-page-calendar.png"
        />

        {/* Hero: dương lịch + đếm ngày */}
        <section className="heroCard lichHomNayHero">
          <h2 className="lichHomNayH1">Hôm nay thứ mấy, ngày mấy?</h2>
          <p className="lichHomNayAnswer">Hôm nay là <strong>{wd}</strong>, ngày <strong>{today.day}/{today.month}/{today.year}</strong> dương lịch.</p>
          <p className="eyebrow">Dương lịch hôm nay</p>
          <div className="lichHomNayTop">
            <div className="lichHomNayDate">
              <span className="lichHomNayWd">{wd}</span>
              <span className="lichHomNayBig">{today.day}</span>
              <span className="lichHomNayMY">{MONTH_VN[today.month - 1]} năm {today.year}</span>
            </div>
            <div className="lichHomNayStats">
              <div className="statBox">
                <span className="statNum">{ordinal}</span>
                <span className="statLabel">Ngày trong năm</span>
              </div>
              <div className="statBox">
                <span className="statNum">{remaining}</span>
                <span className="statLabel">Ngày còn lại</span>
              </div>
              <div className="statBox">
                <span className="statNum">{Math.ceil(ordinal / 7)}</span>
                <span className="statLabel">Tuần thứ</span>
              </div>
              <div className="statBox">
                <span className="statNum">Q{Math.ceil(today.month / 3)}</span>
                <span className="statLabel">Quý</span>
              </div>
            </div>
          </div>

          {todayHolidays.length > 0 && (
            <div className="lichHomNayHoliday">
              {todayHolidays.map(h => (
                <span key={h.title} className={`eventPill ${h.isDayOff ? "red" : "green"}`}>{h.title}</span>
              ))}
            </div>
          )}

          {nextHoliday && daysToNext !== null && daysToNext > 0 && (
            <p className="lichHomNayNextHoliday">
              <strong>Ngày nghỉ tiếp theo:</strong>{" "}
              <Link href={amLichDayHref(nextHoliday.date)}>{nextHoliday.title}</Link> còn{" "}
              <strong>{daysToNext} ngày</strong>
              <span className="lichHomNayNextSub"> ({nextHoliday.dateText})</span>
            </p>
          )}
        </section>

        {/* Âm lịch ngắn — không trùng /am-lich-hom-nay */}
        <section className="panelCard lichHomNayAmBlock">
          <div className="lichHomNayAmInner">
            <div>
              <p className="eyebrow">Âm lịch hôm nay (tóm tắt)</p>
              <p className="lichHomNayAmDate">
                Mùng <strong>{day.lunar.day} tháng {day.lunar.month}{day.lunar.isLeap ? " nhuận" : ""}</strong> năm {day.canChi.year}
              </p>
              <p className="lichHomNayAmSub">Ngày {day.canChi.day} · {day.quality.label}</p>
            </div>
            <div className="lichHomNayAmLinks">
              <Link href="/am-lich-hom-nay" className="btn">Chi tiết âm lịch</Link>
              <Link href={gioHoangDaoDayHref(today)} className="btn btn-secondary">Giờ hoàng đạo</Link>
            </div>
          </div>
        </section>

        {/* Lịch tháng */}
        {calendarSlot}

        {/* Công cụ */}
        <section className="panelCard lichHomNayTools">
          <p className="eyebrow">Công cụ ngày tháng</p>
          <h2 className="lichHomNayToolsTitle">Tra nhanh</h2>
          <div className="lichHomNayToolGrid">
            <Link href="/dem-ngay" className="toolLink">
              <span className="toolLinkIcon"><SiteIcon name="calendar" /></span><span>Đếm ngày giữa hai mốc</span>
            </Link>
            <Link href="/chuyen-doi-lich" className="toolLink">
              <span className="toolLinkIcon"><SiteIcon name="converter" /></span><span>Đổi ngày âm dương</span>
            </Link>
            <Link href="/lich-nghi-le" className="toolLink">
              <span className="toolLinkIcon"><SiteIcon name="flag" /></span><span>Lịch nghỉ lễ {today.year}</span>
            </Link>
            <Link href="/nhac-ngay-gio" className="toolLink">
              <span className="toolLinkIcon"><SiteIcon name="bell" /></span><span>Nhắc ngày giờ (.ics)</span>
            </Link>
            <Link href="/tinh-tuoi-am" className="toolLink">
              <span className="toolLinkIcon"><SiteIcon name="age" /></span><span>Tính tuổi âm / con giáp</span>
            </Link>
            <Link href="/ngay-tot-xau" className="toolLink">
              <span className="toolLinkIcon"><SiteIcon name="goodBad" /></span><span>Ngày tốt xấu hôm nay</span>
            </Link>
          </div>
        </section>

        {/* Điều hướng cụm */}
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
          <p>Hôm nay là <strong>{wd}</strong>, ngày <strong>{today.day} tháng {today.month} năm {today.year}</strong> dương lịch — hay còn gọi là <strong>nay là ngày {today.day}/{today.month}/{today.year}</strong>, <strong>bữa nay thứ {wd.replace("Thứ ", "").replace("Chủ nhật", "Chủ nhật")}</strong>. Đây là ngày thứ {Math.ceil(today.day * today.month / today.month)} trong tháng {today.month} và thuộc Quý {Math.ceil(today.month / 3)} của năm {today.year}.</p>
          <h2>Hôm nay ngày mấy âm lịch?</h2>
          <p>Ngày dương lịch {today.day}/{today.month}/{today.year} tương đương <strong>mùng {day.lunar.day} tháng {day.lunar.month} năm {day.canChi.year}</strong> âm lịch, ngày <strong>{day.canChi.day}</strong>. Xem chi tiết tại trang <Link href="/am-lich-hom-nay">âm lịch hôm nay</Link>.</p>
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
