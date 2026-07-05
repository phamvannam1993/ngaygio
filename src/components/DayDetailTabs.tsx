"use client";

import { useId, useState, type ReactNode } from "react";

export type DayDetailTab = {
  label: string;
  body: ReactNode;
};

// Tab luận giải chi tiết trong ngày: bấm để chuyển nhóm.
// Toàn bộ panel vẫn nằm trong DOM (chỉ ẩn bằng thuộc tính hidden) để giữ nội dung cho SEO.
export function DayDetailTabs({ tabs }: { tabs: DayDetailTab[] }) {
  const [active, setActive] = useState(0);
  const baseId = useId();

  if (tabs.length === 0) return null;

  return (
    <>
      <div className="ngdTabs" role="tablist" aria-label="Các nhóm luận giải">
        {tabs.map((tab, index) => {
          const selected = index === active;
          return (
            <button
              key={tab.label}
              type="button"
              role="tab"
              id={`${baseId}-tab-${index}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${index}`}
              tabIndex={selected ? 0 : -1}
              className={selected ? "is-active" : undefined}
              onClick={() => setActive(index)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      <div className="ngdDetailText">
        {tabs.map((tab, index) => (
          <div
            key={tab.label}
            role="tabpanel"
            id={`${baseId}-panel-${index}`}
            aria-labelledby={`${baseId}-tab-${index}`}
            hidden={index !== active}
          >
            {tab.body}
          </div>
        ))}
      </div>
    </>
  );
}
