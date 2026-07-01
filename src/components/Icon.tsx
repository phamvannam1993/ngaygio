import type { ReactNode } from "react";
import type { ActivitySlug } from "@/lib/calendar/activity";
import type { ChiName } from "@/lib/calendar/types";

export type SiteIconName =
  | "calendar"
  | "clock"
  | "goodBad"
  | "perpetual"
  | "converter"
  | "age"
  | "check"
  | "cross"
  | "bagua"
  | "refresh"
  | "flag"
  | "bell"
  | "star"
  | "moon"
  | "book"
  | "sparkle"
  | "number"
  | "hourglass"
  | "compass"
  | "shield"
  | "heart"
  | "home"
  | "ring"
  | "building"
  | "car"
  | "contract"
  | "scissors"
  | "box"
  | "altar"
  | "fire"
  | "money"
  | "lantern"
  | "gift"
  | "temple"
  | "moonFull"
  | "tree"
  | "fireworks"
  | "vietnam"
  | "image"
  | "print"
  | "focus"
  | "facebook"
  | "youtube"
  | "zalo"
  | "tiktok";

type IconProps = {
  name: SiteIconName;
  className?: string;
  title?: string;
};

type SvgProps = {
  className?: string;
  title?: string;
  children: ReactNode;
  viewBox?: string;
};

