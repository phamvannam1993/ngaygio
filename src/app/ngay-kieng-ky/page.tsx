import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getVietnamTodayParts, formatDisplayDate, daysInMonth, type DateParts } from "@/lib/date";
import { getDayInfo } from "@/lib/calendar/service";
import { getSpecialWarnings, type SpecialWarning } from "@/lib/calendar/good-bad";
import { amLichDayHref } from "@/lib/calendar/urls";
import { siteConfig, webPageSchema, faqSchema } from "@/lib/site";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const PAGE_PATH = "/ngay-kieng-ky";

type WarnedDay = {
  date: DateParts;
  lunarDay: number;
  lunarMonth: number;
  weekday: string;
  warnings: SpecialWarning[];
};

// Quét toàn bộ tháng dương hiện tại, lấy các ngày dính kiêng kỵ (Tam nương / Nguyệt kỵ / Dương Công / Nguyệt tận).
function getWarnedDaysOfMonth(year: number, month: number): WarnedDay[] {
  const total = daysInMonth(year, month);
  const list: WarnedDay[] = [];
  for (let day = 1; day <= total; day += 1) {
    const info = getDayInfo({ year, month, day });
    const warnings = getSpecialWarnings(info);
    if (warnings.length > 0) {
      list.push({
        date: { year, month, day },
        lunarDay: info.lunar.day,
        lunarMonth: info.lunar.month,
        weekday: info.weekdayName,
        warnings,
      });
    }
  }
  return list;
}

