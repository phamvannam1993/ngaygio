const currentSolarYearForLinks = new Date().getFullYear();

export const siteConfig = {
  name: "Ngày Giờ",
  domain: "ngaygio.vn",
  url: "https://ngaygio.vn",
  slogan: "Xem lịch âm · ngày đẹp · giờ lành",
  author: "Ngày Giờ",
  email: "info.ngaygio@gmail.com",
  keywords: [
    "âm lịch hôm nay",
    "lịch âm",
    "ngày âm lịch",
    "ngày giờ",
    "ngày đẹp",
    "giờ lành",
    "lịch vạn niên",
    "giờ hoàng đạo",
    "đổi ngày âm dương",
    "tính tuổi âm",
    "đếm ngày",
    "lịch nghỉ lễ",
    "nhắc ngày giờ",
    "xem ngày tốt theo việc",
    "xem ngày tốt theo tuổi",
    "tử vi hôm nay",
    "tử vi 12 con giáp",
    "lập lá số tử vi",
    "lá số tử vi",
    "xem tuổi hợp",
    "xem tuổi hợp làm ăn",
    "xem tuổi vợ chồng",
    "xem tuổi sinh con",
    "xem tuổi làm nhà",
    "xem tuổi hợp màu gì",
    "xem tuổi hợp hướng nào",
    "thước lỗ ban",
    "thước lỗ ban online",
    "tra kích thước đẹp",
    "kích thước cửa đẹp",
    "kích thước bàn thờ đẹp",
    "tải lịch âm PDF",
    "tạo ảnh lịch",
    "tuổi làm nhà theo năm",
    "api lịch âm",
    "widget lịch âm",
  ],
};

export const mainNav = [
  { title: "Lịch hôm nay", href: "/lich-hom-nay" },
  { title: "Lịch vạn niên", href: "/lich-van-nien" },
  { title: "Ngày tốt xấu", href: "/ngay-tot-xau" },
  { title: "Tử vi", href: "/tu-vi-hom-nay" },
  { title: "Lập lá số", href: "/lap-la-so-tu-vi" },
  { title: "Xem tuổi hợp", href: "/xem-tuoi-hop" },
  { title: "Giờ hoàng đạo", href: "/gio-hoang-dao" },
  { title: "Đổi tuổi", href: "/tinh-tuoi-am" },
  { title: "Chuyển đổi lịch", href: "/chuyen-doi-lich" },
];

