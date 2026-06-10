import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function HomePage() {
  const { user } = useAuth();

  return (
    <>
      <h1>Your movie tracker</h1>
      <p className="lead">
        Search films via TMDB, build a watchlist, mark what you have watched, and rate titles
        from 1 to 10. Share your watched list on a public profile — no streaming here.
      </p>
      <ul className="pill-row">
        <li className="pill">Watchlist</li>
        <li className="pill">Watched + rating</li>
        <li className="pill">Public @handle</li>
      </ul>
      <section className="grid">
        <article className="card">
          <h2>Search</h2>
          <p>Type-ahead movie search powered by TMDB.</p>
          <Link to="/search" className="card-link">
            Find movies →
          </Link>
        </article>
        <article className="card">
          <h2>Your lists</h2>
          <p>Watchlist without ratings; watched with a single 1–10 score per film.</p>
          {user ? (
            <Link to="/profile" className="card-link">
              My profile →
            </Link>
          ) : (
            <Link to="/register" className="card-link">
              Create account →
            </Link>
          )}
        </article>
        <article className="card">
          <h2>Community</h2>
          <p>Find users by @handle. Their watchlist stays private.</p>
          <Link to="/users" className="card-link">
            Find users →
          </Link>
        </article>
      </section>
    </>
  );
}
