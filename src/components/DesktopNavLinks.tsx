"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LICH_AM_PATHS = ["/am-lich", "/lich-van-nien", "/am-lich-hom-nay", "/lich-am"];
const TU_VI_PATHS = ["/tu-vi", "/tu-vi-hom-nay", "/tu-vi-12-con-giap", "/tu-vi-tuoi", "/lap-la-so-tu-vi", "/la-so-tu-vi"];
const CONG_CU_PATHS = [
  "/chuyen-doi-lich", "/tinh-tuoi-am", "/xem-ngay-tot", "/dem-ngay",
  "/lich-nghi-le", "/con-bao-nhieu-ngay-den-tet", "/tao-anh-lich",
  "/tai-lich-am-pdf", "/nhac-ngay-gio", "/time-in-vietnam", "/sinh-nam", "/lap-la-so-tu-vi", "/la-so-tu-vi",
];

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(href + "/");
}

type Props = {
  currentYear: number;
  currentMonth: number;
};

export function DesktopNavLinks({ currentYear, currentMonth }: Props) {
  const pathname = usePathname();

  const lichAmActive = LICH_AM_PATHS.some((p) => pathname.startsWith(p));
  const tuViActive = TU_VI_PATHS.some((p) => pathname.startsWith(p));
  const congCuActive = CONG_CU_PATHS.some((p) => pathname.startsWith(p));

  return (
    <nav className="desktopNav" aria-label="Điều hướng chính">
      <Link href="/lich-hom-nay" className={isActive(pathname, "/lich-hom-nay") ? "navActive" : undefined}>Lịch hôm nay</Link>

      <details className={`navDropdown${lichAmActive ? " navActive" : ""}`}>
        <summary className={lichAmActive ? "navActive" : undefined}>Lịch âm</summary>
        <div className="dropdownMenu compactMenu">
          <Link href="/am-lich-hom-nay">Âm lịch hôm nay</Link>
          <Link href="/lich-van-nien">Lịch vạn niên</Link>
          <Link href={`/am-lich/nam/${currentYear}`}>Lịch âm {currentYear}</Link>
          <Link href={`/am-lich/nam/${currentYear}/thang/${currentMonth}`}>Tháng {currentMonth}/{currentYear}</Link>
          <Link href={`/am-lich/nam/${currentYear - 1}`}>Lịch âm {currentYear - 1}</Link>
          <Link href={`/am-lich/nam/${currentYear + 1}`}>Lịch âm {currentYear + 1}</Link>
        </div>
      </details>

      <Link href="/gio-hoang-dao" className={isActive(pathname, "/gio-hoang-dao") ? "navActive" : undefined}>Giờ hoàng đạo</Link>
      <Link href="/ngay-tot-xau" className={isActive(pathname, "/ngay-tot-xau") || isActive(pathname, "/xem-ngay-tot") ? "navActive" : undefined}>Ngày tốt xấu</Link>
      <Link href="/tu-vi-hom-nay" className={tuViActive ? "navActive" : undefined}>Tử vi</Link>
      <Link href="/lich-van-nien" className={isActive(pathname, "/lich-van-nien") ? "navActive" : undefined}>Lịch vạn niên</Link>

      <details className={`navDropdown${congCuActive ? " navActive" : ""}`}>
        <summary className={congCuActive ? "navActive" : undefined}>Công cụ</summary>
        <div className="dropdownMenu">
          <Link href="/chuyen-doi-lich">Đổi ngày âm dương</Link>
          <Link href="/tinh-tuoi-am">Xem tuổi</Link>
          <Link href="/xem-ngay-tot">Tìm ngày tốt theo việc</Link>
          <Link href="/xem-ngay-tot-theo-tuoi">Xem ngày tốt theo tuổi</Link>
          <Link href="/lap-la-so-tu-vi">Lập lá số tử vi</Link>
          <Link href="/dem-ngay">Đếm ngày</Link>
          <Link href="/lich-nghi-le">Lịch nghỉ lễ</Link>
          <Link href="/con-bao-nhieu-ngay-den-tet">Đếm ngày đến Tết</Link>
          <Link href="/tao-anh-lich">Tạo ảnh lịch</Link>
          <Link href="/tai-lich-am-pdf">Tải lịch PDF</Link>
        </div>
      </details>

      <Link href="/lich-nghi-le" className={isActive(pathname, "/lich-nghi-le") ? "navActive" : undefined}>Tin tức</Link>
    </nav>
  );
}
