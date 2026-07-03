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
      { source: "/tuoi-lam-nha-:year", destination: "/tuoi-lam-nha/:year", permanent: true },
      { source: "/tai-lich-am-:year-pdf", destination: "/tai-lich-am/:year", permanent: true },
      { source: "/api-am-lich", destination: "/api-lich-am", permanent: true },
      { source: "/hom-nay-thu-may", destination: "/lich-hom-nay", permanent: true },
      { source: "/hom-nay-la-ngay-gi", destination: "/lich-hom-nay", permanent: true },
    ];
  },

  async rewrites() {
    return [
      // /sitemap.xml → sitemap index API (Next.js không tự gen index khi dùng generateSitemaps)
      { source: "/sitemap.xml", destination: "/api/sitemap-index" },


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
