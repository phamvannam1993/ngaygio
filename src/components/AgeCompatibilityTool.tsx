import Link from "next/link";
import { getChildYearResult, getCompatibilityResult, getFengShuiAgeInfo, getHouseAgeCheck, nearbyYears, type CompatibilityPurpose, type GenderValue } from "@/lib/calendar/compatibility";
import { getVietnamTodayParts } from "@/lib/date";
import { ZodiacIcon } from "./Icon";

type SearchParams = Record<string, string | string[] | undefined>;

type Props = {
  purpose: CompatibilityPurpose;
  params?: SearchParams;
  title: string;
  description: string;
  canonicalPath: string;
};

function single(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function intParam(params: SearchParams | undefined, key: string, fallback: number, min = 1900, max = 2050) {
  const raw = Number(single(params?.[key]));
  return Number.isInteger(raw) && raw >= min && raw <= max ? raw : fallback;
}

function genderParam(params: SearchParams | undefined, fallback: GenderValue = "nam"): GenderValue {
  const raw = single(params?.gioiTinh);
  return raw === "nu" ? "nu" : fallback;
}

function toneClass(tone: "good" | "bad" | "neutral") {
  if (tone === "good") return "good";
  if (tone === "bad") return "bad";
  return "neutral";
}

function scoreClass(score: number) {
  if (score >= 82) return "excellent";
  if (score >= 68) return "good";
  if (score >= 52) return "ok";
  return "avoid";
}

function YearIdentity({ year, canChi, animal, chi }: { year: number; canChi: string; animal: string; chi: Parameters<typeof ZodiacIcon>[0]["branch"] }) {
  return (
    <div className="compatIdentity">
      <ZodiacIcon branch={chi} />
      <span>
        <strong>{year} · {canChi}</strong>
        <small>Con {animal}</small>
      </span>
    </div>
  );
}

function CompatibilityResultPanel({ result }: { result: ReturnType<typeof getCompatibilityResult> }) {
  return (
    <section className={["panelCard compatResultPanel", scoreClass(result.score)].join(" ")} aria-labelledby="compat-result-title">
      <div className="compatResultHead">
        <div>
          <p className="eyebrow">Kết quả hợp tuổi</p>
          <h2 id="compat-result-title">{result.personA.birthCanChi} và {result.personB.birthCanChi}: {result.label}</h2>
          <p>{result.summary}</p>
        </div>
        <div className="compatScore"><strong>{result.score}</strong><span>/100</span></div>
      </div>
      <div className="compatPeopleGrid">
        <YearIdentity year={result.yearA} canChi={result.personA.birthCanChi} animal={result.personA.animal} chi={result.personA.birthChi} />
        <YearIdentity year={result.yearB} canChi={result.personB.birthCanChi} animal={result.personB.animal} chi={result.personB.birthChi} />
      </div>
      <div className="compatBreakdown">
        {result.reasons.map((reason) => (
          <span key={reason.label} className={toneClass(reason.tone)}>{reason.points > 0 ? "+" : ""}{reason.points} · {reason.label}</span>
        ))}
      </div>
      <div className="bestDateGrid compatNoteGrid">
        <article>
          <h3>Điểm thuận</h3>
          {result.goodNotes.length ? <ul>{result.goodNotes.map((note) => <li key={note}>{note}</li>)}</ul> : <p>Hai tuổi ở mức bình hòa, không có điểm hợp nổi bật trong bộ tiêu chí hiện tại.</p>}
        </article>
        <article>
          <h3>Cần lưu ý</h3>
          {result.cautionNotes.length ? <ul>{result.cautionNotes.map((note) => <li key={note}>{note}</li>)}</ul> : <p>Không có dấu hiệu xung/khắc mạnh theo can chi và nạp âm.</p>}
        </article>
        <article>
          <h3>Nạp âm</h3>
          <p>{result.personA.napAm} ({result.personA.element}) · {result.personB.napAm} ({result.personB.element})</p>
        </article>
        <article>
          <h3>Gợi ý tiếp theo</h3>
          <p>Nếu chuẩn bị việc lớn, nên xem thêm ngày tốt theo tuổi và giờ hoàng đạo để chọn thời điểm phù hợp.</p>
          <Link href={`/xem-ngay-tot-theo-tuoi?tuoi=${result.yearA}`}>Xem ngày hợp tuổi {result.yearA}</Link>
        </article>
      </div>
    </section>
  );
}

function StandardCompatibilityForm({ purpose, canonicalPath, yearA, yearB }: { purpose: CompatibilityPurpose; canonicalPath: string; yearA: number; yearB: number }) {
  const isMarriage = purpose === "vo-chong";
  const isBusiness = purpose === "lam-an";
  return (
    <form className="ageForm compatForm" action={canonicalPath} method="get">
      <label>
        <span>{isMarriage ? "Năm sinh nam" : isBusiness ? "Năm sinh người 1" : "Năm sinh 1"}</span>
        <input name="nam1" type="number" min="1900" max="2050" defaultValue={yearA} inputMode="numeric" />
      </label>
      <label>
        <span>{isMarriage ? "Năm sinh nữ" : isBusiness ? "Năm sinh người 2" : "Năm sinh 2"}</span>
        <input name="nam2" type="number" min="1900" max="2050" defaultValue={yearB} inputMode="numeric" />
      </label>
      <button type="submit">Xem hợp tuổi</button>
    </form>
  );
}

function ChildYearTool({ params, canonicalPath }: { params?: SearchParams; canonicalPath: string }) {
  const today = getVietnamTodayParts();
  const fatherYear = intParam(params, "namCha", today.year - 32);
  const motherYear = intParam(params, "namMe", today.year - 30);
  const childYear = intParam(params, "namCon", today.year + 1, today.year, 2050);
  const result = getChildYearResult({ fatherYear, motherYear, childYear });
  return (
    <>
      <section className="panelCard ageSearch" aria-labelledby="child-form-title">
        <div>
          <p className="eyebrow">Chọn năm sinh con</p>
          <h2 id="child-form-title">Xem năm sinh con hợp tuổi cha mẹ</h2>
          <p>Nhập năm sinh cha, mẹ và năm dự sinh để tham khảo mức độ hòa hợp theo can chi, nạp âm và con giáp.</p>
        </div>
        <form className="ageForm compatForm threeFields" action={canonicalPath} method="get">
          <label><span>Năm sinh cha</span><input name="namCha" type="number" min="1900" max="2050" defaultValue={fatherYear} /></label>
          <label><span>Năm sinh mẹ</span><input name="namMe" type="number" min="1900" max="2050" defaultValue={motherYear} /></label>
          <label><span>Năm dự sinh con</span><input name="namCon" type="number" min={today.year} max="2050" defaultValue={childYear} /></label>
          <button type="submit">Xem năm sinh con</button>
        </form>
      </section>

      <section className={["panelCard compatResultPanel", scoreClass(result.score)].join(" ")}>
        <div className="compatResultHead">
          <div>
            <p className="eyebrow">Kết quả sinh con</p>
            <h2>Năm {result.childYear} · {result.child.birthCanChi}: {result.label}</h2>
            <p>{result.summary}</p>
          </div>
          <div className="compatScore"><strong>{result.score}</strong><span>/100</span></div>
        </div>
        <div className="compatPeopleGrid threePeople">
          {result.fatherResult && <YearIdentity year={fatherYear} canChi={result.fatherResult.personA.birthCanChi} animal={result.fatherResult.personA.animal} chi={result.fatherResult.personA.birthChi} />}
          {result.motherResult && <YearIdentity year={motherYear} canChi={result.motherResult.personA.birthCanChi} animal={result.motherResult.personA.animal} chi={result.motherResult.personA.birthChi} />}
          <YearIdentity year={result.childYear} canChi={result.child.birthCanChi} animal={result.child.animal} chi={result.child.birthChi} />
        </div>
        <div className="bestDateGrid compatNoteGrid">
          <article><h3>Cha - con</h3>{result.fatherResult ? <p>{result.fatherResult.summary}</p> : <p>Chưa có năm sinh cha.</p>}</article>
          <article><h3>Mẹ - con</h3>{result.motherResult ? <p>{result.motherResult.summary}</p> : <p>Chưa có năm sinh mẹ.</p>}</article>
          <article><h3>Điểm thuận</h3>{result.goodNotes.length ? <ul>{result.goodNotes.map((n) => <li key={n}>{n}</li>)}</ul> : <p>Không có điểm hợp nổi bật.</p>}</article>
          <article><h3>Cần lưu ý</h3>{result.cautionNotes.length ? <ul>{result.cautionNotes.map((n) => <li key={n}>{n}</li>)}</ul> : <p>Không có xung khắc mạnh trong bộ tiêu chí hiện tại.</p>}</article>
        </div>
      </section>
    </>
  );
}

export function AgeCompatibilityTool({ purpose, params, title, description, canonicalPath }: Props) {
  const today = getVietnamTodayParts();
  if (purpose === "sinh-con") return <ChildYearTool params={params} canonicalPath={canonicalPath} />;
  const yearA = intParam(params, "nam1", today.year - 32);
  const yearB = intParam(params, "nam2", today.year - 30);
  const result = getCompatibilityResult(yearA, yearB, purpose);
  const sampleYears = nearbyYears(yearA, 3);

  return (
    <>
      <section className="panelCard ageSearch" aria-labelledby="compat-form-title">
        <div>
          <p className="eyebrow">Xem tuổi hợp</p>
          <h2 id="compat-form-title">{title}</h2>
          <p>{description}</p>
        </div>
        <StandardCompatibilityForm purpose={purpose} canonicalPath={canonicalPath} yearA={yearA} yearB={yearB} />
      </section>
      <CompatibilityResultPanel result={result} />
      <section className="panelCard activitySeoLinks">
        <p className="eyebrow">Tra cứu nhanh</p>
        <h2>Các năm sinh gần {yearA}</h2>
        <div className="dayLinkList">
          {sampleYears.map((year) => <Link key={year} href={`${canonicalPath}?nam1=${year}&nam2=${yearB}`} className="eventPill blue">{year} với {yearB}</Link>)}
          <Link href={`/xem-ngay-tot-theo-tuoi?tuoi=${yearA}`} className="eventPill blue">Xem ngày hợp tuổi {yearA}</Link>
          <Link href={`/sinh-nam/${yearA}`} className="eventPill blue">Sinh năm {yearA}</Link>
        </div>
      </section>
    </>
  );
}

export function HouseAgeTool({ params, canonicalPath }: { params?: SearchParams; canonicalPath: string }) {
  const today = getVietnamTodayParts();
  const birthYear = intParam(params, "namSinh", today.year - 35);
  const buildYear = intParam(params, "namLamNha", today.year, birthYear, 2050);
  const result = getHouseAgeCheck(birthYear, buildYear);
  return (
    <>
      <section className="panelCard ageSearch" aria-labelledby="house-form-title">
        <div>
          <p className="eyebrow">Tuổi làm nhà</p>
          <h2 id="house-form-title">Xem tuổi làm nhà, sửa nhà</h2>
          <p>Kiểm tra nhanh Kim Lâu, Hoang Ốc, Tam Tai theo tuổi âm và năm dự định động thổ.</p>
        </div>
        <form className="ageForm compatForm" action={canonicalPath} method="get">
          <label><span>Năm sinh gia chủ</span><input name="namSinh" type="number" min="1900" max="2050" defaultValue={birthYear} /></label>
          <label><span>Năm làm nhà</span><input name="namLamNha" type="number" min="1900" max="2050" defaultValue={buildYear} /></label>
          <button type="submit">Xem tuổi làm nhà</button>
        </form>
      </section>
      <section className={["panelCard compatResultPanel", result.level === "good" ? "excellent" : result.level === "ok" ? "ok" : "avoid"].join(" ")}>
        <div className="compatResultHead">
          <div>
            <p className="eyebrow">Kết quả tuổi làm nhà</p>
            <h2>Tuổi {result.ageInfo.birthCanChi} làm nhà năm {result.buildYear}: {result.label}</h2>
            <p>{result.summary}</p>
          </div>
          <div className="compatScore"><strong>{result.score}</strong><span>/100</span></div>
        </div>
        <div className="compatCheckGrid">
          {result.checks.map((check) => (
            <article className={check.status} key={check.name}>
              <strong>{check.name}</strong>
              <p>{check.description}</p>
            </article>
          ))}
        </div>
        <div className="resultActions wideActions">
          <Link href={`/xem-ngay-tot/dong-tho?tuoi=${birthYear}`}>Tìm ngày động thổ hợp tuổi</Link>
          <Link href={`/xem-tuoi-hop-huong-nao?namSinh=${birthYear}`}>Xem hướng hợp tuổi</Link>
        </div>
      </section>
    </>
  );
}

export function FengShuiAgeTool({ params, canonicalPath, mode }: { params?: SearchParams; canonicalPath: string; mode: "color" | "direction" | "full" }) {
  const today = getVietnamTodayParts();
  const birthYear = intParam(params, "namSinh", today.year - 30);
  const gender = genderParam(params);
  const result = getFengShuiAgeInfo(birthYear, gender);
  return (
    <>
      <section className="panelCard ageSearch" aria-labelledby="feng-form-title">
        <div>
          <p className="eyebrow">Phong thủy theo tuổi</p>
          <h2 id="feng-form-title">{mode === "color" ? "Xem tuổi hợp màu gì" : mode === "direction" ? "Xem tuổi hợp hướng nào" : "Xem màu và hướng hợp tuổi"}</h2>
          <p>Nhập năm sinh và giới tính để xem nạp âm, màu hợp/kỵ, cung phi bát trạch và hướng tốt xấu tham khảo.</p>
        </div>
        <form className="ageForm compatForm" action={canonicalPath} method="get">
          <label><span>Năm sinh</span><input name="namSinh" type="number" min="1900" max="2050" defaultValue={birthYear} /></label>
          <label><span>Giới tính</span><select name="gioiTinh" defaultValue={gender}><option value="nam">Nam</option><option value="nu">Nữ</option></select></label>
          <button type="submit">Xem phong thủy</button>
        </form>
      </section>
      <section className="panelCard compatResultPanel excellent">
        <div className="compatResultHead">
          <div>
            <p className="eyebrow">Kết quả phong thủy tuổi</p>
            <h2>Sinh năm {birthYear} · {result.ageInfo.birthCanChi}</h2>
            <p>{result.colors.note}</p>
          </div>
          <div className="yearAnimal"><ZodiacIcon branch={result.ageInfo.birthChi} /><strong>{result.kua.palace}</strong><small>{result.kua.group}</small></div>
        </div>
        {(mode === "color" || mode === "full") && (
          <div className="bestDateGrid compatNoteGrid">
            <article><h3>Màu bản mệnh</h3><div className="fortunePills large">{result.colors.lucky.map((c) => <span key={c}>{c}</span>)}</div></article>
            <article><h3>Màu tương sinh</h3><div className="fortunePills large">{result.colors.support.map((c) => <span key={c}>{c}</span>)}</div></article>
            <article><h3>Màu nên tiết chế</h3><div className="fortunePills large">{result.colors.avoid.map((c) => <span key={c}>{c}</span>)}</div></article>
            <article><h3>Ứng dụng</h3><p>Có thể dùng cho màu ví, xe, trang phục, nhận diện cá nhân hoặc màu nhấn trong không gian sống.</p></article>
          </div>
        )}
        {(mode === "direction" || mode === "full") && (
          <div className="bestDateGrid compatNoteGrid directionGrid">
            <article><h3>Hướng tốt</h3><ul>{result.kua.goodDirections.map((item) => <li key={item.name}><strong>{item.name}:</strong> {item.direction} — {item.meaning}</li>)}</ul></article>
            <article><h3>Hướng nên hạn chế</h3><ul>{result.kua.badDirections.map((item) => <li key={item.name}><strong>{item.name}:</strong> {item.direction} — {item.meaning}</li>)}</ul></article>
            <article><h3>Cung phi</h3><p>Quái số {result.kua.number}, cung {result.kua.palace}, thuộc {result.kua.group}.</p></article>
            <article><h3>Liên kết hữu ích</h3><p>Nên kết hợp hướng hợp tuổi với thiết kế thực tế, ánh sáng, thông gió và pháp lý xây dựng.</p></article>
          </div>
        )}
      </section>
    </>
  );
}
