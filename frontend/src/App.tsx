import './App.css'

function App() {
  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <span className="logo">ReelMates</span>
          <nav className="nav" aria-label="Glavna navigacija">
            <span className="nav-muted">Iskanje · Profil · Prijava (v izdelavi)</span>
          </nav>
        </div>
      </header>

      <main className="main">
        <h1>Sledilnik filmov</h1>
        <p className="lead">
          Full-stack aplikacija: React (Vite), Node.js (Express), PostgreSQL. Metapodatki
          filmov prek TMDB API.
        </p>

        <ul className="pill-row" aria-label="Načrtovane funkcionalnosti">
          <li className="pill">Watchlist</li>
          <li className="pill">Ogledano + ocena 1–10</li>
          <li className="pill">Javni profil (gametag)</li>
        </ul>

        <section className="grid" aria-label="Osnovni moduli">
          <article className="card">
            <h2>Iskanje</h2>
            <p>Predlogi med tipkanjem (TMDB), podrobnosti filma.</p>
          </article>
          <article className="card">
            <h2>Seznami</h2>
            <p>Watchlist brez ocene; ogledano z obvezno oceno in možnostjo urejanja.</p>
          </article>
          <article className="card">
            <h2>Skupnost</h2>
            <p>Iskanje uporabnikov po gametag-u; tuji profili kažejo le ogledano.</p>
          </article>
        </section>
      </main>

      <footer className="footer">
        <small>FERI · študentski projekt · dokumentacija v mapi docs/</small>
      </footer>
    </div>
  )
}

export default App
