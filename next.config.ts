import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      // Remove the SearchAction template URL that got indexed by Google
      {
        source: "/",
        has: [{ type: "query", key: "date", value: "{search_term_string}" }],
        destination: "/",
        permanent: true,
        missing: [],
      },
    ];
  },
  async rewrites() {
    return [
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
