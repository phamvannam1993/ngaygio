import Link from "next/link";
import {
  calculateNumerology,
  normalizeVietnamese,
  personalYearNumber,
  NUMBER_MEANINGS,
  getLifePathDetail,
} from "@/lib/numerology";
import { getVietnamTodayParts } from "@/lib/date";
import { NumerologyAspectTabs } from "./NumerologyAspectTabs";
import { NumerologyShareCard } from "./NumerologyShareCard";

type SearchParams = Record<string, string | string[] | undefined>;

type BirthChartItem = {
  value: number;
  count: number;
};

function single(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

// Nhận ngày sinh dạng yyyy-mm-dd từ input type=date.
function parseDob(params?: SearchParams): { day: number; month: number; year: number } | null {
  const raw = single(params?.ngaySinh);
  if (!raw) return null;

  const m = raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (!m) return null;

  const year = Number(m[1]);
  const month = Number(m[2]);
  const day = Number(m[3]);
  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    year >= 1900 &&
    year <= 2100 &&
    month >= 1 &&
    month <= 12 &&
    day >= 1 &&
    day <= 31 &&
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  ) {
    return { day, month, year };
  }

  return null;
}

function ordinalClass(value: number) {
  if (value === 11 || value === 22 || value === 33) return "master";
  if (value >= 7) return "strong";
  if (value >= 4) return "warm";
  return "soft";
}

function buildBirthChart(dob: { day: number; month: number; year: number } | null): BirthChartItem[] {
  const counts = new Map<number, number>();
  if (dob) {
    `${String(dob.day).padStart(2, "0")}${String(dob.month).padStart(2, "0")}${dob.year}`
      .split("")
      .map(Number)
      .filter((n) => n >= 1 && n <= 9)
      .forEach((n) => counts.set(n, (counts.get(n) ?? 0) + 1));
  }

  return [3, 6, 9, 2, 5, 8, 1, 4, 7].map((value) => ({
    value,
    count: counts.get(value) ?? 0,
  }));
}

function formatDob(dob: { day: number; month: number; year: number }) {
  return `${String(dob.day).padStart(2, "0")}/${String(dob.month).padStart(2, "0")}/${dob.year}`;
}

function getIndex(result: ReturnType<typeof calculateNumerology> | null, key: string) {
  return result?.indices.find((item) => item.key === key) ?? null;
}

const quickTools = [
  { href: "/lap-la-so-tu-vi", label: "Lập lá số tử vi", icon: "✦" },
  { href: "/tu-vi-hom-nay", label: "Tử vi hôm nay", icon: "☯" },
  { href: "/xem-tuoi-hop", label: "Xem tuổi hợp", icon: "♡" },
  { href: "/tinh-tuoi-am", label: "Tính tuổi âm", icon: "◐" },
];

const relatedPosts = [
  { href: "/than-so-hoc/so-chu-dao/1", number: "1", title: "Ý nghĩa số chủ đạo 1", desc: "Tiên phong, độc lập, lãnh đạo" },
  { href: "/than-so-hoc/so-chu-dao/8", number: "8", title: "Số chủ đạo 8 hợp nghề gì?", desc: "Quản trị, tài chính, kinh doanh" },
  { href: "/than-so-hoc/so-chu-dao/11", number: "11", title: "Thần số học số 11", desc: "Trực giác, cảm hứng, chiều sâu" },
  { href: "/than-so-hoc/so-chu-dao/22", number: "22", title: "Thần số học số 22", desc: "Tầm nhìn lớn, năng lực kiến tạo" },
];

