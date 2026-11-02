import { describe, expect, it } from "vitest";
import { COLORWAYS, shoeLabel } from "./colorways";

describe("shoeLabel", () => {
  it("商品名＋色名にする", () => {
    expect(shoeLabel(COLORWAYS[0])).toBe("PULSAR-9 ACID LIME");
    expect(shoeLabel(COLORWAYS[2])).toBe("PULSAR-9 VOLT BLUE");
  });
});
