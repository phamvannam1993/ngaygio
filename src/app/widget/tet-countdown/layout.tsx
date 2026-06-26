import type { ReactNode } from "react";

// Minimal layout for embeddable widget — no header/footer, transparent body
export default function WidgetLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
