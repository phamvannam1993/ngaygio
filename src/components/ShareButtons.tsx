"use client";

import { useEffect, useState } from "react";

type Props = {
  url?: string;
  title?: string;
};

export function ShareButtons({ url, title }: Props) {
  const [copied, setCopied] = useState(false);
  // Resolve URL client-side only to avoid server/client mismatch
  const [pageUrl, setPageUrl] = useState(url ?? "");

  useEffect(() => {
    setPageUrl(url ?? window.location.href);
  }, [url]);

  function handleCopy() {
    navigator.clipboard?.writeText(pageUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const encodedUrl = encodeURIComponent(pageUrl);
  const encodedTitle = encodeURIComponent(title ?? "Lịch âm dương – Ngaygio.vn");

  return (
    <div className="shareButtons" aria-label="Chia sẻ trang này">
      <span className="shareLabel">Chia sẻ:</span>

      {/* Facebook */}
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="shareBtn fbBtn"
        aria-label="Chia sẻ lên Facebook"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
        </svg>
        Facebook
      </a>

      {/* Zalo */}
      <a
        href={`https://zalo.me/share/url?url=${encodedUrl}&title=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className="shareBtn zaloBtn"
        aria-label="Chia sẻ qua Zalo"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm-1.5 5.5c-1.933 0-3.5 1.567-3.5 3.5s1.567 3.5 3.5 3.5c.663 0 1.28-.184 1.807-.504L14 16l-1.165-2.342A3.482 3.482 0 0013.5 11c0-1.933-1.567-3.5-3.5-3.5zm0 1.5c1.105 0 2 .895 2 2s-.895 2-2 2-2-.895-2-2 .895-2 2-2zm5.5-1v7h1.5V11h1V9.5h-1V8h-1.5z"/>
        </svg>
        Zalo
      </a>

      {/* Copy link */}
      <button
        type="button"
        onClick={handleCopy}
        className="shareBtn copyBtn"
        aria-label="Sao chép đường dẫn"
      >
        {copied ? (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Đã sao chép!
          </>
        ) : (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
            </svg>
            Sao chép link
          </>
        )}
      </button>
    </div>
  );
}
