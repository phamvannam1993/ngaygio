import Link from "next/link";
import { SiteIcon, ZodiacIcon } from "./Icon";
import { formatHours } from "@/lib/calendar/can-chi";
import { fortuneHref, getAllDailyFortunes, getDailyFortune, type ZodiacFortuneProfile } from "@/lib/calendar/fortune";
import { type DateParts } from "@/lib/date";

function scoreTone(score: number) {
  if (score >= 74) return "good";
  if (score >= 58) return "neutral";
  return "careful";
}

export function FortuneDetail({ profile, date }: { profile: ZodiacFortuneProfile; date: DateParts }) {
  const fortune = getDailyFortune(profile.chi, date);
  const otherFortunes = getAllDailyFortunes(date).filter((item) => item.slug !== profile.slug).slice(0, 6);

  return (
    <>
      <section className={`heroCard fortuneDetailHero ${fortune.tone}`} aria-labelledby="fortune-detail-title">
        <div className="fortuneDetailIntro">
          <p className="eyebrow"><SiteIcon name="sparkle" /> Tử vi hôm nay</p>
          <h1 id="fortune-detail-title">Tử vi tuổi {fortune.chi} hôm nay {fortune.dateLabel}</h1>
          <p className="converterIntro yearIntroText">{fortune.overview}</p>
          <div className="activityHeroBadges">
            <span>Ngày {fortune.dayCanChi}</span>
            <span>Âm lịch {fortune.lunarLabel}</span>
            <span>{fortune.relationLabel}</span>
            <span>Giờ tốt: {formatHours(fortune.goodHours.slice(0, 2))}</span>
          </div>
        </div>
        <aside className="fortuneBigScore" aria-label="Điểm tử vi hôm nay">
          <ZodiacIcon branch={fortune.chi} />
          <span>{fortune.shortTitle}</span>
          <strong>{fortune.score}/100</strong>
          <small>{fortune.headline}</small>
        </aside>
      </section>

      <section className="panelCard fortuneRelationPanel" aria-labelledby="fortune-relation-title">
        <p className="eyebrow">Can chi trong ngày</p>
        <h2 id="fortune-relation-title">Tuổi {fortune.chi} gặp ngày {fortune.dayCanChi}: {fortune.relationLabel}</h2>
        <p>{fortune.relationNote}</p>
        <div className="fortunePills large">
          <span>Màu may mắn: {fortune.luckyColor}</span>
          <span>Con số tham khảo: {fortune.luckyNumber}</span>
          <span>Tuổi hợp trong ngày: {fortune.compatibleToday.join(", ")}</span>
        </div>
      </section>

      <section className="fortuneMetricGrid" aria-label="Chi tiết công việc, tài lộc, tình cảm, sức khỏe">
        {fortune.categories.map((category) => (
          <article className={`panelCard fortuneMetric ${scoreTone(category.score)}`} key={category.key}>
            <span>{category.score}/100</span>
            <h2>{category.label}</h2>
            <p>{category.summary}</p>
          </article>
        ))}
      </section>

      <section className="fortuneAdviceGrid" aria-label="Gợi ý nên làm và nên tránh">
        <article className="panelCard">
          <p className="eyebrow"><SiteIcon name="check" /> Nên làm</p>
          <h2>Gợi ý cho tuổi {fortune.chi}</h2>
          <ul>{fortune.shouldDo.map((item) => <li key={item}>{item}</li>)}</ul>
        </article>
        <article className="panelCard">
          <p className="eyebrow"><SiteIcon name="shield" /> Cần tránh</p>
          <h2>Lưu ý trong hôm nay</h2>
          <ul>{fortune.shouldAvoid.map((item) => <li key={item}>{item}</li>)}</ul>
        </article>
      </section>

      <section className="panelCard" aria-labelledby="fortune-hour-title">
        <div className="sectionHeaderRow">
          <div>
            <p className="eyebrow">Giờ hoàng đạo</p>
            <h2 id="fortune-hour-title">Khung giờ tốt cho tuổi {fortune.chi} hôm nay</h2>
          </div>
          <Link className="sectionHeaderLink" href="/gio-hoang-dao-hom-nay">Xem chi tiết giờ tốt</Link>
        </div>
        <div className="fortuneHourGrid">
          {fortune.goodHours.map((hour) => (
            <span key={hour.branch}>{hour.branch} <small>{hour.range}</small></span>
          ))}
        </div>
        <p className="smallNote">Giờ tốt là gợi ý theo ngày, nên kết hợp lịch cá nhân, điều kiện thực tế và mức độ quan trọng của công việc.</p>
      </section>

      <section className="panelCard" aria-labelledby="other-fortune-title">
        <div className="sectionHeaderRow">
          <div>
            <p className="eyebrow">Xem thêm</p>
            <h2 id="other-fortune-title">Tử vi các con giáp khác</h2>
          </div>
          <Link className="sectionHeaderLink" href="/tu-vi-hom-nay">Tất cả 12 con giáp</Link>
        </div>
        <div className="fortuneMiniList inlineList">
          {otherFortunes.map((item) => (
            <Link href={fortuneHref(item.slug)} key={item.slug}>
              <ZodiacIcon branch={item.chi} />
              <span><strong>{item.shortTitle}</strong><small>{item.score}/100 · {item.relationLabel}</small></span>
            </Link>
          ))}
        </div>
      </section>

      <article className="seoArticle">
        <h2>Tử vi tuổi {fortune.chi} hôm nay nên hiểu thế nào?</h2>
        <p>Tử vi tuổi {fortune.chi} hôm nay trên Ngaygio.vn là phần tham khảo văn hóa dân gian, dựa trên can chi, quan hệ tuổi với ngày, giờ hoàng đạo và một số yếu tố lịch âm. Nội dung giúp bạn có thêm góc nhìn khi sắp xếp công việc, giữ tinh thần bình tĩnh và chủ động hơn.</p>
        <p>Không nên dùng tử vi như căn cứ duy nhất cho quyết định tài chính, sức khỏe, pháp lý hoặc các việc đại sự. Với việc quan trọng, hãy kết hợp thêm ngày tốt xấu, giờ hoàng đạo, tuổi người liên quan và điều kiện thực tế.</p>
        <div className="resultActions wideActions">
          <Link href="/xem-ngay-tot-theo-tuoi">Xem ngày tốt theo tuổi</Link>
          <Link href="/ngay-tot-xau-hom-nay">Xem ngày tốt xấu hôm nay</Link>
        </div>
      </article>
    </>
  );
}
