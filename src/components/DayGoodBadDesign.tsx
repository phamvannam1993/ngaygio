import Link from "next/link";
import type { ReactNode } from "react";
import { ActivityIcon, SiteIcon, ZodiacIcon } from "./Icon";
import { DayGoodBadDatePicker } from "./DayGoodBadDatePicker";
import { addDays, formatDisplayDate, type DateParts } from "@/lib/date";
import { getNapAmByCanChi } from "@/lib/calendar/age";
import { activityHref, getActivityRecommendation, getDayStars, getDirectionInfo, getGeneralDayScore100, type ActivityRecommendation, type ActivitySlug } from "@/lib/calendar/activity";
import { CHI } from "@/lib/calendar/can-chi";
import type { GoodBadDetails, OverallDayType } from "@/lib/calendar/good-bad";
import type { CalendarMonth, DayInfo, HourInfo } from "@/lib/calendar/types";

type DayGoodBadDesignProps = {
  day: DayInfo;
  details: GoodBadDetails;
  calendar: CalendarMonth;
  isHomNay?: boolean;
  isNgayMai?: boolean;
};

const featuredActivities: ActivitySlug[] = ["khai-truong", "cuoi-hoi", "xuat-hanh", "dong-tho", "ky-hop-dong", "nhap-trach"];

const dayNames = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

function goodBadDateHref(date: DateParts): string {
  return `/ngay-tot-xau/${date.year}/${date.month}/${date.day}`;
}

function lunarDisplay(day: DayInfo): string {
  return `${day.lunar.day}/${day.lunar.month}/${day.lunar.year}${day.lunar.isLeap ? " nhuận" : ""}`;
}

function overallShortLabel(type: OverallDayType): string {
  if (type === "good") return "TỐT";
  if (type === "neutral") return "TRUNG BÌNH";
  return "XẤU";
}

function score10(score: number): string {
  return (score / 10).toFixed(1).replace(".0", "");
}

function hourLabel(hour: HourInfo): string {
  return hour.range.replace("-", "h - ") + "h";
}

function activityToneClass(recommendation: ActivityRecommendation): string {
  if (recommendation.level === "excellent" || recommendation.level === "good") return "good";
  if (recommendation.level === "ok") return "neutral";
  return "bad";
}

function activityShortLabel(recommendation: ActivityRecommendation): string {
  if (recommendation.level === "excellent") return "Rất tốt";
  if (recommendation.level === "good") return "Khá tốt";
  if (recommendation.level === "ok") return "Cần xem tuổi";
  return "Không nên";
}

