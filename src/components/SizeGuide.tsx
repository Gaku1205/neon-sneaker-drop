import { SIZES, formatFootRange, formatSize } from "@/lib/sizes";

const WIDTH_GUIDE = [
  {
    no: "01",
    title: "足の長さと幅の測り方",
    body: "夕方、立った状態で測る。壁にかかとをつけて紙の上に立ち、いちばん長い指の先までが「足の長さ」。足の横でいちばん広い所のまわりを、メジャーで一周したのが「幅」。左右で違うときは大きいほうで選ぶ。",
  },
  {
    no: "02",
    title: "幅が広い・ふつう・狭いときの選び方",
    body: "ふつうなら、長さの目安に合うサイズをそのまま選ぶ。幅が広いときは 0.5cm 上げる。幅が狭いときは同じサイズのまま、紐をしっかり締める。PULSAR-9 のアッパーは一枚編みのニットで、横にのびる。",
  },
  {
    no: "03",
    title: "迷ったときの目安",
    body: "2つのサイズで迷ったら、大きいほうを選ぶ。厚手の靴下で履くなら 0.5cm 上げる。つま先に指1本ぶんの余裕があれば、ちょうどいい。",
  },
];

export function SizeGuide() {
  return (
    <section className="sizes" aria-labelledby="sizes-title">
      <p className="sizes-word" data-scrub-x="1" aria-hidden="true">
        SIZE
        <span className="sizes-word-ghost">SIZE</span>
      </p>
      <div className="sizes-inner">
        <p className="hud">SIZE GUIDE — 22.0–30.0 CM</p>
        <h2 id="sizes-title" className="section-title">
          サイズを、測れ。
        </h2>
        <div className="sizes-grid">
          <div className="sizes-table-wrap">
            <table className="sizes-table">
              <caption>サイズ表（22.0〜30.0cm、0.5cm 刻み）</caption>
              <thead>
                <tr>
                  <th scope="col">サイズ（cm）</th>
                  <th scope="col">足の長さの目安（mm）</th>
                </tr>
              </thead>
              <tbody>
                {SIZES.map((r) => (
                  <tr key={r.size}>
                    <th scope="row">{formatSize(r.size)}</th>
                    <td>{formatFootRange(r)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ol className="sizes-guide">
            {WIDTH_GUIDE.map((g) => (
              <li key={g.no}>
                <p className="hud">{g.no} / 03</p>
                <h3>{g.title}</h3>
                <p>{g.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
