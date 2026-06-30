import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },

  async redirects() {
    return [
      { source: "/gio-tot-hom-nay", destination: "/gio-hoang-dao-hom-nay", permanent: true },
      { source: "/gio-tot-xau-hom-nay", destination: "/gio-hoang-dao-hom-nay", permanent: true },
      { source: "/ngay-dep-hom-nay", destination: "/ngay-tot-xau-hom-nay", permanent: true },
      { source: "/hom-nay-thu-may", destination: "/lich-hom-nay", permanent: true },
      { source: "/hom-nay-la-ngay-gi", destination: "/lich-hom-nay", permanent: true },
    ];
  },

  async rewrites() {
    return [
      // /sitemap.xml → sitemap index API (Next.js không tự gen index khi dùng generateSitemaps)
      { source: "/sitemap.xml", destination: "/api/sitemap-index" },


      // Chọn ngày tốt keyword URLs
      { source: "/xem-ngay-tot-khai-truong", destination: "/xem-ngay-tot/khai-truong" },
      { source: "/xem-ngay-tot-cuoi-hoi", destination: "/xem-ngay-tot/cuoi-hoi" },
      { source: "/xem-ngay-tot-dong-tho", destination: "/xem-ngay-tot/dong-tho" },
      { source: "/xem-ngay-tot-nhap-trach", destination: "/xem-ngay-tot/nhap-trach" },
      { source: "/xem-ngay-tot-mua-xe", destination: "/xem-ngay-tot/mua-xe" },
      { source: "/xem-ngay-tot-ky-hop-dong", destination: "/xem-ngay-tot/ky-hop-dong" },
      { source: "/xem-ngay-tot-xuat-hanh", destination: "/xem-ngay-tot/xuat-hanh" },
      { source: "/xem-ngay-tot-cat-toc", destination: "/xem-ngay-tot/cat-toc" },
      { source: "/xem-ngay-tot-chuyen-nha", destination: "/xem-ngay-tot/chuyen-nha" },
      { source: "/xem-ngay-tot-dat-ban-tho", destination: "/xem-ngay-tot/dat-ban-tho" },
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
