import { describe, expect, it } from "vitest";
import { SIZES, formatFootRange, formatSize, sizeForFootLength } from "./sizes";

describe("SIZES", () => {
  it("22.0〜30.0cm を 0.5cm 刻みで 17 行", () => {
    expect(SIZES).toHaveLength(17);
    expect(SIZES[0].size).toBe(22);
    expect(SIZES[16].size).toBe(30);
    SIZES.slice(1).forEach((r, i) => expect(r.size - SIZES[i].size).toBe(0.5));
  });
  it("足の長さの目安は サイズ−5mm 〜 サイズ", () => {
    expect(formatFootRange(SIZES[0])).toBe("215–220");
    expect(formatFootRange(SIZES[16])).toBe("295–300");
  });
  it("サイズは小数 1 桁で表示", () => {
    expect(formatSize(22)).toBe("22.0");
    expect(formatSize(27.5)).toBe("27.5");
  });
});

describe("sizeForFootLength", () => {
  it("目安の範囲内なら合うサイズ", () => {
    expect(sizeForFootLength(250)).toBe(25);
    expect(sizeForFootLength(246)).toBe(25);
    expect(sizeForFootLength(245)).toBe(24.5);
    expect(sizeForFootLength(251)).toBe(25.5);
  });
  it("両端は含む", () => {
    expect(sizeForFootLength(215)).toBe(22);
    expect(sizeForFootLength(300)).toBe(30);
  });
  it("範囲外は null", () => {
    expect(sizeForFootLength(214.9)).toBeNull();
    expect(sizeForFootLength(300.1)).toBeNull();
    expect(sizeForFootLength(0)).toBeNull();
    expect(sizeForFootLength(-10)).toBeNull();
  });
  it("数でない値は null", () => {
    expect(sizeForFootLength(NaN)).toBeNull();
    expect(sizeForFootLength(Infinity)).toBeNull();
  });
});
