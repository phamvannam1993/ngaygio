import Link from "next/link";
import { DateConverter } from "./DateConverter";
import { LiveClock } from "./LiveClock";
import { Logo } from "./Logo";

type HeaderProps = {
  currentYear: number;
};

export function Header({ currentYear }: HeaderProps) {
  const currentMonth = new Date().getMonth() + 1;
  const yearLinks = [currentYear - 1, currentYear, currentYear + 1];

  return (
    <header className="siteHeader">
      <div className="container headerInner">
        <Logo />

        <nav className="desktopNav" aria-label="Điều hướng chính">
          <Link href="/lich-hom-nay">Hôm nay</Link>
          <details className="navDropdown">
            <summary>Lịch âm</summary>
            <div className="dropdownMenu compactMenu">
              <Link href="/am-lich-hom-nay">Âm lịch hôm nay</Link>
              <Link href="/lich-van-nien">Lịch vạn niên</Link>
              <Link href={`/am-lich/nam/${currentYear}`}>Lịch âm {currentYear}</Link>
              <Link href={`/am-lich/nam/${currentYear}/thang/${currentMonth}`}>Tháng {currentMonth}/{currentYear}</Link>
              <Link href={`/am-lich/nam/${currentYear - 1}`}>Lịch âm {currentYear - 1}</Link>
              <Link href={`/am-lich/nam/${currentYear + 1}`}>Lịch âm {currentYear + 1}</Link>
            </div>
          </details>
          <Link href="/ngay-tot-xau-hom-nay">Ngày tốt xấu</Link>
          <Link href="/gio-hoang-dao-hom-nay">Giờ tốt xấu</Link>
          <details className="navDropdown">
            <summary>Tiện ích</summary>
            <div className="dropdownMenu compactMenu">
              <Link href="/chuyen-doi-lich">Đổi ngày âm dương</Link>
              <Link href="/tinh-tuoi-am">Tính tuổi âm</Link>
              <Link href="/dem-ngay">Đếm ngày</Link>
              <Link href="/lich-nghi-le">Lịch nghỉ lễ</Link>
              <Link href="/con-bao-nhieu-ngay-den-tet">Đếm ngày đến Tết</Link>
              <Link href="/time-in-vietnam">Time in Vietnam</Link>
            </div>
          </details>
        </nav>

        <details className="mobileNav">
          <summary aria-label="Mở menu điều hướng">☰ Menu</summary>
          <nav className="mobileNavPanel" aria-label="Menu mobile">
            <Link href="/lich-hom-nay">Lịch hôm nay</Link>
            <Link href="/am-lich-hom-nay">Âm lịch hôm nay</Link>
            <Link href="/ngay-tot-xau-hom-nay">Ngày tốt xấu hôm nay</Link>
            <Link href="/gio-hoang-dao-hom-nay">Giờ tốt xấu hôm nay</Link>

            <details className="mobileSubMenu">
              <summary>Lịch âm theo năm</summary>
              <div className="mobileLinkGrid yearMobileGrid">
                {yearLinks.map((year) => (
                  <Link key={year} href={`/am-lich/nam/${year}`}>{year}</Link>
                ))}
                <Link href="/lich-van-nien">Vạn niên</Link>
                <Link href={`/am-lich/nam/${currentYear}/thang/${currentMonth}`}>Tháng này</Link>
              </div>
            </details>

            <details className="mobileSubMenu">
              <summary>Công cụ</summary>
              <div className="mobileLinkGrid">
                <Link href="/chuyen-doi-lich">Đổi lịch</Link>
                <Link href="/tinh-tuoi-am">Tính tuổi</Link>
                <Link href="/dem-ngay">Đếm ngày</Link>
                <Link href="/lich-nghi-le">Nghỉ lễ</Link>
                <Link href="/con-bao-nhieu-ngay-den-tet">Đến Tết</Link>
                <Link href="/time-in-vietnam">Giờ VN</Link>
              </div>
            </details>
          </nav>
        </details>

        <div className="headerActions" aria-label="Giờ Việt Nam và đổi ngày nhanh">
          <LiveClock />
          <DateConverter />
        </div>
      </div>
    </header>
  );
}