function compactSummary(text: string, max = 118): string {
  return text.length > max ? `${text.slice(0, max).trim()}…` : text;
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
    <section className="ngdSideCard ngdMonthMini" aria-labelledby="ngd-month-title">
      <div className="ngdSideTitleRow">
        <Link href={goodBadDateHref(calendar.prevMonthDate)} aria-label="Tháng trước">‹</Link>
        <h2 id="ngd-month-title">Lịch tháng {calendar.month}/{calendar.year}</h2>
        <Link href={goodBadDateHref(calendar.nextMonthDate)} aria-label="Tháng sau">›</Link>
      </div>

      <div className="ngdMonthGrid" role="grid" aria-label={`Lịch tháng ${calendar.month}/${calendar.year}`}>
        {dayNames.map((name) => <span className="ngdMonthDow" key={name}>{name}</span>)}
        {calendar.cells.map((cell) => (
          <Link
            key={`${cell.solar.year}-${cell.solar.month}-${cell.solar.day}`}
            href={goodBadDateHref(cell.solar)}
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

export function DayGoodBadDesign({ day, details, calendar, isHomNay, isNgayMai }: DayGoodBadDesignProps) {
  const displayDate = formatDisplayDate(day.solar);
  const previousDay = addDays(day.solar, -1);
  const nextDay = addDays(day.solar, 1);
  const score = getGeneralDayScore100(day);
  const directions = getDirectionInfo(day);
  const stars = getDayStars(day);
  const napAm = getNapAmByCanChi(day.canChi.dayCan, day.canChi.dayChi);
  const recommendations = featuredActivities.map((slug) => getActivityRecommendation(day, slug));
  const activeStars = Math.max(1, Math.min(5, Math.round(score.score / 20)));
  const pageTitle = isHomNay
    ? `Ngày tốt xấu hôm nay ${displayDate}`
    : isNgayMai
      ? `Ngày tốt xấu ngày mai ${displayDate}`
      : `Ngày ${displayDate} tốt hay xấu?`;

  return (
    <main className="ngdPage">
      <div className="pageFullscreenBg ngdFullscreenBg" style={{ backgroundImage: "linear-gradient(90deg, rgba(255,255,255,.94) 0%, rgba(255,255,255,.82) 42%, rgba(255,255,255,.52) 100%), linear-gradient(180deg, rgba(245,251,247,.18) 0%, rgba(245,251,247,.9) 100%), url(/bg-page-goodbad.png)" }} aria-hidden="true" />
      <div className="container ngdContainer">
        <nav className="ngdBreadcrumb" aria-label="Đường dẫn">
          <Link href="/">Trang chủ</Link>
          <span>›</span>
          <Link href="/ngay-tot-xau">Ngày tốt xấu</Link>
          <span>›</span>
          <strong>Ngày {displayDate}</strong>
        </nav>

        <div className="ngdLayout">
          <div className="ngdMainColumn">
            <section className="ngdHeroCard" aria-labelledby="ngd-title">
              <div className="ngdSolarCard" aria-label="Dương lịch">
                <span>Dương lịch</span>
                <strong>{day.weekdayName}</strong>
                <b>{String(day.solar.day).padStart(2, "0")}</b>
                <em>{String(day.solar.month).padStart(2, "0")}/{day.solar.year}</em>
                <i aria-hidden="true">☁</i>
              </div>

              <div className="ngdHeroInfo">
                <p className="ngdEyebrow">Xem ngày tốt xấu theo ngày</p>
                <h1 id="ngd-title">{pageTitle}</h1>

                <dl className="ngdMetaList">
                  <div><dt><SiteIcon name="moon" /></dt><dd><span>Âm lịch:</span><strong>{lunarDisplay(day)} ({day.canChi.year})</strong></dd></div>
                  <div><dt><SiteIcon name="calendar" /></dt><dd><span>Can chi:</span><strong>{day.canChi.day} – {day.canChi.month} – {day.canChi.year}</strong></dd></div>
                  <div><dt><SiteIcon name="sparkle" /></dt><dd><span>Tiết khí:</span><strong>{day.solarTerm}</strong></dd></div>
                  <div><dt><SiteIcon name="shield" /></dt><dd><span>Ngày:</span><strong>{day.quality.label}</strong></dd></div>
                  <div><dt><SiteIcon name="focus" /></dt><dd><span>Trực:</span><strong>Trực {details.twelveDirect.name}</strong></dd></div>
                  <div><dt><SiteIcon name="star" /></dt><dd><span>Ngũ hành:</span><strong>{napAm.name} · Hành {napAm.element}</strong></dd></div>
                </dl>
              </div>

              <div className={["ngdScoreSeal", details.overallType].join(" ")} aria-label={`Đánh giá ${overallShortLabel(details.overallType)}`}>
                <span>Đánh giá tổng quan</span>
                <strong>{overallShortLabel(details.overallType)}</strong>
                <b>{score10(score.score)}/10 điểm</b>
                <div aria-label={`${activeStars} trên 5 sao`}>
                  {Array.from({ length: 5 }, (_, index) => <i key={index} className={index < activeStars ? "active" : ""}>★</i>)}
                </div>
              </div>

              <div className="ngdHeroSummary">
                <p><span className="ngdCheck">✓</span>{details.overallSummary}</p>
                <p><span className="ngdCross">×</span>{details.shouldAvoid[0] ?? "Không nên quyết định việc trọng đại khi chưa cân nhắc đủ điều kiện thực tế."}</p>
              </div>

              <div className="ngdHeroActions">
                <DayGoodBadDatePicker defaultDate={day.solar} buttonLabel="Chọn ngày khác" compact />
                <Link href={goodBadDateHref(nextDay)}>Xem ngày mai <span>→</span></Link>
              </div>
            </section>

            <section className="ngdQuickConclusion" aria-labelledby="quick-conclusion-title">
              <div className="ngdSectionHead">
                <p className="ngdEyebrow">Kết luận nhanh</p>
                <h2 id="quick-conclusion-title">Ngày {displayDate} nên làm gì, tránh gì?</h2>
              </div>

              <div className="ngdAdviceGrid">
                <article className="ngdAdviceCard good">
                  <div><span>✓</span><h3>Nên làm</h3></div>
                  <ul>
                    {details.shouldDo.slice(0, 6).map((item) => <li key={item}>{item}</li>)}
                  </ul>
                  <i aria-hidden="true">☘</i>
                </article>

                <article className="ngdAdviceCard bad">
                  <div><span>×</span><h3>Không nên làm</h3></div>
                  <ul>
                    {details.shouldAvoid.slice(0, 6).map((item) => <li key={item}>{item}</li>)}
                  </ul>
                  <i aria-hidden="true">⌂</i>
                </article>
              </div>
            </section>

            <section className="ngdPanel" aria-labelledby="hours-title">
              <div className="ngdPanelHead">
                <div>
                  <p className="ngdEyebrow">Giờ tốt xấu</p>
                  <h2 id="hours-title">Giờ hoàng đạo hôm nay</h2>
                </div>
                <label className="ngdFakeSelect">
                  <span>Chọn việc để lọc giờ tốt:</span>
                  <select defaultValue="all" aria-label="Chọn việc để lọc giờ tốt">
                    <option value="all">Tất cả công việc</option>
                    <option value="xuat-hanh">Xuất hành</option>
                    <option value="khai-truong">Khai trương</option>
                    <option value="cuoi-hoi">Cưới hỏi</option>
                    <option value="dong-tho">Động thổ</option>
                  </select>
                </label>
              </div>

              <div className="ngdHourGrid">
                {allHours(day).map((hour) => (
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

            <section className="ngdPanel" aria-labelledby="activities-title">
              <div className="ngdSectionHead">
                <p className="ngdEyebrow">Theo từng việc</p>
                <h2 id="activities-title">Việc nên làm theo ngày</h2>
              </div>

              <div className="ngdActivityGrid">
                {recommendations.map((recommendation) => (
                  <Link className={["ngdActivityCard", activityToneClass(recommendation)].join(" ")} href={activityHref(recommendation.activity.slug)} key={recommendation.activity.slug}>
                    <div className="ngdActivityTop">
                      <h3>{recommendation.activity.shortTitle}</h3>
                      <ActivityIcon slug={recommendation.activity.slug} />
                    </div>
                    <span>{activityShortLabel(recommendation)}</span>
                    <p>{compactSummary(recommendation.summary)}</p>
                    <em>Xem chi tiết →</em>
                  </Link>
                ))}
              </div>
            </section>

            <section className="ngdInfoTriplet" aria-label="Hướng xuất hành, tuổi hợp tuổi kỵ và xem theo việc">
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

              <article className="ngdAgeCard">
                <div className="ngdSectionHead compact">
                  <p className="ngdEyebrow">Can chi</p>
                  <h2>Tuổi hợp – tuổi kỵ</h2>
                </div>
                <div className="ngdAgeBox good">
                  <div>
                    <strong>Tuổi hợp</strong>
                    <span>{details.ageCompatibility.lucHop} – {details.ageCompatibility.tamHop.join(" – ")}</span>
                    <p>Hỗ trợ, giúp đỡ, dễ thành công.</p>
                  </div>
                  <div className="ngdZodiacRow" aria-hidden="true">
                    <ZodiacIcon branch={details.ageCompatibility.lucHop} />
                    {details.ageCompatibility.tamHop.slice(0, 2).map((branch) => <ZodiacIcon key={branch} branch={branch} />)}
                  </div>
                </div>
                <div className="ngdAgeBox bad">
                  <div>
                    <strong>Tuổi kỵ</strong>
                    <span>{details.ageCompatibility.xung.join(" – ")}</span>
                    <p>Dễ xung khắc, nên cẩn trọng.</p>
                  </div>
                  <div className="ngdZodiacRow" aria-hidden="true">
                    {details.ageCompatibility.xung.slice(0, 2).map((branch) => <ZodiacIcon key={branch} branch={branch} />)}
                  </div>
                </div>
                <form className="ngdBirthForm" action="/xem-ngay-tot-theo-tuoi">
                  <label>
                    <span>Xem ngày hợp tuổi của bạn</span>
                    <input name="namSinh" inputMode="numeric" placeholder="Nhập năm sinh" />
                  </label>
                  <select name="gioiTinh" defaultValue="nam" aria-label="Giới tính">
                    <option value="nam">Nam</option>
                    <option value="nu">Nữ</option>
                  </select>
                  <button type="submit">Xem ngay</button>
                </form>
              </article>

              <article className="ngdTaskCard">
                <div className="ngdSectionHead compact">
                  <p className="ngdEyebrow">Tra cứu nhanh</p>
                  <h2>Xem theo việc cần làm</h2>
                </div>
                <div className="ngdTaskLinks">
                  <QuickLink href="/xem-ngay-tot-khai-truong" icon="🏮">Tôi muốn khai trương</QuickLink>
                  <QuickLink href="/xem-ngay-tot-cuoi-hoi" icon="💍">Tôi muốn cưới hỏi</QuickLink>
                  <QuickLink href="/xem-ngay-tot-nhap-trach" icon="🏠">Tôi muốn nhập trạch</QuickLink>
                  <QuickLink href="/xem-ngay-tot-dong-tho" icon="🏗️">Tôi muốn động thổ</QuickLink>
                  <QuickLink href="/xem-ngay-tot-xuat-hanh" icon="✈️">Tôi muốn xuất hành</QuickLink>
                  <QuickLink href="/xem-ngay-tot-ky-hop-dong" icon="📝">Tôi muốn ký hợp đồng</QuickLink>
                </div>
              </article>
            </section>

            <section className="ngdDetailAndLinks">
              <article className="ngdPanel ngdDetailPanel" aria-labelledby="detail-title">
                <div className="ngdSectionHead compact">
                  <p className="ngdEyebrow">Luận giải</p>
                  <h2 id="detail-title">Luận giải chi tiết ngày {displayDate}</h2>
                </div>
                <div className="ngdTabs" aria-label="Các nhóm luận giải">
                  <span>Theo can chi</span>
                  <span>Theo trực</span>
                  <span>Sao tốt</span>
                  <span>Sao xấu</span>
                  <span>Bành Tổ</span>
                  <span>Giờ hoàng đạo</span>
                </div>
                <div className="ngdDetailText">
                  <p>Ngày {day.canChi.day}, tháng {day.canChi.month}, năm {day.canChi.year}. Theo phân loại hiện tại, đây là <strong>{day.quality.label}</strong>; Trực ngày là <strong>Trực {details.twelveDirect.name}</strong>, {details.twelveDirect.meaning.toLowerCase()}</p>
                  <p><strong>Sao tốt:</strong> {stars.goodStars.join(", ")}. <strong>Sao xấu:</strong> {stars.badStars.join(", ")}.</p>
                  <p><strong>Bành Tổ bách kỵ:</strong> {details.banhTo.join(" ")}</p>
                  {details.specialWarnings.length > 0 ? <p><strong>Ngày kỵ cần lưu ý:</strong> {details.specialWarnings.map((warning) => `${warning.name}: ${warning.description}`).join(" ")}</p> : <p>Không phạm các nhóm ngày kỵ phổ biến trong bộ kiểm tra hiện tại. Dù vậy, các việc lớn vẫn nên cân nhắc tuổi, giờ, người đứng việc và điều kiện thực tế.</p>}
                </div>
              </article>

              <aside className="ngdPanel ngdRelatedPanel" aria-labelledby="related-title">
                <div className="ngdSectionHead compact">
                  <p className="ngdEyebrow">Liên kết</p>
                  <h2 id="related-title">Ngày liên quan</h2>
                </div>
                <div className="ngdRelatedGrid">
                  <Link href={goodBadDateHref(previousDay)}><SiteIcon name="calendar" />Ngày hôm qua tốt hay xấu?</Link>
                  <Link href={goodBadDateHref(nextDay)}><SiteIcon name="calendar" />Ngày mai tốt hay xấu?</Link>
                  <Link href="/ngay-tot-xau-hom-nay"><SiteIcon name="shield" />Ngày tốt xấu hôm nay</Link>
                  <Link href="/ngay-tot-xau-ngay-mai"><SiteIcon name="sparkle" />Ngày tốt xấu ngày mai</Link>
                  <Link href="/lich-van-nien"><SiteIcon name="book" />Lịch âm hôm nay</Link>
                  <Link href="/gio-hoang-dao-hom-nay"><SiteIcon name="clock" />Giờ hoàng đạo hôm nay</Link>
                </div>
              </aside>
            </section>

            <section className="ngdFaq" aria-labelledby="faq-title">
              <div className="ngdSectionHead compact">
                <p className="ngdEyebrow">FAQ</p>
                <h2 id="faq-title">Câu hỏi thường gặp</h2>
              </div>
              <div className="ngdFaqGrid">
                <details>
                  <summary>Ngày {displayDate} có tốt không?</summary>
                  <p>{details.overallSummary}</p>
                </details>
                <details>
                  <summary>Ngày {displayDate} có giờ hoàng đạo nào?</summary>
                  <p>{day.goodHours.map((hour) => `${hour.branch} ${hour.range}`).join(", ")}.</p>
                </details>
                <details>
                  <summary>Ngày {displayDate} có nên khai trương không?</summary>
                  <p>{getActivityRecommendation(day, "khai-truong").summary}</p>
                </details>
                <details>
                  <summary>Ngày {displayDate} có nên cưới hỏi không?</summary>
                  <p>{getActivityRecommendation(day, "cuoi-hoi").summary}</p>
                </details>
                <details>
                  <summary>Ngày {displayDate} hợp với tuổi nào?</summary>
                  <p>Ngày {day.canChi.day} lục hợp với tuổi {details.ageCompatibility.lucHop}, tam hợp với {details.ageCompatibility.tamHop.join(", ")}.</p>
                </details>
                <details>
                  <summary>Thông tin ngày tốt xấu có phải kết luận tuyệt đối không?</summary>
                  <p>Không. Nội dung chỉ mang tính tham khảo theo lịch pháp dân gian; việc quan trọng vẫn nên xét thêm hoàn cảnh, pháp lý, sức khỏe, tài chính và người liên quan.</p>
                </details>
              </div>
            </section>
          </div>

          <aside className="ngdSidebar" aria-label="Lịch tháng và lối tắt">
            <MiniMonthCalendar calendar={calendar} />

            <section className="ngdSideCard ngdFastCard" aria-labelledby="fast-title">
              <h2 id="fast-title">Xem nhanh</h2>
              <div>
                <Link href="#hours-title"><SiteIcon name="clock" />Giờ hoàng đạo hôm nay</Link>
                <Link href="#activities-title"><SiteIcon name="sparkle" />Việc nên làm trong ngày</Link>
                <Link href="#detail-title"><SiteIcon name="compass" />Hướng xuất hành</Link>
                <Link href="#quick-conclusion-title"><SiteIcon name="shield" />Tuổi hợp – tuổi kỵ</Link>
                <Link href="#detail-title"><SiteIcon name="book" />Luận giải chi tiết</Link>
              </div>
            </section>

            <section className="ngdSideCard ngdPickerSide" aria-labelledby="picker-title">
              <h2 id="picker-title">Xem ngày khác</h2>
              <p>Chọn ngày dương lịch để xem âm lịch, can chi, giờ hoàng đạo và việc nên làm.</p>
              <DayGoodBadDatePicker defaultDate={day.solar} buttonLabel="Xem kết quả" />
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
