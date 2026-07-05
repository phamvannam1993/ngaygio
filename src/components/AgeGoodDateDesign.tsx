import Link from "next/link";
import { ActivityResultCard } from "@/components/ActivityResults";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ActivityIcon, SiteIcon, ZodiacIcon } from "@/components/Icon";
import { ACTIVITIES, getActivity, getActivityRecommendation, searchGoodDates, type ActivitySlug } from "@/lib/calendar/activity";
import { getYearCanChi } from "@/lib/calendar/can-chi";
import { getGoodBadDetails } from "@/lib/calendar/good-bad";
import { getDayInfo } from "@/lib/calendar/service";
import { ZODIAC_BY_CHI } from "@/lib/calendar/zodiac";
import { faqSchema, siteConfig, webPageSchema } from "@/lib/site";
import { formatDateKey, formatDisplayDate, getVietnamTodayParts, type DateParts } from "@/lib/date";

type ResolvedAgeGoodDateParams = {
  activitySlug: ActivitySlug;
  from: DateParts;
  to: DateParts;
  birthYear?: number;
};

type AgeGoodDateDesignProps = {
  resolved: ResolvedAgeGoodDateParams;
};

const popularActivities: ActivitySlug[] = [
  "khai-truong",
  "cuoi-hoi",
  "dong-tho",
  "nhap-trach",
  "mua-xe",
  "ky-hop-dong",
  "xuat-hanh",
  "mua-nha",
];

function scoreLabel(score: number) {
  if (score >= 82) return "Rất tốt";
  if (score >= 68) return "Tốt";
  if (score >= 50) return "Cân nhắc";
  return "Nên tránh";
}

function scoreTone(score: number) {
  if (score >= 68) return "good";
  if (score >= 50) return "neutral";
  return "bad";
}

function makeAgeGoodDateHref(slug: ActivitySlug, resolved: ResolvedAgeGoodDateParams) {
  const params = new URLSearchParams({
    viec: slug,
    tu: formatDateKey(resolved.from),
    den: formatDateKey(resolved.to),
  });
  if (resolved.birthYear) params.set("tuoi", String(resolved.birthYear));
  return `/xem-ngay-tot-theo-tuoi?${params.toString()}`;
}

function AgeGoodDateForm({ resolved }: { resolved: ResolvedAgeGoodDateParams }) {
  return (
    <form className="ageGoodDateForm" action="/xem-ngay-tot-theo-tuoi" method="get">
      <label className="ageGoodDateMainField">
        <span>Năm sinh của bạn</span>
        <input name="tuoi" type="number" min="1900" max="2050" inputMode="numeric" placeholder="Ví dụ: 1993" defaultValue={resolved.birthYear ?? ""} />
      </label>
      <label>
        <span>Việc cần xem</span>
        <select name="viec" defaultValue={resolved.activitySlug}>
          {ACTIVITIES.map((activity) => (
            <option key={activity.slug} value={activity.slug}>{activity.shortTitle}</option>
          ))}
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
      <button type="submit"><SiteIcon name="calendar" /> Lọc ngày hợp tuổi</button>
    </form>
  );
}

