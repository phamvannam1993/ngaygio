"use client";

import { useId, useState } from "react";

export type NumerologyAspect = {
  label: string;
  body: string;
};

// Tab luận giải theo khía cạnh (Tổng quan / Tình yêu / Công việc / Tài chính).
// Toàn bộ panel vẫn nằm trong DOM (ẩn bằng hidden) để giữ nội dung cho SEO.
export function NumerologyAspectTabs({ aspects }: { aspects: NumerologyAspect[] }) {
  const [active, setActive] = useState(0);
  const baseId = useId();
  if (aspects.length === 0) return null;

  return (
    <>
      <div className="tshTabs" role="tablist" aria-label="Nhóm luận giải theo khía cạnh">
        {aspects.map((a, i) => {
          const selected = i === active;
          return (
            <button
              key={a.label}
              type="button"
              role="tab"
              id={`${baseId}-t-${i}`}
              aria-selected={selected}
              aria-controls={`${baseId}-p-${i}`}
              tabIndex={selected ? 0 : -1}
              className={selected ? "is-active" : undefined}
              onClick={() => setActive(i)}
            >
              {a.label}
            </button>
          );
        })}
      </div>
      {aspects.map((a, i) => (
        <div
          key={a.label}
          role="tabpanel"
          id={`${baseId}-p-${i}`}
          aria-labelledby={`${baseId}-t-${i}`}
          hidden={i !== active}
          className="tshReadBox"
        >
          <h3>{a.label}</h3>
          <p>{a.body}</p>
        </div>
      ))}
    </>
  );
}
