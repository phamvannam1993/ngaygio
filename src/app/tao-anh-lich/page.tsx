import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ShareImageTool } from "@/components/ShareImageTool";
import { formatDisplayDate, getVietnamTodayParts, parseDateKey } from "@/lib/date";
import { formatHours } from "@/lib/calendar/can-chi";
import { getDayInfo } from "@/lib/calendar/service";
import { siteConfig } from "@/lib/site";

type PageProps = { searchParams?: Promise<Record<string, string | string[] | undefined>> };

function single(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tạo ảnh lịch âm hôm nay để chia sẻ Facebook, Zalo | Ngày Giờ",
  description: "Tạo ảnh lịch âm dương 1200x630 có ngày âm, ngày dương, can chi, giờ hoàng đạo để chia sẻ lên Facebook, Zalo hoặc website.",
  keywords: ["tạo ảnh lịch", "ảnh lịch âm", "lịch hôm nay ảnh", "chia sẻ lịch âm"],
  alternates: { canonical: "/tao-anh-lich" },
  openGraph: {
    title: "Tạo ảnh lịch âm để chia sẻ | Ngày Giờ",
    description: "Xuất ảnh lịch âm dương hôm nay 1200x630 miễn phí.",
    url: `${siteConfig.url}/tao-anh-lich`,
    siteName: siteConfig.name,
    locale: "vi_VN",
    type: "website",
    images: [{ url: "/home.jpg", width: 1200, height: 630, alt: "Tạo ảnh lịch âm" }],
  },
};

export default async function TaoAnhLichPage({ searchParams }: PageProps) {
  const today = getVietnamTodayParts();
  const params = (await searchParams) ?? {};
  const selectedDate = parseDateKey(single(params.date)) ?? today;
  const day = getDayInfo(selectedDate);

  return (
    <>
      <Header currentYear={selectedDate.year} />
      <main className="container mainStack">
        <div className="pageFullscreenBg" style={{ backgroundImage: "linear-gradient(90deg, rgba(255,255,255,.94) 0%, rgba(255,255,255,.82) 42%, rgba(255,255,255,.52) 100%), linear-gradient(180deg, rgba(245,251,247,.18) 0%, rgba(245,251,247,.9) 100%), url(/bg-page-calendar.png)" }} aria-hidden="true" />
        <section className="heroCard" aria-labelledby="share-image-title">
          <p className="eyebrow">Ảnh chia sẻ</p>
          <h1 id="share-image-title">Tạo ảnh lịch âm ngày {formatDisplayDate(selectedDate)}</h1>
          <p className="converterIntro yearIntroText">Chọn ngày, tạo ảnh lịch có ngày âm, ngày dương, can chi và giờ hoàng đạo. Phù hợp để đăng Facebook, Zalo, website hoặc gửi cho người thân.</p>
          <form className="compactDateForm shareDateForm" action="/tao-anh-lich" method="get">
            <label>
              <span>Chọn ngày</span>
              <input type="date" name="date" defaultValue={`${selectedDate.year}-${String(selectedDate.month).padStart(2, "0")}-${String(selectedDate.day).padStart(2, "0")}`} />
            </label>
            <button type="submit">Tạo ảnh</button>
          </form>
        </section>
        <ShareImageTool
          dateText={formatDisplayDate(selectedDate)}
          weekday={day.weekdayName}
          lunarText={`${day.lunar.day}/${day.lunar.month}/${day.lunar.year}${day.lunar.isLeap ? " nhuận" : ""}`}
          canChiDay={day.canChi.day}
          canChiMonth={day.canChi.month}
          canChiYear={day.canChi.year}
          qualityLabel={day.quality.label}
          goodHours={formatHours(day.goodHours)}
          siteName={siteConfig.domain}
        />
        <article className="seoArticle">
          <h2>Dùng ảnh lịch như thế nào?</h2>
          <p>Bạn có thể tải PNG để đăng mạng xã hội, dùng SVG cho website hoặc lưu làm ảnh minh họa bài viết ngày âm lịch. Nội dung trong ảnh được tạo từ dữ liệu lịch âm hiện có trên Ngaygio.vn.</p>
        </article>
      </main>
      <Footer />
    </>
  );
}
