import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { VietnamClock, VietnamCityTimes } from "@/components/VietnamClock";
import { getVietnamTodayParts } from "@/lib/date";
import { siteConfig, webPageSchema, faqSchema } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Current Time in Vietnam (GMT+7) – Giờ Việt Nam | Ngày Giờ",
  description: "Current local time in Vietnam is GMT+7 (Indochina Time, ICT). See live clock, time in Ha Noi, Ho Chi Minh City, Da Nang and Vietnam country info.",
  alternates: { canonical: `${siteConfig.url}/time-in-vietnam` },
  openGraph: {
    title: "Current Time in Vietnam (GMT+7)",
    description: "Live clock showing current local time in Vietnam (ICT, UTC+7). Time in Hanoi, Ho Chi Minh City, Da Nang.",
    url: `${siteConfig.url}/time-in-vietnam`,
    siteName: siteConfig.name,
    locale: "en_US",
    type: "website",
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
};

const countryInfo = [
  { label: "Country", value: "Vietnam" },
  { label: "Long Name", value: "Socialist Republic of Vietnam" },
  { label: "Abbreviations", value: "VN, VNM" },
  { label: "Capital", value: "Hanoi" },
  { label: "Time Zone", value: "ICT – Indochina Time (UTC/GMT +7)" },
  { label: "Dial Code", value: "+84" },
  { label: "Currency", value: "Vietnamese Dong (VND)" },
  { label: "Official Language", value: "Vietnamese" },
];

