import type { ReactNode } from "react";

type PageHeroBannerProps = {
  eyebrow?: string;
  title: string;
  description: string;
  imageSrc: string;
  align?: "left" | "right";
  compact?: boolean;
  /**
   * "fullscreen" (mặc định): `imageSrc` phủ nền cả trang, hero chỉ là lớp kính mờ.
   * "inset": `imageSrc` nằm gọn trong thẻ hero — dùng cho ảnh đã có sẵn khoảng trắng và artwork.
   */
  mode?: "fullscreen" | "inset";
  /** Ảnh nền cả trang khi dùng mode "inset" (hero và nền trang là hai ảnh khác nhau). */
  backgroundSrc?: string;
  children?: ReactNode;
};

export function PageHeroBanner({
  eyebrow = "Tra cứu nhanh",
  title,
  description,
  imageSrc,
  align = "left",
  compact = false,
  mode = "fullscreen",
  backgroundSrc,
  children,
}: PageHeroBannerProps) {
  const isInset = mode === "inset";
  const fullscreenSrc = isInset ? backgroundSrc : imageSrc;

  const fullscreenStyle = {
    backgroundImage: `linear-gradient(90deg, rgba(255,255,255,.94) 0%, rgba(255,255,255,.82) 42%, rgba(255,255,255,.52) 100%), linear-gradient(180deg, rgba(245,251,247,.18) 0%, rgba(245,251,247,.9) 100%), url(${fullscreenSrc})`,
  };

  return (
    <>
      {fullscreenSrc && <div className="pageFullscreenBg" style={fullscreenStyle} aria-hidden="true" />}
      <section
        className={["pageHeroBanner", align === "right" ? "isRight" : "", compact ? "isCompact" : "", isInset ? "isInset" : ""].filter(Boolean).join(" ")}
        style={isInset ? { backgroundImage: `url(${imageSrc})` } : undefined}
      >
        <div className="pageHeroBannerInner">
          <div className="pageHeroContent">
            <p className="eyebrow">{eyebrow}</p>
            <h1>{title}</h1>
            <p className="pageHeroDesc">{description}</p>
            {children}
          </div>
        </div>
      </section>
    </>
  );
}
