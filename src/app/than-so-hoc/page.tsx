import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { NumerologyTool } from "@/components/NumerologyTool";
import { getVietnamTodayParts } from "@/lib/date";
import { siteConfig, webPageSchema, faqSchema } from "@/lib/site";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const PAGE_PATH = "/than-so-hoc";

export const metadata: Metadata = {
  title: "Tra cứu thần số học miễn phí – Số chủ đạo, sứ mệnh, linh hồn | Ngày Giờ",
  description: "Tra cứu thần số học online miễn phí theo họ tên và ngày sinh. Xem số chủ đạo, sứ mệnh, linh hồn, nhân cách, biểu đồ ngày sinh và năm cá nhân.",
  keywords: [
    "thần số học",
    "tra cứu thần số học",
    "tra cứu thần số học miễn phí",
    "số chủ đạo",
    "số đường đời",
    "thần số học theo ngày sinh",
    "thần số học theo tên",
    "năm cá nhân",
  ],
  alternates: { canonical: `${siteConfig.url}${PAGE_PATH}` },
  openGraph: {
    title: "Tra cứu thần số học miễn phí – Số chủ đạo, sứ mệnh | Ngày Giờ",
    description: "Tính các chỉ số thần số học theo họ tên và ngày sinh: Đường Đời, Sứ Mệnh, Linh Hồn, Nhân Cách, Năm cá nhân…",
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
      description: "Công cụ tra cứu thần số học online theo họ tên và ngày sinh: Số Đường Đời, Sứ Mệnh, Linh Hồn, Nhân Cách, Ngày Sinh, Thái Độ, Trưởng Thành và Năm cá nhân.",
      breadcrumb: [{ name: "Thần số học", url: `${siteConfig.url}${PAGE_PATH}` }],
    }),
    faqSchema([
      { q: "Thần số học là gì?", a: "Thần số học là bộ môn nghiên cứu ý nghĩa của các con số gắn với con người, thường dựa trên họ tên và ngày sinh để gợi mở tính cách, tiềm năng và hướng phát triển." },
      { q: "Số chủ đạo hay Số Đường Đời tính như thế nào?", a: "Số Đường Đời được tính bằng cách cộng các chữ số trong ngày, tháng, năm sinh rồi rút gọn về một chữ số, giữ lại các số master 11, 22, 33." },
      { q: "Thần số học theo tên có cần nhập dấu tiếng Việt không?", a: "Bạn nên nhập họ tên đầy đủ có dấu. Hệ thống sẽ tự chuyển về chữ cái Latin không dấu để áp bảng số Pythagoras." },
      { q: "Năm cá nhân trong thần số học là gì?", a: `Năm cá nhân là chỉ số cho biết xu hướng trải nghiệm nổi bật trong từng năm. Công cụ hiện tính theo năm ${today.year}.` },
      { q: "Tra cứu thần số học ở đây có miễn phí không?", a: "Có. Công cụ tra cứu thần số học tại Ngày Giờ miễn phí và cho kết quả ngay sau khi nhập thông tin." },
    ]),
  ];

  return (
    <>
      <Header currentYear={today.year} />
      <main className="numerologyLuxuryShell">
        <div className="tshDecorBg" aria-hidden="true" />
        <div className="container tshContentWrap">
          <NumerologyTool params={params} canonicalPath={PAGE_PATH} />
        </div>
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
