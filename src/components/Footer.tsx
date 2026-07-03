import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { Logo } from "./Logo";
import { SiteIcon } from "./Icon";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="siteFooter">
      <div className="container footerGrid">
        {/* Brand */}
        <div className="footerBrand">
          <Logo />
          <p>Công cụ xem ngày tốt xấu, giờ hoàng đạo, lịch âm dương chính xác, dễ dùng cho mọi người.</p>
          <div className="footerSocials" aria-label="Mạng xã hội">
            <span><SiteIcon name="facebook" /></span>
            <span><SiteIcon name="youtube" /></span>
            <span><SiteIcon name="zalo" /></span>
            <span><SiteIcon name="tiktok" /></span>
          </div>
        </div>

        {/* Cột 1 – Lịch */}
        <div>
          <h2>Lịch</h2>
          <Link href="/">Trang chủ</Link>
          <Link href="/lich-hom-nay">Lịch hôm nay</Link>
          <Link href="/am-lich-hom-nay">Âm lịch hôm nay</Link>
          <Link href="/lich-van-nien">Lịch vạn niên</Link>
          <Link href="/gio-hoang-dao">Giờ hoàng đạo</Link>
          <Link href="/ngay-tot-xau">Ngày tốt xấu</Link>
          <Link href="/lich-nghi-le">Lịch nghỉ lễ</Link>
          <Link href={`/tet/${currentYear + 1}`}>Tết {currentYear + 1}</Link>
        </div>

        {/* Cột 2 – Tử vi & Tuổi */}
        <div>
          <h2>Tử vi &amp; Tuổi</h2>
          <Link href="/tu-vi-hom-nay">Tử vi hôm nay</Link>
          <Link href="/lap-la-so-tu-vi">Lập lá số tử vi</Link>
          <Link href="/xem-tuoi-hop">Xem tuổi hợp</Link>
          <Link href="/xem-tuoi-hop-lam-an">Tuổi hợp làm ăn</Link>
          <Link href="/xem-tuoi-vo-chong">Tuổi vợ chồng</Link>
          <Link href="/xem-tuoi-lam-nha">Tuổi làm nhà</Link>
          <Link href={`/tuoi-lam-nha/${currentYear}`}>Bảng tuổi làm nhà {currentYear}</Link>
          <Link href="/phong-thuy-theo-tuoi">Phong thủy theo tuổi</Link>
        </div>

        {/* Cột 3 – Công cụ */}
        <div>
          <h2>Công cụ</h2>
          <Link href="/chuyen-doi-lich">Đổi ngày âm dương</Link>
          <Link href="/tinh-tuoi-am">Tính tuổi âm</Link>
          <Link href="/xem-ngay-tot">Ngày tốt theo việc</Link>
          <Link href="/xem-ngay-tot-theo-tuoi">Ngày tốt theo tuổi</Link>
          <Link href="/dem-ngay">Đếm ngày</Link>
          <Link href="/con-bao-nhieu-ngay-den-tet">Đếm ngày đến Tết</Link>
          <Link href="/tai-lich-am-pdf">Tải lịch PDF</Link>
          <Link href={`/tai-lich-am/${currentYear}`}>Tải lịch âm {currentYear}</Link>
          <Link href="/api-lich-am">API lịch âm</Link>
          <Link href="/tao-anh-lich">Tạo ảnh lịch</Link>
        </div>

        {/* Kết nối */}
        <div className="footerContact">
          <h2>Kết nối</h2>
          <p><strong>Website:</strong> {siteConfig.domain}</p>
          <p><strong>Email:</strong> {siteConfig.email}</p>
          <p className="footerSlogan">{siteConfig.slogan}</p>
        </div>
      </div>
      <div className="copyright">© {currentYear} {siteConfig.name}. All rights reserved.</div>
    </footer>
  );
}
