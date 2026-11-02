"use client";

import { useId, useState, type FormEvent } from "react";
import { checkEmail } from "@/lib/email";

type State = { kind: "idle" } | { kind: "error"; message: string } | { kind: "done"; email: string };

const MESSAGES = {
  empty: "メールアドレスを入れてください。",
  format: "メールアドレスの形を確かめてください（例：name@example.com）。",
} as const;

export function NotifyForm() {
  const [value, setValue] = useState("");
  const [state, setState] = useState<State>({ kind: "idle" });
  const id = useId();
  const errId = `${id}-err`;

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const r = checkEmail(value);
    if (!r.ok) {
      setState({ kind: "error", message: MESSAGES[r.reason] });
      return;
    }
    setState({ kind: "done", email: r.email });
  };

  return (
    <section className="notify" id="notify" aria-labelledby="notify-title">
      <p className="notify-word" data-scrub-x="-1" aria-hidden="true">
        DON&apos;T MISS THE DROP
      </p>
      <div className="notify-grid">
        <div className="notify-copy">
          <p className="hud">NOTIFY ME</p>
          <h2 id="notify-title" className="section-title">
            乗り遅れるな。
          </h2>
          <p className="notify-lead">発売の 1 時間前に、メールでお知らせします。1,212 足が無くなる前に。</p>

          {state.kind === "done" ? (
            <div className="notify-done" role="status">
              <p className="notify-done-big">受け付けました。</p>
              <p>
                12月12日 9:00 に <strong>{state.email}</strong> へお知らせします。
              </p>
              <button type="button" className="btn btn-ghost" onClick={() => { setState({ kind: "idle" }); setValue(""); }}>
                別のアドレスで登録する
              </button>
            </div>
          ) : (
            <form className="notify-form" onSubmit={onSubmit} noValidate>
              <label htmlFor={id} className="notify-label">
                メールアドレス
              </label>
              <div className="notify-row">
                <input
                  id={id}
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  spellCheck={false}
                  placeholder="name@example.com"
                  value={value}
                  onChange={(e) => {
                    setValue(e.target.value);
                    if (state.kind === "error") setState({ kind: "idle" });
                  }}
                  aria-invalid={state.kind === "error"}
                  aria-describedby={state.kind === "error" ? errId : undefined}
                />
                <button type="submit" className="btn btn-accent btn-big">
                  通知を受け取る
                </button>
              </div>
              {state.kind === "error" && (
                <p className="notify-error" id={errId} role="alert">
                  {state.message}
                </p>
              )}
            </form>
          )}
          <p className="notify-fine">※ 見本のページです。入力した内容はどこにも送られません。</p>
        </div>
        <div
          className="slot slot-notify"
          data-shoe-slot="notify"
          data-rx="0.2"
          data-ry="-2.3"
          data-rz="0.1"
          data-spin="0.3"
          aria-hidden="true"
        />
      </div>
    </section>
  );
}
