import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { Logo } from "./Logo";
import { SiteIcon } from "./Icon";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="siteFooter">
      <div className="container footerGrid">
        <div className="footerBrand">
          <Logo />
          <p>
            Công cụ xem ngày tốt xấu, giờ hoàng đạo, lịch âm dương chính xác, dễ dùng cho mọi người.
          </p>
          <div className="footerSocials" aria-label="Mạng xã hội">
            <span><SiteIcon name="facebook" /></span><span><SiteIcon name="youtube" /></span><span><SiteIcon name="zalo" /></span><span><SiteIcon name="tiktok" /></span>
          </div>
        </div>
        <div>
          <h2>Về NgayGio.vn</h2>
          <Link href="/">Trang chủ</Link>
          <Link href="/lich-hom-nay">Lịch hôm nay</Link>
          <Link href="/am-lich-hom-nay">Âm lịch hôm nay</Link>
          <Link href="/lich-van-nien">Lịch vạn niên</Link>
        </div>
        <div>
          <h2>Công cụ</h2>
          <Link href="/gio-hoang-dao">Giờ hoàng đạo</Link>
          <Link href="/ngay-tot-xau">Ngày tốt xấu</Link>
          <Link href="/chuyen-doi-lich">Đổi ngày âm dương</Link>
          <Link href="/tinh-tuoi-am">Xem tuổi âm</Link>
          <Link href="/con-bao-nhieu-ngay-den-tet">Đếm ngày đến Tết</Link>
        </div>
        <div>
          <h2>Hỗ trợ</h2>
          <Link href="/lich-nghi-le">Lịch nghỉ lễ</Link>
          <Link href="/tai-lich-am-pdf">Tải lịch PDF</Link>
          <Link href="/tao-anh-lich">Tạo ảnh lịch</Link>
          <Link href={`/tet/${currentYear + 1}`}>Tết {currentYear + 1}</Link>
        </div>
        <div className="footerContact">
          <h2>Kết nối với chúng tôi</h2>
          <p><strong>Website:</strong> {siteConfig.domain}</p>
          <p><strong>Email:</strong> {siteConfig.email}</p>
          <p>{siteConfig.slogan}</p>
        </div>
      </div>
      <div className="copyright">© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</div>
    </footer>
  );
}
