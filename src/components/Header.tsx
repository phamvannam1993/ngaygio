import Link from "next/link";
import { Logo } from "./Logo";
import { DesktopNavLinks } from "./DesktopNavLinks";

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

        <DesktopNavLinks currentYear={currentYear} currentMonth={currentMonth} />

        <div className="headerIcons" aria-label="Tìm kiếm và tài khoản">
          <Link className="headerIconButton" href="/lich-van-nien" aria-label="Tìm kiếm lịch">
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
          </Link>
          <Link className="headerIconButton userIcon" href="/tinh-tuoi-am" aria-label="Xem tuổi">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 21a8 8 0 0 0-16 0"/><circle cx="12" cy="7" r="4"/></svg>
          </Link>
        </div>

        <details className="mobileNav">
          <summary aria-label="Mở menu điều hướng">☰</summary>
          <nav className="mobileNavPanel" aria-label="Menu mobile">
            <Link href="/lich-hom-nay">Lịch hôm nay</Link>
            <Link href="/am-lich-hom-nay">Âm lịch hôm nay</Link>
            <Link href="/ngay-tot-xau-hom-nay">Ngày tốt xấu hôm nay</Link>
            <Link href="/gio-hoang-dao-hom-nay">Giờ tốt xấu hôm nay</Link>
            <Link href="/lich-van-nien">Lịch vạn niên</Link>
            <Link href="/xem-ngay-tot">Tìm ngày tốt theo việc</Link>
            <Link href="/xem-ngay-tot-theo-tuoi">Xem ngày tốt theo tuổi</Link>
            <Link href="/tu-vi-hom-nay">Tử vi hôm nay</Link>
            <Link href="/lap-la-so-tu-vi">Lập lá số tử vi</Link>
            <Link href="/than-so-hoc">Thần số học</Link>
            <Link href="/ngay-kieng-ky">Ngày kiêng kỵ</Link>
            <Link href="/tuoi-xong-dat">Tuổi xông đất</Link>
            <Link href="/xem-tuoi-hop-lam-an">Tuổi hợp làm ăn</Link>
            <Link href="/xem-tuoi-vo-chong">Tuổi vợ chồng</Link>
            <Link href="/xem-tuoi-lam-nha">Tuổi làm nhà</Link>
            <Link href={`/tuoi-lam-nha/${currentYear}`}>Bảng tuổi làm nhà</Link>

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
                <Link href="/tinh-tuoi-am">Xem tuổi</Link>
                <Link href="/tu-vi-hom-nay">Tử vi</Link>
                <Link href="/lap-la-so-tu-vi">Lập lá số</Link>
                <Link href="/xem-tuoi-hop">Xem tuổi hợp</Link>
                <Link href="/xem-tuoi-hop-mau-gi">Hợp màu</Link>
                <Link href="/xem-tuoi-hop-huong-nao">Hợp hướng</Link>
                <Link href="/dem-ngay">Đếm ngày</Link>
                <Link href="/lich-nghi-le">Nghỉ lễ</Link>
                <Link href="/dem-ngay-su-kien">Sự kiện</Link>
                <Link href="/con-bao-nhieu-ngay-den-tet">Đến Tết</Link>
                <Link href="/nhac-ngay-gio">Nhắc âm</Link>
                <Link href="/tao-anh-lich">Tạo ảnh</Link>
                <Link href="/tai-lich-am-pdf">In PDF</Link>
                <Link href={`/tai-lich-am/${currentYear}`}>Lịch âm PDF năm</Link>
                <Link href="/api-lich-am">API lịch âm</Link>
                <Link href="/time-in-vietnam">Giờ VN</Link>
              </div>
            </details>
          </nav>
        </details>
      </div>
    </header>
  );
}