function IconSvg({ className, title, children, viewBox = "0 0 24 24" }: SvgProps) {
  return (
    <svg
      className={["svgIcon", className].filter(Boolean).join(" ")}
      viewBox={viewBox}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}

const line = { stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" } as const;
const strongLine = { stroke: "currentColor", strokeWidth: 2.1, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export function SiteIcon({ name, className, title }: IconProps) {
  switch (name) {
    case "calendar":
      return <IconSvg className={className} title={title}><rect x="4" y="5" width="16" height="15" rx="3" {...line}/><path d="M8 3v4M16 3v4M4 9h16M8 13h2M12 13h2M16 13h1M8 17h2M12 17h2" {...line}/></IconSvg>;
    case "clock":
      return <IconSvg className={className} title={title}><circle cx="12" cy="12" r="8" {...line}/><path d="M12 7v5l3 2" {...strongLine}/></IconSvg>;
    case "goodBad":
    case "star":
      return <IconSvg className={className} title={title}><path d="m12 3 2.6 5.25 5.8.85-4.2 4.08 1 5.77L12 16.2l-5.2 2.75 1-5.77L3.6 9.1l5.8-.85L12 3Z" {...line}/></IconSvg>;
    case "perpetual":
      return <IconSvg className={className} title={title}><path d="M5 5.5h9.5A3.5 3.5 0 0 1 18 9v10.5H8.5A3.5 3.5 0 0 1 5 16V5.5Z" {...line}/><path d="M9 9h5M9 12h6M9 15h4" {...line}/></IconSvg>;
    case "converter":
    case "refresh":
      return <IconSvg className={className} title={title}><path d="M7 7h9.5l-2.2-2.2M17 17H7.5l2.2 2.2" {...strongLine}/><path d="M17 7a7 7 0 0 1 1 8M7 17a7 7 0 0 1-1-8" {...line}/></IconSvg>;
    case "age":
      return <IconSvg className={className} title={title}><circle cx="12" cy="8" r="3" {...line}/><path d="M5.5 19a6.7 6.7 0 0 1 13 0" {...line}/><path d="M18 7.5c1.5.7 2.5 2 3 3.6M6 7.5c-1.5.7-2.5 2-3 3.6" {...line}/></IconSvg>;
    case "check":
      return <IconSvg className={className} title={title}><circle cx="12" cy="12" r="9" fill="currentColor" opacity=".12"/><path d="m7.5 12.3 3 3L16.8 9" {...strongLine}/></IconSvg>;
    case "cross":
      return <IconSvg className={className} title={title}><circle cx="12" cy="12" r="9" fill="currentColor" opacity=".12"/><path d="m8.6 8.6 6.8 6.8M15.4 8.6l-6.8 6.8" {...strongLine}/></IconSvg>;
    case "bagua":
      return <IconSvg className={className} title={title} viewBox="0 0 64 64"><circle cx="32" cy="32" r="18" fill="currentColor" opacity=".08"/><path d="M32 14a18 18 0 1 0 0 36 9 9 0 1 0 0-18 9 9 0 1 1 0-18Z" fill="currentColor" opacity=".92"/><circle cx="32" cy="23" r="3" fill="white"/><circle cx="32" cy="41" r="3" fill="currentColor"/><path d="M13 20h8M43 20h8M13 44h8M43 44h8M20 13v8M44 13v8M20 43v8M44 43v8" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/></IconSvg>;
    case "flag":
      return <IconSvg className={className} title={title}><path d="M6 20V5M6 5h10l-1.4 3L16 11H6" {...line}/></IconSvg>;
    case "bell":
      return <IconSvg className={className} title={title}><path d="M18 10a6 6 0 0 0-12 0c0 6-2 6-2 8h16c0-2-2-2-2-8ZM10 21h4" {...line}/></IconSvg>;
    case "moon":
      return <IconSvg className={className} title={title}><path d="M18.5 15.5A8 8 0 0 1 8.5 5.5 8 8 0 1 0 18.5 15.5Z" {...line}/></IconSvg>;
    case "book":
      return <IconSvg className={className} title={title}><path d="M5 5h6a3 3 0 0 1 3 3v11a3 3 0 0 0-3-3H5V5ZM19 5h-5a3 3 0 0 0-3 3v11a3 3 0 0 1 3-3h5V5Z" {...line}/></IconSvg>;
    case "sparkle":
      return <IconSvg className={className} title={title}><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3ZM18 15l.8 2.2L21 18l-2.2.8L18 21l-.8-2.2L15 18l2.2-.8L18 15Z" {...line}/></IconSvg>;
    case "number":
      return <IconSvg className={className} title={title}><path d="M9 4 7 20M17 4l-2 16M4 9h16M3 15h16" {...strongLine}/></IconSvg>;
    case "hourglass":
      return <IconSvg className={className} title={title}><path d="M7 4h10M7 20h10M8 4c0 5 4 5 4 8s-4 3-4 8M16 4c0 5-4 5-4 8s4 3 4 8" {...line}/></IconSvg>;
    case "compass":
      return <IconSvg className={className} title={title}><circle cx="12" cy="12" r="8" {...line}/><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" {...line}/></IconSvg>;
    case "shield":
      return <IconSvg className={className} title={title}><path d="M12 3 5 6v5c0 4.8 2.9 8 7 10 4.1-2 7-5.2 7-10V6l-7-3Z" {...line}/><path d="m8.5 12 2.2 2.2 4.8-5" {...line}/></IconSvg>;
    case "heart":
      return <IconSvg className={className} title={title}><path d="M12 20s-7-4.4-8.6-9.2C2.2 7 4.3 4.5 7.4 4.5c1.8 0 3.4 1 4.6 2.5 1.2-1.5 2.8-2.5 4.6-2.5 3.1 0 5.2 2.5 4 6.3C19 15.6 12 20 12 20Z" {...line}/></IconSvg>;
    case "home":
      return <IconSvg className={className} title={title}><path d="M4 11.5 12 5l8 6.5V20h-5v-5H9v5H4v-8.5Z" {...line}/></IconSvg>;
    case "ring":
      return <IconSvg className={className} title={title}><path d="m9 4 3-2 3 2-3 4-3-4Z" {...line}/><circle cx="12" cy="14" r="6" {...line}/></IconSvg>;
    case "building":
      return <IconSvg className={className} title={title}><path d="M5 20h14M7 20V9l5-4 5 4v11M9.5 11h.01M14.5 11h.01M9.5 15h.01M14.5 15h.01" {...line}/></IconSvg>;
    case "car":
      return <IconSvg className={className} title={title}><path d="M5 15h14l-1.5-5h-11L5 15ZM7 15v3M17 15v3M8 18h1M15 18h1" {...line}/></IconSvg>;
    case "contract":
      return <IconSvg className={className} title={title}><path d="M6 3h9l3 3v15H6V3Z" {...line}/><path d="M14 3v4h4M9 10h6M9 14h6M9 18h3" {...line}/></IconSvg>;
    case "scissors":
      return <IconSvg className={className} title={title}><circle cx="6" cy="7" r="2.5" {...line}/><circle cx="6" cy="17" r="2.5" {...line}/><path d="M8.2 8.2 20 20M8.2 15.8 20 4" {...line}/></IconSvg>;
    case "box":
      return <IconSvg className={className} title={title}><path d="m12 3 8 4-8 4-8-4 8-4ZM4 7v10l8 4 8-4V7M12 11v10" {...line}/></IconSvg>;
    case "altar":
      return <IconSvg className={className} title={title}><path d="M6 20h12M8 20v-8h8v8M10 12V8a2 2 0 1 1 4 0v4M9 5c1.5-2 4.5-2 6 0" {...line}/></IconSvg>;
    case "fire":
      return <IconSvg className={className} title={title}><path d="M12 21c4 0 7-2.8 7-6.8 0-3.4-2.4-6-5.2-9.2-.5 3-2.4 4.5-4 5.7.1-2-1-3.3-1.8-4.2C6.8 9 5 11.2 5 14.2 5 18.2 8 21 12 21Z" {...line}/></IconSvg>;
    case "money":
      return <IconSvg className={className} title={title}><rect x="4" y="6" width="16" height="12" rx="2" {...line}/><circle cx="12" cy="12" r="2" {...line}/><path d="M7 9h.01M17 15h.01" {...strongLine}/></IconSvg>;
    case "lantern":
      return <IconSvg className={className} title={title}><path d="M9 4h6M9 20h6M8 7c2.5-1.5 5.5-1.5 8 0v10c-2.5 1.5-5.5 1.5-8 0V7ZM12 4v16M6 10h12M6 14h12" {...line}/></IconSvg>;
    case "gift":
      return <IconSvg className={className} title={title}><path d="M4 10h16v10H4V10ZM3 7h18v3H3V7ZM12 7v13" {...line}/><path d="M12 7c-4-4-7-1-4 0M12 7c4-4 7-1 4 0" {...line}/></IconSvg>;
    case "temple":
      return <IconSvg className={className} title={title}><path d="M4 10h16L12 5 4 10ZM6 10v8M10 10v8M14 10v8M18 10v8M4 18h16M3 21h18" {...line}/></IconSvg>;
    case "moonFull":
      return <IconSvg className={className} title={title}><circle cx="12" cy="12" r="8" {...line}/><path d="M8 9c2 1 5 1 8 0M7.5 14c2.8 1.2 6.2 1.2 9 0" {...line}/></IconSvg>;
    case "tree":
      return <IconSvg className={className} title={title}><path d="M12 3v18M8 21h8M12 4l-5 6h10l-4-5M12 9l-6 7h12l-5-6" {...line}/></IconSvg>;
    case "fireworks":
      return <IconSvg className={className} title={title}><path d="M12 4v4M12 16v4M4 12h4M16 12h4M6.3 6.3l2.8 2.8M14.9 14.9l2.8 2.8M17.7 6.3l-2.8 2.8M9.1 14.9l-2.8 2.8" {...line}/><circle cx="12" cy="12" r="2" fill="currentColor"/></IconSvg>;
    case "vietnam":
      return <IconSvg className={className} title={title}><rect x="4" y="6" width="16" height="12" rx="2" {...line}/><path d="m12 8 1.1 2.3 2.5.3-1.8 1.7.4 2.5-2.2-1.2-2.2 1.2.4-2.5-1.8-1.7 2.5-.3L12 8Z" fill="currentColor"/></IconSvg>;
    case "image":
      return <IconSvg className={className} title={title}><rect x="4" y="5" width="16" height="14" rx="3" {...line}/><circle cx="9" cy="10" r="1.5" fill="currentColor"/><path d="M6 17l4.5-4 3 2.5 2-2L19 17" {...line}/></IconSvg>;
    case "print":
      return <IconSvg className={className} title={title}><path d="M7 8V4h10v4M7 17H5a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-2M7 14h10v7H7v-7Z" {...line}/></IconSvg>;
    case "focus":
      return <IconSvg className={className} title={title}><circle cx="12" cy="12" r="7" {...line}/><circle cx="12" cy="12" r="2" fill="currentColor"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3" {...line}/></IconSvg>;
    case "facebook":
      return <IconSvg className={className} title={title}><circle cx="12" cy="12" r="9" {...line}/><path d="M13 20v-7h2.3l.4-3H13V8.4c0-.9.3-1.4 1.5-1.4H16V4.4c-.7-.1-1.5-.2-2.3-.2-2.4 0-4 1.5-4 4V10H7v3h2.7v7H13Z" fill="currentColor"/></IconSvg>;
    case "youtube":
      return <IconSvg className={className} title={title}><rect x="3" y="7" width="18" height="10" rx="3" {...line}/><path d="m10 10 5 2-5 2v-4Z" fill="currentColor"/></IconSvg>;
    case "zalo":
      return <IconSvg className={className} title={title}><rect x="4" y="5" width="16" height="14" rx="5" {...line}/><path d="M8 9h6l-6 6h6M16 9v6" {...line}/></IconSvg>;
    case "tiktok":
      return <IconSvg className={className} title={title}><path d="M14 4v10a4 4 0 1 1-4-4" {...line}/><path d="M14 5c1 2.5 2.7 3.7 5 3.8" {...line}/></IconSvg>;
    default:
      return <IconSvg className={className} title={title}><circle cx="12" cy="12" r="8" {...line}/></IconSvg>;
  }
}

export function ActivityIcon({ slug, className, title }: { slug: ActivitySlug; className?: string; title?: string }) {
  const iconByActivity: Record<ActivitySlug, SiteIconName> = {
    "khai-truong": "lantern",
    "cuoi-hoi": "ring",
    "dong-tho": "building",
    "nhap-trach": "home",
    "mua-xe": "car",
    "ky-hop-dong": "contract",
    "xuat-hanh": "compass",
    "cat-toc": "scissors",
    "chuyen-nha": "box",
    "dat-ban-tho": "altar",
  };
  return <SiteIcon name={iconByActivity[slug]} className={className} title={title} />;
}

export function EventIcon({ slug, className, title }: { slug: string; className?: string; title?: string }) {
  const iconByEvent: Record<string, SiteIconName> = {
    "tet-duong-lich": "fireworks",
    "ngay-30-4": "vietnam",
    "quoc-khanh": "star",
    "noel": "tree",
    "ong-cong-ong-tao": "fire",
    "tet-nguyen-dan": "gift",
    "than-tai": "money",
    "gio-to-hung-vuong": "temple",
    "vu-lan": "moonFull",
    "trung-thu": "lantern",
  };
  return <SiteIcon name={iconByEvent[slug] ?? "calendar"} className={className} title={title} />;
}

function ZodiacShape({ branch }: { branch: ChiName }) {
  switch (branch) {
    case "Tý": // Rat — big oval ears, round head, whiskers
      return <>
        <ellipse cx="32" cy="39" rx="15" ry="13"/>
        <ellipse cx="18" cy="21" rx="8" ry="11"/>
        <ellipse cx="46" cy="21" rx="8" ry="11"/>
        <circle cx="25" cy="36" r="2.5" fill="currentColor" stroke="none"/>
        <circle cx="39" cy="36" r="2.5" fill="currentColor" stroke="none"/>
        <ellipse cx="32" cy="46" rx="4" ry="3"/>
        <path d="M12 40 l11 2M12 44 l11 0M52 40 l-11 2M52 44 l-11 0"/>
        <path d="M46 52 q10 2 12-6"/>
      </>;
    case "Sửu": // Ox — wide head, outward-curved horns, muzzle, nose ring
      return <>
        <path d="M19 28 q-10-4-13-16 q6 4 13 14"/>
        <path d="M45 28 q10-4 13-16 q-6 4-13 14"/>
        <rect x="14" y="26" width="36" height="28" rx="12"/>
        <circle cx="24" cy="36" r="2.5" fill="currentColor" stroke="none"/>
        <circle cx="40" cy="36" r="2.5" fill="currentColor" stroke="none"/>
        <ellipse cx="32" cy="48" rx="9" ry="5"/>
        <path d="M27 47 q5-3 10 0"/>
      </>;
    case "Dần": // Tiger — round face, small ears, forehead stripes, whiskers
      return <>
        <circle cx="32" cy="36" r="19"/>
        <path d="M16 24 q2-12 8-14 q0 8-2 14"/>
        <path d="M48 24 q-2-12-8-14 q0 8 2 14"/>
        <circle cx="24" cy="33" r="3" fill="currentColor" stroke="none"/>
        <circle cx="40" cy="33" r="3" fill="currentColor" stroke="none"/>
        <path d="M28 44 q4-3 8 0"/>
        <path d="M27 17 q2-6 3-12M32 15 q0-7 1-11M37 17 q0-6-1-12"/>
      </>;
    case "Mão": // Cat — pointy triangle ears, cat eyes, whiskers
      return <>
        <circle cx="32" cy="37" r="18"/>
        <path d="M16 26 l3-15 13 11"/>
        <path d="M48 26 l-3-15-13 11"/>
        <ellipse cx="24" cy="34" rx="5" ry="3.5"/>
        <ellipse cx="40" cy="34" rx="5" ry="3.5"/>
        <circle cx="32" cy="43" r="3"/>
        <path d="M12 39 l12 2M12 43 l12 0M52 39 l-12 2M52 43 l-12 0"/>
      </>;
    case "Thìn": // Dragon — coiled body, head with horns, scales
      return <>
        <path d="M10 56 q12-8 14-18 q2-12 10-14 q10-2 16 6 q6 10-2 16 q-8 6-18 2"/>
        <ellipse cx="40" cy="22" rx="13" ry="9"/>
        <circle cx="35" cy="20" r="2.5" fill="currentColor" stroke="none"/>
        <path d="M48 18 l7-8M50 22 l8-1"/>
        <path d="M42 14 q2-6 2-10M36 13 q-1-5 0-9"/>
        <path d="M44 30 l-4 6 3 6"/>
        <path d="M28 46 q4-4 8-2"/>
      </>;
    case "Tỵ": // Snake — S-curve coil, raised head, forked tongue
      return <>
        <path d="M12 58 q18-4 18-16 q0-12-10-14 q-10-2-6-14 q4-10 18-10 q10 0 14 8"/>
        <ellipse cx="46" cy="12" rx="10" ry="7"/>
        <circle cx="41" cy="10" r="2" fill="currentColor" stroke="none"/>
        <path d="M56 10 l5-4M56 12 l5 4"/>
        <circle cx="49" cy="11" r="1.5" fill="currentColor" stroke="none"/>
      </>;
    case "Ngọ": // Horse — long oval face, flowing mane, nostril ellipses
      return <>
        <ellipse cx="32" cy="38" rx="13" ry="21"/>
        <path d="M21 22 q-2-10 2-16M25 19 q0-10 4-14M29 17 q2-8 4-13"/>
        <circle cx="25" cy="33" r="3" fill="currentColor" stroke="none"/>
        <circle cx="39" cy="33" r="3" fill="currentColor" stroke="none"/>
        <ellipse cx="27" cy="48" rx="3" ry="2.5"/>
        <ellipse cx="37" cy="48" rx="3" ry="2.5"/>
      </>;
    case "Mùi": // Goat — curved backward horns, round face, chin beard
      return <>
        <path d="M22 28 q-4-10-2-20"/>
        <path d="M42 28 q4-10 2-20"/>
        <circle cx="32" cy="38" r="17"/>
        <circle cx="24" cy="35" r="2.5" fill="currentColor" stroke="none"/>
        <circle cx="40" cy="35" r="2.5" fill="currentColor" stroke="none"/>
        <path d="M28 45 q4-3 8 0"/>
        <path d="M27 54 q5 6 10 3"/>
      </>;
    case "Thân": // Monkey — large side ears, protruding muzzle, tail
      return <>
        <ellipse cx="15" cy="33" rx="6" ry="9"/>
        <ellipse cx="49" cy="33" rx="6" ry="9"/>
        <circle cx="32" cy="33" r="18"/>
        <ellipse cx="32" cy="44" rx="11" ry="7"/>
        <circle cx="25" cy="29" r="3" fill="currentColor" stroke="none"/>
        <circle cx="39" cy="29" r="3" fill="currentColor" stroke="none"/>
        <path d="M28 44 q4-3 8 0"/>
        <path d="M50 52 q6 4 8 12"/>
      </>;
    case "Dậu": // Rooster — comb on top, beak to right, wattle below
      return <>
        <path d="M26 20 q-4-8 2-14 q5 4 6 14"/>
        <path d="M34 16 q2-8 8-12"/>
        <circle cx="32" cy="37" r="16"/>
        <path d="M46 30 q10-2 12 4 q-4 8-14 6"/>
        <circle cx="26" cy="31" r="3" fill="currentColor" stroke="none"/>
        <path d="M38 35 l8 2"/>
        <path d="M28 45 q4-3 8 0"/>
        <path d="M48 40 q4 4 2 10"/>
      </>;
    case "Tuất": // Dog — floppy hanging ears, friendly round face, big nose
      return <>
        <path d="M16 30 q-8 0-10 10 q-2 12 8 16 q2-10 8-16"/>
        <path d="M48 30 q8 0 10 10 q2 12-8 16 q-2-10-8-16"/>
        <circle cx="32" cy="33" r="18"/>
        <circle cx="25" cy="29" r="3" fill="currentColor" stroke="none"/>
        <circle cx="39" cy="29" r="3" fill="currentColor" stroke="none"/>
        <ellipse cx="32" cy="46" rx="8" ry="6"/>
        <path d="M28 44 q4-3 8 0"/>
      </>;
    case "Hợi": // Pig — small round ears, large circular snout with nostrils
      return <>
        <circle cx="32" cy="36" r="19"/>
        <path d="M19 22 q-2-10 6-13 q2 6 0 13"/>
        <path d="M45 22 q2-10-6-13 q-2 6 0 13"/>
        <circle cx="25" cy="30" r="3" fill="currentColor" stroke="none"/>
        <circle cx="39" cy="30" r="3" fill="currentColor" stroke="none"/>
        <circle cx="32" cy="47" r="9"/>
        <circle cx="28" cy="46" r="2.5" fill="currentColor" stroke="none"/>
        <circle cx="36" cy="46" r="2.5" fill="currentColor" stroke="none"/>
      </>;
    default:
      return <circle cx="32" cy="32" r="18"/>;
  }
}

const zodiacTitle: Record<ChiName, string> = {
  Tý: "Con chuột",
  Sửu: "Con trâu",
  Dần: "Con hổ",
  Mão: "Con mèo",
  Thìn: "Con rồng",
  Tỵ: "Con rắn",
  Ngọ: "Con ngựa",
  Mùi: "Con dê",
  Thân: "Con khỉ",
  Dậu: "Con gà",
  Tuất: "Con chó",
  Hợi: "Con heo",
};

const zodiacImage: Record<ChiName, string> = {
  Tý:  "/icon-con-giap/icon_chuot.jpg",
  Sửu: "/icon-con-giap/icon_trau.jpg",
  Dần: "/icon-con-giap/icon_ho.jpg",
  Mão: "/icon-con-giap/icon_meo.jpg",
  Thìn:"/icon-con-giap/icon_rong.jpg",
  Tỵ:  "/icon-con-giap/icon_ran.jpg",
  Ngọ: "/icon-con-giap/icon_ngua.jpg",
  Mùi: "/icon-con-giap/icon_de.jpg",
  Thân:"/icon-con-giap/icon_khi.jpg",
  Dậu: "/icon-con-giap/icon_ga.jpg",
  Tuất:"/icon-con-giap/icon_cho.jpg",
  Hợi: "/icon-con-giap/icon_lon.jpg",
};

export function ZodiacIcon({ branch, className, title }: { branch: ChiName; className?: string; title?: string }) {
  const label = title ?? zodiacTitle[branch];
  return (
    <img
      src={zodiacImage[branch]}
      alt={label}
      className={["zodiacImg", className].filter(Boolean).join(" ")}
      loading="lazy"
    />
  );
}
