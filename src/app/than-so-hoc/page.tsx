import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { NumerologyTool } from "@/components/NumerologyTool";
import { getVietnamTodayParts } from "@/lib/date";
import { siteConfig, webPageSchema, faqSchema } from "@/lib/site";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const PAGE_PATH = "/than-so-hoc";

export const metadata: Metadata = {
  title: "Tra cứu thần số học miễn phí – Số đường đời, sứ mệnh theo tên & ngày sinh | Ngày Giờ",
  description: "Tra cứu thần số học online miễn phí theo họ tên và ngày sinh: Số Đường Đời, Sứ Mệnh, Linh Hồn, Nhân Cách, Ngày Sinh, Thái Độ, Trưởng Thành. Xem ngay!",
  keywords: [
    "thần số học",
    "tra cứu thần số học",
    "thần số học theo tên",
    "số chủ đạo",
    "số đường đời",
    "tính thần số học",
    "thần số học miễn phí",
    "số sứ mệnh",
  ],
  alternates: { canonical: `${siteConfig.url}${PAGE_PATH}` },
  openGraph: {
    title: "Tra cứu thần số học miễn phí – Số đường đời, sứ mệnh | Ngày Giờ",
    description: "Tính các chỉ số thần số học theo họ tên và ngày sinh: Đường Đời, Sứ Mệnh, Linh Hồn, Nhân Cách…",
    url: `${siteConfig.url}${PAGE_PATH}`,
    siteName: siteConfig.name,
    locale: "vi_VN",
    type: "website",
    images: [{ url: "/home.jpg", width: 1200, height: 630, alt: "Tra cứu thần số học" }],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
};

export default async function ThanSoHocPage({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const params = (await searchParams) ?? {};
  const today = getVietnamTodayParts();

  const jsonLd = [
    webPageSchema({
      name: "Tra cứu thần số học",
      url: `${siteConfig.url}${PAGE_PATH}`,
      description: "Công cụ tra cứu thần số học online theo họ tên và ngày sinh: Số Đường Đời, Sứ Mệnh, Linh Hồn, Nhân Cách, Ngày Sinh, Thái Độ, Trưởng Thành.",
      breadcrumb: [{ name: "Thần số học", url: `${siteConfig.url}${PAGE_PATH}` }],
    }),
    faqSchema([
      { q: "Thần số học là gì?", a: "Thần số học (Numerology) là bộ môn nghiên cứu ý nghĩa của các con số gắn với con người, dựa trên họ tên và ngày sinh. Mỗi con số phản ánh một khía cạnh về tính cách, tiềm năng và con đường phát triển của mỗi người." },
      { q: "Số Đường Đời (số chủ đạo) tính như thế nào?", a: "Số Đường Đời được tính bằng cách cộng dồn các chữ số của ngày, tháng, năm sinh rồi rút gọn về một chữ số (giữ lại số master 11, 22, 33). Đây là chỉ số quan trọng nhất, phản ánh con đường và bài học lớn của cả đời." },
      { q: "Thần số học tính theo tên có dấu hay không dấu?", a: "Bạn nhập họ tên đầy đủ có dấu; hệ thống tự động chuyển về chữ cái Latin không dấu (đ → d) rồi áp bảng số Pythagoras để tính Số Sứ Mệnh, Số Linh Hồn và Số Nhân Cách." },
      { q: "Số master 11, 22, 33 là gì?", a: "Đây là các con số đặc biệt (master number) không rút gọn thêm, biểu thị tiềm năng và sứ mệnh lớn hơn: 11 (trực giác), 22 (kiến tạo), 33 (dẫn dắt, phụng sự)." },
      { q: "Tra cứu thần số học ở đây có miễn phí không?", a: "Có. Công cụ tra cứu thần số học tại Ngày Giờ hoàn toàn miễn phí, không cần đăng ký, cho kết quả ngay khi nhập họ tên và ngày sinh." },
    ]),
  ];

  return (
    <>
      <Header currentYear={today.year} />
      <main className="container mainStack">
        <div className="pageFullscreenBg" style={{ backgroundImage: "linear-gradient(90deg, rgba(255,255,255,.94) 0%, rgba(255,255,255,.82) 42%, rgba(255,255,255,.52) 100%), linear-gradient(180deg, rgba(245,251,247,.18) 0%, rgba(245,251,247,.9) 100%), url(/bg-page-calendar.png)" }} aria-hidden="true" />

        <section className="heroCard" aria-labelledby="tsh-title">
          <p className="eyebrow">Thần số học</p>
          <h1 id="tsh-title">Tra cứu thần số học theo tên và ngày sinh</h1>
          <p className="homeHeroLead" style={{ marginTop: 12 }}>
            Khám phá con người bạn qua những con số: Số Đường Đời, Sứ Mệnh, Linh Hồn, Nhân Cách… Nhập họ tên và ngày sinh để nhận kết quả miễn phí ngay.
          </p>
        </section>

        <NumerologyTool params={params} canonicalPath={PAGE_PATH} />

        <article className="seoArticle">
          <h2>Thần số học là gì?</h2>
          <p>Thần số học (Numerology) là bộ môn nghiên cứu mối liên hệ giữa các con số và con người. Dựa trên <strong>họ tên</strong> và <strong>ngày tháng năm sinh</strong>, thần số học giải mã tính cách, tiềm năng, điểm mạnh – điểm yếu và con đường phát triển của mỗi người thông qua một hệ thống các chỉ số. Công cụ này sử dụng hệ Pythagoras phổ biến nhất hiện nay.</p>

          <h2>Các chỉ số thần số học quan trọng</h2>
          <ul>
            <li><strong>Số Đường Đời (số chủ đạo):</strong> tính từ ngày sinh — chỉ số quan trọng nhất, phản ánh con đường và bài học lớn của cả đời.</li>
            <li><strong>Số Sứ Mệnh (vận mệnh):</strong> tính từ toàn bộ chữ cái trong họ tên — mục tiêu và tài năng bạn cần phát huy.</li>
            <li><strong>Số Linh Hồn:</strong> tính từ các nguyên âm — khát khao và động lực sâu thẳm bên trong.</li>
            <li><strong>Số Nhân Cách:</strong> tính từ các phụ âm — hình ảnh, ấn tượng bạn tạo ra với người khác.</li>
            <li><strong>Số Ngày Sinh:</strong> tài năng thiên bẩm nổi bật.</li>
            <li><strong>Số Thái Độ & Số Trưởng Thành:</strong> cách bạn tiếp cận cuộc sống và con người bạn hướng tới khi trưởng thành.</li>
          </ul>

          <h2>Cách tính số chủ đạo (Số Đường Đời)</h2>
          <p>Cộng tất cả chữ số của ngày, tháng, năm sinh rồi rút gọn dần về một chữ số. Ví dụ ngày 15/08/1992: 1+5=6 (ngày), 8 (tháng), 1+9+9+2=21→3 (năm); tổng 6+8+3=17→1+7=<strong>8</strong>. Riêng các số master <strong>11, 22, 33</strong> được giữ nguyên, không rút gọn thêm.</p>

          <h2>Công cụ liên quan</h2>
          <div className="dayLinkList">
            <Link href="/lap-la-so-tu-vi" className="eventPill blue">Lập lá số tử vi</Link>
            <Link href="/tu-vi-hom-nay" className="eventPill green">Tử vi hôm nay</Link>
            <Link href="/xem-tuoi-hop" className="eventPill green">Xem tuổi hợp</Link>
            <Link href="/tinh-tuoi-am" className="eventPill green">Tính tuổi âm</Link>
          </div>
        </article>
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
