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
    "tải lịch âm PDF",
    "tạo ảnh lịch",
  ],
};

export const mainNav = [
  { title: "Lịch hôm nay", href: "/lich-hom-nay" },
  { title: "Lịch vạn niên", href: "/lich-van-nien" },
  { title: "Ngày tốt xấu", href: "/ngay-tot-xau" },
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
