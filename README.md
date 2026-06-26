# Ngaygio.vn Next.js

Bộ mã nguồn Next.js App Router cho trang lịch âm, chuyển đổi âm dương, ngày tốt xấu và lịch vạn niên.

## Chạy local

```bash
npm install
npm run dev
```

## Build production

```bash
npm run build
npm run start
```

## Route chính

- `/` trang chủ
- `/lich-hom-nay` redirect về trang âm lịch hôm nay
- `/am-lich-hom-nay` redirect về trang âm lịch hôm nay
- `/am-lich/nam/[year]` xem lịch âm theo năm, ví dụ `/am-lich/nam/2019`
- `/am-lich/nam/[year]/thang/[month]` xem lịch âm theo tháng, ví dụ `/am-lich/nam/2026/thang/1`
- `/am-lich/nam/[year]/thang/[month]/ngay/[day]` xem lịch âm theo ngày, ví dụ `/am-lich/nam/2026/thang/1/ngay/15`
- `/lich-van-nien` trang tra cứu tổng quan
- `/lich-van-nien/[year]`, `/lich-van-nien/[year]/[month]`, `/lich-van-nien/[year]/[month]/[day]` redirect 308 về URL `/am-lich/...` tương ứng để tránh trùng nội dung SEO
- `/chuyen-doi-lich`
- `/ngay-tot-xau`

## Ghi chú SEO

Các trang `/am-lich/...` có metadata động, canonical, Open Graph, Breadcrumb JSON-LD và FAQ JSON-LD. Menu header đã rút gọn, hỗ trợ dropdown desktop và menu mobile dạng collapsible.
