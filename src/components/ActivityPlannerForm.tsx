import { ACTIVITIES, type ActivitySlug } from "@/lib/calendar/activity";
import { formatDateKey, type DateParts } from "@/lib/date";

type Props = {
  selectedActivity: ActivitySlug;
  from: DateParts;
  to: DateParts;
  birthYear?: number;
  action?: string;
};

export function ActivityPlannerForm({ selectedActivity, from, to, birthYear, action = "/xem-ngay-tot" }: Props) {
  return (
    <form className="activityPlannerForm" action={action} method="get">
      <label>
        <span>Việc cần xem</span>
        <select name="viec" defaultValue={selectedActivity}>
          {ACTIVITIES.map((activity) => (
            <option key={activity.slug} value={activity.slug}>{activity.shortTitle}</option>
          ))}
        </select>
      </label>
      <label>
        <span>Từ ngày</span>
        <input name="tu" type="date" defaultValue={formatDateKey(from)} />
      </label>
      <label>
        <span>Đến ngày</span>
        <input name="den" type="date" defaultValue={formatDateKey(to)} />
      </label>
      <label>
        <span>Năm sinh / tuổi</span>
        <input name="tuoi" type="number" min="1900" max="2050" inputMode="numeric" placeholder="Ví dụ: 1996" defaultValue={birthYear ?? ""} />
      </label>
      <button type="submit">Tìm ngày đẹp</button>
    </form>
  );
}
