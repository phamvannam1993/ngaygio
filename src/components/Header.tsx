import Link from "next/link";
import { DateConverter } from "./DateConverter";
import { LiveClock } from "./LiveClock";
import { Logo } from "./Logo";

type HeaderProps = {
  currentYear: number;
};

function MonthLinks({ currentYear }: { currentYear: number }) {
  return (
    <>
      {Array.from({ length: 12 }, (_, index) => index + 1).map((month) => (
        <Link key={month} href={`/am-lich/nam/${currentYear}/thang/${month}`}>
          Tháng {month}/{currentYear}
        </Link>
      ))}
    </>
  );
}

function YearLinks({ currentYear }: { currentYear: number }) {
  const start = currentYear - 4;
  return (
    <>
      {Array.from({ length: 9 }, (_, index) => start + index).map((year) => (
        <Link key={year} href={`/am-lich/nam/${year}`}>
          {year}
        </Link>
      ))}
    </>
  );
}

export function Header({ currentYear }: HeaderProps) {
  return (
    <header className="siteHeader">
      <div className="container headerInner">
        <Logo />

        <nav className="desktopNav" aria-label="Điều hướng chính">
          <Link href="/lich-hom-nay">Hôm nay</Link>
          <details className="navDropdown">
            <summary>Lịch âm</summary>
            <div className="dropdownMenu megaMenu">
              <div>
                <strong>Tra nhanh</strong>
                <Link href="/lich-van-nien">Lịch vạn niên</Link>
                <Link href={`/am-lich/nam/${currentYear}`}>Lịch âm {currentYear}</Link>
                <Link href={`/am-lich/nam/${currentYear}/thang/${new Date().getMonth() + 1}`}>Tháng hiện tại</Link>
              </div>
              <div>
                <strong>Theo tháng</strong>
                <div className="menuGrid"><MonthLinks currentYear={currentYear} /></div>
              </div>
              <div>
                <strong>Theo năm</strong>
                <div className="menuGrid yearMenuGrid"><YearLinks currentYear={currentYear} /></div>
              </div>
            </div>
          </details>
          <Link href="/ngay-tot-xau">Ngày tốt xấu</Link>
          <Link href="/gio-hoang-dao">Giờ tốt</Link>
          <details className="navDropdown">
            <summary>Tiện ích</summary>
            <div className="dropdownMenu compactMenu">
              <Link href="/chuyen-doi-lich">Đổi ngày âm dương</Link>
              <Link href="/tinh-tuoi-am">Đổi tuổi</Link>
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
            <Link href="/chuyen-doi-lich">Chuyển đổi âm dương</Link>
            <Link href="/tinh-tuoi-am">Đổi tuổi / tính tuổi âm</Link>
            <Link href="/dem-ngay">Đếm ngày</Link>
            <Link href="/lich-nghi-le">Lịch nghỉ lễ</Link>
            <Link href="/nhac-ngay-gio">Nhắc ngày giờ</Link>
            <details className="mobileSubMenu">
              <summary>Lịch tháng {currentYear}</summary>
              <div className="mobileLinkGrid"><MonthLinks currentYear={currentYear} /></div>
            </details>
            <details className="mobileSubMenu">
              <summary>Lịch năm gần đây</summary>
              <div className="mobileLinkGrid yearMobileGrid"><YearLinks currentYear={currentYear} /></div>
            </details>
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
