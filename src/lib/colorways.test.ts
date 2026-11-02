import { describe, expect, it } from "vitest";
import { COLORWAYS, colorwayIndexFromParam, searchWithColorway, shoeLabel } from "./colorways";

describe("shoeLabel", () => {
  it("商品名＋色名にする", () => {
    expect(shoeLabel(COLORWAYS[0])).toBe("PULSAR-9 ACID LIME");
    expect(shoeLabel(COLORWAYS[2])).toBe("PULSAR-9 VOLT BLUE");
  });
});

describe("colorwayIndexFromParam", () => {
  it("正しい値は番号にする", () => {
    expect(colorwayIndexFromParam("acid")).toBe(0);
    expect(colorwayIndexFromParam("shock")).toBe(1);
    expect(colorwayIndexFromParam("volt")).toBe(2);
  });

  it("大文字小文字は区別しない", () => {
    expect(colorwayIndexFromParam("SHOCK")).toBe(1);
    expect(colorwayIndexFromParam("Volt")).toBe(2);
  });

  it("知らない値・空・null は 0（最初の色）", () => {
    expect(colorwayIndexFromParam("xxx")).toBe(0);
    expect(colorwayIndexFromParam("")).toBe(0);
    expect(colorwayIndexFromParam(null)).toBe(0);
  });
});

describe("searchWithColorway", () => {
  it("色違いを入れると color が付く", () => {
    expect(searchWithColorway(1, "")).toBe("?color=shock");
    expect(searchWithColorway(2, "")).toBe("?color=volt");
  });

  it("最初の色（acid）のときは color を消す", () => {
    expect(searchWithColorway(0, "?color=shock")).toBe("");
    expect(searchWithColorway(0, "")).toBe("");
  });

  it("他のクエリは残す", () => {
    expect(searchWithColorway(1, "?utm_source=ig&color=acid")).toBe("?utm_source=ig&color=shock");
    expect(searchWithColorway(0, "?utm_source=ig&color=shock")).toBe("?utm_source=ig");
    expect(searchWithColorway(2, "?utm_source=ig")).toBe("?utm_source=ig&color=volt");
  });

  it("既に color がある場合は値だけ置き換える", () => {
    expect(searchWithColorway(2, "?color=shock")).toBe("?color=volt");
  });
});
