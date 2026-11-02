import type { Colorway } from "@/lib/colorways";

/**
 * WebGL が使えないときに置き場へ出す、靴の側面の平面イラスト。
 * 形は buildShoe.ts の側面の形と同じ（つま先が右、y は上向きなので反転して描く）。
 * 色は色違いの shoe（upper / midsole / outsole / trim）だけ。影・グラデーションは使わない。
 */
export function ShoeSideSvg({
  colors,
  label,
}: {
  colors: Pick<Colorway["shoe"], "upper" | "midsole" | "outsole" | "trim">;
  label: string;
}) {
  return (
    <svg className="shoe-fallback" viewBox="-2.35 -2.05 4.7 2.15" role="img" aria-label={label} preserveAspectRatio="xMidYMid meet">
      <g transform="scale(1,-1)">
        <path
          fill={colors.outsole}
          d="M-1.98 .2Q-2.06 -.02 -1.8 -.02L1.35 -.02Q2.2 0 2.26 .4L2.14 .38Q2.04 .12 1.35 .12L-1.8 .12Q-1.95 .12 -1.98 .2Z"
        />
        <path
          fill={colors.midsole}
          d="M-2.02 .2Q-2.05 .06 -1.82 .06L1.35 .06Q2.12 .08 2.2 .42L2.1 .5Q.9 .5 .2 .6Q-.9 .74 -1.92 .8Q-2.1 .72 -2.02 .2Z"
        />
        <path
          fill={colors.upper}
          d="M-1.85 .74L1.95 .5Q2.26 .55 2.06 .82Q1.7 1 1.05 1.04Q.45 1.08 .05 1.42L-.55 1.72Q-1 1.48 -1.5 1.6Q-1.95 1.7 -2.08 1.95Q-2.22 1.3 -1.85 .74Z"
        />
        <path
          fill={colors.outsole}
          d="M-1.86 .76L-1.2 .74Q-1.1 1.1 -1.42 1.36Q-1.8 1.56 -1.98 1.78Q-2.14 1.3 -1.86 .76Z"
        />
        {/* 脈拍の波 */}
        <polyline
          fill="none"
          stroke={colors.trim}
          strokeWidth=".13"
          strokeLinejoin="miter"
          points="-1.55,1.02 -.75,1.02 -.52,1.36 -.22,.74 .06,1.18 .26,.98 1.45,.86"
        />
      </g>
    </svg>
  );
}
