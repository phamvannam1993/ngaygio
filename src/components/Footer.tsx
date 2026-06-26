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
          <Link href="/am-lich-hom-nay">Âm lịch hôm nay</Link>
          <Link href="/lich-van-nien">Lịch vạn niên</Link>
          <Link href={`/am-lich/nam/${currentYear}`}>Lịch âm {currentYear}</Link>
        </div>
        <div>
          <h2>Ngày tốt · Giờ tốt</h2>
          <Link href="/ngay-tot-xau-hom-nay">Ngày tốt xấu hôm nay</Link>
          <Link href="/gio-hoang-dao-hom-nay">Giờ hoàng đạo hôm nay</Link>
          <Link href="/ngay-tot-xau">Xem ngày tốt xấu theo ngày</Link>
          <Link href="/gio-hoang-dao">Xem giờ hoàng đạo theo ngày</Link>
          <Link href="/con-bao-nhieu-ngay-den-tet">Còn bao nhiêu ngày đến Tết</Link>
          <Link href={`/tet/${currentYear + 1}`}>Tết {currentYear + 1} ngày nào?</Link>
        </div>
        <div>
          <h2>Công cụ</h2>
          <Link href="/chuyen-doi-lich">Đổi ngày âm dương</Link>
          <Link href="/sinh-nam/1990">Sinh năm bao nhiêu tuổi</Link>
          <Link href="/tinh-tuoi-am">Tính tuổi âm</Link>
          <Link href="/dem-ngay">Đếm ngày</Link>
          <Link href="/lich-nghi-le">Lịch nghỉ lễ</Link>
          <Link href="/nhac-ngay-gio">Nhắc ngày giờ</Link>
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
