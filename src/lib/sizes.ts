export type SizeRow = {
  /** サイズ（cm）。22.0〜30.0 を 0.5 刻み */
  size: number;
  /** 足の長さの目安（mm）の下限（サイズ − 5mm） */
  footMin: number;
  /** 足の長さの目安（mm）の上限（サイズそのもの） */
  footMax: number;
};

const FIRST = 22;
const LAST = 30;
const STEP = 0.5;

/** サイズの一覧（22.0〜30.0cm、0.5cm 刻み、17行）。 */
export const SIZES: SizeRow[] = Array.from({ length: (LAST - FIRST) / STEP + 1 }, (_, i) => {
  const size = FIRST + i * STEP;
  return { size, footMin: size * 10 - 5, footMax: size * 10 };
});

/** 22 → "22.0" */
export function formatSize(size: number): string {
  return size.toFixed(1);
}

/** 足の長さの目安を「215–220」の形で返す（Anton に「〜」の字が無いので、en dash でつなぐ）。 */
export function formatFootRange(row: SizeRow): string {
  return `${row.footMin}–${row.footMax}`;
}

/**
 * 足の長さ（mm）から合うサイズ（cm）を返す。
 * 各サイズは「サイズ − 5mm 超 〜 サイズ以下」を受け持つ（最小サイズだけ 215mm ちょうども含む）。
 * 215mm 未満・300mm 超・数でない値は、合うサイズが無いので null。
 */
export function sizeForFootLength(mm: number): number | null {
  if (!Number.isFinite(mm)) return null;
  const min = SIZES[0].footMin;
  const max = SIZES[SIZES.length - 1].footMax;
  if (mm < min || mm > max) return null;
  const row = SIZES.find((r) => mm <= r.footMax);
  return row ? row.size : null;
}
