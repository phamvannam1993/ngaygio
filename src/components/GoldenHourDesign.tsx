import Link from "next/link";
import type { ReactNode } from "react";
import { ActivityIcon, SiteIcon } from "./Icon";
import { GoldenHourDatePicker } from "./GoldenHourDatePicker";
import { addDays, formatDisplayDate, type DateParts } from "@/lib/date";
import { getDirectionInfo } from "@/lib/calendar/activity";
import { CHI, formatHours } from "@/lib/calendar/can-chi";
import { gioHoangDaoDayHref } from "@/lib/calendar/urls";
import type { CalendarMonth, DayInfo, HourInfo } from "@/lib/calendar/types";

type GoldenHourDesignProps = {
  day: DayInfo;
  calendar: CalendarMonth;
  isHomNay?: boolean;
  isNgayMai?: boolean;
};

const dayNames = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

const hourUseCases = [
  {
    title: "Xuất hành",
    slug: "xuat-hanh" as const,
    href: "/xem-ngay-tot-xuat-hanh",
    label: "Nên ưu tiên giờ tốt",
    text: "Phù hợp để đi xa, gặp gỡ, cầu tài hoặc bắt đầu hành trình quan trọng.",
  },
  {
    title: "Khai trương",
    slug: "khai-truong" as const,
    href: "/xem-ngay-tot-khai-truong",
    label: "Cần chọn thêm ngày",
    text: "Giờ hoàng đạo là lớp tham khảo tốt, nên kết hợp ngày đẹp và tuổi người đứng việc.",
  },
  {
    title: "Ký kết",
    slug: "ky-hop-dong" as const,
    href: "/xem-ngay-tot-ky-hop-dong",
    label: "Hợp việc bắt đầu",
    text: "Có thể chọn giờ tốt để trao đổi, ký giấy tờ hoặc chốt thỏa thuận quan trọng.",
  },
  {
    title: "Cưới hỏi",
    slug: "cuoi-hoi" as const,
    href: "/xem-ngay-tot-cuoi-hoi",
    label: "Nên xem tuổi",
    text: "Việc trọng đại nên xem thêm ngày cưới, tuổi hai bên và điều kiện gia đình.",
  },
  {
    title: "Động thổ",
    slug: "dong-tho" as const,
    href: "/xem-ngay-tot-dong-tho",
    label: "Không chỉ xem giờ",
    text: "Nên phối hợp tuổi gia chủ, ngày động thổ và giờ thực hiện để tham khảo đầy đủ hơn.",
  },
  {
    title: "Nhập trạch",
    slug: "nhap-trach" as const,
    href: "/xem-ngay-tot-nhap-trach",
    label: "Chọn giờ vào nhà",
    text: "Có thể dùng giờ hoàng đạo để sắp xếp thời điểm chuyển vào nhà mới.",
  },
];

function lunarDisplay(day: DayInfo): string {
  return `${day.lunar.day}/${day.lunar.month}/${day.lunar.year}${day.lunar.isLeap ? " nhuận" : ""}`;
}

function hourLabel(hour: HourInfo): string {
  return hour.range.replace("-", "h - ") + "h";
}

function allHours(day: DayInfo): HourInfo[] {
  return [...day.goodHours, ...day.badHours].sort((a, b) => CHI.indexOf(a.branch) - CHI.indexOf(b.branch));
}

function QuickLink({ href, icon, children }: { href: string; icon: ReactNode; children: ReactNode }) {
  return (
    <Link className="ngdQuickLink" href={href}>
      <span aria-hidden="true">{icon}</span>
      <strong>{children}</strong>
      <em>›</em>
    </Link>
  );
}

