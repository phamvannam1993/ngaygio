"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export function AgeCalculatorForm({ birthYear, viewYear }: { birthYear: number; viewYear: number }) {
  const router = useRouter();
  const [namSinh, setNamSinh] = useState(String(birthYear));
  const [namXem, setNamXem] = useState(String(viewYear));

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const birth = Number(namSinh);
    const view = Number(namXem);

    if (!Number.isInteger(birth) || birth < 1900 || birth > 2050) {
      window.alert("Vui lòng nhập năm sinh từ 1900 đến 2050.");
      return;
    }

    if (!Number.isInteger(view) || view < birth || view > 2050) {
      window.alert("Năm xem tuổi phải lớn hơn hoặc bằng năm sinh và không vượt quá 2050.");
      return;
    }

    router.push(`/tinh-tuoi-am?namSinh=${birth}&namXem=${view}`);
  }

  return (
    <section className="panelCard ageSearch" aria-labelledby="age-search-title">
      <div>
        <p className="eyebrow">Đổi tuổi · tính tuổi âm</p>
        <h2 id="age-search-title">Tính tuổi âm, tuổi mụ, can chi và con giáp</h2>
        <p>Nhập năm sinh để xem tuổi dương, tuổi âm tham khảo, can chi, nạp âm, con giáp và các tuổi hợp/xung.</p>
      </div>
      <form className="ageForm" onSubmit={handleSubmit}>
        <label>
          <span>Năm sinh</span>
          <input type="number" min="1900" max="2050" value={namSinh} onChange={(event) => setNamSinh(event.target.value)} />
        </label>
        <label>
          <span>Năm cần xem</span>
          <input type="number" min="1900" max="2050" value={namXem} onChange={(event) => setNamXem(event.target.value)} />
        </label>
        <button type="submit">Tính tuổi</button>
      </form>
    </section>
  );
}