export default function TimeInVietnamPage() {
  const today = getVietnamTodayParts();

  const jsonLd = [
    webPageSchema({
      name: "Current Time in Vietnam",
      url: `${siteConfig.url}/time-in-vietnam`,
      description: "Live current local time in Vietnam (GMT+7, ICT). Vietnam uses a single time zone — Indochina Time (ICT), UTC+7, with no daylight saving time.",
      breadcrumb: [
        { name: "Home", url: siteConfig.url },
        { name: "Time in Vietnam", url: `${siteConfig.url}/time-in-vietnam` },
      ],
    }),
    faqSchema([
      { q: "What time zone is Vietnam in?", a: "Vietnam uses Indochina Time (ICT), which is UTC+7 (GMT+7). The entire country uses a single time zone with no daylight saving time adjustments." },
      { q: "Does Vietnam observe daylight saving time?", a: "No. Vietnam does not observe daylight saving time (DST). The time in Vietnam stays at UTC+7 (ICT) all year round." },
      { q: "What is the current time in Hanoi?", a: "Hanoi, Da Nang, Ho Chi Minh City, and all cities in Vietnam share the same time zone: Indochina Time (ICT), UTC+7. The current time is the same across the country." },
      { q: "What is the time difference between Vietnam and the US?", a: "Vietnam (ICT, UTC+7) is 12 hours ahead of US Eastern Standard Time (EST, UTC-5), and 15 hours ahead of US Pacific Standard Time (PST, UTC-8). During US daylight saving, the difference is 11 and 14 hours respectively." },
      { q: "What is the time difference between Vietnam and the UK?", a: "Vietnam (UTC+7) is 7 hours ahead of the UK (GMT, UTC+0) in winter, and 6 hours ahead when the UK is on British Summer Time (BST, UTC+1)." },
    ]),
    {
      "@context": "https://schema.org",
      "@type": "Country",
      "name": "Vietnam",
      "alternateName": "Socialist Republic of Vietnam",
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "14.0583",
        "longitude": "108.2772"
      },
      "telephone": "+84",
      "currenciesAccepted": "VND",
      "url": "https://en.wikipedia.org/wiki/Vietnam"
    }
  ];

  return (
    <>
      <Header currentYear={today.year} />
      <main className="container mainStack">

        {/* Hero: Clock + Country Info */}
        <section className="vnHeroSection" aria-labelledby="time-vn-title">
          <h1 id="time-vn-title" className="vnHeroTitle">Current Local Time in Vietnam</h1>
          <p className="vnHeroSubtitle">Vietnam Time Zone: <strong>ICT – Indochina Time (UTC+7 / GMT+7)</strong> · No daylight saving time</p>

          <div className="vnHeroCard">
            {/* Clock panel */}
            <div className="vnClockPanel">
              <VietnamClock />
            </div>

            {/* Country info */}
            <div className="vnInfoPanel">
              <table className="vnInfoTable">
                <tbody>
                  {countryInfo.map(({ label, value }) => (
                    <tr key={label}>
                      <th>{label}:</th>
                      <td>{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Vietnam map */}
            <div className="vnMapPanel" aria-label="Bản đồ Việt Nam">
              <Image
                src="/ban_do.jpeg"
                alt="Bản đồ Việt Nam"
                width={360}
                height={480}
                className="vnMapImg"
              />
            </div>
          </div>
        </section>

        {/* City times */}
        <section className="panelCard" aria-labelledby="city-times-title">
          <p className="eyebrow">Real-time clocks</p>
          <h2 id="city-times-title">Current Local Time in Major Cities of Vietnam</h2>
          <p style={{ marginBottom: "16px", color: "var(--muted)", fontSize: "0.9rem" }}>
            All cities in Vietnam share the same time zone (ICT, UTC+7).
          </p>
          <VietnamCityTimes />
        </section>

        {/* Time zone info */}
        <section className="panelCard" aria-labelledby="tz-info-title">
          <p className="eyebrow">Time zone reference</p>
          <h2 id="tz-info-title">Vietnam Time Zone (ICT) vs Other Countries</h2>
          <div style={{ overflowX: "auto" }}>
            <table className="vnInfoTable tzTable">
              <thead>
                <tr>
                  <th>City / Country</th>
                  <th>Time Zone</th>
                  <th>Difference from Vietnam</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { city: "Vietnam (Hanoi, HCMC)", tz: "ICT (UTC+7)", diff: "–" },
                  { city: "Bangkok, Thailand", tz: "ICT (UTC+7)", diff: "Same time" },
                  { city: "Singapore / Kuala Lumpur", tz: "SGT/MYT (UTC+8)", diff: "+1 hour" },
                  { city: "Beijing / Shanghai, China", tz: "CST (UTC+8)", diff: "+1 hour" },
                  { city: "Tokyo / Seoul", tz: "JST/KST (UTC+9)", diff: "+2 hours" },
                  { city: "Sydney, Australia (AEST)", tz: "AEST (UTC+10)", diff: "+3 hours" },
                  { city: "Dubai (UAE)", tz: "GST (UTC+4)", diff: "–3 hours" },
                  { city: "London, UK (GMT)", tz: "GMT (UTC+0)", diff: "–7 hours" },
                  { city: "Paris, Germany (CET)", tz: "CET (UTC+1)", diff: "–6 hours" },
                  { city: "New York, USA (EST)", tz: "EST (UTC–5)", diff: "–12 hours" },
                  { city: "Los Angeles, USA (PST)", tz: "PST (UTC–8)", diff: "–15 hours" },
                ].map(({ city, tz, diff }) => (
                  <tr key={city}>
                    <td>{city}</td>
                    <td>{tz}</td>
                    <td style={{ color: diff === "–" ? "var(--muted)" : diff.startsWith("+") ? "var(--green-700)" : "var(--accent)" }}>
                      {diff}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* SEO article */}
        <article className="seoArticle">
          <h2>Vietnam Time Zone: Indochina Time (ICT)</h2>
          <p>Vietnam operates on <strong>Indochina Time (ICT)</strong>, which is <strong>UTC+7 (GMT+7)</strong>. This time zone is shared with Thailand, Laos, and Cambodia. Importantly, Vietnam <strong>does not observe daylight saving time</strong>, so the offset from UTC remains +7 hours throughout the entire year.</p>

          <h2>Time in Hanoi vs Ho Chi Minh City</h2>
          <p>Unlike some large countries, Vietnam uses a <strong>single time zone</strong> for the entire country. This means Hanoi (in the north), Da Nang (in the center), and Ho Chi Minh City (in the south) all share the exact same local time. There is no time difference between Vietnamese cities.</p>

          <h2>History of Vietnam's Time Zone</h2>
          <p>Vietnam briefly used UTC+8 during the 1970s but switched back to UTC+7 in 1975 after reunification. The country has maintained ICT (UTC+7) ever since. Vietnam is one of the few countries in Southeast Asia that has never adopted daylight saving time.</p>

          <h2>Lịch âm Việt Nam hôm nay</h2>
          <div className="dayLinkList">
            <Link href="/lich-hom-nay" className="eventPill green">Lịch hôm nay (Vietnamese)</Link>
            <Link href="/am-lich-hom-nay" className="eventPill blue">Âm lịch hôm nay</Link>
            <Link href="/gio-hoang-dao-hom-nay" className="eventPill blue">Giờ hoàng đạo hôm nay</Link>
          </div>
        </article>
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
