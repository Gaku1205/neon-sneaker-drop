export type EmailCheck =
  | { ok: true; email: string }
  | { ok: false; reason: "empty" | "format" };

/** 通知の入力欄の確かめ。前後の空白は取り除く。 */
export function checkEmail(input: string): EmailCheck {
  const email = input.trim();
  if (email === "") return { ok: false, reason: "empty" };
  // ローカル部@ドメイン.トップレベル（空白なし・@は1つ）
  const ok = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/.test(email) && email.length <= 254;
  return ok ? { ok: true, email } : { ok: false, reason: "format" };
}
