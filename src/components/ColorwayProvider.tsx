"use client";

import { createContext, useContext, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import { COLORWAYS, colorwayAt, type Colorway } from "@/lib/colorways";

type Value = { index: number; colorway: Colorway; setIndex: (i: number) => void };

const Ctx = createContext<Value | null>(null);

export function useColorway(): Value {
  const v = useContext(Ctx);
  if (!v) throw new Error("ColorwayProvider の外で useColorway が呼ばれました");
  return v;
}

/** 選んだ色違いを持ち、画面の差し色（CSS 変数）も一緒に切り替える */
export function ColorwayProvider({ children }: { children: ReactNode }) {
  const [index, setIndex] = useState(0);
  const colorway = colorwayAt(index);
  const value = useMemo(() => ({ index, colorway, setIndex: (i: number) => setIndex(((i % COLORWAYS.length) + COLORWAYS.length) % COLORWAYS.length) }), [index, colorway]);
  const style = {
    "--accent": colorway.accent,
    "--accent-ink": colorway.accentInk,
    "--accent-text": colorway.accentText,
  } as CSSProperties;
  return (
    <Ctx.Provider value={value}>
      <div className="cw-root" style={style} data-colorway={colorway.id}>
        {children}
      </div>
    </Ctx.Provider>
  );
}
