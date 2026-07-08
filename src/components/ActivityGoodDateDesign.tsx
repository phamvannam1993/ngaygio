import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ActivityIcon, SiteIcon } from "@/components/Icon";
import { ACTIVITIES, activityHref, dateToIso, getActivity, getActivityRecommendation, getCurrentMonthRange, searchGoodDates, type ActivityRecommendation, type ActivitySlug } from "@/lib/calendar/activity";
import { getGoodBadDetails } from "@/lib/calendar/good-bad";
import { getDayInfo } from "@/lib/calendar/service";
import { formatDateKey, formatDisplayDate, getVietnamTodayParts, parseDateKey, type DateParts } from "@/lib/date";

type SearchParams = Record<string, string | string[] | undefined>;

type ActivityDateParams = {
  from: DateParts;
  to: DateParts;
  birthYear?: number;
  variant: string;
};

const variantByActivity: Partial<Record<ActivitySlug, string[]>> = {
  "cuoi-hoi": ["Lễ cưới", "Ăn hỏi", "Dạm ngõ", "Đăng ký kết hôn", "Gặp mặt hai họ"],
  "khai-truong": ["Khai trương cửa hàng", "Ra mắt công ty", "Mở văn phòng", "Mở bán sản phẩm", "Khai trương online"],
  "mo-hang": ["Mở hàng đầu tháng", "Mở bán sản phẩm", "Nhận đơn đầu tiên", "Khai lộc đầu năm", "Chốt khách đầu ngày"],
  "dong-tho": ["Động thổ xây nhà", "Khởi công công trình", "Sửa chữa lớn", "Đào móng", "Cất nóc"],
  "nhap-trach": ["Nhập trạch nhà mới", "Chuyển đồ chính", "An vị bàn thờ", "Về nhà mới", "Khai bếp"],
  "mua-xe": ["Mua xe mới", "Nhận xe", "Đăng ký xe", "Lăn bánh đầu tiên", "Ký giấy mua xe"],
  "cung-xe-moi": ["Cúng xe mới", "Nhận xe", "Xuất hành chuyến đầu", "Cầu bình an", "Làm lễ tại nhà"],
  "dat-coc": ["Đặt cọc mua nhà", "Đặt cọc mua đất", "Đặt cọc mua xe", "Chốt giao dịch", "Ký biên nhận"],
  "mua-nha": ["Mua nhà", "Mua đất", "Ký giấy tờ", "Nhận bàn giao", "Xem nhà chốt mua"],
  "xuat-hanh": ["Xuất hành đầu ngày", "Đi gặp khách", "Đi lễ", "Đi công tác", "Đi xa"],
  "di-xa": ["Đi công tác", "Đi du lịch", "Đi thi", "Đi chữa bệnh", "Đi xa nhiều ngày"],
  "cat-toc": ["Cắt tóc", "Làm tóc", "Cắt tóc cho bé", "Thay đổi diện mạo", "Tỉa tóc nhẹ"],
  "chuyen-nha": ["Chuyển nhà", "Chuyển phòng", "Chuyển văn phòng", "Chuyển đồ chính", "Dọn sang nơi mới"],
  "dat-ban-tho": ["Đặt bàn thờ", "An vị bát hương", "Chuyển bàn thờ", "Lau dọn ban thờ", "Cúng nhập trạch"],
  "nhap-hang": ["Nhập hàng mới", "Ký đơn hàng", "Mở kho", "Nhận lô hàng", "Chốt nguồn hàng"],
  "mua-vang": ["Mua vàng tích lũy", "Mua vàng cầu may", "Mua trang sức", "Mua nhẫn cưới", "Mua tài sản"],
  "nop-ho-so": ["Nộp hồ sơ", "Nộp giấy tờ pháp lý", "Nộp hồ sơ xin việc", "Nộp hồ sơ vay", "Nộp hồ sơ đấu thầu"],
  "phong-van": ["Phỏng vấn xin việc", "Gặp nhà tuyển dụng", "Thi tuyển", "Đàm phán lương", "Nhận việc"],
  "khai-but": ["Khai bút", "Bắt đầu học", "Viết kế hoạch", "Nộp bài", "Thi cử"],
  "cau-tai": ["Cầu tài", "Mở ví", "Gặp khách hàng", "Chốt đơn", "Xin lộc đầu tháng"],
};

