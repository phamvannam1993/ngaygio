import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ActivityIcon, SiteIcon } from "@/components/Icon";
import { activityHref, dateToIso, getActivity, getActivityRecommendation, getCurrentMonthRange, searchGoodDates, type ActivityRecommendation, type ActivitySlug } from "@/lib/calendar/activity";
import { getGoodBadDetails } from "@/lib/calendar/good-bad";
import { getDayInfo } from "@/lib/calendar/service";
import { formatDateKey, formatDisplayDate, getVietnamTodayParts, parseDateKey, type DateParts } from "@/lib/date";

type SearchParams = Record<string, string | string[] | undefined>;

type ContractParams = {
  from: DateParts;
  to: DateParts;
  birthYear?: number;
  contractType: string;
};

const CONTRACT_ACTIVITY: ActivitySlug = "ky-hop-dong";

const contractTypes = [
  "Ký hợp đồng kinh doanh",
  "Ký hợp đồng mua bán",
  "Ký hợp đồng lao động",
  "Ký hồ sơ pháp lý",
  "Ký thỏa thuận hợp tác",
];

const relatedActivities: ActivitySlug[] = ["dat-coc", "mua-nha", "khai-truong", "nop-ho-so", "cau-tai", "mo-hang"];

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

function resolveContractParams(params: SearchParams): ContractParams {
  const today = getVietnamTodayParts();
  const defaultRange = getCurrentMonthRange(today);
  const from = parseDateKey(single(params.tu)) ?? defaultRange.from;
  const to = parseDateKey(single(params.den)) ?? defaultRange.to;
  const fixedRange = dateTime(from) <= dateTime(to) ? { from, to } : defaultRange;
  const requestedType = single(params.kieu);

  return {
    from: fixedRange.from,
    to: fixedRange.to,
    birthYear: validBirthYear(single(params.tuoi)),
    contractType: requestedType && contractTypes.includes(requestedType) ? requestedType : contractTypes[0],
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

function ContractFilterForm({ resolved }: { resolved: ContractParams }) {
  return (
    <form className="contractDateForm" action="/xem-ngay-tot-ky-hop-dong" method="get">
      <label>
        <span>Loại ký kết</span>
        <select name="kieu" defaultValue={resolved.contractType}>
          {contractTypes.map((item) => <option key={item} value={item}>{item}</option>)}
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
        <span>Năm sinh người đại diện</span>
        <input name="tuoi" type="number" min="1900" max="2050" inputMode="numeric" placeholder="Ví dụ: 1993" defaultValue={resolved.birthYear ?? ""} />
      </label>
      <button type="submit"><SiteIcon name="contract" /> Tìm ngày ký</button>
    </form>
  );
}

function ContractResultCard({ item, rank }: { item: ActivityRecommendation; rank: number }) {
  const details = getGoodBadDetails(item.day);
  const dateText = formatDisplayDate(item.day.solar);
  const iso = dateToIso(item.day.solar);

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
        <a href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`Ký hợp đồng ngày ${dateText}`)}&dates=${iso.replaceAll("-", "")}/${iso.replaceAll("-", "")}`} target="_blank" rel="noopener noreferrer">Thêm lịch</a>
      </div>
    </article>
  );
}

export function ContractGoodDateDesign({ params = {} }: { params?: SearchParams }) {
  const today = getVietnamTodayParts();
  const resolved = resolveContractParams(params);
  const activity = getActivity(CONTRACT_ACTIVITY);
  const results = searchGoodDates({
    activitySlug: CONTRACT_ACTIVITY,
    from: resolved.from,
    to: resolved.to,
    birthYear: resolved.birthYear,
    limit: 9,
  });
  const topResult = results[0] ?? getActivityRecommendation(getDayInfo(today), CONTRACT_ACTIVITY, resolved.birthYear);
  const topDetails = getGoodBadDetails(topResult.day);
  const topGoodHours = topResult.day.goodHours.slice(0, 6);
  const tone = scoreTone(topResult.score);

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
              <strong>Ký hợp đồng</strong>
            </nav>

            <section className="contractDateHero" aria-labelledby="contract-date-title">
              <div className="contractDateHeroText">
                <p className="ngdEyebrow">Ngày ký kết · Giao dịch · Hồ sơ</p>
                <h1 id="contract-date-title">Xem ngày tốt ký hợp đồng</h1>
                <p>Chọn ngày thuận để ký hợp đồng, chốt thỏa thuận, nộp hồ sơ hoặc hoàn tất giao dịch quan trọng. Kết quả ưu tiên ngày hợp việc ký kết, giờ hoàng đạo, hướng cầu tài và tuổi người đại diện nếu có năm sinh.</p>
                <div className="contractDateBadges">
                  <span><ActivityIcon slug="ky-hop-dong" /> Ký kết</span>
                  <span><SiteIcon name="shield" /> Tránh rủi ro</span>
                  <span><SiteIcon name="clock" /> Chọn giờ tốt</span>
                  <span><SiteIcon name="money" /> Cầu tài</span>
                </div>
              </div>

              <div className={["contractDateSeal", tone].join(" ")}>
                <span>Ngày đề xuất</span>
                <strong>{topResult.score}</strong>
                <b>/100 điểm</b>
                <em>{formatDisplayDate(topResult.day.solar)}</em>
                <small>{topResult.label} · {resolved.contractType}</small>
              </div>
            </section>

            <section className="contractDatePlanner" aria-labelledby="contract-filter-title">
              <div>
                <p className="ngdEyebrow">Bộ lọc nhanh</p>
                <h2 id="contract-filter-title">Tìm ngày đẹp để ký và chốt thỏa thuận</h2>
                <p>Đang xem từ <strong>{formatDisplayDate(resolved.from)}</strong> đến <strong>{formatDisplayDate(resolved.to)}</strong>{resolved.birthYear ? <> · người đại diện sinh năm <strong>{resolved.birthYear}</strong></> : ""}.</p>
              </div>
              <ContractFilterForm resolved={resolved} />
            </section>

            <div className="contractDateLayout">
              <div className="contractDateMain">
                <section className="contractDateInsightGrid" aria-label="Tóm tắt ngày ký hợp đồng">
                  <article className="contractDateInsightCard primary">
                    <SiteIcon name="contract" />
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
                    <span>Hướng cầu thuận lợi</span>
                    <strong>Tài thần {topResult.directions.taiThan}</strong>
                    <p>Hỷ thần {topResult.directions.hyThan}. Hắc thần nên tránh: {topResult.directions.hacThan}.</p>
                  </article>
                </section>

                <section className="contractDateResults" aria-labelledby="contract-results-title">
                  <div className="contractDateSectionHead">
                    <p className="ngdEyebrow">Kết quả gợi ý</p>
                    <h2 id="contract-results-title">Top ngày tốt để ký hợp đồng</h2>
                    <p>Danh sách được sắp theo điểm cao nhất, ưu tiên Trực Định, Thành, Khai, Thu; tránh các ngày kỵ và ngày xung/hại với tuổi nếu bạn đã nhập năm sinh.</p>
                  </div>
                  {results.length > 0 ? (
                    <div className="contractDateResultGrid">
                      {results.map((item, index) => <ContractResultCard item={item} rank={index + 1} key={`${item.day.solar.year}-${item.day.solar.month}-${item.day.solar.day}`} />)}
                    </div>
                  ) : (
                    <div className="contractDateEmpty">
                      <h3>Chưa tìm thấy ngày thật sự phù hợp</h3>
                      <p>Khoảng ngày đang chọn có thể quá ngắn. Hãy mở rộng thêm vài tuần hoặc bỏ năm sinh để xem kết quả rộng hơn.</p>
                    </div>
                  )}
                </section>

                <section className="contractDatePanel" aria-labelledby="contract-best-title">
                  <div className="contractDateSectionHead compact">
                    <p className="ngdEyebrow">Luận giải ngày nổi bật</p>
                    <h2 id="contract-best-title">Vì sao ngày {formatDisplayDate(topResult.day.solar)} đáng cân nhắc?</h2>
                  </div>
                  <div className="contractDateReasonGrid">
                    <article>
                      <h3>Điểm thuận cho ký kết</h3>
                      <ul>{topResult.reasons.map((item) => <li key={item}>{item}</li>)}</ul>
                    </article>
                    <article>
                      <h3>Cần kiểm tra trước khi ký</h3>
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

                <section className="contractDatePanel" aria-labelledby="contract-checklist-title">
                  <div className="contractDateSectionHead compact">
                    <p className="ngdEyebrow">Checklist thực tế</p>
                    <h2 id="contract-checklist-title">4 việc nên chuẩn bị trước giờ ký</h2>
                  </div>
                  <div className="contractDateChecklistGrid">
                    <article><span>1</span><h3>Soát điều khoản chính</h3><p>Kiểm tra đối tượng hợp đồng, giá trị, thời hạn, điều kiện thanh toán, phạt vi phạm và điều khoản chấm dứt.</p></article>
                    <article><span>2</span><h3>Xác minh người ký</h3><p>Đảm bảo người ký có thẩm quyền, giấy ủy quyền hoặc tư cách đại diện hợp lệ.</p></article>
                    <article><span>3</span><h3>Chọn giờ hoàng đạo</h3><p>Sau khi chọn ngày, ưu tiên khung giờ tốt và lịch trình thuận tiện cho các bên.</p></article>
                    <article><span>4</span><h3>Lưu hồ sơ đầy đủ</h3><p>Chuẩn bị bản mềm, bản cứng, phụ lục, biên bản bàn giao và chứng từ thanh toán nếu có.</p></article>
                  </div>
                </section>

                <article className="contractDateArticle">
                  <h2>Xem ngày tốt ký hợp đồng nên dựa vào yếu tố nào?</h2>
                  <p>Với việc ký hợp đồng, nên ưu tiên ngày có tính ổn định và thành tựu như Trực Định, Thành, Khai hoặc Thu. Ngoài ngày tốt xấu tổng quan, bạn nên xem thêm giờ hoàng đạo, tuổi người đại diện ký, hướng cầu tài và các cảnh báo dân gian như Tam nương, Nguyệt kỵ hoặc Dương Công kỵ nhật.</p>
                  <h2>Ngày điểm cao có thay thế việc kiểm tra pháp lý không?</h2>
                  <p>Không. Điểm ngày chỉ là gợi ý tham khảo theo văn hóa lịch pháp. Hợp đồng vẫn cần được kiểm tra bằng điều kiện thực tế: pháp lý, thẩm quyền ký, nghĩa vụ thanh toán, quyền lợi, trách nhiệm và phương án xử lý tranh chấp.</p>
                  <h2>Nên chọn ngày theo tuổi ai?</h2>
                  <p>Nếu ký hợp đồng cho doanh nghiệp, có thể nhập năm sinh của người đại diện ký chính hoặc người chịu trách nhiệm cao nhất cho giao dịch. Nếu là hợp đồng cá nhân, nhập năm sinh của chính người ký.</p>
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
                  <p className="ngdEyebrow">Hợp với ký kết</p>
                  <h2>Ưu tiên các trực</h2>
                  <div className="contractDateDirectList">
                    {activity.goodDirects.map((direct) => <span key={direct}>Trực {direct}</span>)}
                  </div>
                  <p>Những trực này thường hợp với thỏa thuận, giấy tờ, giao dịch, nhận việc hoặc việc cần sự ổn định lâu dài.</p>
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
