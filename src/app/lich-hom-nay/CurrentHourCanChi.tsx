"use client";

import { useEffect, useState } from "react";
import { getHourCanChi } from "@/lib/calendar/can-chi";
import { getVietnamNowHour } from "@/lib/date";
import type { CanName } from "@/lib/calendar/types";

/**
 * Giờ can chi đổi theo thời gian thực. Khởi tạo bằng `initialText` do server tính
 * để lần render đầu khớp hydration, sau đó tự cập nhật theo giờ Việt Nam.
 */
export function CurrentHourCanChi({ dayCan, initialText }: { dayCan: CanName; initialText: string }) {
  const [text, setText] = useState(initialText);

  useEffect(() => {
    const sync = () => setText(getHourCanChi(dayCan, getVietnamNowHour()).text);
    sync();
    const timer = setInterval(sync, 60000);
    return () => clearInterval(timer);
  }, [dayCan]);

  return <>{text}</>;
}