function MiniMonthCalendar({ calendar }: { calendar: CalendarMonth }) {
  return (
    <section className="ngdSideCard ngdMonthMini" aria-labelledby="ghd-month-title">
      <div className="ngdSideTitleRow">
        <Link href={gioHoangDaoDayHref(calendar.prevMonthDate)} aria-label="Tháng trước">‹</Link>
        <h2 id="ghd-month-title">Lịch tháng {calendar.month}/{calendar.year}</h2>
        <Link href={gioHoangDaoDayHref(calendar.nextMonthDate)} aria-label="Tháng sau">›</Link>
      </div>

      <div className="ngdMonthGrid" role="grid" aria-label={`Lịch tháng ${calendar.month}/${calendar.year}`}>
        {dayNames.map((name) => <span className="ngdMonthDow" key={name}>{name}</span>)}
        {calendar.cells.map((cell) => (
          <Link
            key={`${cell.solar.year}-${cell.solar.month}-${cell.solar.day}`}
            href={gioHoangDaoDayHref(cell.solar)}
            className={["ngdMonthDay", cell.otherMonth ? "muted" : "", cell.isSelected ? "selected" : "", cell.isToday ? "today" : "", cell.quality.type].filter(Boolean).join(" ")}
            aria-label={`${formatDisplayDate(cell.solar)} - ${cell.quality.label}`}
          >
            <strong>{cell.solar.day}</strong>
            <span aria-hidden="true" />
          </Link>
        ))}
      </div>

      <div className="ngdLegend">
        <span><i className="good" />Tốt</span>
        <span><i className="neutral" />Bình thường</span>
        <span><i className="bad" />Xấu</span>
      </div>
    </section>
  );
}