export const quickTools = [
  {
    title: "Âm lịch hôm nay",
    href: "/am-lich-hom-nay",
    description: "Xem nhanh ngày âm, can chi, tiết khí và giờ tốt trong ngày.",
  },
  {
    title: "Ngày tốt xấu hôm nay",
    href: "/ngay-tot-xau-hom-nay",
    description: "Hôm nay là ngày Hoàng Đạo hay Hắc Đạo? Xem ngay việc nên làm và tránh.",
  },
  {
    title: "Tìm ngày tốt theo việc",
    href: "/xem-ngay-tot",
    description: "Lọc ngày đẹp cho khai trương, cưới hỏi, động thổ, nhập trạch, mua xe và ký hợp đồng.",
  },
  {
    title: "Xem ngày tốt theo tuổi",
    href: "/xem-ngay-tot-theo-tuoi",
    description: "Nhập năm sinh để chọn ngày hợp tuổi, tránh ngày xung/hại và chấm điểm 100.",
  },
  {
    title: "Tử vi hôm nay 12 con giáp",
    href: "/tu-vi-hom-nay",
    description: "Xem tổng quan công việc, tài lộc, tình cảm, sức khỏe và giờ tốt cho từng con giáp.",
  },
  {
    title: "Lập lá số tử vi",
    href: "/lap-la-so-tu-vi",
    description: "Nhập ngày giờ sinh để dựng lá số 12 cung, Mệnh, Thân, đại vận và luận giải tham khảo.",
  },
  {
    title: "Tra cứu thần số học",
    href: "/than-so-hoc",
    description: "Nhập họ tên và ngày sinh để xem Số Đường Đời, Sứ Mệnh, Linh Hồn, Nhân Cách theo thần số học.",
  },
  {
    title: "Tuổi xông đất",
    href: "/tuoi-xong-dat",
    description: "Chọn tuổi xông đất, xông nhà hợp với gia chủ để đón năm mới nhiều may mắn.",
  },
  {
    title: "Ngày kiêng kỵ",
    href: "/ngay-kieng-ky",
    description: "Tra ngày Tam Nương, Nguyệt Kỵ, Dương Công Kỵ Nhật trong tháng để tránh việc lớn.",
  },
  {
    title: "Xem tuổi hợp làm ăn",
    href: "/xem-tuoi-hop-lam-an",
    description: "So sánh hai năm sinh để xem mức hợp tác kinh doanh theo can chi, địa chi và nạp âm.",
  },
  {
    title: "Xem tuổi vợ chồng",
    href: "/xem-tuoi-vo-chong",
    description: "Xem tuổi cưới hỏi, gia đạo và độ hòa hợp theo con giáp, thiên can, nạp âm.",
  },
  {
    title: "Xem tuổi làm nhà",
    href: "/xem-tuoi-lam-nha",
    description: "Kiểm tra Kim Lâu, Hoang Ốc, Tam Tai và gợi ý ngày động thổ hợp tuổi.",
  },
  {
    title: "Hợp màu, hợp hướng",
    href: "/phong-thuy-theo-tuoi",
    description: "Tra màu hợp tuổi, cung phi bát trạch và hướng tốt xấu theo năm sinh.",
  },
  {
    title: "Thước Lỗ Ban online",
    href: "/thuoc-lo-ban",
    description: "Tra kích thước cửa, bàn thờ, bậc thang, tủ kệ theo thước Lỗ Ban 52.2cm, 42.9cm và 38.8cm.",
  },
  {
    title: "Ngày tốt xấu ngày mai",
    href: "/ngay-tot-xau-ngay-mai",
    description: "Ngày mai tốt hay xấu? Xem trước để chuẩn bị việc quan trọng.",
  },
  {
    title: "Giờ tốt xấu hôm nay",
    href: "/gio-hoang-dao-hom-nay",
    description: "Xem giờ tốt hôm nay, giờ hoàng đạo, giờ hắc đạo theo can chi và lịch âm.",
  },
  {
    title: "Giờ tốt xấu ngày mai",
    href: "/gio-hoang-dao-ngay-mai",
    description: "Xem trước giờ tốt xấu ngày mai để chọn giờ xuất hành, khai trương.",
  },
  {
    title: "Còn bao nhiêu ngày đến Tết",
    href: "/con-bao-nhieu-ngay-den-tet",
    description: "Đếm ngược đến Tết Nguyên Đán, xem mùng 1 Tết năm nay là ngày dương nào.",
  },
  {
    title: "Lịch vạn niên",
    href: "/lich-van-nien",
    description: "Tra lịch âm dương theo ngày, tháng, năm — can chi, tiết khí, ngày tốt.",
  },
  {
    title: "Đổi ngày âm dương",
    href: "/chuyen-doi-lich",
    description: "Chuyển đổi ngày dương sang âm và ngược lại theo múi giờ Việt Nam.",
  },
  {
    title: "Sinh năm bao nhiêu tuổi",
    href: "/sinh-nam/1990",
    description: "Tính tuổi âm, tuổi mụ, can chi, con giáp và nạp âm theo năm sinh.",
  },
  {
    title: "Lịch nghỉ lễ",
    href: "/lich-nghi-le",
    description: "Tra cứu các ngày lễ Tết, ngày nghỉ và sự kiện nổi bật trong năm.",
  },
  {
    title: "Tạo ảnh lịch",
    href: "/tao-anh-lich",
    description: "Xuất ảnh lịch hôm nay 1200×630 để chia sẻ Facebook, Zalo hoặc website.",
  },
  {
    title: "Tải lịch âm PDF",
    href: "/tai-lich-am-pdf",
    description: "In lịch âm dương theo tháng hoặc lưu PDF trực tiếp từ trình duyệt.",
  },
  {
    title: "Bảng tuổi làm nhà theo năm",
    href: `/tuoi-lam-nha/${currentSolarYearForLinks}`,
    description: "Tra bảng Kim Lâu, Hoang Ốc, Tam Tai và tuổi đẹp làm nhà theo từng năm.",
  },
  {
    title: "API lịch âm miễn phí",
    href: "/api-lich-am",
    description: "Tài liệu API JSON/iCal để nhúng lịch âm, giờ hoàng đạo và đếm ngược Tết vào website.",
  },
  {
    title: "Tải lịch âm theo năm",
    href: `/tai-lich-am/${currentSolarYearForLinks}`,
    description: "Tải/in lịch âm dương cả năm, chọn từng tháng để lưu PDF nhanh.",
  },
];

// JSON-LD helpers
export function webPageSchema(opts: { name: string; url: string; description: string; breadcrumb?: { name: string; url: string }[] }) {
  const base = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: opts.name,
    url: opts.url,
    description: opts.description,
    inLanguage: "vi-VN",
    isPartOf: { "@type": "WebSite", name: siteConfig.name, url: siteConfig.url },
  };
  if (!opts.breadcrumb) return base;
  return {
    ...base,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Trang chủ", item: siteConfig.url },
        ...opts.breadcrumb.map((b, i) => ({ "@type": "ListItem", position: i + 2, name: b.name, item: b.url })),
      ],
    },
  };
}

export function faqSchema(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}
