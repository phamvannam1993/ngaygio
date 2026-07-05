import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { XongDatTool } from "@/components/XongDatTool";
import { getVietnamTodayParts } from "@/lib/date";
import { getTetInfo } from "@/lib/calendar/tet";
import { siteConfig, webPageSchema, faqSchema } from "@/lib/site";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const PAGE_PATH = "/tuoi-xong-dat";

export async function generateMetadata(): Promise<Metadata> {
  const today = getVietnamTodayParts();
  const tet = getTetInfo(today);
  const title = `Xem tuổi xông đất ${tet.year} (${tet.canChi}) theo tuổi gia chủ | Ngày Giờ`;
  const description = `Chọn tuổi xông đất, xông nhà Tết ${tet.canChi} ${tet.year} hợp với gia chủ. Nhập năm sinh để xem tuổi hợp, tuổi nên tránh và các tuổi cụ thể nên mời. Xem ngay!`;
  return {
    title,
    description,
    keywords: [
      "tuổi xông đất",
      `tuổi xông đất ${tet.year}`,
      "xem tuổi xông đất",
      "tuổi xông nhà",
      `tuổi xông nhà ${tet.year}`,
      "chọn tuổi xông đất theo tuổi gia chủ",
      `xông đất ${tet.canChi}`,
    ],
    alternates: { canonical: `${siteConfig.url}${PAGE_PATH}` },
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}${PAGE_PATH}`,
      siteName: siteConfig.name,
      locale: "vi_VN",
      type: "website",
      images: [{ url: "/home.jpg", width: 1200, height: 630, alt: title }],
    },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  };
}

export default async function TuoiXongDatPage({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const params = (await searchParams) ?? {};
  const today = getVietnamTodayParts();
  const tet = getTetInfo(today);

  const jsonLd = [
    webPageSchema({
      name: `Xem tuổi xông đất ${tet.year} (${tet.canChi})`,
      url: `${siteConfig.url}${PAGE_PATH}`,
      description: `Công cụ chọn tuổi xông đất, xông nhà Tết ${tet.canChi} ${tet.year} hợp với tuổi gia chủ.`,
      breadcrumb: [{ name: "Xem tuổi xông đất", url: `${siteConfig.url}${PAGE_PATH}` }],
    }),
    faqSchema([
      { q: `Xông đất Tết ${tet.year} nên chọn tuổi nào?`, a: `Nên chọn người có tuổi hợp (tam hợp, lục hợp) với gia chủ, tránh tuổi xung/hại. Nhập năm sinh gia chủ vào công cụ để xem danh sách tuổi hợp xông đất Tết ${tet.canChi} ${tet.year} cụ thể.` },
      { q: "Xông đất là gì?", a: "Xông đất (xông nhà, đạp đất) là tục lệ đầu năm: người đầu tiên bước vào nhà sau thời khắc giao thừa được xem là mang lại vận khí cho cả năm của gia chủ. Vì vậy nhiều gia đình chọn trước người có tuổi hợp để xông đất." },
      { q: "Chọn tuổi xông đất dựa vào đâu?", a: "Chủ yếu dựa vào tương hợp can chi (tam hợp, lục hợp) và ngũ hành tương sinh giữa người xông đất và gia chủ; đồng thời ưu tiên người đang gặp may mắn, tính tình vui vẻ, gia đình hòa thuận và không có tang." },
      { q: "Người xông đất có cần cùng giới với gia chủ không?", a: "Không bắt buộc. Yếu tố quan trọng nhất là tuổi hợp với gia chủ và vận khí của người đó; giới tính không phải điều kiện tiên quyết." },
      { q: `Tết ${tet.year} là năm con gì?`, a: `Tết Nguyên Đán ${tet.year} là năm ${tet.canChi}, mùng 1 rơi vào ${tet.solarDate.day}/${tet.solarDate.month}/${tet.solarDate.year} dương lịch.` },
    ]),
  ];

  return (
    <>
      <Header currentYear={tet.year} />
      <main className="container mainStack">
        <div className="pageFullscreenBg" style={{ backgroundImage: "linear-gradient(90deg, rgba(255,255,255,.94) 0%, rgba(255,255,255,.82) 42%, rgba(255,255,255,.52) 100%), linear-gradient(180deg, rgba(245,251,247,.18) 0%, rgba(245,251,247,.9) 100%), url(/bg-page-calendar.png)" }} aria-hidden="true" />

        <section className="heroCard" aria-labelledby="xongdat-title">
          <p className="eyebrow">Xem tuổi xông đất</p>
          <h1 id="xongdat-title">Xem tuổi xông đất {tet.year} ({tet.canChi}) theo tuổi gia chủ</h1>
          <p className="homeHeroLead" style={{ marginTop: 12 }}>
            Chọn người xông đất, xông nhà hợp tuổi gia chủ để đón một năm mới nhiều may mắn. Nhập năm sinh gia chủ để xem tuổi hợp và tuổi nên tránh.
          </p>
        </section>

        <XongDatTool params={params} canonicalPath={PAGE_PATH} />

        <article className="seoArticle">
          <h2>Xông đất là gì?</h2>
          <p>Xông đất (còn gọi là xông nhà, đạp đất) là tục lệ lâu đời trong Tết Nguyên Đán của người Việt. Người đầu tiên bước vào nhà sau thời khắc giao thừa được cho là ảnh hưởng đến vận khí, tài lộc và sự thuận hòa của gia chủ trong suốt năm mới. Vì vậy, nhiều gia đình chủ động chọn trước người có tuổi hợp để xông đất.</p>

          <h2>Cách chọn tuổi xông đất {tet.year}</h2>
          <p>Việc chọn tuổi xông đất Tết {tet.canChi} {tet.year} thường dựa vào các yếu tố:</p>
          <ul>
            <li><strong>Tương hợp can chi:</strong> ưu tiên người có tuổi tam hợp hoặc lục hợp với gia chủ, tránh tuổi xung (tứ hành xung) và lục hại.</li>
            <li><strong>Ngũ hành tương sinh:</strong> mệnh (nạp âm) của người xông đất tương sinh hoặc tương hòa với mệnh gia chủ.</li>
            <li><strong>Vận khí cá nhân:</strong> chọn người năm qua gặp nhiều may mắn, công việc thuận lợi, gia đình êm ấm, không có tang.</li>
            <li><strong>Tính cách:</strong> người vui vẻ, hoạt bát, nói năng cởi mở, hợp vía với gia chủ.</li>
          </ul>
          <p>Công cụ phía trên tự động xếp hạng 12 con giáp theo mức hợp với gia chủ, gợi ý các tuổi cụ thể nên mời và những tuổi nên tránh.</p>

          <h2>Lưu ý khi xông đất đầu năm</h2>
          <ul>
            <li>Nên xông đất vào <strong>giờ hoàng đạo</strong> đầu năm để tăng thêm may mắn.</li>
            <li>Người xông đất nên ăn mặc chỉnh tề, mang theo lời chúc tốt lành, có thể lì xì lấy may.</li>
            <li>Nếu khó tìm người hợp tuổi, gia chủ có thể tự xông đất nhà mình (tự xông nhà) để chủ động vận khí.</li>
          </ul>

          <h2>Công cụ liên quan</h2>
          <div className="dayLinkList">
            <Link href="/con-bao-nhieu-ngay-den-tet" className="eventPill blue">Còn bao nhiêu ngày đến Tết</Link>
            <Link href="/xem-tuoi-hop" className="eventPill green">Xem tuổi hợp tổng quan</Link>
            <Link href="/gio-hoang-dao-hom-nay" className="eventPill green">Giờ hoàng đạo đầu năm</Link>
            <Link href="/ngay-tot-xau-hom-nay" className="eventPill green">Xem ngày tốt xấu</Link>
            <Link href={`/tet/${tet.year}`} className="eventPill blue">Tết {tet.canChi} {tet.year}</Link>
          </div>
        </article>
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
