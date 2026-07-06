import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ThuocLoBanTool } from "@/components/ThuocLoBanTool";
import { getVietnamTodayParts } from "@/lib/date";
import { faqSchema, siteConfig, webPageSchema } from "@/lib/site";

const pageTitle = "Thước Lỗ Ban Online - Tra kích thước đẹp, cung tốt xấu | Ngày Giờ";
const pageDescription = "Công cụ Thước Lỗ Ban online giúp tra kích thước cửa, bàn thờ, bậc thang, tủ kệ và đồ nội thất theo thước 52.2cm, 42.9cm, 38.8cm.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  keywords: [
    "thước lỗ ban",
    "thước lỗ ban online",
    "tra thước lỗ ban",
    "thước lỗ ban 52.2",
    "thước lỗ ban 42.9",
    "thước lỗ ban 38.8",
    "kích thước cửa đẹp",
    "kích thước bàn thờ đẹp",
  ],
  alternates: { canonical: "/thuoc-lo-ban" },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: `${siteConfig.url}/thuoc-lo-ban`,
    siteName: siteConfig.name,
    locale: "vi_VN",
    type: "website",
    images: [{ url: "/home.jpg", width: 1200, height: 630, alt: "Thước Lỗ Ban online" }],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: pageDescription,
    images: ["/home.jpg"],
  },
};

const jsonLd = [
  webPageSchema({
    name: "Thước Lỗ Ban Online",
    url: `${siteConfig.url}/thuoc-lo-ban`,
    description: pageDescription,
    breadcrumb: [{ name: "Thước Lỗ Ban", url: `${siteConfig.url}/thuoc-lo-ban` }],
  }),
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Thước Lỗ Ban Online",
    url: `${siteConfig.url}/thuoc-lo-ban`,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "All",
    inLanguage: "vi-VN",
    description: pageDescription,
    offers: { "@type": "Offer", price: "0", priceCurrency: "VND" },
  },
  faqSchema([
    {
      q: "Thước Lỗ Ban online dùng để làm gì?",
      a: "Thước Lỗ Ban online giúp tra nhanh kích thước rơi vào cung tốt hay xấu theo các chu kỳ 52.2cm, 42.9cm và 38.8cm để tham khảo khi làm cửa, bàn thờ, tủ kệ, bậc thang hoặc đồ nội thất.",
    },
    {
      q: "Thước Lỗ Ban 52.2cm dùng cho trường hợp nào?",
      a: "Thước 52.2cm thường được dùng để tham khảo kích thước thông thủy như cửa chính, cửa phòng, cửa sổ và khoảng lọt lòng.",
    },
    {
      q: "Kết quả thước Lỗ Ban có thay thế yêu cầu kỹ thuật không?",
      a: "Không. Kết quả chỉ mang tính tham khảo phong thủy dân gian. Khi thi công cần ưu tiên công năng, an toàn, kết cấu, quy chuẩn xây dựng và điều kiện sử dụng thực tế.",
    },
  ]),
];

const relatedLinks = [
  { title: "Xem ngày tốt động thổ", href: "/xem-ngay-tot-dong-tho" },
  { title: "Xem tuổi làm nhà", href: "/xem-tuoi-lam-nha" },
  { title: "Phong thủy theo tuổi", href: "/phong-thuy-theo-tuoi" },
  { title: "Xem hướng hợp tuổi", href: "/xem-tuoi-hop-huong-nao" },
];

