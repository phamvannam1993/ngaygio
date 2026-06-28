"use client";

import { useEffect, useState } from "react";

function getVNTime() {
  return new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" }));
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function r4(n: number) { return Math.round(n * 10000) / 10000; }

function clockNumPos(num: number, r = 32) {
  const angle = (num * 30 - 90) * (Math.PI / 180);
  return {
    x: r4(50 + r * Math.cos(angle)),
    y: r4(50 + r * Math.sin(angle)),
  };
}

export function VietnamClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(getVNTime());
    const id = setInterval(() => setNow(getVNTime()), 1000);
    return () => clearInterval(id);
  }, []);

  const h = now?.getHours() ?? 0;
  const m = now?.getMinutes() ?? 0;
  const s = now?.getSeconds() ?? 0;

  const secDeg = s * 6;
  const minDeg = m * 6 + s * 0.1;
  const hourDeg = (h % 12) * 30 + m * 0.5;

  const dateStr = now
    ? `${DAYS[now.getDay()]}, ${now.getDate()} ${MONTHS[now.getMonth()]} ${now.getFullYear()}`
    : "Giờ Việt Nam hiện tại được cập nhật trực tiếp theo ICT, UTC+7.";

  return (
    <div className="vnClockWrap">
      {/* Analog clock as SVG for crisp rendering at any size */}
      <div className="vnAnalogClock" aria-hidden="true">
        <svg viewBox="0 0 100 100" className="vnClockSvg" style={{ overflow: "visible" }}>
          {/* Outer ring — r=46 + strokeWidth=6 stays within 100x100 viewBox */}
          <circle cx="50" cy="50" r="46" fill="#f8f8f3" stroke="#1a1a1a" strokeWidth="6" />
          {/* Inner subtle ring */}
          <circle cx="50" cy="50" r="42" fill="none" stroke="#ddd" strokeWidth="0.5" />

          {/* Hour tick marks */}
          {Array.from({ length: 12 }, (_, i) => {
            const angle = (i * 30 - 90) * (Math.PI / 180);
            const x1 = r4(50 + 38 * Math.cos(angle));
            const y1 = r4(50 + 38 * Math.sin(angle));
            const x2 = r4(50 + 43 * Math.cos(angle));
            const y2 = r4(50 + 43 * Math.sin(angle));
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#333" strokeWidth="1.5" strokeLinecap="round" />;
          })}

          {/* Minute tick marks */}
          {Array.from({ length: 60 }, (_, i) => {
            if (i % 5 === 0) return null;
            const angle = (i * 6 - 90) * (Math.PI / 180);
            const x1 = r4(50 + 40 * Math.cos(angle));
            const y1 = r4(50 + 40 * Math.sin(angle));
            const x2 = r4(50 + 43 * Math.cos(angle));
            const y2 = r4(50 + 43 * Math.sin(angle));
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#aaa" strokeWidth="0.6" />;
          })}

          {/* Hour numbers 1–12 */}
          {Array.from({ length: 12 }, (_, i) => {
            const num = i + 1;
            const { x, y } = clockNumPos(num, 32);
            return (
              <text
                key={num}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="7.5"
                fontWeight="600"
                fontFamily="-apple-system, BlinkMacSystemFont, sans-serif"
                fill="#111"
              >
                {num}
              </text>
            );
          })}

          {/* Hour hand */}
          <line
            x1="50" y1="50"
            x2={r4(50 + 24 * Math.cos((hourDeg - 90) * Math.PI / 180))}
            y2={r4(50 + 24 * Math.sin((hourDeg - 90) * Math.PI / 180))}
            stroke="#111" strokeWidth="3" strokeLinecap="round"
          />
          {/* Minute hand */}
          <line
            x1="50" y1="50"
            x2={r4(50 + 33 * Math.cos((minDeg - 90) * Math.PI / 180))}
            y2={r4(50 + 33 * Math.sin((minDeg - 90) * Math.PI / 180))}
            stroke="#222" strokeWidth="2" strokeLinecap="round"
          />
          {/* Second hand */}
          <line
            x1={r4(50 - 8 * Math.cos((secDeg - 90) * Math.PI / 180))}
            y1={r4(50 - 8 * Math.sin((secDeg - 90) * Math.PI / 180))}
            x2={r4(50 + 38 * Math.cos((secDeg - 90) * Math.PI / 180))}
            y2={r4(50 + 38 * Math.sin((secDeg - 90) * Math.PI / 180))}
            stroke="#c0392b" strokeWidth="1.2" strokeLinecap="round"
          />
          {/* Center dot */}
          <circle cx="50" cy="50" r="2.5" fill="#c0392b" />
          <circle cx="50" cy="50" r="1" fill="#fff" />
        </svg>
      </div>

      {/* Digital time */}
      <p className="vnDigital">{now ? `${pad(h)}:${pad(m)}:${pad(s)}` : <span className="vnClockFallback">Vietnam time (ICT, UTC+7)</span>}</p>
      <p className="vnDate">{dateStr}</p>
    </div>
  );
}

export function VietnamCityTimes() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(getVNTime());
    const id = setInterval(() => setNow(getVNTime()), 1000);
    return () => clearInterval(id);
  }, []);

  const cities = [
    { en: "Ha Noi" },
    { en: "Da Nang" },
    { en: "Ho Chi Minh City" },
    { en: "Nha Trang" },
    { en: "Hue" },
    { en: "Can Tho" },
  ];

  const timeStr = now
    ? `${["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][now.getDay()]} ${pad(now.getHours())}:${pad(now.getMinutes())}`
    : "ICT (UTC+7)";

  return (
    <div className="citiesGrid">
      {cities.map((city) => (
        <div key={city.en} className="cityTimeCard">
          <span className="cityName">{city.en}</span>
          <span className="cityTime">{timeStr}</span>
        </div>
      ))}
    </div>
  );
}
