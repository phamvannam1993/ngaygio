import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getVietnamTodayParts } from "@/lib/date";
import { amLichDayHref } from "@/lib/calendar/urls";
import { SiteIcon } from "@/components/Icon";

export default function NotFound() {
  const today = getVietnamTodayParts();

  return (
    <>
      <Header currentYear={today.year} />
      <main className="container notFoundMain">
        <div className="notFoundCard">
          <div className="notFoundCode">404</div>
          <h1 className="notFoundTitle">Không tìm thấy trang</h1>
          <p className="notFoundDesc">
            Trang bạn đang tìm không tồn tại hoặc đã được di chuyển.
            <br />
            Thử một trong các liên kết bên dưới nhé.
          </p>

          <div className="notFoundActions">
            <Link href="/" className="btn">Về trang chủ</Link>
            <Link href={amLichDayHref(today)} className="btn btn-secondary">Lịch âm hôm nay</Link>
          </div>

          <div className="notFoundLinks">
            <p className="notFoundLinksTitle">Trang thường dùng</p>
            <div className="notFoundGrid">
              <Link href="/lich-hom-nay">
                <span><SiteIcon name="calendar" /></span> Lịch hôm nay
              </Link>
              <Link href="/am-lich-hom-nay">
                <span><SiteIcon name="moon" /></span> Âm lịch hôm nay
              </Link>
              <Link href="/gio-hoang-dao">
                <span><SiteIcon name="clock" /></span> Giờ hoàng đạo
              </Link>
              <Link href="/ngay-tot-xau">
                <span><SiteIcon name="sparkle" /></span> Ngày tốt xấu
              </Link>
              <Link href="/lich-van-nien">
                <span><SiteIcon name="book" /></span> Lịch vạn niên
              </Link>
              <Link href="/chuyen-doi-lich">
                <span><SiteIcon name="converter" /></span> Đổi ngày âm dương
              </Link>
              <Link href="/dem-ngay">
                <span><SiteIcon name="number" /></span> Đếm ngày
              </Link>
              <Link href="/lich-nghi-le">
                <span><SiteIcon name="flag" /></span> Lịch nghỉ lễ
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
