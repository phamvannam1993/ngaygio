import Link from "next/link";
import { formatDisplayDate } from "@/lib/date";
import type { DayInfo } from "@/lib/calendar/types";
import { SiteIcon, ZodiacIcon, type SiteIconName } from "./Icon";

const bulletItems = [
  "Lịch âm dương chính xác từng ngày",
  "Giờ hoàng đạo, giờ hắc đạo chi tiết",
  "Ngày tốt xấu, việc nên làm và tránh",
  "Lịch vạn niên, tra cứu theo năm, tháng",
  "Đổi ngày âm dương nhanh chóng",
  "Xem tuổi, tính tuổi âm lịch",
];

const quickCards: Array<{ href: string; iconName: SiteIconName; title: string; desc: string; tone: string; imageSrc: string }> = [
  { href: "/lich-hom-nay", iconName: "calendar", title: "Lịch hôm nay", desc: "Xem lịch âm dương chi tiết từng ngày", tone: "green", imageSrc: "/illustrations/calendar.svg" },
  { href: "/gio-hoang-dao", iconName: "clock", title: "Giờ hoàng đạo", desc: "Tra cứu giờ tốt xấu dễ dàng, chính xác", tone: "gold", imageSrc: "/illustrations/clock.svg" },
  { href: "/ngay-tot-xau", iconName: "goodBad", title: "Ngày tốt xấu", desc: "Xem ngày tốt xấu, việc nên làm, nên tránh", tone: "orange", imageSrc: "/illustrations/goodbad.svg" },
  { href: "/lich-van-nien", iconName: "perpetual", title: "Lịch vạn niên", desc: "Tra cứu lịch theo năm, tháng, ngày chính xác", tone: "blue", imageSrc: "/illustrations/perpetual.svg" },
  { href: "/chuyen-doi-lich", iconName: "converter", title: "Đổi ngày âm dương", desc: "Chuyển đổi âm lịch sang dương lịch nhanh", tone: "indigo", imageSrc: "/illustrations/converter.svg" },
  { href: "/tinh-tuoi-am", iconName: "age", title: "Xem tuổi", desc: "Tính tuổi âm lịch, xem tuổi hợp tuổi", tone: "brown", imageSrc: "/illustrations/age.svg" },
];

const shouldDo = ["Cưới hỏi", "Khai trương", "Xuất hành", "Động thổ", "Ký kết", "Cầu tài lộc"];
const shouldAvoid = ["Xây dựng", "Tranh chấp", "Tang lễ", "Kiện tụng", "Chuyển nhà", "Đổ mái"];

export function HomeHero({ day }: { day: DayInfo }) {
  return (
    <section className="homeHero" aria-labelledby="home-hero-title">
      <div className="container homeHeroInner">
        <div className="homeHeroCopy">
<h1 id="home-hero-title">Xem lịch âm dương</h1>
          <strong className="homeHeroSlogan">Chuẩn xác – Đầy đủ – Dễ dàng</strong>
          <p className="homeHeroLead">
            Công cụ xem ngày tốt xấu, giờ hoàng đạo, lịch vạn niên, đổi ngày âm dương, xem tuổi và nhiều tiện ích hữu ích.
          </p>
          <ul className="homeHeroBullets">
            {bulletItems.map((item) => (
              <li key={item}><span aria-hidden="true"><SiteIcon name="check" /></span>{item}</li>
            ))}
          </ul>
        </div>

        <div className="homeCalendarMock" aria-label="Tóm tắt lịch âm hôm nay">
          <div className="mockHeader">
            <h2>Lịch âm hôm nay</h2>
            <p>{day.weekdayName}, ngày {formatDisplayDate(day.solar)} dương lịch</p>
          </div>

          <div className="mockDates">
            <article>
              <span>Dương lịch</span>
              <strong>{day.solar.day}</strong>
              <small>Tháng {String(day.solar.month).padStart(2, "0")} năm {day.solar.year}</small>
              <em>{day.weekdayName}</em>
            </article>
            <div className="baguaIcon"><ZodiacIcon branch={day.canChi.yearChi} title={`Năm ${day.canChi.year}`} /></div>
            <article className="mockLunarDate">
              <span>Âm lịch</span>
              <strong>{day.lunar.day}</strong>
              <small>Tháng {String(day.lunar.month).padStart(2, "0")} năm {day.lunar.year}</small>
              <em>Năm {day.canChi.year}</em>
            </article>
          </div>

          <div className="mockCanChi">
            <span>Ngày {day.canChi.day}</span>
            <span>Tháng {day.canChi.month}</span>
            <span>Năm {day.canChi.year}</span>
          </div>

          <div className="mockHourGrid">
            <article className="mockGoodHours">
              <h3>Giờ hoàng đạo</h3>
              <div>
                {day.goodHours.slice(0, 6).map((hour) => <span key={hour.branch}>{hour.branch}<small>{hour.range}</small></span>)}
              </div>
            </article>
            <article className="mockBadHours">
              <h3>Giờ hắc đạo</h3>
              <div>
                {day.badHours.slice(0, 6).map((hour) => <span key={hour.branch}>{hour.branch}<small>{hour.range}</small></span>)}
              </div>
            </article>
          </div>

          <div className="mockAdviceGrid">
            <article>
              <h3>Việc nên làm</h3>
              <ul>{shouldDo.map((item) => <li key={item}><SiteIcon name="check" /> {item}</li>)}</ul>
            </article>
            <article className="mockAvoid">
              <h3>Việc nên tránh</h3>
              <ul>{shouldAvoid.map((item) => <li key={item}><SiteIcon name="cross" /> {item}</li>)}</ul>
            </article>
          </div>
        </div>
      </div>

      <div className="container homeQuickCards" aria-label="Công cụ xem lịch nhanh">
        {quickCards.map((card) => (
          <Link key={card.href} href={card.href} className={`homeToolCard ${card.tone}`}>
            <span className="homeToolImage" aria-hidden="true"><img src={card.imageSrc} alt="" loading="lazy" /></span>
            <span className="homeToolIcon" aria-hidden="true"><SiteIcon name={card.iconName} /></span>
            <strong>{card.title}</strong>
            <p>{card.desc}</p>
            <em aria-hidden="true">→</em>
          </Link>
        ))}
      </div>
    </section>
  );
}
