import Link from "next/link";
import { DateConverter } from "./DateConverter";
import { LiveClock } from "./LiveClock";
import { Logo } from "./Logo";

type HeaderProps = {
  currentYear: number;
};

export function Header({ currentYear }: HeaderProps) {
  const currentMonth = new Date().getMonth() + 1;
  return (
    <header className="siteHeader">
      <div className="container headerInner">
        <Logo />

        <nav className="desktopNav" aria-label="Điều hướng chính">
          <Link href="/lich-hom-nay">Hôm nay</Link>
          <details className="navDropdown">
            <summary>Lịch âm</summary>
            <div className="dropdownMenu compactMenu">
              <Link href="/lich-van-nien">Lịch vạn niên</Link>
              <Link href={`/am-lich/nam/${currentYear}`}>Lịch âm {currentYear}</Link>
              <Link href={`/am-lich/nam/${currentYear}/thang/${currentMonth}`}>Tháng {currentMonth}/{currentYear}</Link>
              <Link href={`/am-lich/nam/${currentYear - 1}`}>Lịch âm {currentYear - 1}</Link>
              <Link href={`/am-lich/nam/${currentYear + 1}`}>Lịch âm {currentYear + 1}</Link>
            </div>
          </details>
          <Link href="/ngay-tot-xau">Ngày tốt xấu</Link>
          <Link href="/gio-hoang-dao">Giờ tốt</Link>
          <details className="navDropdown">
            <summary>Tiện ích</summary>
            <div className="dropdownMenu compactMenu">
              <Link href="/chuyen-doi-lich">Đổi ngày âm dương</Link>
              <Link href="/tinh-tuoi-am">Tính tuổi âm</Link>
              <Link href="/dem-ngay">Đếm ngày</Link>
              <Link href="/lich-nghi-le">Lịch nghỉ lễ</Link>
              <Link href="/nhac-ngay-gio">Nhắc ngày giờ</Link>
            </div>
          </details>
        </nav>

        <details className="mobileNav">
          <summary aria-label="Mở menu">☰ Menu</summary>
          <div className="mobileNavPanel">
            <Link href="/lich-hom-nay">Lịch hôm nay</Link>
            <Link href="/lich-van-nien">Lịch vạn niên</Link>
            <Link href={`/am-lich/nam/${currentYear}`}>Lịch âm {currentYear}</Link>
            <Link href="/ngay-tot-xau">Ngày tốt xấu</Link>
            <Link href="/gio-hoang-dao">Giờ hoàng đạo</Link>
            <Link href="/chuyen-doi-lich">Đổi ngày âm dương</Link>
            <Link href="/tinh-tuoi-am">Tính tuổi âm</Link>
            <Link href="/dem-ngay">Đếm ngày</Link>
            <Link href="/lich-nghi-le">Lịch nghỉ lễ</Link>
            <Link href="/nhac-ngay-gio">Nhắc ngày giờ</Link>
          </div>
        </details>

        <div className="headerActions">
          <LiveClock />
          <DateConverter />
        </div>
      </div>
    </header>
  );
}