export function NumerologyTool({ params, canonicalPath }: { params?: SearchParams; canonicalPath: string }) {
  const today = getVietnamTodayParts();
  const hoTen = (single(params?.hoTen) ?? "").trim();
  const tenThuongDung = (single(params?.tenThuongDung) ?? "").trim();
  const gioiTinh = single(params?.gioiTinh) ?? "nam";
  const dob = parseDob(params);
  const dobValue = dob ? `${dob.year}-${String(dob.month).padStart(2, "0")}-${String(dob.day).padStart(2, "0")}` : "";
  const nameValid = normalizeVietnamese(hoTen).replace(/\s/g, "").length >= 2;
  const hasSubmitted = single(params?.hoTen) !== undefined || single(params?.ngaySinh) !== undefined;
  const hasResult = nameValid && dob !== null;

  const result = hasResult ? calculateNumerology({ fullName: hoTen, day: dob!.day, month: dob!.month, year: dob!.year }) : null;
  const lifePath = getIndex(result, "duong-doi");
  const expression = getIndex(result, "su-menh");
  const soul = getIndex(result, "linh-hon");
  const personality = getIndex(result, "nhan-cach");
  const maturity = getIndex(result, "truong-thanh");
  const personalYear = result && dob ? personalYearNumber(dob.day, dob.month, today.year) : null;
  const personalYearMeaning = personalYear ? NUMBER_MEANINGS[personalYear] : null;
  const chartItems = buildBirthChart(dob);
  const highlightedNumber = lifePath?.value ?? 8;
  const highlightedKeyword = lifePath?.meaning.keyword ?? "Bản đồ số cá nhân";
  const lifePathDetail = lifePath ? getLifePathDetail(lifePath.value) : null;
  const aspectTabs = lifePathDetail
    ? [
        { label: "Tổng quan", body: lifePathDetail.overview },
        { label: "Tình yêu", body: lifePathDetail.love },
        { label: "Công việc", body: lifePathDetail.career },
        { label: "Tài chính", body: lifePathDetail.finance },
      ]
    : [];

  return (
    <>
      <section className="tshHero" aria-labelledby="tsh-title">
        <div className="tshHeroCopy">
          <p className="tshKicker">Công cụ miễn phí • Xem kết quả ngay</p>
          <h1 id="tsh-title">Tra cứu Thần số học theo ngày sinh và họ tên</h1>
          <p>
            Lập bản đồ số cá nhân với Số Đường Đời, Sứ Mệnh, Linh Hồn, Nhân Cách, biểu đồ ngày sinh và năm cá nhân — trình bày đẹp, rõ, dễ hiểu.
          </p>
          <div className="tshHeroActions">
            <a href="#tsh-form" className="tshPrimaryCta">Tra cứu ngay</a>
            <a href="#tsh-guide" className="tshGhostCta">Xem cách tính</a>
          </div>
          <div className="tshHeroBadges" aria-label="Ưu điểm công cụ">
            <span>Không cần đăng nhập</span>
            <span>Có giải thích chỉ số</span>
            <span>Dễ chia sẻ</span>
          </div>
        </div>

        <div className="tshOracle" aria-hidden="true">
          <div className="tshOracleRing">
            <span>{highlightedNumber}</span>
            <small>{highlightedKeyword}</small>
          </div>
        </div>
      </section>

      <div className="tshPortalGrid">
        <div className="tshMainColumn">
          <section id="tsh-form" className="tshFormCard" aria-labelledby="tsh-form-title">
            <div className="tshFormHead">
              <div>
                <p className="tshSectionEyebrow">Tra cứu thần số học</p>
                <h2 id="tsh-form-title">Nhập thông tin để lập bản đồ số</h2>
                <p>Ưu tiên nhập ngày sinh dương lịch thật và họ tên khai sinh đầy đủ để kết quả ổn định hơn.</p>
              </div>
              <div className="tshFormMark" aria-hidden="true">✦</div>
            </div>

            <form className="tshForm" action={canonicalPath} method="get">
              <label className="tshField tshFieldWide">
                <span>Họ và tên khai sinh *</span>
                <input name="hoTen" type="text" defaultValue={hoTen} placeholder="Ví dụ: Nguyễn Văn An" autoComplete="name" />
              </label>

              <label className="tshField">
                <span>Tên thường dùng</span>
                <input name="tenThuongDung" type="text" defaultValue={tenThuongDung} placeholder="Không bắt buộc" />
              </label>

              <div className="tshField">
                <span>Giới tính</span>
                <div className="tshRadioGroup">
                  <label>
                    <input name="gioiTinh" type="radio" value="nam" defaultChecked={gioiTinh !== "nu"} />
                    <span>Nam</span>
                  </label>
                  <label>
                    <input name="gioiTinh" type="radio" value="nu" defaultChecked={gioiTinh === "nu"} />
                    <span>Nữ</span>
                  </label>
                </div>
              </div>

              <label className="tshField tshFieldWide">
                <span>Ngày sinh dương lịch *</span>
                <input name="ngaySinh" type="date" min="1900-01-01" max="2100-12-31" defaultValue={dobValue} />
              </label>

              <div className="tshFormActions">
                <button type="submit">Tra cứu bản đồ số</button>
                <a href="#tsh-guide">Xem hướng dẫn</a>
              </div>
            </form>

            {hasSubmitted && !hasResult && (
              <p className="tshError">Vui lòng nhập đầy đủ họ tên có chữ và chọn ngày sinh dương lịch hợp lệ.</p>
            )}
          </section>

          <section className="tshNoticeCard" aria-label="Lưu ý khi tra cứu">
            <strong>!</strong>
            <div>
              <h2>Lưu ý khi tra cứu</h2>
              <p>
                Kết quả thần số học chỉ mang tính tham khảo và gợi mở tự nhận thức. Không nên dùng kết quả này như một quyết định tuyệt đối cho công việc, tài chính hay các mối quan hệ.
              </p>
            </div>
          </section>

          {result && lifePath ? (
            <>
              <section className="tshResultHero" aria-labelledby="tsh-result-title">
                <div className="tshNumberOrb">
                  <span>{lifePath.value}</span>
                  <small>Số Đường Đời</small>
                </div>
                <div className="tshResultSummary">
                  <p className="tshSectionEyebrow">Kết quả nổi bật</p>
                  <h2 id="tsh-result-title">Bản đồ thần số học của {result.name}</h2>
                  <p className="tshDob">Ngày sinh: {formatDob(result.dob)}</p>
                  <p><strong>{lifePath.meaning.keyword}.</strong> {lifePath.meaning.description}</p>
                  <div className="tshResultTags">
                    <span>{expression?.label}: {expression?.value}</span>
                    <span>{soul?.label}: {soul?.value}</span>
                    <span>Năm cá nhân {today.year}: {personalYear}</span>
                  </div>
                </div>
                <div className="tshShareCard">
                  <h3>Tạo ảnh chia sẻ</h3>
                  <p>{result.name} • Số chủ đạo {lifePath.value}</p>
                  <a href="#tsh-share">Tải ảnh kết quả</a>
                </div>
              </section>

              <section className="tshPanel" aria-labelledby="tsh-index-title">
                <div className="tshPanelHead">
                  <p className="tshSectionEyebrow">Bản đồ chỉ số</p>
                  <h2 id="tsh-index-title">Các chỉ số thần số học của bạn</h2>
                </div>
                <div className="tshIndexGrid">
                  {result.indices.map((idx) => (
                    <article key={idx.key} className={["tshIndexCard", ordinalClass(idx.value)].join(" ")}>
                      <div>
                        <span>{idx.label}</span>
                        <p>{idx.short}</p>
                      </div>
                      <strong>{idx.value}</strong>
                      {idx.isMaster && <em>master</em>}
                      <p><b>{idx.meaning.keyword}.</b> {idx.meaning.description}</p>
                    </article>
                  ))}
                </div>
              </section>

              <section className="tshBirthReadingGrid" aria-label="Biểu đồ ngày sinh và luận giải">
                <article className="tshPanel tshBirthCard">
                  <div className="tshPanelHead">
                    <p className="tshSectionEyebrow">Biểu đồ ngày sinh</p>
                    <h2>Lưới năng lượng 3x3</h2>
                  </div>
                  <div className="tshBirthChart" aria-label="Biểu đồ ngày sinh">
                    {chartItems.map((item) => (
                      <div key={item.value} className={item.count > 0 ? "active" : "missing"}>
                        <span>{item.value}</span>
                        <small>{item.count > 0 ? `x${item.count}` : "thiếu"}</small>
                      </div>
                    ))}
                  </div>
                  <div className="tshMiniRead">
                    <p><strong>Gợi ý đọc:</strong> Số xuất hiện nhiều thể hiện năng lượng nổi bật; số thiếu là vùng nên quan sát và rèn luyện thêm.</p>
                  </div>
                </article>

                <article className="tshPanel tshDeepRead">
                  <div className="tshPanelHead">
                    <p className="tshSectionEyebrow">Luận giải chi tiết</p>
                    <h2>Đọc theo từng khía cạnh</h2>
                  </div>
                  {aspectTabs.length > 0 ? (
                    <NumerologyAspectTabs aspects={aspectTabs} />
                  ) : (
                    <div className="tshReadBox">
                      <h3>Tính cách nổi bật</h3>
                      <p>{lifePath.meaning.description}</p>
                    </div>
                  )}
                  {personalYear && personalYearMeaning && (
                    <div className="tshReadBox subtle">
                      <h3>Năm cá nhân {today.year}: {personalYear}</h3>
                      <p><strong>{personalYearMeaning.keyword}.</strong> {personalYearMeaning.description}</p>
                    </div>
                  )}
                  {lifePathDetail && (
                    <p style={{ marginTop: 12 }}>
                      <Link href={`/than-so-hoc/so-chu-dao/${lifePath.value}`} className="tshInlineLink">
                        → Xem chi tiết ý nghĩa số chủ đạo {lifePath.value}
                      </Link>
                    </p>
                  )}
                </article>
              </section>
            </>
          ) : (
            <section className="tshPanel tshEmptyState" aria-label="Gợi ý trước khi tra cứu">
              <div className="tshNumberOrb demo">
                <span>8</span>
                <small>Ví dụ kết quả</small>
              </div>
              <div>
                <p className="tshSectionEyebrow">Bạn sẽ nhận được gì?</p>
                <h2>Bản đồ thần số học cá nhân hóa</h2>
                <p>
                  Sau khi nhập họ tên và ngày sinh, hệ thống sẽ tính Số Đường Đời, Sứ Mệnh, Linh Hồn, Nhân Cách, Ngày Sinh, Thái Độ, Trưởng Thành và Năm cá nhân hiện tại.
                </p>
                <div className="tshResultTags">
                  <span>Số chủ đạo</span>
                  <span>Biểu đồ ngày sinh</span>
                  <span>Năm cá nhân</span>
                </div>
              </div>
            </section>
          )}

          <section id="tsh-guide" className="tshPanel tshGuidePanel">
            <div className="tshPanelHead">
              <p className="tshSectionEyebrow">Kiến thức nền</p>
              <h2>Cách hiểu các chỉ số thần số học</h2>
            </div>
            <div className="tshGuideGrid">
              <article>
                <span>01</span>
                <h3>Số Đường Đời</h3>
                <p>Tính từ ngày, tháng, năm sinh. Đây là chỉ số quan trọng nhất, phản ánh bài học lớn và hướng phát triển của cuộc đời.</p>
              </article>
              <article>
                <span>02</span>
                <h3>Số Sứ Mệnh</h3>
                <p>Tính từ toàn bộ chữ cái trong họ tên. Chỉ số này nói về tài năng, mục tiêu và cách bạn tạo giá trị cho đời sống.</p>
              </article>
              <article>
                <span>03</span>
                <h3>Số Linh Hồn</h3>
                <p>Tính từ nguyên âm trong tên. Đây là nhu cầu sâu bên trong, điều bạn thật sự mong muốn và dễ rung động.</p>
              </article>
              <article>
                <span>04</span>
                <h3>Số Nhân Cách</h3>
                <p>Tính từ phụ âm trong tên. Chỉ số này cho biết hình ảnh bên ngoài và ấn tượng bạn thường tạo ra với người khác.</p>
              </article>
            </div>
          </section>

          {result && lifePath && (
            <section id="tsh-share" className="tshSharePreview">
              <div>
                <p className="tshSectionEyebrow">Lưu & chia sẻ</p>
                <h2>Tải ảnh kết quả thần số học</h2>
                <p>Lưu tấm thẻ kết quả về máy để chia sẻ lên Facebook, Zalo hoặc lưu làm kỷ niệm.</p>
              </div>
              <NumerologyShareCard
                name={result.name}
                lifePath={lifePath.value}
                keyword={lifePath.meaning.keyword}
                dob={formatDob(result.dob)}
                expression={expression?.value ?? 0}
                soul={soul?.value ?? 0}
              />
            </section>
          )}
        </div>

        <aside className="tshSidebar" aria-label="Công cụ và bài viết liên quan">
          <section className="tshSideCard dark">
            <h2>Công cụ xem nhiều</h2>
            <p>Khám phá thêm các công cụ xem ngày, xem tuổi và tử vi tại Ngày Giờ.</p>
            <div>
              {quickTools.map((tool) => (
                <Link href={tool.href} key={tool.href}>
                  <span>{tool.icon}</span>
                  {tool.label}
                </Link>
              ))}
            </div>
          </section>

          <section className="tshSideCard">
            <h2>Bài viết nổi bật</h2>
            {relatedPosts.map((post) => (
              <Link className="tshPostLink" href={post.href} key={`${post.number}-${post.title}`}>
                <strong>{post.number}</strong>
                <span>
                  <b>{post.title}</b>
                  <small>{post.desc}</small>
                </span>
              </Link>
            ))}
          </section>

          <section className="tshSideCard">
            <h2>Tra ý nghĩa từng số chủ đạo</h2>
            <p>Xem chi tiết tính cách, tình yêu, sự nghiệp theo số chủ đạo:</p>
            <div className="tshNumberChips">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33].map((n) => (
                <Link key={n} href={`/than-so-hoc/so-chu-dao/${n}`}>{n}</Link>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </>
  );
}
