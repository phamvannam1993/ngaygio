import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getVietnamTodayParts, formatDisplayDate, addDays, weekdayName, type DateParts } from "@/lib/date";
import { getDayInfo } from "@/lib/calendar/service";
import { siteConfig, webPageSchema, faqSchema } from "@/lib/site";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const PAGE_PATH = "/tinh-ngay-online";
type SP = Record<string, string | string[] | undefined>;

function single(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] : v;
}
function parseDate(raw?: string): DateParts | null {
  if (!raw) return null;
  const m = raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (!m) return null;
  const year = Number(m[1]), month = Number(m[2]), day = Number(m[3]);
  const d = new Date(Date.UTC(year, month - 1, day));
  if (d.getUTCFullYear() === year && d.getUTCMonth() === month - 1 && d.getUTCDate() === day) return { year, month, day };
  return null;
}
function toValue(d: DateParts) {
  return `${d.year}-${String(d.month).padStart(2, "0")}-${String(d.day).padStart(2, "0")}`;
}
function diffDays(a: DateParts, b: DateParts) {
  return Math.round((Date.UTC(b.year, b.month - 1, b.day) - Date.UTC(a.year, a.month - 1, a.day)) / 86400000);
}

export const metadata: Metadata = {
  title: "Tính ngày online: Cộng trừ ngày, tính số ngày giữa 2 ngày | Ngày Giờ",
  description: "Công cụ tính ngày online miễn phí: cộng thêm/trừ số ngày ra ngày mới, tính số ngày – tuần – tháng giữa hai ngày, kèm thứ trong tuần và ngày âm lịch.",
  keywords: ["tính ngày online", "công cụ tính ngày", "cộng thêm ngày", "trừ ngày", "tính số ngày giữa 2 ngày", "tính khoảng cách ngày", "đếm ngày giữa hai ngày"],
  alternates: { canonical: `${siteConfig.url}${PAGE_PATH}` },
  openGraph: { title: "Tính ngày online: Cộng trừ ngày, số ngày giữa 2 ngày | Ngày Giờ", description: "Cộng/trừ ngày và tính khoảng cách giữa hai ngày, kèm thứ và âm lịch.", url: `${siteConfig.url}${PAGE_PATH}`, siteName: siteConfig.name, locale: "vi_VN", type: "website", images: [{ url: "/home.jpg", width: 1200, height: 630, alt: "Tính ngày online" }] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
};

export default async function TinhNgayPage({ searchParams }: { searchParams?: Promise<SP> }) {
  const params = (await searchParams) ?? {};
  const today = getVietnamTodayParts();

  // Chế độ cộng/trừ ngày
  const baseDate = parseDate(single(params.tuNgay)) ?? today;
  const soNgay = Number(single(params.soNgay));
  const hasAdd = single(params.tuNgay) !== undefined && Number.isFinite(soNgay);
  const resultDate = hasAdd ? addDays(baseDate, soNgay) : null;
  const resultInfo = resultDate ? getDayInfo(resultDate) : null;

  // Chế độ khoảng cách 2 ngày
  const dateA = parseDate(single(params.ngayA));
  const dateB = parseDate(single(params.ngayB));
  const hasDiff = dateA !== null && dateB !== null;
  const gap = hasDiff ? diffDays(dateA!, dateB!) : null;
  const gapAbs = gap !== null ? Math.abs(gap) : null;

  const jsonLd = [
    webPageSchema({ name: "Tính ngày online", url: `${siteConfig.url}${PAGE_PATH}`, description: "Cộng trừ ngày và tính số ngày giữa hai ngày.", breadcrumb: [{ name: "Tính ngày online", url: `${siteConfig.url}${PAGE_PATH}` }] }),
    faqSchema([
      { q: "Cách tính cộng thêm hoặc trừ ngày?", a: "Nhập ngày bắt đầu và số ngày (số dương để cộng thêm, số âm để trừ bớt). Công cụ trả về ngày kết quả kèm thứ trong tuần và ngày âm lịch." },
      { q: "Cách tính số ngày giữa hai ngày?", a: "Nhập hai ngày bất kỳ, công cụ sẽ tính khoảng cách theo số ngày, số tuần và số tháng gần đúng." },
      { q: "Công cụ tính ngày này có miễn phí không?", a: "Có. Công cụ tính ngày online tại Ngày Giờ hoàn toàn miễn phí, không cần đăng nhập." },
    ]),
  ];

  return (
    <>
      <Header currentYear={today.year} />
      <main className="container mainStack">
        <div className="pageFullscreenBg" style={{ backgroundImage: "linear-gradient(90deg, rgba(255,255,255,.94) 0%, rgba(255,255,255,.82) 42%, rgba(255,255,255,.52) 100%), linear-gradient(180deg, rgba(245,251,247,.18) 0%, rgba(245,251,247,.9) 100%), url(/bg-page-calendar.png)" }} aria-hidden="true" />

        <section className="heroCard" aria-labelledby="tn-title">
          <p className="eyebrow">Công cụ tính ngày</p>
          <h1 id="tn-title">Tính ngày online — cộng trừ ngày & khoảng cách 2 ngày</h1>
          <p className="homeHeroLead" style={{ marginTop: 10 }}>Cộng thêm hoặc trừ số ngày để ra ngày mới, hoặc tính số ngày giữa hai ngày — kèm thứ trong tuần và ngày âm lịch.</p>
        </section>

        <section className="panelCard ageSearch" aria-labelledby="tn-add-title">
          <div className="ngdSectionHead compact">
            <p className="eyebrow">Cộng / trừ ngày</p>
            <h2 id="tn-add-title">Cộng thêm hoặc trừ số ngày</h2>
          </div>
          <form className="ageForm compatForm" action={PAGE_PATH} method="get">
            <label><span>Từ ngày</span><input name="tuNgay" type="date" defaultValue={toValue(baseDate)} /></label>
            <label><span>Số ngày (âm để trừ)</span><input name="soNgay" type="number" defaultValue={Number.isFinite(soNgay) ? soNgay : 30} inputMode="numeric" /></label>
            <button type="submit">Tính ngày</button>
          </form>
          {resultDate && resultInfo && (
            <div className="compatResultHead" style={{ marginTop: 14 }}>
              <div>
                <p className="eyebrow">Kết quả</p>
                <p style={{ fontSize: "1.1rem" }}><strong>{weekdayName(resultDate)}, {formatDisplayDate(resultDate)}</strong> dương lịch</p>
                <p>Tức {resultInfo.lunar.day}/{resultInfo.lunar.month} âm lịch · {soNgay >= 0 ? `sau ${soNgay} ngày` : `trước ${Math.abs(soNgay)} ngày`} kể từ {formatDisplayDate(baseDate)}.</p>
              </div>
            </div>
          )}
        </section>

        <section className="panelCard ageSearch" aria-labelledby="tn-diff-title">
          <div className="ngdSectionHead compact">
            <p className="eyebrow">Khoảng cách 2 ngày</p>
            <h2 id="tn-diff-title">Tính số ngày giữa hai ngày</h2>
          </div>
          <form className="ageForm compatForm" action={PAGE_PATH} method="get">
            <label><span>Ngày bắt đầu</span><input name="ngayA" type="date" defaultValue={dateA ? toValue(dateA) : toValue(today)} /></label>
            <label><span>Ngày kết thúc</span><input name="ngayB" type="date" defaultValue={dateB ? toValue(dateB) : toValue(addDays(today, 30))} /></label>
            <button type="submit">Tính khoảng cách</button>
          </form>
          {hasDiff && gapAbs !== null && (
            <div className="compatResultHead" style={{ marginTop: 14 }}>
              <div>
                <p className="eyebrow">Kết quả</p>
                <p style={{ fontSize: "1.1rem" }}>Giữa {formatDisplayDate(dateA!)} và {formatDisplayDate(dateB!)} cách nhau <strong>{gapAbs} ngày</strong>.</p>
                <p>Tương đương khoảng <strong>{Math.floor(gapAbs / 7)}</strong> tuần {gapAbs % 7 > 0 ? `${gapAbs % 7} ngày` : ""} · <strong>{Math.round((gapAbs / 30.44) * 10) / 10}</strong> tháng.</p>
              </div>
            </div>
          )}
        </section>

        <article className="seoArticle">
          <h2>Công cụ tính ngày online dùng để làm gì?</h2>
          <p>Công cụ tính ngày giúp bạn nhanh chóng: <strong>cộng thêm/trừ số ngày</strong> từ một mốc để biết ngày đến hạn (ví dụ hợp đồng, thai kỳ, bảo hành), và <strong>tính số ngày giữa hai ngày</strong> để đếm thời gian còn lại hoặc đã trôi qua. Kết quả kèm thứ trong tuần và ngày âm lịch tương ứng.</p>

          <h2>Công cụ liên quan</h2>
          <div className="dayLinkList">
            <Link href="/dem-ngay" className="eventPill green">Đếm ngày / đếm ngược sự kiện</Link>
            <Link href="/chuyen-doi-lich" className="eventPill green">Đổi ngày âm dương</Link>
            <Link href="/tinh-tuoi-am" className="eventPill green">Tính tuổi âm lịch</Link>
            <Link href="/hom-nay" className="eventPill blue">Hôm nay là ngày gì</Link>
            <Link href="/lich-van-nien" className="eventPill green">Lịch vạn niên</Link>
          </div>
        </article>
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
