import Link from "next/link";
import { formatDisplayDate, getVietnamTodayParts } from "@/lib/date";
import { getCountdownEvents, type CountdownEvent } from "@/lib/calendar/activity";
import { EventIcon } from "./Icon";

function diffDays(from: { year: number; month: number; day: number }, to: { year: number; month: number; day: number }) {
  const a = Date.UTC(from.year, from.month - 1, from.day);
  const b = Date.UTC(to.year, to.month - 1, to.day);
  return Math.ceil((b - a) / 86400000);
}

function EventCard({ event, today }: { event: CountdownEvent; today: ReturnType<typeof getVietnamTodayParts> }) {
  const left = diffDays(today, event.date);
  const nextText = left === 0 ? "Hôm nay" : left > 0 ? `Còn ${left} ngày` : `Đã qua ${Math.abs(left)} ngày`;
  return (
    <Link className="countdownEventCard" href={event.href}>
      <span className="countdownIcon"><EventIcon slug={event.slug} /></span>
      <strong>{event.title}</strong>
      <em>{nextText}</em>
      <small>{formatDisplayDate(event.date)} · {event.dateType === "lunar" ? "Âm lịch quy đổi" : "Dương lịch"}</small>
      <p>{event.note}</p>
    </Link>
  );
}

export function CountdownEventGrid({ year }: { year?: number }) {
  const today = getVietnamTodayParts();
  const targetYear = year ?? today.year;
  const events = getCountdownEvents(targetYear);
  return (
    <section className="panelCard countdownEventSection" aria-labelledby="countdown-events-title">
      <p className="eyebrow">Đếm ngày</p>
      <h2 id="countdown-events-title">Còn bao nhiêu ngày đến các dịp quan trọng năm {targetYear}?</h2>
      <div className="countdownEventGrid">
        {events.map((event) => <EventCard event={event} today={today} key={event.slug} />)}
      </div>
    </section>
  );
}
