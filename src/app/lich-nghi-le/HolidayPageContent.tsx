import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { formatDisplayDate } from "@/lib/date";
import { getHolidayItems, getYearEvents, groupEventsByMonth } from "@/lib/calendar/holidays";
import { siteConfig } from "@/lib/site";

export function holidayYearHref(year: number) {
  return `/lich-nghi-le/${year}`;
}

export function HolidayPageContent({ year }: { year: number }) {
  const holidays = getHolidayItems(year);
  const eventsByMonth = groupEventsByMonth(getYearEvents(year));
  const yearLinks = Array.from({ length: 7 }, (_, index) => year - 3 + index).filter((item) => item >= 1900 && item <= 2050);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: `Lịch nghỉ lễ ${year}`,
        url: `${siteConfig.url}${holidayYearHref(year)}`,
        description: `Tra cứu các ngày lễ, Tết và ngày kỷ niệm trong năm ${year}.`,
        isPartOf: { "@type": "WebSite", name: siteConfig.name, url: siteConfig.url },
        inLanguage: "vi-VN",
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          { "@type": "Question", name: `Năm ${year} có những ngày nghỉ lễ chính nào?`, acceptedAnswer: { "@type": "Answer", text: holidays.map((item) => `${item.title}: ${item.dateText}`).join("; ") } },
          { "@type": "Question", name: "Lịch nghỉ lễ trên trang có phải lịch chính thức không?", acceptedAnswer: { "@type": "Answer", text: "Trang hiển thị ngày lễ theo quy ước lịch dương và âm lịch; số ngày nghỉ thực tế từng năm cần đối chiếu thông báo chính thức." } },
        ],
      },
    ],
  };

  return (
    <>
      <Header currentYear={year} />
      <main className="container mainStack">
        <section className="heroCard">
          <p className="eyebrow">Lịch nghỉ lễ</p>
          <h1>Lịch nghỉ lễ, ngày lễ Tết năm {year}</h1>
          <p className="converterIntro yearIntroText">Tổng hợp các ngày lễ chính, Tết âm lịch, Giỗ Tổ Hùng Vương và các ngày kỷ niệm trong năm {year}. Lịch nghỉ thực tế từng năm cần đối chiếu thông báo chính thức của cơ quan có thẩm quyền.</p>
          <div className="dayLinkList yearSwitchList">
            {yearLinks.map((item) => <Link key={item} href={holidayYearHref(item)}>Năm {item}</Link>)}
          </div>
        </section>

        <section className="panelCard holidayList" aria-labelledby="holiday-list-title">
          <p className="eyebrow">Ngày nghỉ chính</p>
          <h2 id="holiday-list-title">Các mốc lễ Tết nổi bật năm {year}</h2>
          <div className="holidayGrid">
            {holidays.map((item) => (
              <Link key={`${item.title}-${item.dateText}`} href={item.href} className="holidayCard">
                <span className={item.isDayOff ? "holidayBadge dayOff" : "holidayBadge"}>{item.isDayOff ? "Ngày nghỉ" : "Tham khảo"}</span>
                <strong>{item.title}</strong>
                <em>{formatDisplayDate(item.date)}</em>
                <p>{item.note}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="panelCard holidayEvents" aria-labelledby="event-list-title">
          <p className="eyebrow">Ngày lễ trong năm</p>
          <h2 id="event-list-title">Ngày lễ, ngày kỷ niệm theo từng tháng</h2>
          <div className="eventMonthGrid">
            {eventsByMonth.map((group) => (
              <article key={group.month}>
                <h3>Tháng {group.month}</h3>
                {group.events.length > 0 ? (
                  <ul>
                    {group.events.map((event) => (
                      <li key={`${event.date.day}-${event.title}`}>
                        <Link href={event.href}><strong>{event.date.day}/{event.date.month}</strong> · {event.title}</Link>
                      </li>
                    ))}
                  </ul>
                ) : <p>Chưa có sự kiện nổi bật.</p>}
              </article>
            ))}
          </div>
        </section>

        <article className="seoArticle">
          <h2>Cách xem lịch nghỉ lễ</h2>
          <p>Những ngày lễ cố định theo dương lịch như 1/1, 30/4, 1/5 và 2/9 được hiển thị trực tiếp theo năm dương lịch. Các ngày lễ âm lịch như Tết Nguyên Đán, Giỗ Tổ Hùng Vương được tự động đổi sang ngày dương tương ứng.</p>
          <h2>Lưu ý quan trọng</h2>
          <p>Trang này phục vụ tra cứu lịch và lập kế hoạch cá nhân. Số ngày nghỉ, nghỉ bù hoặc lịch làm việc cụ thể có thể thay đổi theo thông báo từng năm, vì vậy cần kiểm tra nguồn chính thức khi sắp xếp công việc quan trọng.</p>
        </article>
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
