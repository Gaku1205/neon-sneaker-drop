"use client";

import { useEffect, useState } from "react";
import { DROP_AT, getCountdown, pad2, type Countdown } from "@/lib/countdown";

const UNITS: { key: keyof Omit<Countdown, "done">; label: string; en: string }[] = [
  { key: "days", label: "日", en: "DAYS" },
  { key: "hours", label: "時間", en: "HRS" },
  { key: "minutes", label: "分", en: "MIN" },
  { key: "seconds", label: "秒", en: "SEC" },
];

const INFO = [
  { en: "HOW", ja: "先着順。抽選はしない" },
  { en: "LIMIT", ja: "1人1足まで" },
  { en: "WHERE", ja: "公式オンラインと、東京・大阪の2店" },
];

export function CountdownSection() {
  // サーバーとブラウザで時刻がずれるので、最初は「--」で出して、ブラウザで数え始める
  const [cd, setCd] = useState<Countdown | null>(null);
  useEffect(() => {
    const tick = () => setCd(getCountdown(new Date(), DROP_AT));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section className="count" aria-labelledby="count-title">
      <div className="count-head">
        <h2 id="count-title" className="section-title">
          {cd?.done ? "発売中。" : "発売まで、"}
        </h2>
        <p className="hud count-when">2026.12.12 SAT 10:00 JST ／ 数量限定 1,212 足</p>
      </div>
      <div className="count-row">
        <ol className="count-digits" aria-hidden="true">
          {UNITS.map((u) => (
            <li key={u.key}>
              <span className="count-num">{cd ? pad2(cd[u.key]) : "--"}</span>
              <span className="count-label">
                <span className="hud">{u.en}</span> {u.label}
              </span>
            </li>
          ))}
        </ol>
        <div
          className="slot slot-count"
          data-shoe-slot="count"
          data-rx="0.35"
          data-ry="0.7"
          data-rz="0.08"
          data-spin="1"
          aria-hidden="true"
        />
      </div>
      <dl className="count-info">
        {INFO.map((i) => (
          <div key={i.en}>
            <dt className="hud">{i.en}</dt>
            <dd>{i.ja}</dd>
          </div>
        ))}
      </dl>
      <p className="visually-hidden">
        {cd ? `発売まで ${cd.days}日 ${cd.hours}時間 ${cd.minutes}分` : "発売は 2026年12月12日 10時"}
      </p>
    </section>
  );
}
