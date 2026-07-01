import Link from "next/link";

export function Logo() {
  return (
    <Link className="logo" href="/" aria-label="Ngày Giờ về trang chủ">
      <span className="logoIconWrap" aria-hidden="true">
        <svg className="logoIcon" viewBox="0 0 64 64" role="img">
          <rect x="10" y="12" width="44" height="42" rx="10" fill="none" stroke="currentColor" strokeWidth="5" />
          <path d="M20 8v10M44 8v10" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="5" />
          <circle cx="32" cy="34" r="12" fill="none" stroke="currentColor" strokeWidth="4" />
          <path d="M32 26v9l7 4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
        </svg>
      </span>
      <span className="logoText">
        <strong>NgayGio<small>.vn</small></strong>
        <em>Lịch ngày – Giờ tốt – Việc thuận lợi</em>
      </span>
    </Link>
  );
}
