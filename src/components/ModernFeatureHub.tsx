import Link from "next/link";
import { ACTIVITIES, activityHref } from "@/lib/calendar/activity";
import { ActivityIcon, SiteIcon, type SiteIconName } from "./Icon";

const primaryTools: Array<{ href: string; iconName: SiteIconName; title: string; desc: string }> = [
  { href: "/xem-ngay-tot", iconName: "sparkle", title: "Tìm ngày tốt theo việc", desc: "Khai trương, cưới hỏi, động thổ, nhập trạch, mua xe." },
  { href: "/xem-ngay-tot-theo-tuoi", iconName: "focus", title: "Xem ngày hợp tuổi", desc: "Nhập năm sinh để lọc ngày xung hợp và chấm điểm 100." },
  { href: "/tu-vi-hom-nay", iconName: "star", title: "Tử vi 12 con giáp", desc: "Xem vận trình hôm nay, giờ tốt, màu may mắn và điều nên tránh." },
  { href: "/lap-la-so-tu-vi", iconName: "bagua", title: "Lập lá số tử vi", desc: "Nhập ngày giờ sinh để dựng 12 cung, Mệnh, Thân và đại vận." },
  { href: "/xem-tuoi-hop-lam-an", iconName: "heart", title: "Tuổi hợp làm ăn", desc: "So sánh hai năm sinh theo can chi, nạp âm và ngũ hành." },
  { href: "/xem-tuoi-lam-nha", iconName: "home", title: "Tuổi làm nhà", desc: "Kiểm tra Kim Lâu, Hoang Ốc, Tam Tai và gợi ý ngày động thổ." },
  { href: "/phong-thuy-theo-tuoi", iconName: "compass", title: "Phong thủy theo tuổi", desc: "Xem màu hợp, hướng hợp và cung phi bát trạch theo năm sinh." },
  { href: "/tao-anh-lich", iconName: "image", title: "Tạo ảnh lịch chia sẻ", desc: "Xuất ảnh lịch hôm nay để đăng Facebook, Zalo, fanpage." },
  { href: "/tai-lich-am-pdf", iconName: "print", title: "Tải/In lịch âm", desc: "In lịch tháng, lưu PDF bằng trình duyệt, dùng cho gia đình." },
  { href: "/nhac-ngay-gio", iconName: "bell", title: "Nhắc ngày âm", desc: "Giỗ, rằm, mùng 1, sinh nhật âm và lịch nhắc cá nhân." },
  { href: "/dem-ngay-su-kien", iconName: "hourglass", title: "Đếm ngày sự kiện", desc: "Tết, Trung thu, Vu Lan, Thần Tài, Noel và ngày lễ lớn." },
];

export function ModernFeatureHub() {
  return (
    <section className="modernHub" aria-labelledby="modern-hub-title">
      <div className="modernHubHero">
        <p className="eyebrow">Bộ công cụ mới</p>
        <h2 id="modern-hub-title">Chọn ngày đẹp, xem tuổi và tử vi rõ lý do hơn</h2>
        <p>Ngaygio.vn được mở rộng thành bộ công cụ lịch âm hiện đại: tìm ngày theo mục đích, lọc theo tuổi, xem tuổi hợp, lập lá số tử vi, tạo ảnh chia sẻ, in lịch PDF và nhắc ngày âm.</p>
        <div className="heroCtaRow">
          <Link href="/xem-ngay-tot">Tìm ngày đẹp ngay</Link>
          <Link href="/tao-anh-lich" className="ghostCta">Tạo ảnh lịch</Link>
        </div>
      </div>
      <div className="modernToolGrid">
        {primaryTools.map((tool) => (
          <Link className="modernToolCard" href={tool.href} key={tool.href}>
            <span><SiteIcon name={tool.iconName} /></span>
            <strong>{tool.title}</strong>
            <p>{tool.desc}</p>
          </Link>
        ))}
      </div>
      <div className="activityChipCloud" aria-label="Các việc có thể xem ngày tốt">
        {ACTIVITIES.map((activity) => (
          <Link href={activityHref(activity.slug)} key={activity.slug}><ActivityIcon slug={activity.slug} /> {activity.shortTitle}</Link>
        ))}
      </div>
    </section>
  );
}
