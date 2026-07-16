import { SiteIcon, type SiteIconName } from "./Icon";

type TrustItem = {
  iconName: SiteIconName;
  title: string;
  body: string;
};

const trustItems: TrustItem[] = [
  {
    iconName: "moon",
    title: "Lịch âm dương tính bằng thuật toán thiên văn",
    body:
      "Ngày âm được tính từ thời điểm sóc (không trăng) và kinh độ Mặt Trời, quy chiếu về múi giờ Việt Nam UTC+7 — cùng cách tính của lịch âm chính thức đang dùng tại Việt Nam. Nhờ vậy tháng nhuận, mùng 1 và tiết khí khớp với lịch in trong nước.",
  },
  {
    iconName: "book",
    title: "Ngày tốt xấu dựa trên kinh điển lịch pháp phương Đông",
    body:
      "Phần ngày tốt xấu tra theo bảng hoàng đạo – hắc đạo của từng tháng âm, Thập nhị trực, Bành Tổ bách kỵ cùng các ngày kiêng dân gian quen thuộc như Nguyệt kỵ, Tam nương, Dương Công kỵ nhật. Mỗi ngày đều ghi rõ lý do tốt hay xấu để bạn tự đối chiếu.",
  },
  {
    iconName: "vietnam",
    title: "Ngày lễ theo quy định hiện hành",
    body:
      "Tết Dương lịch, Tết Nguyên Đán, Giỗ Tổ Hùng Vương, 30/4, 1/5 và Quốc khánh 2/9 bám theo danh mục nghỉ lễ của Bộ luật Lao động. Riêng lịch nghỉ Tết và nghỉ bù từng năm, bạn nên đối chiếu thêm thông báo chính thức.",
  },
  {
    iconName: "shield",
    title: "Một nguồn dữ liệu, tra cứu 1900–2050",
    body:
      "Trang lịch tháng, trang đổi ngày và trang giờ hoàng đạo dùng chung một bộ dữ liệu nên không lệch nhau. Nội dung ngày giờ tốt xấu là tri thức văn hóa dân gian, mang tính tham khảo — hãy cân nhắc cùng điều kiện thực tế trước khi quyết định việc lớn.",
  },
];

export function DataTrustNote() {
  return (
    <section className="trustSection panelCard" aria-labelledby="trust-title">
      <p className="eyebrow">Cơ sở dữ liệu &amp; độ chính xác</p>
      <h2 id="trust-title">Số liệu trên Ngaygio.vn lấy từ đâu?</h2>
      <p className="trustLead">
        Chúng tôi tách bạch hai nhóm thông tin: phần thiên văn được tính toán chính xác, còn phần luận đoán tốt xấu là tri thức truyền thống để bạn tham khảo.
      </p>
      <div className="trustGrid">
        {trustItems.map((item) => (
          <article className="trustCard" key={item.title}>
            <span className="trustIcon" aria-hidden="true"><SiteIcon name={item.iconName} /></span>
            <div>
              <strong>{item.title}</strong>
              <p>{item.body}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
