import Link from "next/link";
import { calculateNumerology, normalizeVietnamese } from "@/lib/numerology";
import { getVietnamTodayParts } from "@/lib/date";

type SearchParams = Record<string, string | string[] | undefined>;

function single(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

// Nhận ngày sinh dạng yyyy-mm-dd (input type=date) hoặc 3 tham số rời.
function parseDob(params?: SearchParams): { day: number; month: number; year: number } | null {
  const raw = single(params?.ngaySinh);
  if (raw) {
    const m = raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    if (m) {
      const year = Number(m[1]);
      const month = Number(m[2]);
      const day = Number(m[3]);
      if (year >= 1900 && year <= 2100 && month >= 1 && month <= 12 && day >= 1 && day <= 31) {
        return { day, month, year };
      }
    }
  }
  return null;
}

function ordinalClass(value: number) {
  if (value === 11 || value === 22 || value === 33) return "excellent";
  if (value >= 7) return "good";
  return "ok";
}

export function NumerologyTool({ params, canonicalPath }: { params?: SearchParams; canonicalPath: string }) {
  const today = getVietnamTodayParts();
  const hoTen = (single(params?.hoTen) ?? "").trim();
  const dob = parseDob(params);
  const nameValid = normalizeVietnamese(hoTen).replace(/\s/g, "").length >= 2;
  const hasResult = nameValid && dob !== null;

  const result = hasResult ? calculateNumerology({ fullName: hoTen, day: dob!.day, month: dob!.month, year: dob!.year }) : null;
  const dobValue = dob ? `${dob.year}-${String(dob.month).padStart(2, "0")}-${String(dob.day).padStart(2, "0")}` : "";
  const lifePath = result?.indices.find((i) => i.key === "duong-doi");

  return (
    <>
      <section className="panelCard ageSearch" aria-labelledby="tsh-form-title">
        <div className="ngdSectionHead compact">
          <p className="eyebrow">Tra cứu thần số học miễn phí</p>
          <h2 id="tsh-form-title">Nhập họ tên và ngày sinh</h2>
        </div>
        <form className="ageForm compatForm" action={canonicalPath} method="get">
          <label>
            <span>Họ và tên (đầy đủ, có dấu)</span>
            <input name="hoTen" type="text" defaultValue={hoTen} placeholder="Ví dụ: Nguyễn Văn An" autoComplete="name" />
          </label>
          <label>
            <span>Ngày sinh (dương lịch)</span>
            <input name="ngaySinh" type="date" min="1900-01-01" max="2100-12-31" defaultValue={dobValue} />
          </label>
          <button type="submit">Tra cứu thần số học</button>
        </form>
        {(single(params?.hoTen) !== undefined || single(params?.ngaySinh) !== undefined) && !hasResult && (
          <p className="disclaimer" style={{ marginTop: 8 }}>Vui lòng nhập đầy đủ họ tên (có chữ) và chọn ngày sinh hợp lệ.</p>
        )}
      </section>

      {result && lifePath && (
        <section className={["panelCard compatResultPanel", ordinalClass(lifePath.value)].join(" ")} aria-labelledby="tsh-lifepath-title">
          <div className="compatResultHead">
            <div>
              <p className="eyebrow">Chỉ số quan trọng nhất</p>
              <h2 id="tsh-lifepath-title">{result.name} — {lifePath.label}</h2>
            </div>
            <div className="compatScore"><strong>{lifePath.value}</strong><span>đường đời</span></div>
          </div>
          <p style={{ marginTop: 6 }}><strong>{lifePath.meaning.keyword}.</strong> {lifePath.meaning.description}</p>
        </section>
      )}

      {result && (
        <section className="panelCard" aria-labelledby="tsh-all-title">
          <div className="ngdSectionHead compact">
            <p className="eyebrow">Các chỉ số thần số học</p>
            <h2 id="tsh-all-title">Bảng chỉ số của {result.name}</h2>
          </div>
          <div className="bestDateGrid">
            {result.indices.map((idx) => (
              <article key={idx.key} className={["panelCard compatResultPanel", ordinalClass(idx.value)].join(" ")}>
                <div className="compatResultHead">
                  <div>
                    <strong style={{ fontSize: "1.05rem" }}>{idx.label}</strong>
                    <p className="disclaimer" style={{ margin: "2px 0 0" }}>{idx.short}</p>
                  </div>
                  <div className="compatScore"><strong>{idx.value}</strong>{idx.isMaster && <span>master</span>}</div>
                </div>
                <p style={{ marginTop: 8 }}><strong>{idx.meaning.keyword}.</strong> {idx.meaning.description}</p>
              </article>
            ))}
          </div>
          <p className="disclaimer" style={{ marginTop: 10 }}>Thần số học mang tính tham khảo, chiêm nghiệm về bản thân — không phải lời khuyên tuyệt đối.</p>
        </section>
      )}

      {!result && (
        <section className="panelCard" aria-label="Gợi ý">
          <p>Nhập <strong>họ tên đầy đủ (có dấu)</strong> và <strong>ngày sinh dương lịch</strong> để tra cứu các chỉ số thần số học: Số Đường Đời, Số Sứ Mệnh, Số Linh Hồn, Số Nhân Cách, Số Ngày Sinh, Số Thái Độ và Số Trưởng Thành.</p>
          <div className="dayLinkList" style={{ marginTop: 10 }}>
            <Link href="/lap-la-so-tu-vi" className="eventPill blue">Lập lá số tử vi</Link>
            <Link href="/xem-tuoi-hop" className="eventPill green">Xem tuổi hợp</Link>
            <Link href="/tu-vi-hom-nay" className="eventPill green">Tử vi hôm nay</Link>
          </div>
        </section>
      )}
    </>
  );
}
