import { describe, expect, it } from "vitest";
import { slotSize, smoothstep, stageTarget, type Slot } from "./shoePose";

const pose = (rotY: number, spin = 0) => ({ rotX: 0, rotY, rotZ: 0, spin });
const slot = (top: number, rotY: number, spin = 0): Slot => ({
  rect: { top, left: 100, width: 400, height: 200 },
  pose: pose(rotY, spin),
});

describe("smoothstep", () => {
  it("端は 0 と 1、真ん中は 0.5", () => {
    expect(smoothstep(0, 1, -1)).toBe(0);
    expect(smoothstep(0, 1, 2)).toBe(1);
    expect(smoothstep(0, 1, 0.5)).toBe(0.5);
  });
});

describe("slotSize", () => {
  it("幅と、高さの1.7倍の小さい方", () => {
    expect(slotSize({ top: 0, left: 0, width: 400, height: 200 })).toBe(340);
    expect(slotSize({ top: 0, left: 0, width: 300, height: 400 })).toBe(300);
  });
});

describe("stageTarget", () => {
  it("置き場が無ければ null", () => {
    expect(stageTarget([], 800)).toBeNull();
  });

  it("最初の置き場より上なら、最初の置き場に付く", () => {
    const t = stageTarget([slot(500, 1), slot(1500, 2)], 800);
    expect(t).toMatchObject({ cx: 300, cy: 600, size: 340, rotY: 1 });
  });

  it("最後の置き場より下なら、最後の置き場に付く", () => {
    const t = stageTarget([slot(-2000, 1), slot(-900, 2)], 800);
    expect(t).toMatchObject({ cy: -800, rotY: 2 });
  });

  it("置き場の近くでは、その置き場と一緒に流れる", () => {
    // 中心は 100 と 1100。画面の真ん中 400 は間の 30%（u=0.3）
    const t = stageTarget([slot(0, 1), slot(1000, 2)], 800);
    expect(t).toMatchObject({ cy: 100, rotY: 1 });
  });

  it("間のちょうど真ん中では、半分ずつ混ざる", () => {
    // 中心は -100 と 900。真ん中 400 は u=0.5
    const t = stageTarget([slot(-200, 1, 0), slot(800, 3, 1)], 800);
    expect(t?.rotY).toBeCloseTo(2);
    expect(t?.spin).toBeCloseTo(0.5);
    expect(t?.cy).toBeCloseTo(400);
  });

  it("3つ以上でも、今いる間を選ぶ", () => {
    const t = stageTarget([slot(-3000, 1), slot(-1100, 2), slot(300, 5)], 800);
    // 中心は -2900, -1000, 400。真ん中 400 は最後の置き場ちょうど
    expect(t?.rotY).toBe(5);
  });
});