export function AgeGoodDateDesign({ resolved }: AgeGoodDateDesignProps) {
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
  const topDetails = getGoodBadDetails(topResult.day);
  const identity = resolved.birthYear ? getYearCanChi(resolved.birthYear) : null;
  const zodiac = identity ? ZODIAC_BY_CHI[identity.chi] : null;
  const lunarAge = resolved.birthYear ? today.year - resolved.birthYear + 1 : null;
  const topGoodHours = topResult.day.goodHours.slice(0, 6);
  const tone = scoreTone(topResult.score);

  const jsonLd = [
    webPageSchema({
      name: "Xem ngày tốt theo tuổi",
      url: `${siteConfig.url}/xem-ngay-tot-theo-tuoi`,
      description: "Nhập năm sinh để lọc ngày tốt hợp tuổi, xem điểm ngày, giờ hoàng đạo, hướng xuất hành và lý do nên chọn hoặc nên tránh.",
      breadcrumb: [{ name: "Xem ngày tốt", url: `${siteConfig.url}/xem-ngay-tot` }],
    }),
    faqSchema([
      { q: "Xem ngày tốt theo tuổi cần nhập gì?", a: "Bạn nên nhập năm sinh, việc cần làm và khoảng ngày muốn tìm. Hệ thống sẽ xét thêm tuổi xung/hợp với chi ngày bên cạnh các yếu tố lịch âm, trực ngày và giờ hoàng đạo." },
      { q: "Ngày có điểm cao có chắc chắn tốt tuyệt đối không?", a: "Không. Điểm ngày là gợi ý tham khảo theo lịch pháp dân gian. Khi làm việc lớn vẫn cần cân nhắc sức khỏe, pháp lý, tài chính, thời tiết và hoàn cảnh thực tế." },
      { q: "Không nhập năm sinh có xem được không?", a: "Có. Nếu không nhập năm sinh, hệ thống vẫn lọc ngày theo việc cần làm, lịch âm, trực ngày, ngày hoàng đạo và giờ hoàng đạo; tuy nhiên phần xung/hợp tuổi sẽ không được áp dụng." },
    ]),
  ];

  return (
    <>
      <Header currentYear={today.year} />
      <div className="dayGoodBadShell ageGoodDateShell">
        <main className="ageGoodDatePage">
          <div className="pageFullscreenBg ageGoodDateFullscreenBg" style={{ backgroundImage: "linear-gradient(90deg, rgba(255,255,255,.94) 0%, rgba(255,255,255,.82) 42%, rgba(255,255,255,.52) 100%), linear-gradient(180deg, rgba(255,248,236,.18) 0%, rgba(255,248,236,.88) 100%), url(/bg-page-goodbad.png)" }} aria-hidden="true" />

          <div className="container ageGoodDateContainer">
            <nav className="ngdBreadcrumb" aria-label="Đường dẫn">
              <Link href="/">Trang chủ</Link>
              <span>›</span>
              <Link href="/xem-ngay-tot">Xem ngày tốt</Link>
              <span>›</span>
              <strong>Xem ngày tốt theo tuổi</strong>
            </nav>

            <section className="ageGoodDateHero" aria-labelledby="age-good-date-title">
              <div className="ageGoodDateHeroText">
                <p className="ngdEyebrow">Chọn ngày theo tuổi · Theo việc cần làm</p>
                <h1 id="age-good-date-title">Xem ngày tốt theo tuổi</h1>
                <p>Nhập năm sinh để lọc ngày hợp tuổi, tránh ngày xung/hại và chọn ngày đẹp cho khai trương, cưới hỏi, động thổ, nhập trạch, ký kết hoặc xuất hành.</p>
                <div className="ageGoodDateBadges">
                  <span><SiteIcon name="age" /> Năm sinh</span>
                  <span><SiteIcon name="goodBad" /> Điểm ngày 100</span>
                  <span><SiteIcon name="clock" /> Giờ hoàng đạo</span>
                  <span><SiteIcon name="compass" /> Hướng xuất hành</span>
                </div>
              </div>

              <div className={["ageGoodDateSeal", tone].join(" ")} aria-label={`Ngày gợi ý tốt nhất đạt ${topResult.score} điểm`}>
                <span>Gợi ý tốt nhất</span>
                <strong>{topResult.score}</strong>
                <b>/100 điểm</b>
                <em>{scoreLabel(topResult.score)}</em>
                <small>{formatDisplayDate(topResult.day.solar)} · {topResult.day.weekdayName}</small>
              </div>
            </section>

            <section className="ageGoodDatePlanner" aria-labelledby="age-good-filter-title">
              <div>
                <p className="ngdEyebrow">Bộ lọc chính</p>
                <h2 id="age-good-filter-title">Tìm ngày đẹp hợp với tuổi của bạn</h2>
                <p>Đang xem việc <strong>{activity.shortTitle}</strong> từ <strong>{formatDisplayDate(resolved.from)}</strong> đến <strong>{formatDisplayDate(resolved.to)}</strong>{resolved.birthYear ? <> · năm sinh <strong>{resolved.birthYear}</strong></> : ""}.</p>
              </div>
              <AgeGoodDateForm resolved={resolved} />
            </section>

            <div className="ageGoodDateLayout">
              <div className="ageGoodDateMain">
                <section className="ageGoodDateInsightGrid" aria-label="Tóm tắt kết quả">
                  <article className="ageGoodDateInsightCard isPrimary">
                    <SiteIcon name="calendar" />
                    <span>Ngày nên ưu tiên</span>
                    <strong>{formatDisplayDate(topResult.day.solar)}</strong>
                    <p>{topResult.summary}</p>
                    <div className="ageGoodDateActions">
                      <Link href={`/ngay-tot-xau/${topResult.day.solar.year}/${topResult.day.solar.month}/${topResult.day.solar.day}`}>Xem chi tiết ngày</Link>
                      <Link href={`/gio-hoang-dao/${topResult.day.solar.year}/${topResult.day.solar.month}/${topResult.day.solar.day}`}>Xem giờ tốt</Link>
                    </div>
                  </article>

                  <article className="ageGoodDateInsightCard">
                    {identity ? <ZodiacIcon branch={identity.chi} /> : <SiteIcon name="age" />}
                    <span>Thông tin tuổi</span>
                    <strong>{identity ? `${resolved.birthYear} · ${identity.text}` : "Chưa nhập năm sinh"}</strong>
                    <p>{identity && zodiac ? `Tuổi ${zodiac.animal}${lunarAge ? ` · tuổi âm tham khảo ${lunarAge}` : ""}. ${topResult.ageNote ?? "Không có dấu hiệu xung/hại mạnh với ngày gợi ý."}` : "Nhập năm sinh để hệ thống cộng/trừ điểm theo nhóm tuổi hợp, tuổi xung và tuổi hại với chi ngày."}</p>
                  </article>

                  <article className="ageGoodDateInsightCard">
                    <SiteIcon name="clock" />
                    <span>Giờ hoàng đạo</span>
                    <strong>{topGoodHours.length} khung giờ tốt</strong>
                    <p>{topGoodHours.map((hour) => `${hour.branch} ${hour.range}`).join(", ")}</p>
                  </article>
                </section>

                <section className="ageGoodDateResults" aria-labelledby="age-good-results-title">
                  <div className="ageGoodDateSectionHead">
                    <p className="ngdEyebrow">Kết quả gợi ý</p>
                    <h2 id="age-good-results-title">Top ngày hợp tuổi nên tham khảo</h2>
                    <p>Danh sách được sắp theo điểm cao nhất, có xét việc cần làm, ngày hoàng đạo/hắc đạo, trực ngày, giờ tốt và tuổi xung/hợp nếu bạn nhập năm sinh.</p>
                  </div>
                  {results.length > 0 ? (
                    <div className="activityResultGrid ageGoodDateResultGrid">
                      {results.map((item, index) => <ActivityResultCard key={`${item.day.solar.year}-${item.day.solar.month}-${item.day.solar.day}`} item={item} rank={index + 1} />)}
                    </div>
                  ) : (
                    <div className="ageGoodDateEmpty">
                      <h3>Chưa tìm thấy ngày thật sự phù hợp</h3>
                      <p>Khoảng ngày đang chọn có thể quá ngắn hoặc tiêu chí tuổi đang khá chặt. Hãy mở rộng thêm vài tuần hoặc đổi việc cần xem.</p>
                    </div>
                  )}
                </section>

                <section className="ageGoodDatePanel" aria-labelledby="age-good-best-title">
                  <div className="ageGoodDateSectionHead compact">
                    <p className="ngdEyebrow">Luận giải ngày nổi bật</p>
                    <h2 id="age-good-best-title">Vì sao nên cân nhắc ngày {formatDisplayDate(topResult.day.solar)}?</h2>
                  </div>
                  <div className="ageGoodDateReasonGrid">
                    <article>
                      <h3>Điểm thuận</h3>
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
                      <h3>Tuổi hợp/kỵ theo ngày</h3>
                      <p><strong>Lục hợp:</strong> {topDetails.ageCompatibility.lucHop}</p>
                      <p><strong>Tam hợp:</strong> {topDetails.ageCompatibility.tamHop.join(" · ")}</p>
                      <p><strong>Tuổi xung:</strong> {topDetails.ageCompatibility.xung.join(" · ")}</p>
                    </article>
                  </div>
                  <div className="scoreBreakdown ageGoodDateBreakdown">
                    {topResult.breakdown.map((item) => (
                      <span className={item.tone} key={item.label}>{item.points > 0 ? "+" : ""}{item.points} · {item.label}</span>
                    ))}
                  </div>
                  <p className="ageGoodDateNote">{topResult.directions.note}</p>
                </section>

                <section className="ageGoodDatePanel" aria-labelledby="age-good-guide-title">
                  <div className="ageGoodDateSectionHead compact">
                    <p className="ngdEyebrow">Cách dùng kết quả</p>
                    <h2 id="age-good-guide-title">Nên chọn ngày theo tuổi như thế nào?</h2>
                  </div>
                  <div className="ageGoodDateGuideGrid">
                    <article><span>1</span><h3>Nhập đúng năm sinh</h3><p>Dùng năm sinh âm lịch nếu bạn sinh sát Tết và đã biết chính xác năm âm.</p></article>
                    <article><span>2</span><h3>Chọn đúng việc</h3><p>Khai trương, cưới hỏi, nhập trạch, động thổ… có tiêu chí trực ngày và ngày kỵ khác nhau.</p></article>
                    <article><span>3</span><h3>Ưu tiên giờ tốt</h3><p>Sau khi chọn ngày, nên xem thêm giờ hoàng đạo để chọn khung giờ tiến hành.</p></article>
                    <article><span>4</span><h3>Kết hợp thực tế</h3><p>Việc lớn vẫn cần xét pháp lý, thời tiết, sức khỏe, lịch gia đình và điều kiện tài chính.</p></article>
                  </div>
                </section>

                <article className="ageModernArticle ageGoodDateArticle">
                  <p className="ngdEyebrow">Nội dung tham khảo</p>
                  <h2>Xem ngày tốt theo tuổi là gì?</h2>
                  <p>Xem ngày tốt theo tuổi là cách kết hợp thông tin ngày âm lịch, can chi, trực ngày, giờ hoàng đạo và tuổi của người đứng việc để lọc ra những ngày nên ưu tiên. Công cụ này phù hợp khi bạn cần chọn ngày cho việc có tính mở đầu như khai trương, nhập trạch, ký kết, cưới hỏi, động thổ hoặc xuất hành.</p>
                  <h2>Vì sao cần nhập năm sinh?</h2>
                  <p>Khi có năm sinh, hệ thống có thể xác định can chi tuổi, từ đó kiểm tra ngày có dấu hiệu lục hợp, tam hợp, xung hoặc hại với tuổi hay không. Đây là yếu tố giúp danh sách ngày được cá nhân hóa hơn so với việc chỉ xem ngày tốt xấu chung.</p>
                  <h2>Lưu ý quan trọng</h2>
                  <p>Kết quả chỉ mang tính tham khảo theo văn hóa dân gian. Không nên xem đây là quyết định tuyệt đối; với việc trọng đại, bạn nên cân nhắc thêm hoàn cảnh thực tế và tham khảo người có kinh nghiệm.</p>
                </article>
              </div>

              <aside className="ageGoodDateSidebar" aria-label="Xem nhanh ngày tốt theo tuổi">
                <section className="ageGoodDateSideCard">
                  <h2>Đổi việc cần xem</h2>
                  <div className="ageGoodDateActivityList">
                    {popularActivities.map((slug) => {
                      const item = getActivity(slug);
                      return <Link href={makeAgeGoodDateHref(slug, resolved)} key={slug}><ActivityIcon slug={slug} /> {item.shortTitle}</Link>;
                    })}
                  </div>
                </section>

                <section className="ageGoodDateSideCard">
                  <h2>Khoảng ngày đang lọc</h2>
                  <p><strong>{formatDisplayDate(resolved.from)}</strong> đến <strong>{formatDisplayDate(resolved.to)}</strong></p>
                  <p>{results.length > 0 ? `Tìm thấy ${results.length} ngày đạt từ 50 điểm trở lên.` : "Chưa có ngày phù hợp trong khoảng hiện tại."}</p>
                </section>

                <section className="ageGoodDateSideCard">
                  <h2>Công cụ liên quan</h2>
                  <Link href="/xem-tuoi-hop"><SiteIcon name="age" />Xem tuổi hợp</Link>
                  <Link href="/ngay-tot-xau"><SiteIcon name="goodBad" />Ngày tốt xấu hôm nay</Link>
                  <Link href="/gio-hoang-dao"><SiteIcon name="clock" />Giờ hoàng đạo</Link>
                  <Link href="/xem-ngay-tot"><SiteIcon name="calendar" />Xem ngày tốt theo việc</Link>
                </section>
              </aside>
            </div>
          </div>
        </main>
      </div>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
