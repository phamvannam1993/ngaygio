import type { AgeSeoPageConfig } from "./AgeSeoPage";

export const ageSeoConfigs = {
  tongQuan: {
    canonicalPath: "/xem-tuoi-hop",
    title: "Xem tuổi hợp theo năm sinh",
    h1: "Xem tuổi hợp theo can chi, con giáp và ngũ hành",
    description: "Công cụ xem tuổi hợp theo năm sinh, chấm điểm 100 dựa trên địa chi, thiên can, nạp âm và ngũ hành để tham khảo cho quan hệ, hợp tác và việc quan trọng.",
    keywords: ["xem tuổi hợp", "tuổi hợp", "xem tuổi theo năm sinh", "can chi hợp tuổi", "ngũ hành hợp tuổi"],
    mode: "compat",
    purpose: "tong-quan",
    faq: [
      { q: "Xem tuổi hợp dựa trên yếu tố nào?", a: "Công cụ xét thiên can, địa chi, lục hợp, tam hợp, tứ hành xung, lục hại, nạp âm và quan hệ ngũ hành." },
      { q: "Điểm hợp tuổi có tuyệt đối không?", a: "Không. Điểm hợp tuổi chỉ là gợi ý tham khảo theo văn hóa dân gian, nên kết hợp hoàn cảnh thực tế khi quyết định việc quan trọng." },
    ],
  },
  lamAn: {
    canonicalPath: "/xem-tuoi-hop-lam-an",
    title: "Xem tuổi hợp làm ăn",
    h1: "Xem tuổi hợp làm ăn, hợp tác kinh doanh",
    description: "Nhập hai năm sinh để xem tuổi hợp làm ăn, hợp tác mở việc, góp vốn, ký kết hoặc đồng hành kinh doanh theo can chi và ngũ hành.",
    keywords: ["xem tuổi hợp làm ăn", "tuổi hợp kinh doanh", "hợp tuổi mở công ty", "hợp tuổi hợp tác"],
    mode: "compat",
    purpose: "lam-an",
    faq: [
      { q: "Xem tuổi hợp làm ăn có cần ngày sinh đầy đủ không?", a: "Bản cơ bản dùng năm sinh để xét can chi, địa chi và nạp âm. Nếu cần chuyên sâu hơn có thể xem thêm lá số tử vi theo ngày giờ sinh." },
      { q: "Hai tuổi xung có làm ăn chung được không?", a: "Vẫn có thể, nhưng nên phân vai rõ, thống nhất tài chính, trách nhiệm và chọn ngày giờ tốt khi bắt đầu việc quan trọng." },
    ],
  },
  voChong: {
    canonicalPath: "/xem-tuoi-vo-chong",
    title: "Xem tuổi vợ chồng",
    h1: "Xem tuổi vợ chồng, cưới hỏi có hợp không",
    description: "Công cụ xem tuổi vợ chồng theo năm sinh, can chi, con giáp, nạp âm ngũ hành và điểm hòa hợp tham khảo cho cưới hỏi, gia đạo.",
    keywords: ["xem tuổi vợ chồng", "tuổi vợ chồng hợp nhau", "xem tuổi cưới hỏi", "hợp tuổi kết hôn"],
    mode: "compat",
    purpose: "vo-chong",
    faq: [
      { q: "Xem tuổi vợ chồng trên Ngaygio.vn tính gì?", a: "Công cụ xét thiên can, địa chi, tam hợp/lục hợp, tứ hành xung, lục hại, nạp âm và âm dương thiên can." },
      { q: "Tuổi không hợp có nên cưới không?", a: "Kết quả chỉ để tham khảo văn hóa dân gian. Hôn nhân còn phụ thuộc tình cảm, trách nhiệm, gia đình, kinh tế và cách hai người ứng xử với nhau." },
    ],
  },
  sinhCon: {
    canonicalPath: "/xem-tuoi-sinh-con",
    title: "Xem tuổi sinh con hợp cha mẹ",
    h1: "Xem năm sinh con hợp tuổi cha mẹ",
    description: "Nhập năm sinh cha mẹ và năm dự sinh con để tham khảo tuổi con hợp cha mẹ theo can chi, con giáp, nạp âm và ngũ hành.",
    keywords: ["xem tuổi sinh con", "sinh con năm nào hợp tuổi bố mẹ", "chọn năm sinh con", "tuổi con hợp cha mẹ"],
    mode: "compat",
    purpose: "sinh-con",
    faq: [
      { q: "Chọn năm sinh con có nên phụ thuộc hoàn toàn vào tuổi không?", a: "Không. Tuổi chỉ là yếu tố tham khảo văn hóa. Sức khỏe của mẹ, điều kiện gia đình, tài chính và tư vấn y tế quan trọng hơn." },
      { q: "Công cụ xét những yếu tố nào khi xem tuổi sinh con?", a: "Công cụ so sánh tuổi con với tuổi cha, tuổi mẹ theo địa chi, thiên can, nạp âm và ngũ hành rồi tính điểm trung bình tham khảo." },
    ],
  },
  lamNha: {
    canonicalPath: "/xem-tuoi-lam-nha",
    title: "Xem tuổi làm nhà",
    h1: "Xem tuổi làm nhà, sửa nhà theo Kim Lâu Hoang Ốc Tam Tai",
    description: "Nhập năm sinh gia chủ và năm dự định xây sửa để kiểm tra Kim Lâu, Hoang Ốc, Tam Tai và gợi ý xem ngày động thổ hợp tuổi.",
    keywords: ["xem tuổi làm nhà", "tuổi làm nhà", "kim lâu hoang ốc tam tai", "xem tuổi xây nhà", "mượn tuổi làm nhà"],
    mode: "house",
    faq: [
      { q: "Xem tuổi làm nhà xét những hạn nào?", a: "Bản cơ bản xét Kim Lâu, Hoang Ốc và Tam Tai theo tuổi âm của gia chủ trong năm dự định xây sửa." },
      { q: "Phạm tuổi làm nhà thì làm gì?", a: "Có thể cân nhắc đổi năm, chọn thời điểm phù hợp hơn hoặc tham khảo phong tục mượn tuổi tại địa phương." },
    ],
  },
  mauSac: {
    canonicalPath: "/xem-tuoi-hop-mau-gi",
    title: "Xem tuổi hợp màu gì",
    h1: "Xem tuổi hợp màu gì theo ngũ hành nạp âm",
    description: "Nhập năm sinh để xem màu bản mệnh, màu tương sinh và màu nên tiết chế theo nạp âm ngũ hành, dùng cho xe, ví, trang phục và màu nhấn cá nhân.",
    keywords: ["xem tuổi hợp màu gì", "màu hợp tuổi", "mệnh hợp màu gì", "ngũ hành màu sắc"],
    mode: "color",
    faq: [
      { q: "Màu hợp tuổi được tính theo gì?", a: "Công cụ lấy nạp âm ngũ hành của năm sinh, sau đó gợi ý màu bản mệnh, màu tương sinh và màu nên tiết chế." },
      { q: "Có cần kiêng tuyệt đối màu kỵ không?", a: "Không cần tuyệt đối. Màu kỵ nên dùng tiết chế, còn lựa chọn màu sắc vẫn cần phù hợp sở thích, thẩm mỹ và mục đích sử dụng." },
    ],
  },
  huong: {
    canonicalPath: "/xem-tuoi-hop-huong-nao",
    title: "Xem tuổi hợp hướng nào",
    h1: "Xem tuổi hợp hướng nào theo cung phi bát trạch",
    description: "Nhập năm sinh và giới tính để xem cung phi, Đông tứ mệnh/Tây tứ mệnh, hướng Sinh Khí, Thiên Y, Diên Niên, Phục Vị và các hướng nên hạn chế.",
    keywords: ["xem tuổi hợp hướng nào", "hướng hợp tuổi", "cung phi bát trạch", "hướng nhà hợp tuổi", "đông tứ mệnh tây tứ mệnh"],
    mode: "direction",
    faq: [
      { q: "Hướng hợp tuổi được tính theo gì?", a: "Công cụ tính quái số/cung phi theo năm sinh và giới tính, rồi tra nhóm hướng tốt xấu theo bát trạch." },
      { q: "Hướng nhà có phải chỉ cần hợp tuổi?", a: "Không. Hướng hợp tuổi chỉ là tham khảo. Khi làm nhà cần xét pháp lý, quy hoạch, ánh sáng, thông gió, công năng và điều kiện thực tế." },
    ],
  },
  phongThuy: {
    canonicalPath: "/phong-thuy-theo-tuoi",
    title: "Phong thủy theo tuổi",
    h1: "Xem phong thủy theo tuổi: màu hợp, hướng hợp, cung phi",
    description: "Tra cứu phong thủy theo năm sinh gồm nạp âm, màu hợp tuổi, cung phi bát trạch, hướng tốt xấu và các liên kết xem ngày hợp tuổi.",
    keywords: ["phong thủy theo tuổi", "xem phong thủy tuổi", "màu hợp tuổi", "hướng hợp tuổi", "cung phi"],
    mode: "feng-full",
    faq: [
      { q: "Phong thủy theo tuổi trên trang này gồm gì?", a: "Trang hiển thị nạp âm ngũ hành, màu hợp/kỵ, cung phi, nhóm Đông tứ mệnh/Tây tứ mệnh và hướng tốt xấu tham khảo." },
      { q: "Có nên dùng kết quả phong thủy để quyết định mọi việc?", a: "Không. Đây là nội dung tham khảo văn hóa dân gian, nên kết hợp điều kiện thực tế và tư vấn chuyên môn khi cần." },
    ],
  },
} satisfies Record<string, AgeSeoPageConfig>;
