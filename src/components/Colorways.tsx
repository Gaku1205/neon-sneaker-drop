"use client";

import { useColorway } from "@/components/ColorwayProvider";
import { COLORWAYS } from "@/lib/colorways";

export function Colorways() {
  const { index, colorway, setIndex } = useColorway();
  return (
    <section className="colors" aria-labelledby="colors-title">
      <div className="colors-head">
        <p className="hud">COLORWAYS — 3</p>
        <h2 id="colors-title" className="section-title">
          色を、選べ。
        </h2>
      </div>

      <div className="colors-stage">
        <p className="colors-name" aria-hidden="true" key={colorway.id}>
          {colorway.name}
        </p>
        <div
          className="slot slot-colors"
          data-shoe-slot="colors"
          data-rx="0.28"
          data-ry="-0.5"
          data-rz="-0.05"
          data-spin="0.55"
          aria-hidden="true"
        />
      </div>

      <div className="colors-pick" role="group" aria-label="色違いを選ぶ">
        {COLORWAYS.map((c, i) => (
          <button
            key={c.id}
            type="button"
            className="swatch"
            aria-pressed={i === index}
            onClick={() => setIndex(i)}
            style={{ "--sw": c.accent, "--sw2": c.shoe.midsole, "--swi": c.accentInk, "--swt": c.accentText } as React.CSSProperties}
          >
            <span className="swatch-chip" aria-hidden="true">
              <span />
              <span />
            </span>
            <span className="swatch-text">
              <span className="swatch-name">{c.name}</span>
              <span className="swatch-ja">{c.nameJa}</span>
            </span>
          </button>
        ))}
      </div>
      <p className="colors-note" aria-live="polite">
        <span className="hud">NOW —</span> {colorway.nameJa}：{colorway.note}
      </p>
    </section>
  );
}
