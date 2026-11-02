"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore, type CSSProperties, type ReactNode } from "react";
import { COLORWAYS, COLORWAY_QUERY, colorwayAt, colorwayIndexFromParam, searchWithColorway, type Colorway } from "@/lib/colorways";

type Value = { index: number; colorway: Colorway; setIndex: (i: number) => void };

const Ctx = createContext<Value | null>(null);

/** 色違いを変えたときに、同じ画面の中へ知らせるイベント名 */
const CHANGE_EVENT = "colorway-change";

function subscribe(onChange: () => void): () => void {
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => window.removeEventListener(CHANGE_EVENT, onChange);
}

/** URL の `color` から番号を読む（ブラウザだけで動く） */
function readIndexFromUrl(): number {
  return colorwayIndexFromParam(new URLSearchParams(window.location.search).get(COLORWAY_QUERY));
}

/** サーバーの HTML と初回のハイドレーションは番号 0 で合わせる */
function serverIndex(): number {
  return 0;
}

export function useColorway(): Value {
  const v = useContext(Ctx);
  if (!v) throw new Error("ColorwayProvider の外で useColorway が呼ばれました");
  return v;
}

/**
 * 選んだ色違いを持ち、画面の差し色（CSS 変数）も一緒に切り替える。
 * 色違いは URL のクエリ `color` に残す（replaceState で書き換え、履歴は増やさない）。
 * 初回の描画は番号 0 で出し、ハイドレーションのあとに URL の `color` を読んで合わせる。
 */
export function ColorwayProvider({ children }: { children: ReactNode }) {
  const index = useSyncExternalStore(subscribe, readIndexFromUrl, serverIndex);

  const setIndex = useCallback((i: number) => {
    const nextIndex = COLORWAYS.indexOf(colorwayAt(i));
    const url = new URL(window.location.href);
    url.search = searchWithColorway(nextIndex, window.location.search);
    window.history.replaceState(window.history.state, "", url);
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  const colorway = colorwayAt(index);
  const value = useMemo(() => ({ index, colorway, setIndex }), [index, colorway, setIndex]);
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
