import Link from "next/link";
import { quickTools } from "@/lib/site";

export function QuickTools() {
  return (
    <section className="quickTools" aria-labelledby="quick-tools-title">
      <p className="eyebrow">Công cụ nổi bật</p>
      <h2 id="quick-tools-title">Tra cứu ngày giờ nhanh, gọn, dễ dùng</h2>
      <div className="toolGrid">
        {quickTools.map((tool) => (
          <Link key={tool.href} href={tool.href} className="toolCard">
            <span aria-hidden="true">✦</span>
            <strong>{tool.title}</strong>
            <p>{tool.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
