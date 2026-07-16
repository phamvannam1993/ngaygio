import Link from "next/link";
import { SiteIcon, type SiteIconName } from "./Icon";

type UseCase = {
  href: string;
  iconName: SiteIconName;
  persona: string;
  title: string;
  story: string;
  steps: string[];
  cta: string;
};

const useCases: UseCase[] = [
  {
    href: "/xem-ngay-tot-khai-truong",
    iconName: "building",
    persona: "Chủ doanh nghiệp",
    title: "Tìm ngày khai trương công ty",
    story:
      "Anh Minh chuẩn bị mở quán cà phê, muốn chọn một ngày đẹp trong tháng tới để khai trương và tránh ngày xung với tuổi mình.",
    steps: [
      "Chọn việc “Khai trương” và khoảng thời gian dự kiến",
      "Nhập năm sinh để loại ngày xung tuổi",
      "Xem điểm ngày, giờ hoàng đạo để chốt giờ mở cửa",
    ],
    cta: "Xem ngày khai trương",
  },
  {
    href: "/nhac-ngay-gio",
    iconName: "bell",
    persona: "Gia đình",
    title: "Lên kế hoạch buổi lễ kỷ niệm",
    story:
      "Nhà chị Lan có ngày giỗ tính theo âm lịch, mỗi năm lại rơi vào một ngày dương khác nhau nên cả nhà hay quên lịch.",
    steps: [
      "Nhập ngày âm của giỗ, rằm hoặc sinh nhật âm",
      "Xem trước ngày dương tương ứng của nhiều năm",
      "Đặt nhắc để cả nhà sắp xếp công việc từ sớm",
    ],
    cta: "Tạo nhắc ngày âm",
  },
  {
    href: "/xem-ngay-tot-cuoi-hoi",
    iconName: "ring",
    persona: "Cặp đôi sắp cưới",
    title: "Chọn ngày cưới hợp tuổi hai bên",
    story:
      "Hai bạn trẻ cần một vài ngày đẹp cuối năm để hai gia đình cùng bàn, kèm lý do rõ ràng thay vì chỉ nghe nói ngày đó tốt.",
    steps: [
      "Lọc ngày tốt cho việc cưới hỏi theo tháng",
      "Đối chiếu tuổi cô dâu, chú rể",
      "Xem trực, sao tốt xấu và giờ đón dâu",
    ],
    cta: "Xem ngày cưới hỏi",
  },
  {
    href: "/xem-ngay-tot-dong-tho",
    iconName: "home",
    persona: "Người xây nhà",
    title: "Kiểm tra tuổi và ngày động thổ",
    story:
      "Anh Tuấn định khởi công nhà năm nay, muốn biết tuổi mình có phạm Kim Lâu, Hoang Ốc, Tam Tai không trước khi đặt móng.",
    steps: [
      "Kiểm tra tuổi làm nhà theo năm dự định",
      "Xem gợi ý mượn tuổi nếu năm đó phạm",
      "Chọn ngày và giờ động thổ phù hợp",
    ],
    cta: "Xem ngày động thổ",
  },
];

export function UseCaseShowcase() {
  return (
    <section className="useCaseSection" aria-labelledby="use-case-title">
      <div className="useCaseHead">
        <p className="eyebrow">Ai đang dùng Ngaygio.vn</p>
        <h2 id="use-case-title">Bốn tình huống thường gặp nhất</h2>
        <p>
          Nếu bạn chưa biết bắt đầu từ đâu, hãy xem bạn giống trường hợp nào dưới đây rồi đi thẳng tới công cụ tương ứng.
        </p>
      </div>
      <div className="useCaseGrid">
        {useCases.map((item) => (
          <article className="useCaseCard" key={item.href}>
            <div className="useCaseCardTop">
              <span className="useCaseIcon" aria-hidden="true"><SiteIcon name={item.iconName} /></span>
              <p className="useCasePersona">{item.persona}</p>
            </div>
            <h3>{item.title}</h3>
            <p className="useCaseStory">{item.story}</p>
            <ul className="useCaseSteps">
              {item.steps.map((step) => (
                <li key={step}><SiteIcon name="check" /> {step}</li>
              ))}
            </ul>
            <Link href={item.href} className="useCaseCta">
              {item.cta} <span aria-hidden="true">→</span>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