const relatedByActivity: Partial<Record<ActivitySlug, ActivitySlug[]>> = {
  "cuoi-hoi": ["mua-vang", "dat-coc", "mua-nha", "nhap-trach", "xuat-hanh", "cau-tai"],
  "khai-truong": ["mo-hang", "cau-tai", "ky-hop-dong", "nhap-hang", "xuat-hanh", "nop-ho-so"],
  "mo-hang": ["khai-truong", "cau-tai", "nhap-hang", "ky-hop-dong", "mua-vang", "xuat-hanh"],
  "dong-tho": ["nhap-trach", "mua-nha", "dat-ban-tho", "chuyen-nha", "dat-coc", "ky-hop-dong"],
  "nhap-trach": ["mua-nha", "chuyen-nha", "dat-ban-tho", "dong-tho", "cau-tai", "xuat-hanh"],
  "mua-xe": ["cung-xe-moi", "xuat-hanh", "ky-hop-dong", "dat-coc", "cau-tai", "di-xa"],
  "cung-xe-moi": ["mua-xe", "xuat-hanh", "di-xa", "cau-tai", "dat-coc", "ky-hop-dong"],
  "dat-coc": ["ky-hop-dong", "mua-nha", "mua-xe", "cau-tai", "khai-truong", "nop-ho-so"],
  "mua-nha": ["dat-coc", "ky-hop-dong", "nhap-trach", "chuyen-nha", "dong-tho", "dat-ban-tho"],
  "xuat-hanh": ["di-xa", "cau-tai", "mua-xe", "cung-xe-moi", "phong-van", "khai-truong"],
  "di-xa": ["xuat-hanh", "cung-xe-moi", "mua-xe", "phong-van", "cau-tai", "nop-ho-so"],
  "cat-toc": ["khai-but", "phong-van", "cau-tai", "xuat-hanh", "mua-vang", "mo-hang"],
  "chuyen-nha": ["nhap-trach", "mua-nha", "dat-ban-tho", "dong-tho", "xuat-hanh", "cau-tai"],
  "dat-ban-tho": ["nhap-trach", "chuyen-nha", "dong-tho", "mua-nha", "cau-tai", "xuat-hanh"],
  "nhap-hang": ["mo-hang", "khai-truong", "cau-tai", "ky-hop-dong", "xuat-hanh", "dat-coc"],
  "mua-vang": ["cau-tai", "cuoi-hoi", "dat-coc", "mua-nha", "mo-hang", "xuat-hanh"],
  "nop-ho-so": ["ky-hop-dong", "phong-van", "cau-tai", "xuat-hanh", "dat-coc", "khai-truong"],
  "phong-van": ["nop-ho-so", "xuat-hanh", "cau-tai", "khai-but", "cat-toc", "di-xa"],
  "khai-but": ["phong-van", "nop-ho-so", "cat-toc", "cau-tai", "xuat-hanh", "mo-hang"],
  "cau-tai": ["mo-hang", "khai-truong", "mua-vang", "ky-hop-dong", "xuat-hanh", "nhap-hang"],
};

