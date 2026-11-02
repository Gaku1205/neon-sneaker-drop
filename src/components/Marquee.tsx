const WORDS_A = ["PULSAR-9", "12.12 DROP", "地面を、蹴り返せ。", "GRAVLESS", "STACK 42MM"];
const WORDS_B = ["ACID LIME", "SHOCK PINK", "VOLT BLUE", "光るかかと", "片足 228G"];

function Track({ words }: { words: string[] }) {
  // 2回並べて、半分ずらすと切れ目なく流れる
  const row = [...words, ...words];
  return (
    <div className="marquee-track">
      {[0, 1].map((k) => (
        <span className="marquee-run" key={k} aria-hidden={k === 1 ? "true" : undefined}>
          {row.map((w, i) => (
            <span className="marquee-item" key={i}>
              {w}
              <span className="marquee-star" aria-hidden="true">
                ✦
              </span>
            </span>
          ))}
        </span>
      ))}
    </div>
  );
}

export function Marquee() {
  return (
    <div className="marquee" role="presentation">
      <div className="marquee-band marquee-a">
        <Track words={WORDS_A} />
      </div>
      <div className="marquee-band marquee-b marquee-reverse">
        <Track words={WORDS_B} />
      </div>
    </div>
  );
}
