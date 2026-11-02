import { describe, expect, it } from "vitest";
import { DROP_AT, getCountdown, pad2 } from "./countdown";

describe("getCountdown", () => {
  it("残りを日・時・分・秒に分ける", () => {
    const target = new Date("2026-12-12T10:00:00+09:00");
    const now = new Date("2026-12-10T08:58:57+09:00");
    expect(getCountdown(now, target)).toEqual({
      days: 2,
      hours: 1,
      minutes: 1,
      seconds: 3,
      done: false,
    });
  });

  it("ちょうど発売の時刻なら done", () => {
    expect(getCountdown(DROP_AT).done).toBe(true);
  });

  it("過ぎたら全部 0 で done", () => {
    const now = new Date(DROP_AT.getTime() + 5000);
    expect(getCountdown(now)).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0, done: true });
  });

  it("1秒前は 0日0時間0分1秒", () => {
    const now = new Date(DROP_AT.getTime() - 1000);
    expect(getCountdown(now)).toMatchObject({ days: 0, hours: 0, minutes: 0, seconds: 1, done: false });
  });

  it("発売日は 2026-12-12 10:00 JST", () => {
    expect(DROP_AT.toISOString()).toBe("2026-12-12T01:00:00.000Z");
  });
});

describe("pad2", () => {
  it("1桁を2桁にそろえる", () => {
    expect(pad2(7)).toBe("07");
    expect(pad2(0)).toBe("00");
    expect(pad2(41)).toBe("41");
    expect(pad2(120)).toBe("120");
  });
});