export function GoldenHourDesign({ day, calendar, isHomNay, isNgayMai }: GoldenHourDesignProps) {
  const displayDate = formatDisplayDate(day.solar);
  const previousDay = addDays(day.solar, -1);
  const nextDay = addDays(day.solar, 1);
  const directions = getDirectionInfo(day);
  const hours = allHours(day);
  const pageTitle = isHomNay
    ? `Giờ hoàng đạo hôm nay ${displayDate}`
    : isNgayMai
      ? `Giờ hoàng đạo ngày mai ${displayDate}`
      : `Giờ hoàng đạo ngày ${displayDate}`;

  return (
    <main className="ngdPage goldenDayPage">
      <div className="pageFullscreenBg ngdFullscreenBg" style={{ backgroundImage: "linear-gradient(90deg, rgba(255,255,255,.94) 0%, rgba(255,255,255,.82) 42%, rgba(255,255,255,.52) 100%), linear-gradient(180deg, rgba(245,251,247,.18) 0%, rgba(245,251,247,.9) 100%), url(/bg-page-clock.png)" }} aria-hidden="true" />

      <div className="container ngdContainer">
        <nav className="ngdBreadcrumb" aria-label="Đường dẫn">
          <Link href="/">Trang chủ</Link>
          <span>›</span>
          <Link href="/gio-hoang-dao">Giờ hoàng đạo</Link>
          <span>›</span>
          <strong>Ngày {displayDate}</strong>
        </nav>

        <div className="ngdLayout">
          <div className="ngdMainColumn">
            <section className="ngdHeroCard goldenHeroCard" aria-labelledby="ghd-title">
              <div className="ngdSolarCard goldenTimeCard" aria-label="Dương lịch">
                <span>Ngày xem giờ</span>
                <strong>{day.weekdayName}</strong>
                <b>{String(day.solar.day).padStart(2, "0")}</b>
                <em>{String(day.solar.month).padStart(2, "0")}/{day.solar.year}</em>
                <i aria-hidden="true">◷</i>
              </div>

              <div className="ngdHeroInfo">
                <p className="ngdEyebrow">Tra giờ tốt xấu theo ngày</p>
                <h1 id="ghd-title">{pageTitle}</h1>

                <dl className="ngdMetaList">
                  <div><dt><SiteIcon name="moon" /></dt><dd><span>Âm lịch:</span><strong>{lunarDisplay(day)} ({day.canChi.year})</strong></dd></div>
                  <div><dt><SiteIcon name="calendar" /></dt><dd><span>Can chi:</span><strong>{day.canChi.day} – {day.canChi.month} – {day.canChi.year}</strong></dd></div>
                  <div><dt><SiteIcon name="sparkle" /></dt><dd><span>Tiết khí:</span><strong>{day.solarTerm}</strong></dd></div>
                  <div><dt><SiteIcon name="shield" /></dt><dd><span>Ngày:</span><strong>{day.quality.label}</strong></dd></div>
                  <div><dt><SiteIcon name="clock" /></dt><dd><span>Giờ tốt:</span><strong>{formatHours(day.goodHours)}</strong></dd></div>
                  <div><dt><SiteIcon name="cross" /></dt><dd><span>Giờ xấu:</span><strong>{formatHours(day.badHours)}</strong></dd></div>
                </dl>
              </div>

              <div className="ngdScoreSeal goldenSeal good" aria-label={`${day.goodHours.length} giờ hoàng đạo`}>
                <span>Tổng giờ tốt</span>
                <strong>{day.goodHours.length}</strong>
                <b>giờ hoàng đạo</b>
                <div aria-hidden="true">
                  {Array.from({ length: 5 }, (_, index) => <i key={index} className={index < Math.min(5, day.goodHours.length) ? "active" : ""}>★</i>)}
                </div>
              </div>

              <div className="ngdHeroSummary">
                <p><span className="ngdCheck">✓</span>Giờ hoàng đạo ngày {displayDate}: {formatHours(day.goodHours)}. Nên ưu tiên các khung giờ này khi cần xuất hành, gặp gỡ, khai mở hoặc bắt đầu việc quan trọng.</p>
                <p><span className="ngdCross">×</span>Giờ hắc đạo ngày {displayDate}: {formatHours(day.badHours)}. Với việc lớn, nên tránh hoặc cân nhắc kỹ thêm ngày, tuổi và điều kiện thực tế.</p>
              </div>

              <div className="ngdHeroActions">
                <GoldenHourDatePicker defaultDate={day.solar} buttonLabel="Chọn ngày khác" compact />
                <Link href={gioHoangDaoDayHref(nextDay)}>Xem ngày mai <span>→</span></Link>
              </div>
            </section>

            <section className="ngdQuickConclusion" aria-labelledby="ghd-summary-title">
              <div className="ngdSectionHead">
                <p className="ngdEyebrow">Kết luận nhanh</p>
                <h2 id="ghd-summary-title">Giờ nào nên dùng, giờ nào nên tránh?</h2>
              </div>

              <div className="ngdAdviceGrid">
                <article className="ngdAdviceCard good">
                  <div><span>✓</span><h3>Giờ hoàng đạo</h3></div>
                  <ul>
                    {day.goodHours.map((hour) => <li key={hour.branch}>Giờ {hour.branch}: {hourLabel(hour)}</li>)}
                  </ul>
                  <i aria-hidden="true">◴</i>
                </article>

                <article className="ngdAdviceCard bad">
                  <div><span>×</span><h3>Giờ hắc đạo</h3></div>
                  <ul>
                    {day.badHours.map((hour) => <li key={hour.branch}>Giờ {hour.branch}: {hourLabel(hour)}</li>)}
                  </ul>
                  <i aria-hidden="true">◷</i>
                </article>
              </div>
            </section>

            <section className="ngdPanel" aria-labelledby="ghd-all-hours-title">
              <div className="ngdPanelHead">
                <div>
                  <p className="ngdEyebrow">12 khung giờ</p>
                  <h2 id="ghd-all-hours-title">Chi tiết toàn bộ khung giờ ngày {displayDate}</h2>
                </div>
                <label className="ngdFakeSelect">
                  <span>Lọc theo mục đích:</span>
                  <select defaultValue="all" aria-label="Lọc giờ tốt theo mục đích">
                    <option value="all">Tất cả công việc</option>
                    <option value="xuat-hanh">Xuất hành</option>
                    <option value="khai-truong">Khai trương</option>
                    <option value="ky-ket">Ký kết</option>
                    <option value="cuoi-hoi">Cưới hỏi</option>
                  </select>
                </label>
              </div>

              <div className="ngdHourGrid">
                {hours.map((hour) => (
                  <article className={["ngdHourCard", hour.isGood ? "good" : "bad"].join(" ")} key={hour.branch}>
                    <strong>{hour.branch}</strong>
                    <span>{hourLabel(hour)}</span>
                    <em>{hour.isGood ? "Tốt" : "Xấu"}</em>
                  </article>
                ))}
              </div>

              <div className="ngdHourLegend">
                <span><i className="good" />Tốt (Hoàng đạo)</span>
                <span><i className="bad" />Xấu (Hắc đạo)</span>
              </div>
            </section>

            <section className="ngdPanel" aria-labelledby="ghd-use-title">
              <div className="ngdSectionHead">
                <p className="ngdEyebrow">Theo từng việc</p>
                <h2 id="ghd-use-title">Nên dùng giờ hoàng đạo cho việc gì?</h2>
              </div>

              <div className="ngdActivityGrid">
                {hourUseCases.map((item) => (
                  <Link className="ngdActivityCard good goldenUseCard" href={item.href} key={item.slug}>
                    <div className="ngdActivityTop">
                      <h3>{item.title}</h3>
                      <ActivityIcon slug={item.slug} />
                    </div>
                    <span>{item.label}</span>
                    <p>{item.text}</p>
                    <em>Xem ngày tốt →</em>
                  </Link>
                ))}
              </div>
            </section>

            <section className="ngdInfoTriplet goldenInfoGrid" aria-label="Hướng xuất hành, cách dùng giờ tốt và lưu ý">
              <article className="ngdCompassCard">
                <div className="ngdSectionHead compact">
                  <p className="ngdEyebrow">Xuất hành</p>
                  <h2>Hướng xuất hành</h2>
                </div>
                <div className="ngdCompassWrap" aria-hidden="true">
                  <span>N</span><span>E</span><span>S</span><span>W</span>
                  <b>➤</b>
                </div>
                <dl className="ngdDirectionList">
                  <div><dt>Hỷ thần:</dt><dd>{directions.hyThan}</dd></div>
                  <div><dt>Tài thần:</dt><dd>{directions.taiThan}</dd></div>
                  <div><dt>Hắc thần:</dt><dd>{directions.hacThan}</dd></div>
                </dl>
                <p>{directions.note}</p>
              </article>

              <article className="ngdAgeCard goldenNoteCard">
                <div className="ngdSectionHead compact">
                  <p className="ngdEyebrow">Cách dùng</p>
                  <h2>Chọn giờ đúng việc</h2>
                </div>
                <div className="ngdAgeBox good">
                  <div>
                    <strong>Việc nhẹ</strong>
                    <span>Gặp gỡ · Cầu tài · Đi xa</span>
                    <p>Có thể chọn một trong các giờ hoàng đạo thuận tiện nhất.</p>
                  </div>
                  <SiteIcon name="check" />
                </div>
                <div className="ngdAgeBox bad">
                  <div>
                    <strong>Việc trọng đại</strong>
                    <span>Cưới hỏi · Động thổ · Nhập trạch</span>
                    <p>Nên xem thêm ngày tốt, tuổi người đứng việc và điều kiện thực tế.</p>
                  </div>
                  <SiteIcon name="shield" />
                </div>
              </article>

              <article className="ngdTaskCard">
                <div className="ngdSectionHead compact">
                  <p className="ngdEyebrow">Tra cứu nhanh</p>
                  <h2>Xem giờ theo ngày</h2>
                </div>
                <div className="ngdTaskLinks">
                  <QuickLink href={gioHoangDaoDayHref(previousDay)} icon="←">Giờ hoàng đạo hôm qua</QuickLink>
                  <QuickLink href="/gio-hoang-dao-hom-nay" icon="◉">Giờ hoàng đạo hôm nay</QuickLink>
                  <QuickLink href="/gio-hoang-dao-ngay-mai" icon="→">Giờ hoàng đạo ngày mai</QuickLink>
                  <QuickLink href="/ngay-tot-xau" icon="★">Xem ngày tốt xấu</QuickLink>
                  <QuickLink href="/xem-ngay-tot" icon="☘">Tìm ngày tốt theo việc</QuickLink>
                </div>
              </article>
            </section>

            <section className="ngdDetailAndLinks">
              <article className="ngdPanel ngdDetailPanel" aria-labelledby="ghd-detail-title">
                <div className="ngdSectionHead compact">
                  <p className="ngdEyebrow">Luận giải</p>
                  <h2 id="ghd-detail-title">Cách hiểu giờ hoàng đạo ngày {displayDate}</h2>
                </div>
                <div className="ngdTabs" aria-label="Các nhóm luận giải">
                  <span>Theo địa chi</span>
                  <span>Giờ tốt</span>
                  <span>Giờ xấu</span>
                  <span>Ứng dụng</span>
                </div>
                <div className="ngdDetailText">
                  <p>Ngày {day.canChi.day}, tháng {day.canChi.month}, năm {day.canChi.year}. Theo lịch pháp dân gian, các giờ hoàng đạo của ngày này là <strong>{formatHours(day.goodHours)}</strong>.</p>
                  <p>Giờ hoàng đạo thường được tham khảo khi cần xuất hành, mở việc, giao dịch, ký kết, cầu tài hoặc chọn thời điểm bắt đầu công việc. Giờ hắc đạo gồm <strong>{formatHours(day.badHours)}</strong>, thường nên hạn chế dùng cho việc lớn.</p>
                  <p>Thông tin chỉ mang tính tham khảo văn hóa truyền thống. Với quyết định quan trọng, nên kết hợp lịch làm việc, sức khỏe, pháp lý, điều kiện gia đình và sự chuẩn bị thực tế.</p>
                </div>
              </article>

              <aside className="ngdPanel ngdRelatedPanel" aria-labelledby="ghd-related-title">
                <div className="ngdSectionHead compact">
                  <p className="ngdEyebrow">Liên kết</p>
                  <h2 id="ghd-related-title">Trang liên quan</h2>
                </div>
                <div className="ngdRelatedGrid">
                  <Link href={gioHoangDaoDayHref(previousDay)}><SiteIcon name="clock" />Giờ hoàng đạo hôm qua</Link>
                  <Link href={gioHoangDaoDayHref(nextDay)}><SiteIcon name="clock" />Giờ hoàng đạo ngày mai</Link>
                  <Link href="/ngay-tot-xau-hom-nay"><SiteIcon name="shield" />Ngày tốt xấu hôm nay</Link>
                  <Link href="/xem-ngay-tot-xuat-hanh"><SiteIcon name="compass" />Xem ngày tốt xuất hành</Link>
                  <Link href="/lich-van-nien"><SiteIcon name="book" />Lịch vạn niên</Link>
                </div>
              </aside>
            </section>

            <section className="ngdFaq" aria-labelledby="ghd-faq-title">
              <div className="ngdSectionHead compact">
                <p className="ngdEyebrow">FAQ</p>
                <h2 id="ghd-faq-title">Câu hỏi thường gặp</h2>
              </div>
              <div className="ngdFaqGrid">
                <details>
                  <summary>Giờ hoàng đạo ngày {displayDate} là giờ nào?</summary>
                  <p>{formatHours(day.goodHours)}.</p>
                </details>
                <details>
                  <summary>Giờ hắc đạo ngày {displayDate} là giờ nào?</summary>
                  <p>{formatHours(day.badHours)}.</p>
                </details>
                <details>
                  <summary>Ngày {displayDate} là ngày can chi gì?</summary>
                  <p>Ngày {day.canChi.day}, tháng {day.canChi.month}, năm {day.canChi.year}.</p>
                </details>
                <details>
                  <summary>Có nên chỉ dựa vào giờ hoàng đạo không?</summary>
                  <p>Không nên tuyệt đối hóa. Giờ hoàng đạo là lớp tham khảo; việc lớn cần xem thêm ngày, tuổi, hoàn cảnh và sự chuẩn bị thực tế.</p>
                </details>
              </div>
            </section>
          </div>

          <aside className="ngdSidebar" aria-label="Lịch tháng và lối tắt">
            <MiniMonthCalendar calendar={calendar} />

            <section className="ngdSideCard ngdFastCard" aria-labelledby="ghd-fast-title">
              <h2 id="ghd-fast-title">Xem nhanh</h2>
              <div>
                <Link href="#ghd-all-hours-title"><SiteIcon name="clock" />12 khung giờ</Link>
                <Link href="#ghd-use-title"><SiteIcon name="sparkle" />Việc nên dùng giờ tốt</Link>
                <Link href="#ghd-detail-title"><SiteIcon name="book" />Luận giải chi tiết</Link>
                <Link href="#ghd-faq-title"><SiteIcon name="shield" />Câu hỏi thường gặp</Link>
              </div>
            </section>

            <section className="ngdSideCard ngdPickerSide" aria-labelledby="ghd-picker-title">
              <h2 id="ghd-picker-title">Xem giờ ngày khác</h2>
              <p>Chọn ngày dương lịch để xem giờ hoàng đạo, giờ hắc đạo và can chi trong ngày.</p>
              <GoldenHourDatePicker defaultDate={day.solar} buttonLabel="Xem giờ" />
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
