export default function Home() {
  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/store/" aria-label="ITsMagic Store home">
          <span className="brand-mark">M</span>
          <span>ITsMagic <span className="muted">Store</span></span>
        </a>
        <span className="top-note">Made for creators</span>
      </header>

      <section className="hero" aria-labelledby="hero-title">
        <div className="eyebrow"><span className="status-dot" /> THE ITSMAGIC ECOSYSTEM</div>
        <h1 id="hero-title">Make your next<br /><span>great thing.</span></h1>
        <p className="intro">Discover apps, tools, and resources built to help you create with ITsMagic.</p>
        <a className="primary-link" href="https://itsmagic.com.br/">Explore ITsMagic <span aria-hidden="true">↗</span></a>
        <div className="hero-orbit orbit-one" />
        <div className="hero-orbit orbit-two" />
        <div className="hero-grid" />
      </section>

      <section className="featured" aria-labelledby="featured-title">
        <div className="section-heading">
          <div><p className="kicker">THE COLLECTION</p><h2 id="featured-title">Made to build</h2></div>
          <span className="coming-soon">More coming soon</span>
        </div>
        <article className="product-card">
          <div className="product-icon">✦</div>
          <div className="product-copy">
            <p className="product-label">CREATION PLATFORM</p>
            <h3>ITsMagic Engine</h3>
            <p>A creative engine for turning ideas into interactive worlds.</p>
          </div>
          <a className="text-link" href="https://itsmagic.com.br/">Discover <span aria-hidden="true">→</span></a>
        </article>
      </section>

      <footer className="footer"><span>© 2026 ITsMagic Engine, Inc.</span><a href="https://itsmagic.com.br/">itsmagic.com.br</a></footer>
    </main>
  );
}
