export type Colorway = {
  id: "acid" | "shock" | "volt";
  /** 色の名前（欧文・大きく出す） */
  name: string;
  /** 色の名前（日本語） */
  nameJa: string;
  /** 一言 */
  note: string;
  /** 画面の差し色：塗り */
  accent: string;
  /** 差し色の塗りの上に置く文字の色 */
  accentInk: string;
  /** 黒地の上に置く差し色の文字（4.5:1 以上） */
  accentText: string;
  /** 靴の色 */
  shoe: {
    upper: string;
    midsole: string;
    outsole: string;
    trim: string;
    glow: string;
  };
};

export const COLORWAYS: readonly Colorway[] = [
  {
    id: "acid",
    name: "ACID LIME",
    nameJa: "アシッド・ライム",
    note: "夜道でいちばん目立つ、最初の1色。",
    accent: "#C8FF00",
    accentInk: "#0A0A0B",
    accentText: "#C8FF00",
    shoe: { upper: "#C8FF00", midsole: "#F4F4EE", outsole: "#141416", trim: "#FF2E9A", glow: "#FF2E9A" },
  },
  {
    id: "shock",
    name: "SHOCK PINK",
    nameJa: "ショック・ピンク",
    note: "黄緑のソールとぶつけた、いちばんうるさい1足。",
    accent: "#FF2E9A",
    accentInk: "#0A0A0B",
    accentText: "#FF2E9A",
    shoe: { upper: "#FF2E9A", midsole: "#C8FF00", outsole: "#141416", trim: "#0A0A0B", glow: "#C8FF00" },
  },
  {
    id: "volt",
    name: "VOLT BLUE",
    nameJa: "ボルト・ブルー",
    note: "電気の青に、信号のオレンジを差した1足。",
    accent: "#2B3BFF",
    accentInk: "#F4F4EE",
    accentText: "#9AA3FF",
    shoe: { upper: "#2B3BFF", midsole: "#FF5A1F", outsole: "#141416", trim: "#F4F4EE", glow: "#FF5A1F" },
  },
] as const;

/** 靴の代替画像の説明：商品名＋色名（例：PULSAR-9 ACID LIME） */
export function shoeLabel(c: Colorway): string {
  return `PULSAR-9 ${c.name}`;
}

export function colorwayAt(index: number): Colorway {
  const n = COLORWAYS.length;
  return COLORWAYS[((Math.floor(index) % n) + n) % n];
}

/** 色違いを URL に残すときのクエリ名（例：`?color=shock`） */
export const COLORWAY_QUERY = "color";

/** `color` の値 → 色違いの番号。null・空・知らない値は 0（最初の色）。大文字小文字は区別しない。 */
export function colorwayIndexFromParam(value: string | null): number {
  if (value === null) return 0;
  const id = value.toLowerCase();
  const i = COLORWAYS.findIndex((c) => c.id === id);
  return i < 0 ? 0 : i;
}

/**
 * 色違いの番号と今の検索文字列 → 新しい検索文字列（"?..." または ""）。
 * 最初の色は `color` を消す。他のクエリは残す。
 */
export function searchWithColorway(index: number, search: string): string {
  const params = new URLSearchParams(search);
  const c = colorwayAt(index);
  if (c.id === COLORWAYS[0].id) params.delete(COLORWAY_QUERY);
  else params.set(COLORWAY_QUERY, c.id);
  const s = params.toString();
  return s ? `?${s}` : "";
}
