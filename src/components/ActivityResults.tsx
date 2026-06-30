import Link from "next/link";
import { formatDisplayDate } from "@/lib/date";
import { dateToIso, type ActivityRecommendation } from "@/lib/calendar/activity";

function levelText(level: ActivityRecommendation["level"]) {
  if (level === "excellent") return "Rất tốt";
  if (level === "good") return "Tốt";
  if (level === "ok") return "Cân nhắc";
  return "Nên tránh";
}

function levelClass(level: ActivityRecommendation["level"]) {
  if (level === "excellent") return "excellent";
  if (level === "good") return "good";
  if (level === "ok") return "ok";
  return "avoid";
}

export function ActivityResultCard({ item, rank }: { item: ActivityRecommendation; rank?: number }) {
  const dateText = formatDisplayDate(item.day.solar);
  const href = `/ngay-tot-xau/${item.day.solar.year}/${item.day.solar.month}/${item.day.solar.day}`;
  const iso = dateToIso(item.day.solar);
  return (
    <article className={["activityResultCard", levelClass(item.level)].join(" ")}>
      <div className="activityResultTop">
        <div>
          <span className="resultRank">#{rank ?? 1}</span>
          <h3>{dateText} · {item.day.weekdayName}</h3>
          <p>{item.day.lunar.day}/{item.day.lunar.month}/{item.day.lunar.year} âm lịch · Ngày {item.day.canChi.day}</p>
        </div>
        <div className="scoreBadge">
          <strong>{item.score}</strong>
          <span>/100</span>
        </div>
      </div>
      <p className="activitySummary"><strong>{levelText(item.level)}:</strong> {item.summary}</p>
      <div className="miniInfoGrid">
        <span>Giờ tốt: {item.day.goodHours.slice(0, 4).map((hour) => `${hour.branch} ${hour.range}`).join(", ")}</span>
        <span>Hỷ thần: {item.directions.hyThan}</span>
        <span>Tài thần: {item.directions.taiThan}</span>
      </div>
      {item.ageNote && <p className="ageNote">{item.ageNote}</p>}
      <div className="resultActions">
        <Link href={href}>Xem chi tiết ngày</Link>
        <a href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`${item.activity.shortTitle} ngày ${dateText}`)}&dates=${iso.replaceAll("-", "")}/${iso.replaceAll("-", "")}`} target="_blank" rel="noopener noreferrer">Thêm Google Calendar</a>
      </div>
    </article>
  );
}

export function ActivityResults({ results }: { results: ActivityRecommendation[] }) {
  if (results.length === 0) {
    return (
      <section className="panelCard emptyActivityResult">
        <h2>Chưa tìm thấy ngày thật sự phù hợp</h2>
        <p>Khoảng thời gian bạn chọn có thể quá ngắn hoặc tiêu chí tuổi đang khá chặt. Hãy mở rộng thêm vài tuần để có nhiều lựa chọn tốt hơn.</p>
      </section>
    );
  }

  return (
    <section className="activityResults" aria-labelledby="activity-results-title">
      <div className="sectionIntro">
        <p className="eyebrow">Kết quả gợi ý</p>
        <h2 id="activity-results-title">Top ngày nên tham khảo</h2>
        <p>Hệ thống chấm điểm theo ngày hoàng đạo/hắc đạo, trực ngày, giờ hoàng đạo, ngày kỵ và tuổi xung hợp nếu bạn nhập năm sinh.</p>
      </div>
      <div className="activityResultGrid">
        {results.map((item, index) => <ActivityResultCard key={`${item.day.solar.year}-${item.day.solar.month}-${item.day.solar.day}`} item={item} rank={index + 1} />)}
      </div>
    </section>
  );
}