export async function generateMetadata(): Promise<Metadata> {
  const today = getVietnamTodayParts();
  const title = `Ngày kiêng kỵ tháng ${today.month}/${today.year} – Tam Nương, Nguyệt Kỵ, Dương Công | Ngày Giờ`;
  const description = `Tra ngày kiêng kỵ trong tháng: ngày Tam Nương (3,7,13,18,22,27), Nguyệt Kỵ (5,14,23) và Dương Công Kỵ Nhật theo âm lịch. Tránh cưới hỏi, động thổ, khai trương. Xem ngay!`;
  return {
    title,
    description,
    keywords: [
      "ngày kiêng kỵ",
      "ngày tam nương",
      "ngày tam nương là ngày nào",
      "ngày nguyệt kỵ",
      "mùng 5 14 23",
      "dương công kỵ nhật",
      `ngày xấu tháng ${today.month}`,
      "ngày nên tránh cưới hỏi động thổ",
    ],
    alternates: { canonical: `${siteConfig.url}${PAGE_PATH}` },
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}${PAGE_PATH}`,
      siteName: siteConfig.name,
      locale: "vi_VN",
      type: "website",
      images: [{ url: "/home.jpg", width: 1200, height: 630, alt: title }],
    },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  };
}

export default function NgayKiengKyPage() {
  const today = getVietnamTodayParts();
  const todayInfo = getDayInfo(today);
  const todayWarnings = getSpecialWarnings(todayInfo);
  const todayDisplay = formatDisplayDate(today);
  const warnedDays = getWarnedDaysOfMonth(today.year, today.month);

  const jsonLd = [
    webPageSchema({
      name: `Ngày kiêng kỵ tháng ${today.month}/${today.year}`,
      url: `${siteConfig.url}${PAGE_PATH}`,
      description: "Danh sách ngày kiêng kỵ trong tháng theo âm lịch: Tam Nương, Nguyệt Kỵ, Dương Công Kỵ Nhật, Nguyệt tận.",
      breadcrumb: [{ name: "Ngày kiêng kỵ", url: `${siteConfig.url}${PAGE_PATH}` }],
    }),
    faqSchema([
      { q: "Ngày Tam Nương là ngày nào?", a: "Ngày Tam Nương là 6 ngày cố định trong mỗi tháng âm lịch: mùng 3, 7, 13, 18, 22 và 27. Dân gian quan niệm đây là ngày nên thận trọng, hạn chế cưới hỏi, khai trương, động thổ hay khởi sự việc lớn." },
      { q: "Ngày Nguyệt Kỵ là gì?", a: "Ngày Nguyệt Kỵ là các ngày mùng 5, 14, 23 âm lịch (cộng các chữ số đều bằng 5). Theo dân gian, đây là ngày kiêng khởi sự việc trọng đại, xuất hành hay ký kết." },
      { q: "Ngày Dương Công Kỵ Nhật là những ngày nào?", a: "Dương Công Kỵ Nhật gồm 13 ngày cố định trong năm theo âm lịch (ví dụ 13 tháng Giêng, 11 tháng 2, 9 tháng 3...), được xem là ngày xấu, nên tránh quyết định đại sự." },
      { q: `Tháng ${today.month}/${today.year} có những ngày kiêng kỵ nào?`, a: warnedDays.length > 0 ? `Tháng ${today.month}/${today.year} có ${warnedDays.length} ngày dính kiêng kỵ, gồm các ngày: ${warnedDays.map((d) => `${d.date.day}/${d.date.month}`).join(", ")} (dương lịch).` : `Đang cập nhật danh sách ngày kiêng kỵ tháng ${today.month}/${today.year}.` },
      { q: "Ngày kiêng kỵ có bắt buộc phải tránh không?", a: "Ngày kiêng kỵ dựa trên quan niệm dân gian, mang tính tham khảo. Khi chọn ngày làm việc lớn nên cân nhắc thêm ngày hoàng đạo, giờ hoàng đạo, tuổi của gia chủ và điều kiện thực tế, không nên quá cứng nhắc." },
    ]),
  ];

  return (
    <>
      <Header currentYear={today.year} />
      <main className="container mainStack">
        <div className="pageFullscreenBg" style={{ backgroundImage: "linear-gradient(90deg, rgba(255,255,255,.94) 0%, rgba(255,255,255,.82) 42%, rgba(255,255,255,.52) 100%), linear-gradient(180deg, rgba(245,251,247,.18) 0%, rgba(245,251,247,.9) 100%), url(/bg-page-calendar.png)" }} aria-hidden="true" />

        <section className="heroCard" aria-labelledby="kieng-ky-title">
          <p className="eyebrow">Ngày kiêng kỵ theo âm lịch</p>
          <h1 id="kieng-ky-title">Ngày kiêng kỵ tháng {today.month}/{today.year}</h1>

          <div className="todayGrid" style={{ marginTop: "24px" }}>
            <article className={todayWarnings.length > 0 ? "dateBox lunarBox" : "dateBox"}>
              <span className="boxTitle">Hôm nay</span>
              <strong className="monthTitle">{today.day}/{today.month}/{today.year}</strong>
              <span className="bigDate">{todayInfo.lunar.day}</span>
              <span className="subDate">{todayDisplay} · Âm lịch {todayInfo.lunar.day}/{todayInfo.lunar.month}</span>
            </article>

            <article className="infoBox">
              {todayWarnings.length > 0 ? (
                <>
                  <p><strong>Hôm nay là ngày kiêng kỵ:</strong></p>
                  {todayWarnings.map((w) => (
                    <p key={w.name}><span>{w.name}</span> — {w.description}</p>
                  ))}
                </>
              ) : (
                <>
                  <p><strong>Hôm nay không phải ngày kiêng kỵ</strong> (không thuộc Tam Nương, Nguyệt Kỵ hay Dương Công Kỵ Nhật).</p>
                  <p>Bạn vẫn nên xem thêm <Link href="/ngay-tot-xau-hom-nay">ngày tốt xấu</Link> và <Link href="/gio-hoang-dao-hom-nay">giờ hoàng đạo</Link> hôm nay.</p>
                </>
              )}
              <p className="disclaimer">Kiêng kỵ theo quan niệm dân gian, mang tính tham khảo.</p>
            </article>
          </div>
        </section>

        <section className="heroCard" aria-labelledby="list-title">
          <h2 id="list-title" className="monthTitle" style={{ marginBottom: 16 }}>
            Danh sách ngày kiêng kỵ trong tháng {today.month}/{today.year}
          </h2>
          {warnedDays.length > 0 ? (
            <div className="dayLinkList">
              {warnedDays.map((d) => (
                <Link key={`${d.date.day}`} href={amLichDayHref(d.date)} className="eventPill red">
                  {d.date.day}/{d.date.month} ({d.weekday}) · ÂL {d.lunarDay}/{d.lunarMonth} — {d.warnings.map((w) => w.name).join(", ")}
                </Link>
              ))}
            </div>
          ) : (
            <p>Đang cập nhật danh sách ngày kiêng kỵ tháng này.</p>
          )}
        </section>

        <article className="seoArticle">
          <h2>Ngày Tam Nương là ngày nào?</h2>
          <p>Ngày <strong>Tam Nương</strong> là 6 ngày cố định trong mỗi tháng âm lịch: <strong>mùng 3, mùng 7, 13, 18, 22 và 27</strong>. Theo quan niệm dân gian, đây là những ngày nên thận trọng, hạn chế tổ chức việc trọng đại như cưới hỏi, khai trương, động thổ, nhập trạch hay xuất hành xa. Cả năm có khoảng 72 ngày Tam Nương.</p>

          <h2>Ngày Nguyệt Kỵ là gì?</h2>
          <p>Ngày <strong>Nguyệt Kỵ</strong> gồm mùng <strong>5, 14, 23</strong> âm lịch — đặc điểm là tổng các chữ số của ngày đều bằng 5 (5; 1+4; 2+3). Dân gian có câu &ldquo;mùng năm, mười bốn, hai ba; đi chơi cũng thiệt nữa là đi buôn&rdquo;, nên thường kiêng khởi sự việc lớn, xuất hành hay ký kết trong các ngày này.</p>

          <h2>Ngày Dương Công Kỵ Nhật</h2>
          <p>Đây là nhóm <strong>13 ngày kỵ cố định trong năm</strong> theo âm lịch (13 tháng Giêng, 11 tháng 2, 9 tháng 3, 7 tháng 4, 5 tháng 5, 3 tháng 6, 8 & 29 tháng 7, 27 tháng 8, 25 tháng 9, 23 tháng 10, 21 tháng 11, 19 tháng Chạp). Dân gian xem đây là ngày rất xấu, nên tránh quyết định đại sự nếu không có tư vấn chuyên môn.</p>

          <h2>Ngày Nguyệt Tận</h2>
          <p><strong>Nguyệt Tận</strong> là ngày cuối cùng của tháng âm lịch (30 hoặc 29). Ngày này phù hợp cho việc tổng kết, dọn dẹp; hạn chế mở đầu việc mới quá lớn.</p>

          <h2>Có nhất thiết phải tránh ngày kiêng kỵ không?</h2>
          <p>Ngày kiêng kỵ dựa trên kinh nghiệm và quan niệm dân gian, <strong>mang tính tham khảo</strong>. Khi chọn ngày làm việc lớn, bạn nên kết hợp thêm: ngày hoàng đạo/hắc đạo, giờ hoàng đạo, trực và sao trong ngày, cùng tuổi của gia chủ. Dùng công cụ bên dưới để chọn ngày tốt phù hợp với từng việc cụ thể.</p>

          <h2>Công cụ chọn ngày tốt liên quan</h2>
          <div className="dayLinkList">
            <Link href="/ngay-tot-xau-hom-nay" className="eventPill green">Xem ngày tốt xấu hôm nay</Link>
            <Link href="/gio-hoang-dao-hom-nay" className="eventPill green">Giờ hoàng đạo hôm nay</Link>
            <Link href="/xem-ngay-tot-cuoi-hoi" className="eventPill blue">Xem ngày cưới hỏi</Link>
            <Link href="/xem-ngay-tot-dong-tho" className="eventPill blue">Xem ngày động thổ</Link>
            <Link href="/xem-ngay-tot-khai-truong" className="eventPill blue">Xem ngày khai trương</Link>
            <Link href="/xem-ngay-tot-nhap-trach" className="eventPill blue">Xem ngày nhập trạch</Link>
            <Link href="/am-lich-hom-nay" className="eventPill green">Lịch âm hôm nay</Link>
          </div>
        </article>
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
