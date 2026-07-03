"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LICH_AM_PATHS = ["/am-lich", "/am-lich-hom-nay", "/lich-am", "/lich-van-nien"];
const TU_VI_PATHS = ["/tu-vi", "/tu-vi-hom-nay", "/tu-vi-12-con-giap", "/tu-vi-tuoi", "/lap-la-so-tu-vi", "/la-so-tu-vi"];
const CONG_CU_PATHS = [
  "/chuyen-doi-lich", "/tinh-tuoi-am", "/xem-ngay-tot", "/dem-ngay",
  "/con-bao-nhieu-ngay-den-tet", "/tao-anh-lich",
  "/tai-lich-am-pdf", "/tai-lich-am", "/api-lich-am", "/nhac-ngay-gio", "/time-in-vietnam", "/sinh-nam",
  "/xem-tuoi-hop", "/xem-tuoi-hop-lam-an", "/xem-tuoi-vo-chong",
  "/xem-tuoi-sinh-con", "/xem-tuoi-lam-nha", "/xem-tuoi-hop-mau-gi",
  "/xem-tuoi-hop-huong-nao", "/phong-thuy-theo-tuoi", "/tuoi-lam-nha",
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

      <details className={`navDropdown${congCuActive ? " navActive" : ""}`}>
        <summary className={congCuActive ? "navActive" : undefined}>Công cụ</summary>
        <div className="dropdownMenu">
          <Link href="/xem-tuoi-hop">Xem tuổi hợp</Link>
          <Link href="/xem-tuoi-hop-lam-an">Tuổi hợp làm ăn</Link>
          <Link href="/xem-tuoi-vo-chong">Tuổi vợ chồng</Link>
          <Link href="/xem-tuoi-sinh-con">Tuổi sinh con</Link>
          <Link href="/xem-tuoi-lam-nha">Tuổi làm nhà</Link>
          <Link href={`/tuoi-lam-nha/${currentYear}`}>Bảng tuổi làm nhà</Link>
          <Link href="/xem-tuoi-hop-mau-gi">Hợp màu</Link>
          <Link href="/xem-tuoi-hop-huong-nao">Hợp hướng</Link>
          <Link href="/phong-thuy-theo-tuoi">Phong thủy tuổi</Link>
          <hr />
          <Link href="/chuyen-doi-lich">Đổi ngày âm dương</Link>
          <Link href="/tinh-tuoi-am">Tính tuổi âm</Link>
          <Link href="/xem-ngay-tot-theo-tuoi">Xem ngày tốt theo tuổi</Link>
          <Link href="/lap-la-so-tu-vi">Lập lá số tử vi</Link>
          <Link href="/dem-ngay">Đếm ngày</Link>
          <Link href="/lich-nghi-le">Lịch nghỉ lễ</Link>
          <Link href="/con-bao-nhieu-ngay-den-tet">Đếm ngày đến Tết</Link>
          <Link href="/tao-anh-lich">Tạo ảnh lịch</Link>
          <Link href="/tai-lich-am-pdf">Tải lịch PDF</Link>
          <Link href={`/tai-lich-am/${currentYear}`}>Tải lịch âm {currentYear}</Link>
          <Link href="/api-lich-am">API lịch âm</Link>
        </div>
      </details>

      <Link href="/lich-nghi-le" className={isActive(pathname, "/lich-nghi-le") ? "navActive" : undefined}>Tin tức</Link>
    </nav>
  );
}
