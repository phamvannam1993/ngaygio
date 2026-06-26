import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { Logo } from "./Logo";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="siteFooter">
      <div className="container footerGrid">
        <div>
          <Logo />
          <p>
            {siteConfig.domain} là công cụ xem lịch âm, lịch dương, lịch vạn niên và giờ hoàng đạo dành cho người Việt.
          </p>
        </div>
        <div>
          <h2>Lịch vạn niên</h2>
          <Link href="/lich-hom-nay">Lịch hôm nay</Link>
          <Link href="/lich-van-nien">Lịch vạn niên</Link>
          <Link href={`/am-lich/nam/${currentYear}`}>Lịch âm {currentYear}</Link>
        </div>
        <div>
          <h2>Tiện ích</h2>
          <Link href="/chuyen-doi-lich">Đổi ngày âm dương</Link>
          <Link href="/tinh-tuoi-am">Đổi tuổi / tính tuổi âm</Link>
          <Link href="/gio-hoang-dao">Giờ hoàng đạo</Link>
          <Link href="/ngay-tot-xau">Ngày tốt xấu</Link>
          <Link href="/dem-ngay">Đếm ngày</Link>
          <Link href="/lich-nghi-le">Lịch nghỉ lễ</Link>
          <Link href="/nhac-ngay-gio">Nhắc ngày giờ</Link>
          <Link href="/am-lich-hom-nay">Âm lịch hôm nay</Link>
        </div>
        <div>
          <h2>Liên hệ</h2>
          <p>{siteConfig.email}</p>
          <p>{siteConfig.slogan}</p>
        </div>
      </div>
      <div className="copyright">© {new Date().getFullYear()} {siteConfig.name}</div>
    </footer>
  );
}
