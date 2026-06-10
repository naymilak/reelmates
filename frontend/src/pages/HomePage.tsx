import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function HomePage() {
  const { user } = useAuth();

  return (
    <>
      <h1>Your movie tracker</h1>
      <p className="lead">
        Search films via TMDB with type-ahead suggestions. Sign in to save lists and ratings in a
        later step.
      </p>
      <ul className="pill-row">
        <li className="pill">TMDB search</li>
        <li className="pill">Movie details</li>
        <li className="pill">@handle account</li>
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
          <h2>Account</h2>
          <p>Register or sign in with email, password, and a public @handle.</p>
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
          <h2>Coming next</h2>
          <p>Watchlist, watched titles, and ratings will be added in the next update.</p>
          <Link to="/search" className="card-link">
            Browse movies →
          </Link>
        </article>
      </section>
    </>
  );
}
