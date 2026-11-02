/** 発売日時（2026-12-12 10:00 JST）。 */
export const DROP_AT = new Date("2026-12-12T10:00:00+09:00");

export type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  /** 発売日時を過ぎたら true（数字はすべて 0） */
  done: boolean;
};

/** now から target までの残りを、日・時・分・秒に分ける。過ぎていれば全部 0 で done。 */
export function getCountdown(now: Date, target: Date = DROP_AT): Countdown {
  const diff = Math.floor((target.getTime() - now.getTime()) / 1000);
  if (!Number.isFinite(diff) || diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
  }
  return {
    days: Math.floor(diff / 86400),
    hours: Math.floor((diff % 86400) / 3600),
    minutes: Math.floor((diff % 3600) / 60),
    seconds: diff % 60,
    done: false,
  };
}

/** 2桁にそろえる（100 以上はそのまま）。 */
export function pad2(n: number): string {
  return String(Math.max(0, Math.floor(n))).padStart(2, "0");
}
