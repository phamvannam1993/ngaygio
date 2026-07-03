import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getVietnamTodayParts } from "@/lib/date";
import { faqSchema, siteConfig, webPageSchema } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "API lịch âm miễn phí – JSON, giờ hoàng đạo, ngày tốt xấu | Ngày Giờ",
  description: "Tài liệu API lịch âm miễn phí của Ngaygio.vn: lấy ngày âm, can chi, giờ hoàng đạo, ngày tốt xấu, đếm ngày đến Tết và xuất file iCal.",
  keywords: ["api lịch âm", "api âm lịch", "api ngày âm", "api giờ hoàng đạo", "api lịch việt nam", "api tet countdown"],
  alternates: { canonical: "/api-lich-am" },
  openGraph: {
    title: "API lịch âm miễn phí | Ngày Giờ",
    description: "Lấy dữ liệu lịch âm Việt Nam dạng JSON hoặc iCal để nhúng vào website/app.",
    url: `${siteConfig.url}/api-lich-am`,
    siteName: siteConfig.name,
    locale: "vi_VN",
    type: "website",
    images: [{ url: "/home.jpg", width: 1200, height: 630, alt: "API lịch âm miễn phí" }],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
};

const endpoint = `${siteConfig.url}/api/lich-am`;
const sampleJson = `{
  "date": "2026-07-03",
  "solarDate": "03/07/2026",
  "weekday": "Thứ Sáu",
  "lunar": { "day": 19, "month": 5, "year": 2026, "isLeap": false },
  "canChi": { "day": "...", "month": "...", "year": "Bính Ngọ" },
  "quality": { "label": "Ngày Hoàng Đạo", "note": "..." },
  "goodHoursText": "Tý 23:00-01:00, Sửu 01:00-03:00...",
  "tetDaysLeft": 200,
  "source": "${siteConfig.url}"
}`;

const fetchExample = `fetch('${endpoint}?date=2026-07-03')
  .then((res) => res.json())
  .then((data) => {
    console.log(data.lunar.day + '/' + data.lunar.month + ' âm lịch');
    console.log('Giờ tốt:', data.goodHoursText);
  });`;

const curlExample = `curl '${endpoint}?date=2026-07-03&format=json'`;

