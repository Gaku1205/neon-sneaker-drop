import { describe, expect, it } from "vitest";
import { checkEmail } from "./email";

describe("checkEmail", () => {
  it("正しい形なら ok（前後の空白は取る）", () => {
    expect(checkEmail("  runner@example.com ")).toEqual({ ok: true, email: "runner@example.com" });
    expect(checkEmail("a.b+drop@mail.example.co.jp")).toEqual({
      ok: true,
      email: "a.b+drop@mail.example.co.jp",
    });
  });

  it("空なら empty", () => {
    expect(checkEmail("   ")).toEqual({ ok: false, reason: "empty" });
  });

  it("形が違えば format", () => {
    for (const bad of ["runner", "runner@", "@example.com", "runner@example", "a b@example.com", "a@@b.com", "a@b..com"]) {
      expect(checkEmail(bad)).toEqual({ ok: false, reason: "format" });
    }
  });
});
