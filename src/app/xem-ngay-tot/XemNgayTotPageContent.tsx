import Link from "next/link";
import { ActivityPlannerForm } from "@/components/ActivityPlannerForm";
import { ActivityResults } from "@/components/ActivityResults";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MonthCalendar } from "@/components/MonthCalendar";
import { ActivityIcon } from "@/components/Icon";
import { ACTIVITIES, activityHref, getActivity, getActivityRecommendation, getCurrentMonthRange, searchGoodDates, type ActivitySlug } from "@/lib/calendar/activity";
import { getGoodBadDetails } from "@/lib/calendar/good-bad";
import { getDayInfo, getMonthCalendar } from "@/lib/calendar/service";
import { formatDisplayDate, getVietnamTodayParts, parseDateKey, type DateParts } from "@/lib/date";

type SearchParams = Record<string, string | string[] | undefined>;

type ResolvedParams = {
  activitySlug: ActivitySlug;
  from: DateParts;
  to: DateParts;
  birthYear?: number;
};

function single(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function dateTime(date: DateParts) {
  return Date.UTC(date.year, date.month - 1, date.day);
}

function validBirthYear(value?: string): number | undefined {
  const year = Number(value);
  if (!Number.isInteger(year) || year < 1900 || year > 2050) return undefined;
  return year;
}

export function resolveGoodDateParams(params: SearchParams, fallbackSlug?: string | null): ResolvedParams {
  const today = getVietnamTodayParts();
  const defaultRange = getCurrentMonthRange(today);
  const rawActivity = single(params.viec) ?? fallbackSlug ?? "khai-truong";
  const activity = getActivity(rawActivity);
  const from = parseDateKey(single(params.tu)) ?? defaultRange.from;
  const to = parseDateKey(single(params.den)) ?? defaultRange.to;
  const fixedRange = dateTime(from) <= dateTime(to) ? { from, to } : defaultRange;
  return {
    activitySlug: activity.slug,
    from: fixedRange.from,
    to: fixedRange.to,
    birthYear: validBirthYear(single(params.tuoi)),
  };
}

function makeCalendarHref(date: DateParts) {
  return `/ngay-tot-xau/${date.year}/${date.month}/${date.day}`;
}

export function XemNgayTotPageContent({ resolved, overrideTitle, overrideDescription }: { resolved: ResolvedParams; overrideTitle?: string; overrideDescription?: string }) {
  const today = getVietnamTodayParts();
  const activity = getActivity(resolved.activitySlug);
  const results = searchGoodDates({
    activitySlug: resolved.activitySlug,
    from: resolved.from,
    to: resolved.to,
    birthYear: resolved.birthYear,
    limit: 12,
  });
  const topResult = results[0] ?? getActivityRecommendation(getDayInfo(today), resolved.activitySlug, resolved.birthYear);
  const monthCalendar = getMonthCalendar(resolved.from.year, resolved.from.month, topResult.day.solar);
  const details = getGoodBadDetails(topResult.day);

  return (
    <>
      <Header currentYear={today.year} />
      <main className="container mainStack">
        <section className="activityHero heroCard" aria-labelledby="activity-hero-title">
          <div>
            <p className="eyebrow"><ActivityIcon slug={activity.slug} /> Công cụ chọn ngày mới</p>
            <h1 id="activity-hero-title">{overrideTitle ?? activity.title}</h1>
            <p className="converterIntro yearIntroText">{overrideDescription ?? `${activity.description} Hệ thống chấm điểm 100 theo lịch âm, trực ngày, giờ hoàng đạo, ngày kỵ và tuổi xung hợp nếu có năm sinh.`}</p>
            <div className="activityHeroBadges">
              <span>Chấm điểm 100</span>
              <span>Lọc theo khoảng ngày</span>
              <span>Gợi ý giờ tốt</span>
              <span>Tuổi hợp/xung</span>
            </div>
          </div>
          <div className="heroScorePreview">
            <span>Gợi ý tốt nhất</span>
            <strong>{topResult.score}/100</strong>
            <small>{formatDisplayDate(topResult.day.solar)} · {topResult.label}</small>
          </div>
        </section>

        <section className="panelCard activityPlannerPanel" aria-labelledby="planner-title">
          <div>
            <p className="eyebrow">Bộ lọc thông minh</p>
            <h2 id="planner-title">Tìm ngày đẹp trong khoảng thời gian bạn muốn</h2>
            <p>Từ {formatDisplayDate(resolved.from)} đến {formatDisplayDate(resolved.to)}{resolved.birthYear ? ` · Năm sinh ${resolved.birthYear}` : ""}</p>
          </div>
          <ActivityPlannerForm selectedActivity={resolved.activitySlug} from={resolved.from} to={resolved.to} birthYear={resolved.birthYear} />
        </section>

        <ActivityResults results={results} />

        <section className="panelCard bestDateDetail" aria-labelledby="best-date-title">
          <p className="eyebrow">Phân tích ngày nổi bật</p>
          <h2 id="best-date-title">Vì sao nên cân nhắc ngày {formatDisplayDate(topResult.day.solar)}?</h2>
          <div className="bestDateGrid">
            <article>
              <h3>Điểm mạnh</h3>
              <ul>{topResult.reasons.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
            <article>
              <h3>Cần lưu ý</h3>
              {topResult.cautions.length > 0 ? <ul>{topResult.cautions.map((item) => <li key={item}>{item}</li>)}</ul> : <p>Không có cảnh báo lớn trong bộ tiêu chí hiện tại.</p>}
            </article>
            <article>
              <h3>Hướng xuất hành</h3>
              <ul>
                <li>Hỷ thần: <strong>{topResult.directions.hyThan}</strong></li>
                <li>Tài thần: <strong>{topResult.directions.taiThan}</strong></li>
                <li>Hắc thần nên tránh: <strong>{topResult.directions.hacThan}</strong></li>
              </ul>
            </article>
            <article>
              <h3>Sao tốt/xấu tham khảo</h3>
              <p><strong>Sao tốt:</strong> {topResult.stars.goodStars.join(", ")}</p>
              <p><strong>Sao xấu:</strong> {topResult.stars.badStars.join(", ")}</p>
            </article>
          </div>
          <div className="scoreBreakdown">
            {topResult.breakdown.map((item) => (
              <span className={item.tone} key={item.label}>{item.points > 0 ? "+" : ""}{item.points} · {item.label}</span>
            ))}
          </div>
          <p className="smallNote">{topResult.directions.note}</p>
          <div className="resultActions wideActions">
            <Link href={`/ngay-tot-xau/${topResult.day.solar.year}/${topResult.day.solar.month}/${topResult.day.solar.day}`}>Xem ngày tốt xấu chi tiết</Link>
            <Link href={`/gio-hoang-dao/${topResult.day.solar.year}/${topResult.day.solar.month}/${topResult.day.solar.day}`}>Xem giờ hoàng đạo</Link>
          </div>
        </section>

        <MonthCalendar calendar={monthCalendar} makeHref={makeCalendarHref} />

        <section className="panelCard activitySeoLinks" aria-labelledby="activity-links-title">
          <p className="eyebrow">Cụm trang SEO</p>
          <h2 id="activity-links-title">Xem ngày tốt theo từng việc</h2>
          <div className="activityChipCloud">
            {ACTIVITIES.map((item) => <Link href={activityHref(item.slug)} key={item.slug}><ActivityIcon slug={item.slug} /> {item.shortTitle}</Link>)}
          </div>
        </section>

        <article className="seoArticle">
          <h2>{activity.title} nên xem những yếu tố nào?</h2>
          <p>Khi chọn ngày cho việc {activity.shortTitle.toLowerCase()}, bạn nên kết hợp ngày hoàng đạo/hắc đạo, trực ngày, giờ hoàng đạo, tuổi xung hợp, ngày kỵ dân gian và điều kiện thực tế như sức khỏe, pháp lý, thời tiết, tài chính, lịch của người liên quan.</p>
          <h2>Điểm ngày trên Ngaygio.vn có ý nghĩa gì?</h2>
          <p>Điểm 100 là thang gợi ý để người dùng dễ so sánh giữa nhiều ngày. Điểm càng cao nghĩa là càng ít yếu tố xấu và càng có nhiều tín hiệu phù hợp với mục đích đã chọn. Thông tin chỉ nên dùng như tham khảo văn hóa dân gian, không thay thế tư vấn chuyên môn.</p>
          <h2>Gợi ý đang dùng tiêu chí nào?</h2>
          <p>Ngày đang được đánh giá theo {details.overallLabel.toLowerCase()}, Trực {details.twelveDirect.name}, giờ hoàng đạo, ngày kỵ, Bành Tổ bách kỵ, tuổi hợp/xung và một số nhóm sao tốt/xấu tham khảo.</p>
        </article>
      </main>
      <Footer />
    </>
  );
}
