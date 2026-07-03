# SEO updates for ngaygio.vn

Bản cập nhật này bổ sung các landing page và tính năng SEO ngách theo hướng mỗi nhu cầu tìm kiếm có URL riêng, có metadata, canonical, internal links, sitemap và dữ liệu có cấu trúc phù hợp.

## 1. Mở rộng cụm xem ngày tốt theo việc

Đã mở rộng danh sách việc từ 10 lên 21 nhu cầu long-tail:

- Khai trương
- Mở hàng
- Cưới hỏi
- Động thổ
- Nhập trạch
- Mua xe
- Cúng xe mới
- Ký hợp đồng
- Đặt cọc
- Mua nhà
- Xuất hành
- Đi xa
- Cắt tóc
- Chuyển nhà
- Đặt bàn thờ
- Nhập hàng
- Mua vàng
- Nộp hồ sơ
- Phỏng vấn
- Khai bút
- Cầu tài

URL chuẩn mới dùng dạng thư mục:

```txt
/xem-ngay-tot/khai-truong
/xem-ngay-tot/mo-hang
/xem-ngay-tot/mua-vang
...
```

Các URL dạng cũ `/xem-ngay-tot-...` được redirect 301 về URL chuẩn để tránh trùng lặp nội dung.

## 2. Thêm landing page tuổi làm nhà theo năm

Đã thêm route:

```txt
/tuoi-lam-nha/[year]
```

Ví dụ:

```txt
/tuoi-lam-nha/2026
/tuoi-lam-nha/2027
```

Trang có:

- Bảng tuổi làm nhà theo năm
- Kim Lâu
- Hoang Ốc
- Tam Tai
- Điểm đánh giá
- Link sang trang xem chi tiết tuổi làm nhà
- FAQ schema
- WebPage schema
- Internal links liên quan

## 3. Thêm landing page tải lịch âm theo năm

Đã thêm route:

```txt
/tai-lich-am/[year]
```

Ví dụ:

```txt
/tai-lich-am/2026
/tai-lich-am/2027
```

Trang có:

- 12 tháng để tải/in lịch âm PDF
- Preview lịch tháng
- Link sang lịch âm năm
- Link sang lịch nghỉ lễ
- FAQ schema
- WebPage schema

## 4. Thêm trang API lịch âm

Đã thêm route:

```txt
/api-lich-am
```

Trang giới thiệu API cho developer, gồm:

- API đổi âm dương
- API lịch tháng
- API ngày tốt xấu
- API giờ hoàng đạo
- API iCal
- Ví dụ JavaScript
- Ví dụ cURL
- FAQ schema
- SoftwareApplication schema

## 5. Bổ sung các trang ngày lễ còn thiếu để tránh sitemap 404

Đã thêm trang SEO cho:

- Vu Lan
- Giỗ Tổ Hùng Vương
- Ngày 30/4
- Quốc khánh 2/9
- Trung Thu theo năm

Các route dạng năm:

```txt
/trung-thu/[year]
/vu-lan/[year]
/gio-to-hung-vuong/[year]
/ngay-30-4/[year]
/quoc-khanh-2-9/[year]
```

## 6. Cập nhật sitemap và internal links

Đã cập nhật:

- `src/app/sitemap.ts`
- `src/app/api/sitemap-index/route.ts`
- Header
- Footer
- ModernFeatureHub
- DesktopNavLinks
- Site config quick tools
- Các trang sinh năm, hợp tuổi, widget

## 7. Kiểm tra kỹ thuật

Đã chạy:

```bash
npx tsc --noEmit --pretty false
```

Kết quả: không có lỗi TypeScript.

Build production trong sandbox bị quá thời gian ở bước `Creating an optimized production build ...`, nên cần chạy lại trên máy local/server:

```bash
npm install
npm run build
```

