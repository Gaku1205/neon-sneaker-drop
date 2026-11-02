export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-hud hud" aria-hidden="true">
        <span>GRAVLESS / 2026 WINTER DROP</span>
        <span>MODEL ── PULSAR-9</span>
        <span>STACK 42MM / 228G</span>
      </div>

      <h1 id="hero-title" className="hero-title">
        <span className="hero-word" data-hero-word="1">
          PULSAR
        </span>
        <span className="hero-word hero-word-num" data-hero-word="2">
          -9
        </span>
      </h1>

      <div
        className="slot slot-hero"
        data-shoe-slot="hero"
        data-rx="0.3"
        data-ry="-0.35"
        data-rz="0.2"
        data-spin="1"
        aria-hidden="true"
      />

      <div className="hero-bottom">
        <p className="band band-accent hero-catch">
          <span>地面を、</span>
          <span>蹴り返せ。</span>
        </p>
        <div className="hero-meta">
          <p className="hero-lead">
            反発する厚底と、光るかかと。
            <br />
            GRAVLESS の新作スニーカー、12月12日発売。
          </p>
          <dl className="hud hero-specs">
            <div>
              <dt>PRICE</dt>
              <dd>¥24,800</dd>
            </div>
            <div>
              <dt>DROP</dt>
              <dd>12.12 SAT</dd>
            </div>
            <div>
              <dt>COLORS</dt>
              <dd>3</dd>
            </div>
          </dl>
        </div>
      </div>
      <p className="hud scroll-cue" aria-hidden="true">
        SCROLL ↓
      </p>
    </section>
  );
}
