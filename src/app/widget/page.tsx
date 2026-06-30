import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getVietnamTodayParts } from "@/lib/date";
import { getTetInfo } from "@/lib/calendar/tet";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Widget lịch âm nhúng miễn phí – Ngaygio.vn",
  description: "Nhúng widget đếm ngược Tết, lịch âm hôm nay vào website của bạn miễn phí. Cung cấp code iframe và JSON API.",
  alternates: { canonical: `${siteConfig.url}/widget` },
  robots: { index: true, follow: true },
};

export default function WidgetPage() {
  const today = getVietnamTodayParts();
  const tet = getTetInfo(today);
  const widgetUrl = `${siteConfig.url}/widget/tet-countdown`;
  const lunarWidgetUrl = `${siteConfig.url}/widget/lunar-today`;
  const apiUrl = `${siteConfig.url}/api/lich-am`;

  const iframeCode = `<iframe
  src="${widgetUrl}"
  width="300"
  height="180"
  frameborder="0"
  scrolling="no"
  style="border-radius:12px;overflow:hidden;"
  title="Đếm ngược Tết – Ngaygio.vn"
></iframe>`;

  const lunarIframeCode = `<iframe
  src="${lunarWidgetUrl}"
  width="340"
  height="250"
  frameborder="0"
  scrolling="no"
  style="border-radius:16px;overflow:hidden;"
  title="Lịch âm hôm nay – Ngaygio.vn"
></iframe>`;

  const scriptCode = `<!-- Widget đếm ngược Tết – Ngaygio.vn -->
<div id="ngaygio-tet-widget"></div>
<script>
fetch('${apiUrl}?format=json')
  .then(r => r.json())
  .then(data => {
    document.getElementById('ngaygio-tet-widget').innerHTML =
      '<p>Còn <strong>' + data.tetDaysLeft + ' ngày</strong> nữa đến Tết ' +
      data.tetCanChi + ' ' + data.tetYear + '</p>';
  });
</script>`;

  return (
    <>
      <Header currentYear={today.year} />
      <main className="container mainStack">
        <section className="heroCard" aria-labelledby="widget-title">
          <p className="eyebrow">Công cụ miễn phí</p>
          <h1 id="widget-title">Widget lịch âm – Nhúng vào website của bạn</h1>
          <p style={{ marginTop: "8px", color: "var(--muted)" }}>
            Tất cả widget và API dưới đây miễn phí. Không cần đăng ký, không cần API key.
          </p>
        </section>

        <section className="panelCard" aria-labelledby="widget-tet-title">
          <p className="eyebrow">Widget 1 – Đếm ngược Tết</p>
          <h2 id="widget-tet-title">Widget đếm ngược Tết {tet.canChi} {tet.year}</h2>
          <p style={{ marginBottom: "16px" }}>Nhúng đồng hồ đếm ngược Tết vào website/blog của bạn bằng thẻ {"<iframe>"}. Tự động cập nhật hàng ngày.</p>

          <div style={{ marginBottom: "16px" }}>
            <iframe
              src={widgetUrl}
              width="300"
              height="180"
              style={{ border: "none", borderRadius: "12px", display: "block" }}
              scrolling="no"
              title="Preview widget đếm ngược Tết"
            />
          </div>

          <h3 style={{ marginBottom: "8px" }}>Code nhúng (iframe):</h3>
          <pre className="codeBlock" style={{ background: "var(--surface2)", padding: "12px", borderRadius: "8px", overflow: "auto", fontSize: "0.8rem" }}>
            <code>{iframeCode}</code>
          </pre>
        </section>

        <section className="panelCard" aria-labelledby="widget-lunar-title">
          <p className="eyebrow">Widget 2 – Lịch âm hôm nay</p>
          <h2 id="widget-lunar-title">Widget lịch âm hôm nay</h2>
          <p style={{ marginBottom: "16px" }}>Nhúng thẻ lịch âm có ngày dương, ngày âm, can chi, ngày hoàng đạo/hắc đạo và giờ tốt.</p>
          <div style={{ marginBottom: "16px" }}>
            <iframe
              src={lunarWidgetUrl}
              width="340"
              height="250"
              style={{ border: "none", borderRadius: "16px", display: "block" }}
              scrolling="no"
              title="Preview widget lịch âm hôm nay"
            />
          </div>
          <h3 style={{ marginBottom: "8px" }}>Code nhúng (iframe):</h3>
          <pre className="codeBlock" style={{ background: "var(--surface2)", padding: "12px", borderRadius: "8px", overflow: "auto", fontSize: "0.8rem" }}>
            <code>{lunarIframeCode}</code>
          </pre>
        </section>

        <section className="panelCard" aria-labelledby="widget-api-title">
          <p className="eyebrow">API JSON – Lịch âm hôm nay</p>
          <h2 id="widget-api-title">API lịch âm miễn phí</h2>
          <p style={{ marginBottom: "12px" }}>Dùng API JSON để lấy dữ liệu lịch âm theo ngày, tích hợp vào ứng dụng của bạn.</p>

          <h3 style={{ marginBottom: "8px" }}>Endpoint:</h3>
          <pre className="codeBlock" style={{ background: "var(--surface2)", padding: "12px", borderRadius: "8px", overflow: "auto", fontSize: "0.8rem" }}>
            <code>{`GET ${apiUrl}
GET ${apiUrl}?date=2026-06-26
GET ${apiUrl}?date=2026-06-26&format=json`}</code>
          </pre>

          <h3 style={{ marginTop: "16px", marginBottom: "8px" }}>Ví dụ tích hợp (JavaScript):</h3>
          <pre className="codeBlock" style={{ background: "var(--surface2)", padding: "12px", borderRadius: "8px", overflow: "auto", fontSize: "0.8rem" }}>
            <code>{scriptCode}</code>
          </pre>
        </section>

        <section className="panelCard" aria-labelledby="widget-ical-title">
          <p className="eyebrow">File lịch – iCal</p>
          <h2 id="widget-ical-title">Lịch ngày nghỉ Việt Nam (.ics)</h2>
          <p style={{ marginBottom: "12px" }}>Tải file lịch .ics để đăng ký lịch ngày lễ Việt Nam vào Google Calendar, Apple Calendar hoặc Outlook.</p>
          <div className="dayLinkList">
            <a href={`/api/lich-am?format=ics`} className="eventPill green" download="lich-am.ics">
              Tải file .ics lịch ngày hôm nay
            </a>
            <a href="/nhac-ngay-gio" className="eventPill blue">
              Tạo nhắc ngày giờ tuỳ chỉnh
            </a>
          </div>
        </section>

        <article className="seoArticle">
          <h2>Điều khoản sử dụng widget</h2>
          <p>Các widget và API trên Ngaygio.vn được cung cấp <strong>miễn phí cho mục đích cá nhân và phi thương mại</strong>. Khi nhúng widget vào website, vui lòng giữ nguyên link dẫn về Ngaygio.vn. Không sử dụng với mục đích thương mại hoặc phân phối lại dữ liệu hàng loạt.</p>
          <h2>Yêu cầu widget khác</h2>
          <p>Nếu bạn cần widget lịch âm dương, giờ hoàng đạo, hay dạng tùy chỉnh khác, vui lòng liên hệ qua email hoặc góp ý trên trang. Chúng tôi sẽ cân nhắc phát triển theo nhu cầu cộng đồng.</p>
        </article>
      </main>
      <Footer />
    </>
  );
}
