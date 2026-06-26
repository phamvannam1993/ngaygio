import Link from "next/link";

export function Logo() {
  return (
    <Link className="logo" href="/" aria-label="Ngày Giờ về trang chủ">
      <svg aria-hidden="true" className="logoIcon" viewBox="0 0 64 64" role="img">
        <circle cx="32" cy="32" r="26" fill="none" stroke="currentColor" strokeWidth="6" />
        <path d="M32 17v17l14 9" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="6" />
        <path d="M32 8v5M32 51v5M8 32h5M51 32h5" stroke="currentColor" strokeLinecap="round" strokeWidth="5" />
      </svg>
      <span>
        <strong>NGAYGIO</strong><small>.VN</small>
      </span>
    </Link>
  );
}
