import Link from "next/link";
import { quickTools } from "@/lib/site";
import { SiteIcon, type SiteIconName } from "./Icon";

const iconList: SiteIconName[] = ["calendar", "goodBad", "check", "focus", "star", "bagua", "moon", "clock", "clock", "hourglass", "perpetual", "converter", "age", "flag", "book", "calendar"];
const imageList = [
  "/illustrations/calendar.svg",
  "/illustrations/goodbad.svg",
  "/illustrations/clock.svg",
  "/illustrations/age.svg",
  "/illustrations/fortune.svg",
  "/illustrations/la-so-tu-vi.svg",
  "/illustrations/perpetual.svg",
  "/illustrations/converter.svg",
];

export function QuickTools() {
  return (
    <section className="quickTools" aria-labelledby="quick-tools-title">
      <p className="eyebrow">Công cụ nổi bật</p>
      <h2 id="quick-tools-title">Tra cứu ngày giờ nhanh, gọn, dễ dùng</h2>
      <div className="toolGrid">
        {quickTools.slice(0, 8).map((tool, index) => (
          <Link key={tool.href} href={tool.href} className="toolCard">
            <span className="toolThumb" aria-hidden="true"><img src={imageList[index % imageList.length]} alt="" loading="lazy" /></span>
            <span className="toolCardIcon" aria-hidden="true"><SiteIcon name={iconList[index % iconList.length]} /></span>
            <strong>{tool.title}</strong>
            <p>{tool.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
