import type { Metadata } from "next";
import { CalendarPrintActions } from "@/components/CalendarPrintActions";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MonthCalendar } from "@/components/MonthCalendar";
import { MonthPicker } from "@/components/MonthPicker";
import { amLichDayHref } from "@/lib/calendar/urls";
import { getMonthCalendar } from "@/lib/calendar/service";
import { getVietnamTodayParts } from "@/lib/date";
import { siteConfig } from "@/lib/site";

type PageProps = { searchParams?: Promise<Record<string, string | string[] | undefined>> };

function single(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tải lịch âm PDF, in lịch âm dương theo tháng | Ngày Giờ",
  description: "Tải và in lịch âm dương theo tháng. Xem ngày âm, ngày dương, ngày tốt xấu và sự kiện nổi bật rồi lưu PDF bằng trình duyệt.",
  keywords: ["tải lịch âm pdf", "in lịch âm", "lịch âm dương tháng", "tải lịch tháng"],
  alternates: { canonical: "/tai-lich-am-pdf" },
  openGraph: {
    title: "Tải lịch âm PDF | Ngày Giờ",
    description: "In lịch âm dương theo tháng, lưu PDF miễn phí.",
    url: `${siteConfig.url}/tai-lich-am-pdf`,
    siteName: siteConfig.name,
    locale: "vi_VN",
    type: "website",
    images: [{ url: "/home.jpg", width: 1200, height: 630, alt: "Tải lịch âm PDF" }],
  },
};

export default async function TaiLichAmPdfPage({ searchParams }: PageProps) {
  const today = getVietnamTodayParts();
  const params = (await searchParams) ?? {};
  const monthValue = Number(single(params.month));
  const yearValue = Number(single(params.year));
  const month = Number.isInteger(monthValue) && monthValue >= 1 && monthValue <= 12 ? monthValue : today.month;
  const year = Number.isInteger(yearValue) && yearValue >= 1900 && yearValue <= 2050 ? yearValue : today.year;
  const calendar = getMonthCalendar(year, month, { year, month, day: 1 });

  return (
    <>
      <Header currentYear={year} />
      <main className="container mainStack printPage">
        <section className="heroCard noPrint" aria-labelledby="print-title">
          <p className="eyebrow">Tải / in lịch</p>
          <h1 id="print-title">Tải lịch âm tháng {month}/{year} dạng PDF</h1>
          <p className="converterIntro yearIntroText">Chọn tháng cần in, bấm “In / Lưu PDF”, sau đó chọn “Save as PDF” trong trình duyệt. Lịch giữ đầy đủ ngày dương, ngày âm, ngày tốt xấu và sự kiện nổi bật.</p>
        </section>
        <div className="twoColumns noPrint">
          <MonthPicker month={month} year={year} />
          <section className="panelCard">
            <p className="eyebrow">Thao tác</p>
            <h2>Xuất file từ trình duyệt</h2>
            <p className="converterIntro yearIntroText">Bạn có thể in ra A4 hoặc lưu PDF. Khi in, phần menu sẽ tự ẩn để bản lịch gọn hơn.</p>
            <CalendarPrintActions />
          </section>
        </div>
        <section className="printCalendarArea">
          <div className="printCalendarTitle">
            <h2>Lịch âm dương tháng {month}/{year}</h2>
            <p>{siteConfig.domain} · Thông tin lịch âm chỉ mang tính tham khảo văn hóa dân gian.</p>
          </div>
          <MonthCalendar calendar={calendar} makeHref={amLichDayHref} />
        </section>
      </main>
      <Footer />
    </>
  );
}
