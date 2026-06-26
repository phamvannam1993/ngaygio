"use client";

import { useEffect, useState } from "react";

function formatTime(date: Date): string {
  return new Intl.DateTimeFormat("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);
}

export function LiveClock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    setTime(formatTime(new Date()));
    const timer = window.setInterval(() => setTime(formatTime(new Date())), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <span className="liveClock" suppressHydrationWarning>
      <span aria-hidden="true">◷</span> {time || "--:--:--"}
    </span>
  );
}
