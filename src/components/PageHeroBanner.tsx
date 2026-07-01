type PageHeroBannerProps = {
  eyebrow?: string;
  title: string;
  description: string;
  imageSrc: string;
  align?: "left" | "right";
  compact?: boolean;
};

export function PageHeroBanner({
  eyebrow = "Tra cứu nhanh",
  title,
  description,
  imageSrc,
  align = "left",
  compact = false,
}: PageHeroBannerProps) {
  const fullscreenStyle = {
    backgroundImage: `linear-gradient(90deg, rgba(255,255,255,.94) 0%, rgba(255,255,255,.82) 42%, rgba(255,255,255,.52) 100%), linear-gradient(180deg, rgba(245,251,247,.18) 0%, rgba(245,251,247,.9) 100%), url(${imageSrc})`,
  };

  return (
    <>
      <div className="pageFullscreenBg" style={fullscreenStyle} aria-hidden="true" />
      <section className={["pageHeroBanner", align === "right" ? "isRight" : "", compact ? "isCompact" : ""].filter(Boolean).join(" ")}>
        <div className="pageHeroBannerInner">
          <div className="pageHeroContent">
            <p className="eyebrow">{eyebrow}</p>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>
        </div>
      </section>
    </>
  );
}
