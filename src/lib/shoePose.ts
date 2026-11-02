/** 靴の向き（ラジアン）と回り方。区画ごとに「置き場（スロット）」に持たせる。 */
export type Pose = {
  rotX: number;
  rotY: number;
  rotZ: number;
  /** 0〜1。1 でゆっくり回り続ける */
  spin: number;
};

/** 画面上の置き場の四角（getBoundingClientRect の値） */
export type SlotRect = { top: number; left: number; width: number; height: number };

export type Slot = { rect: SlotRect; pose: Pose };

export type StageTarget = Pose & {
  /** 靴の中心（画面の px） */
  cx: number;
  cy: number;
  /** 靴の長さに合わせる大きさ（px） */
  size: number;
};

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

/** 置き場の中に靴をおさめる大きさ（横長の靴なので、高さの 1.7 倍まで横に使う） */
export function slotSize(rect: SlotRect): number {
  return Math.max(0, Math.min(rect.width, rect.height * 1.7));
}

function fromSlot(s: Slot): StageTarget {
  return {
    ...s.pose,
    cx: s.rect.left + s.rect.width / 2,
    cy: s.rect.top + s.rect.height / 2,
    size: slotSize(s.rect),
  };
}

/**
 * 画面の縦の真ん中が、どの置き場とどの置き場の間にあるかで、靴の位置・大きさ・向きを決める。
 * 置き場の近く（間の 30% まで）では、靴はその置き場に付いて一緒に流れる。
 * 間の 30%〜70% で次の置き場へ移る。slots は上から順に並べる。
 */
export function stageTarget(slots: readonly Slot[], viewportHeight: number): StageTarget | null {
  if (slots.length === 0) return null;
  const ref = viewportHeight / 2;
  const centers = slots.map((s) => s.rect.top + s.rect.height / 2);
  if (ref <= centers[0]) return fromSlot(slots[0]);
  const last = slots.length - 1;
  if (ref >= centers[last]) return fromSlot(slots[last]);
  let i = 0;
  while (i < last - 1 && ref > centers[i + 1]) i++;
  const span = centers[i + 1] - centers[i];
  const u = span <= 0 ? 1 : (ref - centers[i]) / span;
  const t = smoothstep(0.3, 0.7, u);
  const a = fromSlot(slots[i]);
  const b = fromSlot(slots[i + 1]);
  return {
    cx: lerp(a.cx, b.cx, t),
    cy: lerp(a.cy, b.cy, t),
    size: lerp(a.size, b.size, t),
    rotX: lerp(a.rotX, b.rotX, t),
    rotY: lerp(a.rotY, b.rotY, t),
    rotZ: lerp(a.rotZ, b.rotZ, t),
    spin: lerp(a.spin, b.spin, t),
  };
}
