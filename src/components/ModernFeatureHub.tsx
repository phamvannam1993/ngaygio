import Link from "next/link";
import { ACTIVITIES, activityHref } from "@/lib/calendar/activity";

const primaryTools = [
  { href: "/xem-ngay-tot", icon: "✨", title: "Tìm ngày tốt theo việc", desc: "Khai trương, cưới hỏi, động thổ, nhập trạch, mua xe." },
  { href: "/xem-ngay-tot-theo-tuoi", icon: "🧿", title: "Xem ngày hợp tuổi", desc: "Nhập năm sinh để lọc ngày xung hợp và chấm điểm 100." },
  { href: "/tao-anh-lich", icon: "🖼️", title: "Tạo ảnh lịch chia sẻ", desc: "Xuất ảnh lịch hôm nay để đăng Facebook, Zalo, fanpage." },
  { href: "/tai-lich-am-pdf", icon: "🖨️", title: "Tải/In lịch âm", desc: "In lịch tháng, lưu PDF bằng trình duyệt, dùng cho gia đình." },
  { href: "/nhac-ngay-gio", icon: "🔔", title: "Nhắc ngày âm", desc: "Giỗ, rằm, mùng 1, sinh nhật âm và lịch nhắc cá nhân." },
  { href: "/dem-ngay-su-kien", icon: "⏳", title: "Đếm ngày sự kiện", desc: "Tết, Trung thu, Vu Lan, Thần Tài, Noel và ngày lễ lớn." },
];

export function ModernFeatureHub() {
  return (
    <section className="modernHub" aria-labelledby="modern-hub-title">
      <div className="modernHubHero">
        <p className="eyebrow">Bộ công cụ mới</p>
        <h2 id="modern-hub-title">Chọn ngày đẹp nhanh hơn, rõ lý do hơn</h2>
        <p>Ngaygio.vn được mở rộng thành bộ công cụ lịch âm hiện đại: tìm ngày theo mục đích, lọc theo tuổi, tạo ảnh chia sẻ, in lịch PDF và nhắc ngày âm.</p>
        <div className="heroCtaRow">
          <Link href="/xem-ngay-tot">Tìm ngày đẹp ngay</Link>
          <Link href="/tao-anh-lich" className="ghostCta">Tạo ảnh lịch</Link>
        </div>
      </div>
      <div className="modernToolGrid">
        {primaryTools.map((tool) => (
          <Link className="modernToolCard" href={tool.href} key={tool.href}>
            <span>{tool.icon}</span>
            <strong>{tool.title}</strong>
            <p>{tool.desc}</p>
          </Link>
        ))}
      </div>
      <div className="activityChipCloud" aria-label="Các việc có thể xem ngày tốt">
        {ACTIVITIES.map((activity) => (
          <Link href={activityHref(activity.slug)} key={activity.slug}>{activity.icon} {activity.shortTitle}</Link>
        ))}
      </div>
    </section>
  );
}
