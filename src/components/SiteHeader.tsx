export function SiteHeader() {
  return (
    <header className="site-header">
      <a className="logo" href="#top" aria-label="GRAVLESS（ページの先頭へ）">
        GRAVLESS
      </a>
      <p className="hud header-date">
        <span className="dot" aria-hidden="true" />
        DROP 2026.12.12 10:00 JST
      </p>
      <a className="btn btn-accent btn-small" href="#notify">
        通知を受け取る
      </a>
    </header>
  );
}
