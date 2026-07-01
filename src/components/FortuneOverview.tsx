import Link from "next/link";
import { SiteIcon, ZodiacIcon } from "./Icon";
import { formatDisplayDate, type DateParts } from "@/lib/date";
import { fortuneHref, getAllDailyFortunes } from "@/lib/calendar/fortune";
import { formatHours } from "@/lib/calendar/can-chi";

export function FortuneOverview({ date }: { date: DateParts }) {
  const fortunes = getAllDailyFortunes(date);
  const sorted = [...fortunes].sort((a, b) => b.score - a.score);
  const topFortunes = sorted.slice(0, 3);
  const carefulFortunes = [...sorted].reverse().slice(0, 3);

  return (
    <>
      <section className="heroCard fortuneHero" aria-labelledby="fortune-overview-title">
        <div>
          <p className="eyebrow"><SiteIcon name="sparkle" /> Tử vi ứng dụng</p>
          <h1 id="fortune-overview-title">Tử vi hôm nay 12 con giáp</h1>
          <p className="converterIntro yearIntroText">
            Xem nhanh vận trình ngày {formatDisplayDate(date)} cho 12 con giáp: tổng quan, công việc, tài lộc, tình cảm, sức khỏe, giờ tốt và tuổi nên thận trọng.
          </p>
          <div className="activityHeroBadges">
            <span>Cập nhật theo ngày</span>
            <span>Dựa trên can chi</span>
            <span>Có giờ hoàng đạo</span>
            <span>Chỉ để tham khảo</span>
          </div>
        </div>
        <div className="fortuneHeroPanel" aria-label="Con giáp nổi bật hôm nay">
          <span>Vận khí nổi bật</span>
          <strong>{topFortunes[0].shortTitle}</strong>
          <small>{topFortunes[0].score}/100 · {topFortunes[0].relationLabel}</small>
          <ZodiacIcon branch={topFortunes[0].chi} />
        </div>
      </section>

      <section className="fortuneHighlights" aria-label="Điểm nhanh tử vi hôm nay">
        <article className="panelCard">
          <p className="eyebrow">Dễ thuận lợi</p>
          <h2>Con giáp có điểm sáng</h2>
          <div className="fortuneMiniList">
            {topFortunes.map((item) => (
              <Link href={fortuneHref(item.slug)} key={item.slug}>
                <ZodiacIcon branch={item.chi} />
                <span><strong>{item.shortTitle}</strong><small>{item.score}/100 · {item.relationLabel}</small></span>
              </Link>
            ))}
          </div>
        </article>
        <article className="panelCard">
          <p className="eyebrow">Nên chậm lại</p>
          <h2>Con giáp cần thận trọng</h2>
          <div className="fortuneMiniList careful">
            {carefulFortunes.map((item) => (
              <Link href={fortuneHref(item.slug)} key={item.slug}>
                <ZodiacIcon branch={item.chi} />
                <span><strong>{item.shortTitle}</strong><small>{item.score}/100 · {item.relationLabel}</small></span>
              </Link>
            ))}
          </div>
        </article>
      </section>

      <section className="panelCard" aria-labelledby="fortune-grid-title">
        <div className="sectionHeaderRow">
          <div>
            <p className="eyebrow">12 con giáp</p>
            <h2 id="fortune-grid-title">Chọn tuổi để xem chi tiết hôm nay</h2>
          </div>
          <Link className="sectionHeaderLink" href="/xem-ngay-tot-theo-tuoi">Xem ngày tốt theo tuổi</Link>
        </div>
        <div className="zodiacFortuneGrid">
          {fortunes.map((item) => (
            <Link className={`fortuneCard ${item.tone}`} href={fortuneHref(item.slug)} key={item.slug}>
              <div className="fortuneCardTop">
                <ZodiacIcon branch={item.chi} />
                <span className="fortuneScore">{item.score}</span>
              </div>
              <strong>{item.shortTitle}</strong>
              <p>{item.headline}</p>
              <div className="fortunePills">
                <span>{item.relationLabel}</span>
                <span>Màu {item.luckyColor}</span>
                <span>Số {item.luckyNumber}</span>
              </div>
              <small>Giờ tốt: {formatHours(item.goodHours.slice(0, 3))}</small>
            </Link>
          ))}
        </div>
      </section>

      <article className="seoArticle">
        <h2>Tử vi hôm nay trên Ngaygio.vn được tính như thế nào?</h2>
        <p>Phần tử vi được xây dựng theo hướng tham khảo văn hóa dân gian: kết hợp can chi ngày, hoàng đạo/hắc đạo, trực ngày, giờ hoàng đạo, quan hệ lục hợp, tam hợp, xung/hại giữa tuổi và ngày. Kết quả không phải dự đoán tuyệt đối.</p>
        <h2>Nên dùng tử vi hôm nay ra sao?</h2>
        <p>Bạn có thể dùng kết quả để sắp xếp tinh thần, chọn thời điểm làm việc vừa sức và tránh nóng vội. Với việc hệ trọng như tài chính, sức khỏe, pháp lý, xây dựng hoặc cưới hỏi, nên kết hợp thêm điều kiện thực tế và ý kiến chuyên môn.</p>
        <h2>Liên kết hữu ích</h2>
        <div className="dayLinkList fortuneSeoLinks">
          <Link href="/ngay-tot-xau-hom-nay" className="eventPill blue">Ngày tốt xấu hôm nay</Link>
          <Link href="/gio-hoang-dao-hom-nay" className="eventPill blue">Giờ hoàng đạo hôm nay</Link>
          <Link href="/xem-ngay-tot" className="eventPill blue">Tìm ngày tốt theo việc</Link>
          <Link href="/xem-ngay-tot-theo-tuoi" className="eventPill blue">Xem ngày tốt theo tuổi</Link>
        </div>
      </article>
    </>
  );
}
