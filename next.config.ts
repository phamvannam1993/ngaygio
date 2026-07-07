import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },

  async redirects() {
    return [
      // Synonym "giờ tốt hôm nay" gom về trang chính /gio-tot-hom-nay (giữ /gio-hoang-dao-hom-nay riêng)
      { source: "/gio-tot-xau-hom-nay", destination: "/gio-tot-hom-nay", permanent: true },
      { source: "/gio-dep-ngay-hom-nay", destination: "/gio-tot-hom-nay", permanent: true },
      { source: "/gio-dep-hom-nay", destination: "/gio-tot-hom-nay", permanent: true },
      { source: "/xem-gio-tot-hom-nay", destination: "/gio-tot-hom-nay", permanent: true },
      { source: "/ngay-dep-hom-nay", destination: "/ngay-tot-xau-hom-nay", permanent: true },
      { source: "/tuoi-lam-nha-:year", destination: "/tuoi-lam-nha/:year", permanent: true },
      { source: "/tai-lich-am-:year-pdf", destination: "/tai-lich-am/:year", permanent: true },
      { source: "/api-am-lich", destination: "/api-lich-am", permanent: true },
      { source: "/hom-nay-thu-may", destination: "/hom-nay-la-thu-may", permanent: true },
      { source: "/hom-nay-la-ngay-gi", destination: "/hom-nay-ngay-gi", permanent: true },
      // Cụm "lịch âm" gom về kho archive sẵn có /am-lich/... (tránh tạo trang trùng lặp)
      { source: "/lich-am-hom-nay", destination: "/am-lich-hom-nay", permanent: true },
      { source: "/lich-am-:year(\\d{4})", destination: "/am-lich/nam/:year", permanent: true },
      { source: "/lich-am-thang-:month(\\d{1,2})-nam-:year(\\d{4})", destination: "/am-lich/nam/:year/thang/:month", permanent: true },
      { source: "/lich-am-thang-:month(\\d{1,2})-:year(\\d{4})", destination: "/am-lich/nam/:year/thang/:month", permanent: true },
      // #7 Công cụ tính ngày — synonym gom về /tinh-ngay-online
      { source: "/cong-cu-tinh-ngay", destination: "/tinh-ngay-online", permanent: true },
      { source: "/cong-them-ngay", destination: "/tinh-ngay-online", permanent: true },
      { source: "/tru-ngay", destination: "/tinh-ngay-online", permanent: true },
      { source: "/tinh-so-ngay-giua-2-ngay", destination: "/tinh-ngay-online", permanent: true },
      // #8 Lễ tết — alias về trang/đếm ngược tương ứng đã có
      { source: "/le-vu-lan", destination: "/vu-lan", permanent: true },
      { source: "/ram-thang-bay", destination: "/vu-lan", permanent: true },
      { source: "/noel", destination: "/con-bao-nhieu-ngay-nua-den-noel", permanent: true },
    ];
  },

  async rewrites() {
    return [
      // /sitemap.xml → sitemap index API (Next.js không tự gen index khi dùng generateSitemaps)
      { source: "/sitemap.xml", destination: "/api/sitemap-index" },

      // Đếm ngược ngày lễ: URL đẹp /con-bao-nhieu-ngay-nua-den-<slug> → route /dem-nguoc/[slug]
      { source: "/con-bao-nhieu-ngay-nua-den-:slug", destination: "/dem-nguoc/:slug" },

      // Ngày tốt theo tháng: /ngay-tot-thang-7-nam-2026 → /ngay-tot-thang/7/2026
      { source: "/ngay-tot-thang-:month(\\d{1,2})-nam-:year(\\d{4})", destination: "/ngay-tot-thang/:month/:year" },


      // Tử vi keyword URLs
      { source: "/tu-vi-tuoi-:slug-hom-nay", destination: "/tu-vi/:slug" },
      { source: "/in-lich-am", destination: "/tai-lich-am-pdf" },
      { source: "/tai-lich-am", destination: "/tai-lich-am-pdf" },
      { source: "/tao-anh-lich-am", destination: "/tao-anh-lich" },

      // Tết keyword URLs → /tet/:year (canonical = /tet/:year)
      { source: "/tet-:year-con-bao-nhieu-ngay", destination: "/tet/:year" },
      { source: "/tet-:year-ngay-nao", destination: "/tet/:year" },
      // Giao thừa keyword URL
      { source: "/giao-thua-:year-la-ngay-nao", destination: "/giao-thua/:year" },
      // Ông công ông táo keyword URL
      { source: "/ong-cong-ong-tao-:year-ngay-nao", destination: "/ong-cong-ong-tao/:year" },
      // Rằm tháng Chạp keyword URL
      { source: "/ram-thang-chap-:year-ngay-nao", destination: "/ram-thang-chap/:year" },
      // Lịch nghỉ Tết keyword URL
      { source: "/lich-nghi-tet-:year", destination: "/lich-nghi-tet/:year" },
    ];
  },
};

export default nextConfig;
