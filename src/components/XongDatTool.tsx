import Link from "next/link";
import { getCompatibilityResult } from "@/lib/calendar/compatibility";
import { getAgeCompatibility } from "@/lib/calendar/good-bad";
import { getAgeResult, isValidBirthYear } from "@/lib/calendar/age";
import { getVietnamTodayParts } from "@/lib/date";
import { getTetInfo } from "@/lib/calendar/tet";
import { ZodiacIcon } from "./Icon";
import type { ChiName } from "@/lib/calendar/types";

type SearchParams = Record<string, string | string[] | undefined>;

function single(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function scoreClass(score: number) {
  if (score >= 82) return "excellent";
  if (score >= 68) return "good";
  if (score >= 52) return "ok";
  return "avoid";
}

type ChiSuggestion = {
  chi: ChiName;
  animal: string;
  score: number;
  relation: string;
  napAm: string;
  years: Array<{ year: number; age: number }>;
};

// Gom năm sinh trưởng thành (18–70 tuổi) theo từng con giáp.
function adultYearsByChi(tetYear: number): Map<ChiName, Array<{ year: number; age: number }>> {
  const groups = new Map<ChiName, Array<{ year: number; age: number }>>();
  for (let year = tetYear - 70; year <= tetYear - 18; year += 1) {
    const info = getAgeResult(year, tetYear);
    const list = groups.get(info.birthChi) ?? [];
    list.push({ year, age: tetYear - year });
    groups.set(info.birthChi, list);
  }
  return groups;
}

function buildSuggestion(chi: ChiName, relation: string, hostYear: number, tetYear: number, groups: Map<ChiName, Array<{ year: number; age: number }>>): ChiSuggestion | null {
  const years = groups.get(chi);
  if (!years || years.length === 0) return null;
  const rep = years[years.length - 1]; // đại diện: người trưởng thành gần nhất
  const repInfo = getAgeResult(rep.year, tetYear);
  const comp = getCompatibilityResult(hostYear, rep.year, "tong-quan");
  return {
    chi,
    animal: repInfo.animal,
    score: comp.score,
    relation,
    napAm: repInfo.napAm,
    years: years.slice(-4).reverse(),
  };
}

function uniqueChi(list: ChiName[]): ChiName[] {
  return Array.from(new Set(list));
}

// Chọn tuổi xông đất theo quan hệ can chi truyền thống: tam hợp/lục hợp = hợp; tứ hành xung/lục hại = tránh.
function rankAgesForHost(hostChi: ChiName, hostYear: number, tetYear: number): { good: ChiSuggestion[]; avoid: ChiSuggestion[] } {
  const rel = getAgeCompatibility(hostChi);
  const groups = adultYearsByChi(tetYear);

  const goodChis: Array<{ chi: ChiName; relation: string }> = [
    { chi: rel.lucHop, relation: "Lục hợp" },
    ...rel.tamHop.map((chi) => ({ chi, relation: `Tam hợp ${rel.tamHopElement}` })),
  ];
  const avoidChis: Array<{ chi: ChiName; relation: string }> = [
    ...rel.xung.map((chi) => ({ chi, relation: "Tứ hành xung" })),
    { chi: rel.hai, relation: "Lục hại" },
  ];

  const good = uniqueChi(goodChis.map((g) => g.chi))
    .map((chi) => buildSuggestion(chi, goodChis.find((g) => g.chi === chi)!.relation, hostYear, tetYear, groups))
    .filter((s): s is ChiSuggestion => s !== null)
    .sort((a, b) => b.score - a.score);

  const avoid = uniqueChi(avoidChis.map((g) => g.chi))
    .map((chi) => buildSuggestion(chi, avoidChis.find((g) => g.chi === chi)!.relation, hostYear, tetYear, groups))
    .filter((s): s is ChiSuggestion => s !== null);

  return { good, avoid };
}

export function XongDatTool({ params, canonicalPath }: { params?: SearchParams; canonicalPath: string }) {
  const today = getVietnamTodayParts();
  const tet = getTetInfo(today);
  const tetYear = tet.year;

  const rawYear = Number(single(params?.namSinh));
  const hasInput = isValidBirthYear(rawYear);
  const hostYear = hasInput ? rawYear : undefined;

  const host = hostYear ? getAgeResult(hostYear, tetYear) : undefined;
  const { good, avoid } = host ? rankAgesForHost(host.birthChi, hostYear!, tetYear) : { good: [], avoid: [] };

  return (
    <>
      <section className="panelCard ageSearch" aria-labelledby="xongdat-form-title">
        <div className="ngdSectionHead compact">
          <p className="eyebrow">Xem tuổi xông đất {tetYear}</p>
          <h2 id="xongdat-form-title">Nhập năm sinh gia chủ</h2>
        </div>
        <form className="ageForm compatForm" action={canonicalPath} method="get">
          <label>
            <span>Năm sinh gia chủ (dương lịch)</span>
            <input name="namSinh" type="number" min="1900" max="2050" defaultValue={hostYear ?? ""} inputMode="numeric" placeholder="Ví dụ: 1990" />
          </label>
          <button type="submit">Xem tuổi hợp xông đất</button>
        </form>
      </section>

      {host && (
        <section className="panelCard" aria-labelledby="host-title">
          <div className="ngdSectionHead compact">
            <p className="eyebrow">Gia chủ</p>
            <h2 id="host-title">Gia chủ tuổi {host.birthCanChi} ({host.animal})</h2>
          </div>
          <div className="compatIdentity">
            <ZodiacIcon branch={host.birthChi} />
            <span>
              <strong>{hostYear} · {host.birthCanChi}</strong>
              <small>Con {host.animal} · Nạp âm {host.napAm} · Hành {host.element}</small>
            </span>
          </div>
          <p style={{ marginTop: 10 }}>
            Xông đất Tết <strong>{tet.canChi} {tetYear}</strong> (mùng 1 rơi vào {tet.solarDate.day}/{tet.solarDate.month}/{tet.solarDate.year} dương lịch).
            Nên chọn người xông đất có tuổi hợp với gia chủ, đang gặp nhiều may mắn, tính tình vui vẻ và không có tang.
          </p>
        </section>
      )}

      {host && good.length > 0 && (
        <section className="panelCard" aria-labelledby="good-title">
          <div className="ngdSectionHead compact">
            <p className="eyebrow">Tuổi hợp xông đất</p>
            <h2 id="good-title">Tuổi hợp xông đất cho gia chủ {host.birthCanChi}</h2>
          </div>
          <div className="bestDateGrid">
            {good.map((s) => (
              <article key={s.chi} className={["panelCard compatResultPanel", scoreClass(s.score)].join(" ")}>
                <div className="compatIdentity">
                  <ZodiacIcon branch={s.chi} />
                  <span>
                    <strong>Tuổi {s.chi} · Con {s.animal}</strong>
                    <small>{s.relation}</small>
                  </span>
                </div>
                <p style={{ margin: "8px 0 4px" }}><strong>Độ hợp:</strong> {s.score}/100</p>
                <p><strong>Các tuổi nên chọn:</strong> {s.years.map((y) => `${y.year} (${y.age} tuổi)`).join(", ")}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      {host && avoid.length > 0 && (
        <section className="panelCard" aria-labelledby="avoid-title">
          <div className="ngdSectionHead compact">
            <p className="eyebrow">Tuổi nên tránh</p>
            <h2 id="avoid-title">Tuổi nên tránh xông đất cho gia chủ {host.birthCanChi}</h2>
          </div>
          <div className="bestDateGrid">
            {avoid.map((s) => (
              <article key={s.chi} className="panelCard compatResultPanel avoid">
                <div className="compatIdentity">
                  <ZodiacIcon branch={s.chi} />
                  <span>
                    <strong>Tuổi {s.chi} · Con {s.animal}</strong>
                    <small>{s.relation}</small>
                  </span>
                </div>
                <p style={{ marginTop: 8 }}>Xung/hại với gia chủ, nên tránh nhờ xông đất năm nay.</p>
              </article>
            ))}
          </div>
          <p className="disclaimer" style={{ marginTop: 10 }}>Kết quả dựa trên tương hợp can chi, ngũ hành theo quan niệm dân gian, mang tính tham khảo.</p>
        </section>
      )}

      {!host && (
        <section className="panelCard" aria-label="Gợi ý">
          <p>Nhập năm sinh gia chủ ở trên để xem danh sách <strong>tuổi hợp xông đất Tết {tet.canChi} {tetYear}</strong>, kèm các tuổi cụ thể nên mời và những tuổi nên tránh.</p>
          <div className="dayLinkList" style={{ marginTop: 10 }}>
            <Link href="/xem-tuoi-hop" className="eventPill green">Xem tuổi hợp tổng quan</Link>
            <Link href="/con-bao-nhieu-ngay-den-tet" className="eventPill blue">Còn bao nhiêu ngày đến Tết</Link>
            <Link href="/gio-hoang-dao-hom-nay" className="eventPill green">Giờ hoàng đạo</Link>
          </div>
        </section>
      )}
    </>
  );
}