const heroEyebrowByActivity: Partial<Record<ActivitySlug, string>> = {
  "cuoi-hoi": "Ngày cưới hỏi · Ăn hỏi · Hai họ",
  "khai-truong": "Khai trương · Mở cửa · Khởi sự",
  "mo-hang": "Mở hàng · Cầu tài · Doanh số",
  "dong-tho": "Động thổ · Khởi công · Xây dựng",
  "nhap-trach": "Nhập trạch · Về nhà mới · An cư",
  "mua-xe": "Mua xe · Nhận xe · Lăn bánh",
  "cung-xe-moi": "Cúng xe · Nhận xe · Bình an",
  "dat-coc": "Đặt cọc · Chốt giao dịch · Giữ tài sản",
  "mua-nha": "Mua nhà đất · Ký giấy tờ · Bàn giao",
  "xuat-hanh": "Xuất hành · Đi xa · Cầu thuận lợi",
  "di-xa": "Đi xa · Công tác · Lộ trình",
  "cat-toc": "Cắt tóc · Làm mới · Khởi sắc",
  "chuyen-nha": "Chuyển nhà · Chuyển đồ · Ổn định",
  "dat-ban-tho": "Bàn thờ · An vị · Cầu an",
  "nhap-hang": "Nhập hàng · Mở kho · Nguồn hàng",
  "mua-vang": "Mua vàng · Tích lũy · Cầu tài",
  "nop-ho-so": "Nộp hồ sơ · Giấy tờ · Công việc",
  "phong-van": "Phỏng vấn · Việc làm · Gặp gỡ",
  "khai-but": "Khai bút · Học tập · Khởi đầu",
  "cau-tai": "Cầu tài · Gặp khách · Mở lộc",
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

function getVariants(slug: ActivitySlug) {
  const activity = getActivity(slug);
  return variantByActivity[slug] ?? [activity.shortTitle, ...activity.goodForWords].slice(0, 5);
}

// Nếu URL sạch truyền tháng+năm (vd /ngay-tot-khai-truong-thang-8-2026) → lấy trọn tháng đó làm khoảng ngày.
function monthRangeFromParams(params: SearchParams): { from: DateParts; to: DateParts } | null {
  const month = Number(single(params.thang));
  const year = Number(single(params.nam));
  if (!Number.isInteger(month) || month < 1 || month > 12) return null;
  if (!Number.isInteger(year) || year < 1900 || year > 2050) return null;
  const lastDay = new Date(year, month, 0).getDate();
  return { from: { year, month, day: 1 }, to: { year, month, day: lastDay } };
}

function resolveActivityDateParams(params: SearchParams, activitySlug: ActivitySlug): ActivityDateParams {
  const today = getVietnamTodayParts();
  const monthRange = monthRangeFromParams(params);
  const defaultRange = monthRange ?? getCurrentMonthRange(today);
  const from = parseDateKey(single(params.tu)) ?? defaultRange.from;
  const to = parseDateKey(single(params.den)) ?? defaultRange.to;
  const fixedRange = dateTime(from) <= dateTime(to) ? { from, to } : defaultRange;
  const variants = getVariants(activitySlug);
  const requestedVariant = single(params.kieu);

  return {
    from: fixedRange.from,
    to: fixedRange.to,
    birthYear: validBirthYear(single(params.tuoi)),
    variant: requestedVariant && variants.includes(requestedVariant) ? requestedVariant : variants[0],
  };
}

function levelText(level: ActivityRecommendation["level"]) {
  if (level === "excellent") return "Rất thuận";
  if (level === "good") return "Nên cân nhắc";
  if (level === "ok") return "Cần kiểm tra thêm";
  return "Nên tránh";
}

function levelClass(level: ActivityRecommendation["level"]) {
  if (level === "excellent") return "excellent";
  if (level === "good") return "good";
  if (level === "ok") return "ok";
  return "avoid";
}

function scoreTone(score: number) {
  if (score >= 82) return "excellent";
  if (score >= 68) return "good";
  if (score >= 50) return "ok";
  return "avoid";
}

function ActivityDateFilterForm({ activitySlug, formAction, resolved }: { activitySlug: ActivitySlug; formAction: string; resolved: ActivityDateParams }) {
  const activity = getActivity(activitySlug);
  const variants = getVariants(activitySlug);

  return (
    <form className="contractDateForm" action={formAction} method="get">
      <label>
        <span>Việc cần xem</span>
        <select name="kieu" defaultValue={resolved.variant}>
          {variants.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </label>
      <label>
        <span>Từ ngày</span>
        <input name="tu" type="date" defaultValue={formatDateKey(resolved.from)} />
      </label>
      <label>
        <span>Đến ngày</span>
        <input name="den" type="date" defaultValue={formatDateKey(resolved.to)} />
      </label>
      <label>
        <span>Năm sinh người chủ việc</span>
        <input name="tuoi" type="number" min="1900" max="2050" inputMode="numeric" placeholder="Ví dụ: 1993" defaultValue={resolved.birthYear ?? ""} />
      </label>
      <button type="submit">Tìm ngày tốt</button>
    </form>
  );
}

function ActivityDateResultCard({ item, rank }: { item: ActivityRecommendation; rank: number }) {
  const details = getGoodBadDetails(item.day);
  const dateText = formatDisplayDate(item.day.solar);
  const iso = dateToIso(item.day.solar).replaceAll("-", "");

  return (
    <article className={["contractDateResultCard", levelClass(item.level)].join(" ")}>
      <div className="contractDateResultTop">
        <span>#{rank}</span>
        <div className="contractDateMiniScore">
          <strong>{item.score}</strong>
          <small>/100</small>
        </div>
      </div>
      <h3>{dateText}</h3>
      <p>{item.day.weekdayName} · Âm lịch {item.day.lunar.day}/{item.day.lunar.month}/{item.day.lunar.year} · Ngày {item.day.canChi.day}</p>
      <strong className="contractDateLevel">{levelText(item.level)}</strong>
      <div className="contractDateCardFacts">
        <span>Trực {details.twelveDirect.name}</span>
        <span>{item.day.goodHours.length} giờ hoàng đạo</span>
        <span>Tài thần {item.directions.taiThan}</span>
      </div>
      <p className="contractDateSummary">{item.summary}</p>
      {item.ageNote ? <p className="contractDateAgeNote">{item.ageNote}</p> : null}
      <div className="contractDateResultActions">
        <Link href={`/ngay-tot-xau/${item.day.solar.year}/${item.day.solar.month}/${item.day.solar.day}`}>Xem ngày</Link>
        <a href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`${item.activity.shortTitle} ngày ${dateText}`)}&dates=${iso}/${iso}`} target="_blank" rel="noopener noreferrer">Thêm lịch</a>
      </div>
    </article>
  );
}

function getChecklist(activitySlug: ActivitySlug, shortTitle: string) {
  if (activitySlug === "cuoi-hoi") {
    return [
      ["Chốt lịch hai họ", "Thống nhất ngày, giờ, địa điểm, người đại diện và các mốc chuẩn bị quan trọng."],
      ["Xem tuổi cô dâu chú rể", "Nếu làm lễ lớn, nên xét thêm tuổi hai bên và tuổi người đứng lễ trong gia đình."],
      ["Chọn giờ hoàng đạo", "Sau khi chọn ngày, ưu tiên khung giờ tốt để làm lễ, đón dâu, nhập tiệc hoặc đăng ký."],
      ["Giữ tinh thần hòa hợp", "Ngày đẹp chỉ là tham khảo; sự chu đáo, bình an và đồng thuận của hai gia đình vẫn là nền tảng chính."],
    ];
  }

  return [
    ["Xác định việc chính", `Làm rõ mục đích ${shortTitle.toLowerCase()} để chọn ngày theo đúng tiêu chí, tránh xem quá chung chung.`],
    ["Nhập năm sinh nếu cần", "Với việc lớn, nên nhập năm sinh người chủ việc để lọc thêm tuổi xung, tuổi hợp."],
    ["Chọn giờ hoàng đạo", "Ngày tốt nên đi cùng giờ tốt, lịch trình thuận tiện và tâm thế chủ động."],
    ["Kiểm tra điều kiện thực tế", "Cân nhắc pháp lý, tài chính, sức khỏe, thời tiết, lịch gia đình và những người liên quan."],
  ];
}

export function ActivityGoodDateDesign({ activitySlug, path, params = {}, formAction }: { activitySlug: ActivitySlug; path: string; params?: SearchParams; formAction?: string }) {
  const today = getVietnamTodayParts();
  const activity = getActivity(activitySlug);
  const resolved = resolveActivityDateParams(params, activity.slug);
  const results = searchGoodDates({
    activitySlug: activity.slug,
    from: resolved.from,
    to: resolved.to,
    birthYear: resolved.birthYear,
    limit: 9,
  });
  const topResult = results[0] ?? getActivityRecommendation(getDayInfo(today), activity.slug, resolved.birthYear);
  const topDetails = getGoodBadDetails(topResult.day);
  const topGoodHours = topResult.day.goodHours.slice(0, 6);
  const tone = scoreTone(topResult.score);
  const relatedActivities = relatedByActivity[activity.slug] ?? ACTIVITIES.map((item) => item.slug).filter((slug) => slug !== activity.slug).slice(0, 6);
  const checklist = getChecklist(activity.slug, activity.shortTitle);

  return (
    <>
      <Header currentYear={today.year} />
      <div className="dayGoodBadShell contractDateShell">
        <main className="contractDatePage">
          <div className="pageFullscreenBg contractDateFullscreenBg" style={{ backgroundImage: "linear-gradient(90deg, rgba(255,255,255,.95) 0%, rgba(255,255,255,.84) 44%, rgba(255,248,236,.62) 100%), linear-gradient(180deg, rgba(255,248,236,.08) 0%, rgba(255,248,236,.90) 100%), url(/bg-page-goodbad.png)" }} aria-hidden="true" />

          <div className="container contractDateContainer">
            <nav className="ngdBreadcrumb" aria-label="Đường dẫn">
              <Link href="/">Trang chủ</Link>
              <span>›</span>
              <Link href="/xem-ngay-tot">Xem ngày tốt</Link>
              <span>›</span>
              <strong>{activity.shortTitle}</strong>
            </nav>

            <section className="contractDateHero" aria-labelledby="activity-date-title">
              <div className="contractDateHeroText">
                <p className="ngdEyebrow">{heroEyebrowByActivity[activity.slug] ?? "Chọn ngày · Giờ tốt · Hợp tuổi"}</p>
                <h1 id="activity-date-title">{activity.title}</h1>
                <p>{activity.description} Kết quả ưu tiên ngày hợp việc {activity.shortTitle.toLowerCase()}, giờ hoàng đạo, hướng xuất hành và tuổi người chủ việc nếu có năm sinh.</p>
                <div className="contractDateBadges">
                  <span><ActivityIcon slug={activity.slug} /> {activity.shortTitle}</span>
                  <span><SiteIcon name="goodBad" /> Chấm điểm 100</span>
                  <span><SiteIcon name="clock" /> Chọn giờ tốt</span>
                  <span><SiteIcon name="age" /> Có xét tuổi</span>
                </div>
              </div>

              <div className={["contractDateSeal", tone].join(" ")}>
                <span>Ngày đề xuất</span>
                <strong>{topResult.score}</strong>
                <b>/100 điểm</b>
                <em>{formatDisplayDate(topResult.day.solar)}</em>
                <small>{topResult.label} · {resolved.variant}</small>
              </div>
            </section>

            <section className="contractDatePlanner" aria-labelledby="activity-filter-title">
              <div>
                <p className="ngdEyebrow">Bộ lọc nhanh</p>
                <h2 id="activity-filter-title">Tìm ngày đẹp cho {activity.shortTitle.toLowerCase()}</h2>
                <p>Đang xem từ <strong>{formatDisplayDate(resolved.from)}</strong> đến <strong>{formatDisplayDate(resolved.to)}</strong>{resolved.birthYear ? <> · người chủ việc sinh năm <strong>{resolved.birthYear}</strong></> : ""}.</p>
              </div>
              <ActivityDateFilterForm activitySlug={activity.slug} formAction={formAction ?? path} resolved={resolved} />
            </section>

            <div className="contractDateLayout">
              <div className="contractDateMain">
                <section className="contractDateInsightGrid" aria-label={`Tóm tắt ngày tốt ${activity.shortTitle.toLowerCase()}`}>
                  <article className="contractDateInsightCard primary">
                    <ActivityIcon slug={activity.slug} />
                    <span>Ngày nên ưu tiên</span>
                    <strong>{formatDisplayDate(topResult.day.solar)}</strong>
                    <p>{topResult.summary}</p>
                    <div className="contractDateQuickActions">
                      <Link href={`/ngay-tot-xau/${topResult.day.solar.year}/${topResult.day.solar.month}/${topResult.day.solar.day}`}>Xem luận ngày</Link>
                      <Link href={`/gio-hoang-dao/${topResult.day.solar.year}/${topResult.day.solar.month}/${topResult.day.solar.day}`}>Xem giờ tốt</Link>
                    </div>
                  </article>
                  <article className="contractDateInsightCard">
                    <SiteIcon name="clock" />
                    <span>Khung giờ nên cân nhắc</span>
                    <strong>{topGoodHours.length} giờ hoàng đạo</strong>
                    <p>{topGoodHours.map((hour) => `${hour.branch} ${hour.range}`).join(", ")}</p>
                  </article>
                  <article className="contractDateInsightCard">
                    <SiteIcon name="compass" />
                    <span>Hướng xuất hành</span>
                    <strong>Tài thần {topResult.directions.taiThan}</strong>
                    <p>Hỷ thần {topResult.directions.hyThan}. Hắc thần nên tránh: {topResult.directions.hacThan}.</p>
                  </article>
                </section>

                <section className="contractDateResults" aria-labelledby="activity-results-title">
                  <div className="contractDateSectionHead">
                    <p className="ngdEyebrow">Kết quả gợi ý</p>
                    <h2 id="activity-results-title">Top ngày tốt cho {activity.shortTitle.toLowerCase()}</h2>
                    <p>Danh sách được sắp theo điểm cao nhất, ưu tiên các trực hợp việc {activity.shortTitle.toLowerCase()}, tránh ngày kỵ và ngày xung/hại với tuổi nếu bạn đã nhập năm sinh.</p>
                  </div>
                  {results.length > 0 ? (
                    <div className="contractDateResultGrid">
                      {results.map((item, index) => <ActivityDateResultCard item={item} rank={index + 1} key={`${item.day.solar.year}-${item.day.solar.month}-${item.day.solar.day}`} />)}
                    </div>
                  ) : (
                    <div className="contractDateEmpty">
                      <h3>Chưa tìm thấy ngày thật sự phù hợp</h3>
                      <p>Khoảng ngày đang chọn có thể quá ngắn. Hãy mở rộng thêm vài tuần hoặc bỏ năm sinh để xem kết quả rộng hơn.</p>
                    </div>
                  )}
                </section>

                <section className="contractDatePanel" aria-labelledby="activity-best-title">
                  <div className="contractDateSectionHead compact">
                    <p className="ngdEyebrow">Luận giải ngày nổi bật</p>
                    <h2 id="activity-best-title">Vì sao ngày {formatDisplayDate(topResult.day.solar)} đáng cân nhắc?</h2>
                  </div>
                  <div className="contractDateReasonGrid">
                    <article>
                      <h3>Điểm thuận cho {activity.shortTitle.toLowerCase()}</h3>
                      <ul>{topResult.reasons.map((item) => <li key={item}>{item}</li>)}</ul>
                    </article>
                    <article>
                      <h3>Cần lưu ý</h3>
                      {topResult.cautions.length > 0 ? <ul>{topResult.cautions.map((item) => <li key={item}>{item}</li>)}</ul> : <p>Không có cảnh báo lớn trong bộ tiêu chí hiện tại.</p>}
                    </article>
                    <article>
                      <h3>Sao tốt/xấu tham khảo</h3>
                      <p><strong>Sao tốt:</strong> {topResult.stars.goodStars.join(", ")}</p>
                      <p><strong>Sao xấu:</strong> {topResult.stars.badStars.join(", ")}</p>
                    </article>
                    <article>
                      <h3>Tuổi hợp/kỵ trong ngày</h3>
                      <p><strong>Lục hợp:</strong> {topDetails.ageCompatibility.lucHop}</p>
                      <p><strong>Tam hợp:</strong> {topDetails.ageCompatibility.tamHop.join(" · ")}</p>
                      <p><strong>Tuổi xung:</strong> {topDetails.ageCompatibility.xung.join(" · ")}</p>
                    </article>
                  </div>
                  <div className="contractDateBreakdown">
                    {topResult.breakdown.map((item) => (
                      <span className={item.tone} key={item.label}>{item.points > 0 ? "+" : ""}{item.points} · {item.label}</span>
                    ))}
                  </div>
                  <p className="contractDateNote">{topResult.directions.note}</p>
                </section>

                <section className="contractDatePanel" aria-labelledby="activity-checklist-title">
                  <div className="contractDateSectionHead compact">
                    <p className="ngdEyebrow">Checklist thực tế</p>
                    <h2 id="activity-checklist-title">4 việc nên chuẩn bị trước khi chọn ngày</h2>
                  </div>
                  <div className="contractDateChecklistGrid">
                    {checklist.map(([title, text], index) => <article key={title}><span>{index + 1}</span><h3>{title}</h3><p>{text}</p></article>)}
                  </div>
                </section>

                <article className="contractDateArticle">
                  <h2>{activity.title} nên dựa vào yếu tố nào?</h2>
                  <p>Khi chọn ngày cho việc {activity.shortTitle.toLowerCase()}, bạn nên kết hợp ngày hoàng đạo/hắc đạo, trực ngày, giờ hoàng đạo, tuổi xung hợp, ngày kỵ dân gian và điều kiện thực tế như sức khỏe, pháp lý, thời tiết, tài chính, lịch của người liên quan.</p>
                  <h2>Điểm ngày trên Ngaygio.vn có ý nghĩa gì?</h2>
                  <p>Điểm 100 là thang gợi ý để người dùng dễ so sánh giữa nhiều ngày. Điểm càng cao nghĩa là càng ít yếu tố xấu và càng có nhiều tín hiệu phù hợp với mục đích đã chọn. Thông tin chỉ nên dùng như tham khảo văn hóa dân gian, không thay thế tư vấn chuyên môn.</p>
                  <h2>Nên chọn ngày theo tuổi ai?</h2>
                  <p>Với việc gia đình, nên xem tuổi người chủ việc hoặc người trực tiếp đứng lễ. Với việc kinh doanh, có thể nhập năm sinh người đại diện chính. Nếu chưa chắc, hãy dùng kết quả không nhập tuổi rồi kiểm tra thêm giờ tốt và điều kiện thực tế.</p>
                </article>
              </div>

              <aside className="contractDateSidebar" aria-label="Công cụ liên quan">
                <section className="contractDateSideCard">
                  <p className="ngdEyebrow">Ngày đang ưu tiên</p>
                  <h2>{formatDisplayDate(topResult.day.solar)}</h2>
                  <div className="contractDateSideFacts">
                    <span>Ngày {topResult.day.canChi.day}</span>
                    <span>Trực {topDetails.twelveDirect.name}</span>
                    <span>{topResult.day.quality.label}</span>
                    <span>{topResult.day.goodHours.length} giờ tốt</span>
                  </div>
                  <Link href={`/gio-hoang-dao/${topResult.day.solar.year}/${topResult.day.solar.month}/${topResult.day.solar.day}`}>Xem giờ hoàng đạo ngày này</Link>
                </section>

                <section className="contractDateSideCard">
                  <p className="ngdEyebrow">Hợp với {activity.shortTitle.toLowerCase()}</p>
                  <h2>Ưu tiên các trực</h2>
                  <div className="contractDateDirectList">
                    {activity.goodDirects.map((direct) => <span key={direct}>Trực {direct}</span>)}
                  </div>
                  <p>Những trực này thường được ưu tiên cho nhóm việc {activity.goodForWords.join(", ").toLowerCase()}.</p>
                </section>

                <section className="contractDateSideCard">
                  <p className="ngdEyebrow">Nên tránh</p>
                  <h2>Ngày kỵ cần lưu ý</h2>
                  <div className="contractDateDirectList">
                    {activity.avoidWarnings.map((warning) => <span key={warning}>{warning}</span>)}
                  </div>
                  <p>Với việc quan trọng, nên kiểm tra thêm tuổi, giờ tiến hành và điều kiện thực tế trước khi quyết định.</p>
                </section>

                <section className="contractDateSideCard">
                  <p className="ngdEyebrow">Xem thêm</p>
                  <h2>Công cụ liên quan</h2>
                  <div className="contractDateRelatedLinks">
                    {relatedActivities.map((slug) => {
                      const item = getActivity(slug);
                      return <Link href={activityHref(slug)} key={slug}><ActivityIcon slug={slug} /> {item.shortTitle}</Link>;
                    })}
                  </div>
                </section>
              </aside>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
