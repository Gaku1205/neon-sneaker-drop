type Feature = {
  no: string;
  word: string;
  title: string;
  body: string;
  specs: { label: string; value: string; unit: string }[];
  tone: "dark" | "pink" | "blue";
  pose: { rx: number; ry: number; rz: number; spin: number };
};

const FEATURES: Feature[] = [
  {
    no: "01",
    word: "BOUNCE",
    title: "跳ね返す厚底",
    body: "中底は新しい発泡素材「ボルトフォーム」。踏んだ力をためて、次の一歩で前へ押し返す。かかとは 42mm の厚さでも、つま先は反り上がって転がるように進む。",
    specs: [
      { label: "反発率", value: "78", unit: "%" },
      { label: "かかとの厚さ", value: "42", unit: "MM" },
    ],
    tone: "dark",
    pose: { rx: 0.06, ry: 0, rz: 0.1, spin: 0 },
  },
  {
    no: "02",
    word: "GLOW",
    title: "光るかかと",
    body: "かかとのクッションの中に、光をためる粒を封じ込めた。昼の光を吸って、暗い道で 6 時間ぼんやり光る。電池も配線もいらない。",
    specs: [
      { label: "光る時間", value: "6", unit: "H" },
      { label: "電池", value: "0", unit: "本" },
    ],
    tone: "pink",
    pose: { rx: 0.22, ry: 2.55, rz: 0, spin: 0 },
  },
  {
    no: "03",
    word: "LIGHT",
    title: "片足 228g",
    body: "アッパーは一枚編みのニット。縫い目を減らして、足の甲に沿ってのびる。糸の 62% は使い終わったペットボトルから作った。",
    specs: [
      { label: "片足（27cm）", value: "228", unit: "G" },
      { label: "再生糸", value: "62", unit: "%" },
    ],
    tone: "blue",
    pose: { rx: 0.95, ry: -0.35, rz: 0.25, spin: 0 },
  },
];

export function Features() {
  return (
    <section className="features" aria-labelledby="features-title">
      <h2 id="features-title" className="visually-hidden">
        見どころ
      </h2>
      {FEATURES.map((f, i) => (
        <article key={f.no} className={`feature feature-${f.tone} ${i % 2 === 1 ? "feature-flip" : ""}`}>
          <p className="feature-word" data-scrub-x={i % 2 === 1 ? "1" : "-1"} aria-hidden="true">
            {f.word}
            <span className="feature-word-ghost">{f.word}</span>
          </p>
          <div className="feature-grid">
            <div className="feature-copy">
              <p className="hud feature-no">
                {f.no} / 03 — {f.word}
              </p>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-body">{f.body}</p>
              <dl className="feature-specs">
                {f.specs.map((s) => (
                  <div key={s.label}>
                    <dt className="hud">{s.label}</dt>
                    <dd>
                      {s.value}
                      <span className="unit">{s.unit}</span>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
            <div
              className="slot slot-feature"
              data-shoe-slot={`feature-${f.no}`}
              data-rx={f.pose.rx}
              data-ry={f.pose.ry}
              data-rz={f.pose.rz}
              data-spin={f.pose.spin}
              aria-hidden="true"
            />
          </div>
        </article>
      ))}
    </section>
  );
}