export default function ThuocLoBanPage() {
  const today = getVietnamTodayParts();

  return (
    <>
      <Header currentYear={today.year} />
      <main className="lobanPage">
        <div className="lobanPageBg" aria-hidden="true" />
        <div className="container lobanContainer">
          <nav className="ngdBreadcrumb lobanBreadcrumb" aria-label="Đường dẫn">
            <Link href="/">Trang chủ</Link>
            <span>›</span>
            <Link href="/phong-thuy-theo-tuoi">Phong thủy</Link>
            <span>›</span>
            <strong>Thước Lỗ Ban</strong>
          </nav>

          <section className="lobanHero" aria-labelledby="loban-page-title">
            <div className="lobanHeroText">
              <p className="ngdEyebrow">Công cụ phong thủy online</p>
              <h1 id="loban-page-title">Thước Lỗ Ban Online - Tra kích thước đẹp, cung tốt xấu chính xác</h1>
              <p>Hỗ trợ thước 52.2cm, 42.9cm và 38.8cm. Phù hợp tra cửa, bàn thờ, bậc thang, đồ nội thất và kích thước xây dựng.</p>
              <div className="lobanHeroBadges">
                <span>52.2cm thông thủy</span>
                <span>42.9cm dương trạch</span>
                <span>38.8cm âm phần</span>
              </div>
            </div>
            <div className="lobanHeroVisual" aria-hidden="true">
              <div className="lobanCompass" />
              <div className="lobanRulerIllustration">
                {Array.from({ length: 16 }).map((_, index) => (
                  <i key={index} />
                ))}
              </div>
              <div className="lobanPagoda">⌂</div>
              <div className="lobanBonsai" />
            </div>
          </section>

          <ThuocLoBanTool />

          <section className="lobanInfoGrid" aria-label="Hướng dẫn dùng thước Lỗ Ban">
            <article>
              <span>01</span>
              <h2>Chọn đúng loại thước</h2>
              <p>52.2cm thường dùng cho khoảng thông thủy; 42.9cm dùng cho khối đặc, đồ nội thất; 38.8cm dùng tham khảo cho đồ thờ, âm phần.</p>
            </article>
            <article>
              <span>02</span>
              <h2>Nhập kích thước thực tế</h2>
              <p>Nhập số đo theo cm, có thể dùng số lẻ như 81.5 hoặc 217.5. Công cụ tự chia theo chu kỳ và xác định cung đang rơi vào.</p>
            </article>
            <article>
              <span>03</span>
              <h2>Ưu tiên kích thước tốt</h2>
              <p>Nếu kết quả rơi vào cung xấu, hãy dùng nhóm gợi ý gần nhất để chọn kích thước tốt mà vẫn phù hợp công năng.</p>
            </article>
          </section>

          <section className="lobanArticle">
            <div className="lobanArticleMain">
              <h2>Thước Lỗ Ban online nên dùng như thế nào?</h2>
              <p>Thước Lỗ Ban là công cụ tham khảo kích thước theo quan niệm phong thủy dân gian. Khi nhập một số đo, công cụ sẽ lấy kích thước đó chia theo chu kỳ của từng loại thước, từ đó xác định kích thước đang rơi vào cung tốt hay cung xấu.</p>
              <p>Trong thực tế, bạn nên xem thước Lỗ Ban như bước tinh chỉnh sau cùng. Kích thước đẹp cần đi cùng công năng sử dụng, an toàn, kết cấu, độ thoáng, vật liệu và quy chuẩn thi công.</p>

              <h2>Nên dùng thước 52.2cm, 42.9cm hay 38.8cm?</h2>
              <p>Với cửa chính, cửa phòng, cửa sổ hoặc khoảng lọt lòng, bạn có thể dùng nhóm 52.2cm. Với đồ nội thất, tủ, kệ, bếp, bậc hoặc khối đặc, bạn có thể tham khảo nhóm 42.9cm. Với bàn thờ, đồ thờ hoặc hạng mục âm phần, bạn có thể dùng nhóm 38.8cm.</p>

              <h2>Lưu ý khi chọn kích thước đẹp</h2>
              <p>Kết quả tốt/xấu chỉ là tham khảo. Không nên vì cố ép vào cung tốt mà làm cửa quá hẹp, bậc quá cao, bàn thờ thiếu cân đối hoặc đồ nội thất khó sử dụng. Cách tốt nhất là chọn một khoảng kích thước phù hợp trước, sau đó tinh chỉnh trong khoảng đó để rơi vào cung đẹp.</p>
            </div>

            <aside className="lobanRelatedBox">
              <h2>Công cụ liên quan</h2>
              <p>Kết hợp thêm ngày tốt, tuổi làm nhà và hướng hợp tuổi để có kế hoạch đầy đủ hơn.</p>
              <div>
                {relatedLinks.map((item) => (
                  <Link href={item.href} key={item.href}>{item.title}</Link>
                ))}
              </div>
            </aside>
          </section>
        </div>
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