export default function ApiLichAmPage() {
  const today = getVietnamTodayParts();
  const todayIso = `${today.year}-${String(today.month).padStart(2, "0")}-${String(today.day).padStart(2, "0")}`;

  const jsonLd = [
    webPageSchema({
      name: "API lịch âm miễn phí",
      url: `${siteConfig.url}/api-lich-am`,
      description: "Tài liệu API lịch âm Việt Nam, ngày tốt xấu và giờ hoàng đạo.",
      breadcrumb: [{ name: "Widget", url: `${siteConfig.url}/widget` }],
    }),
    faqSchema([
      { q: "API lịch âm có cần API key không?", a: "Không. Endpoint hiện tại có thể gọi trực tiếp để lấy dữ liệu JSON hoặc iCal cơ bản." },
      { q: "API trả về những dữ liệu nào?", a: "API trả ngày dương, ngày âm, can chi, chất lượng ngày, giờ hoàng đạo, tiết khí, số ngày còn lại đến Tết và thông tin nguồn." },
      { q: "Có thể nhúng dữ liệu này vào website không?", a: "Có. Bạn có thể dùng API hoặc widget iframe, vui lòng giữ nguồn Ngaygio.vn khi hiển thị lại dữ liệu." },
    ]),
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "API lịch âm Ngaygio.vn",
      url: `${siteConfig.url}/api-lich-am`,
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "VND" },
      inLanguage: "vi-VN",
      description: "API lịch âm Việt Nam dạng JSON/iCal cho website và ứng dụng.",
    },
  ];

  return (
    <>
      <Header currentYear={today.year} />
      <main className="container mainStack">
        <section className="heroCard" aria-labelledby="api-title">
          <p className="eyebrow">Dành cho developer</p>
          <h1 id="api-title">API lịch âm miễn phí cho website và ứng dụng</h1>
          <p className="converterIntro yearIntroText">Lấy dữ liệu ngày âm, can chi, ngày tốt xấu, giờ hoàng đạo và đếm ngày đến Tết bằng JSON. Có thể dùng để nhúng lịch âm vào blog, app nội bộ, landing page hoặc widget cá nhân.</p>
          <div className="activityHeroBadges">
            <span>JSON</span>
            <span>iCal .ics</span>
            <span>CORS mở</span>
            <span>Không cần API key</span>
          </div>
        </section>

        <section className="panelCard" aria-labelledby="endpoint-title">
          <p className="eyebrow">Endpoint</p>
          <h2 id="endpoint-title">Cách gọi API</h2>
          <pre className="codeBlock" style={{ background: "var(--surface2)", padding: "12px", borderRadius: "8px", overflow: "auto", fontSize: "0.86rem" }}><code>{`GET ${endpoint}
GET ${endpoint}?date=${todayIso}
GET ${endpoint}?date=2026-07-03&format=json
GET ${endpoint}?date=2026-07-03&format=ics`}</code></pre>
          <p className="smallNote">Tham số <strong>date</strong> dùng định dạng YYYY-MM-DD. Nếu không truyền date, API tự lấy ngày hiện tại theo Việt Nam.</p>
        </section>

        <section className="panelCard" aria-labelledby="api-fields-title">
          <p className="eyebrow">Dữ liệu trả về</p>
          <h2 id="api-fields-title">Các trường chính trong response</h2>
          <div style={{ overflowX: "auto" }}>
            <table className="seoDataTable">
              <thead><tr><th>Trường</th><th>Ý nghĩa</th><th>Ví dụ sử dụng</th></tr></thead>
              <tbody>
                <tr><td><strong>lunar</strong></td><td>Ngày, tháng, năm âm lịch và thông tin tháng nhuận.</td><td>Hiển thị âm lịch hôm nay.</td></tr>
                <tr><td><strong>canChi</strong></td><td>Can chi ngày, tháng, năm.</td><td>Tra ngày Bính Tý, tháng Mậu Ngọ...</td></tr>
                <tr><td><strong>quality</strong></td><td>Nhãn ngày tốt/xấu và ghi chú.</td><td>Làm thẻ “ngày hoàng đạo/hắc đạo”.</td></tr>
                <tr><td><strong>goodHours</strong></td><td>Danh sách giờ hoàng đạo trong ngày.</td><td>Gợi ý giờ xuất hành, mở hàng.</td></tr>
                <tr><td><strong>tetDaysLeft</strong></td><td>Số ngày còn lại đến Tết âm lịch gần nhất.</td><td>Widget đếm ngược Tết.</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="panelCard" aria-labelledby="examples-title">
          <p className="eyebrow">Ví dụ code</p>
          <h2 id="examples-title">JavaScript và cURL</h2>
          <h3>JavaScript</h3>
          <pre className="codeBlock" style={{ background: "var(--surface2)", padding: "12px", borderRadius: "8px", overflow: "auto", fontSize: "0.86rem" }}><code>{fetchExample}</code></pre>
          <h3 style={{ marginTop: 16 }}>cURL</h3>
          <pre className="codeBlock" style={{ background: "var(--surface2)", padding: "12px", borderRadius: "8px", overflow: "auto", fontSize: "0.86rem" }}><code>{curlExample}</code></pre>
          <h3 style={{ marginTop: 16 }}>Response mẫu</h3>
          <pre className="codeBlock" style={{ background: "var(--surface2)", padding: "12px", borderRadius: "8px", overflow: "auto", fontSize: "0.86rem" }}><code>{sampleJson}</code></pre>
        </section>

        <section className="panelCard activitySeoLinks" aria-labelledby="api-links-title">
          <p className="eyebrow">Liên kết liên quan</p>
          <h2 id="api-links-title">Widget và công cụ dùng chung dữ liệu</h2>
          <div className="dayLinkList">
            <Link href="/widget" className="eventPill blue">Widget lịch âm</Link>
            <Link href="/widget/lunar-today" className="eventPill blue">Preview widget âm lịch</Link>
            <Link href="/tai-lich-am-pdf" className="eventPill blue">Tải lịch âm PDF</Link>
            <a href={`${endpoint}?date=${todayIso}`} className="eventPill green">Xem JSON hôm nay</a>
            <a href={`${endpoint}?date=${todayIso}&format=ics`} className="eventPill green">Tải iCal hôm nay</a>
          </div>
        </section>

        <article className="seoArticle">
          <h2>Khi nào nên dùng API lịch âm?</h2>
          <p>API phù hợp khi anh muốn nhúng lịch âm vào website riêng, tạo widget nội bộ, hiển thị giờ hoàng đạo trong app hoặc làm thẻ đếm ngược Tết. Với website tĩnh, cách đơn giản nhất là gọi JSON bằng JavaScript phía trình duyệt.</p>
          <h2>Lưu ý sử dụng</h2>
          <p>Dữ liệu lịch âm, ngày tốt xấu và giờ hoàng đạo trên Ngaygio.vn mang tính tham khảo văn hóa dân gian. Khi hiển thị lại dữ liệu, nên ghi nguồn Ngaygio.vn và không dùng kết quả thay cho tư vấn chuyên môn trong các việc pháp lý, tài chính, y tế hoặc xây dựng.</p>
        </article>
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
