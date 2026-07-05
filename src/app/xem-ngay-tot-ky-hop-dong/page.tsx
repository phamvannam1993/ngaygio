import { ContractGoodDateDesign } from "@/components/ContractGoodDateDesign";
import { getActivity } from "@/lib/calendar/activity";
import { faqSchema, siteConfig, webPageSchema } from "@/lib/site";
import { buildActivityKeywordMetadata } from "../xem-ngay-tot/ActivityKeywordPage";

type PageProps = { searchParams?: Promise<Record<string, string | string[] | undefined>> };
export const dynamic = "force-dynamic";
export const metadata = buildActivityKeywordMetadata("ky-hop-dong", "/xem-ngay-tot-ky-hop-dong");

export default async function Page({ searchParams }: PageProps) {
  const activity = getActivity("ky-hop-dong");
  const jsonLd = [
    webPageSchema({
      name: activity.title,
      url: `${siteConfig.url}/xem-ngay-tot-ky-hop-dong`,
      description: activity.description,
      breadcrumb: [{ name: "Xem ngày tốt", url: `${siteConfig.url}/xem-ngay-tot` }],
    }),
    faqSchema([
      { q: "Ký hợp đồng nên chọn ngày như thế nào?", a: "Nên ưu tiên ngày hoàng đạo, trực Định, Thành, Khai hoặc Thu, có giờ hoàng đạo và tránh ngày kỵ như Tam nương, Nguyệt kỵ hoặc ngày xung/hại với tuổi người đại diện." },
      { q: "Xem ngày ký hợp đồng có cần nhập năm sinh không?", a: "Không bắt buộc. Nếu nhập năm sinh của người đại diện ký, hệ thống sẽ xét thêm yếu tố tuổi hợp/xung với chi ngày để gợi ý sát hơn." },
      { q: "Ngày tốt có thay thế kiểm tra pháp lý hợp đồng không?", a: "Không. Thông tin ngày tốt chỉ là tham khảo văn hóa dân gian. Hợp đồng vẫn cần được kiểm tra kỹ về pháp lý, thẩm quyền ký, nghĩa vụ thanh toán và điều khoản rủi ro." },
    ]),
  ];

  return (
    <>
      <ContractGoodDateDesign params={(await searchParams) ?? {}} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
