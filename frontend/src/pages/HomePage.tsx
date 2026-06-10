import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, ApiError, type GenreSection } from '../api/client';
import { MovieCard } from '../components/MovieCard';
import { useAuth } from '../context/AuthContext';

export function HomePage() {
  const { user } = useAuth();
  const [sections, setSections] = useState<GenreSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    api.movies
      .homeByGenre()
      .then((data) => setSections(data.sections))
      .catch((err) => {
        setSections([]);
        setError(err instanceof ApiError ? err.message : 'Could not load movies.');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <h1>Your movie tracker</h1>
      <p className="lead">
        Browse popular films by genre, build a watchlist, mark what you have watched, and rate
        titles from 1 to 10 — powered by TMDB.
      </p>
      <ul className="pill-row">
        <li className="pill">Browse by genre</li>
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

      <section className="section">
        <h2>Browse by genre</h2>
        <p className="muted section-note">Popular picks from TMDB — refresh for a new mix.</p>
        {loading && <p className="muted">Loading movies…</p>}
        {error && <p className="form-error">{error}</p>}
        {!loading && !error && (
          <div className="genre-groups">
            {sections.map(({ genre, movies }) => (
              <div key={genre} className="genre-group">
                <h3 className="genre-heading">
                  {genre} <span className="genre-count">({movies.length})</span>
                </h3>
                {movies.length === 0 ? (
                  <p className="muted">No titles for this genre right now.</p>
                ) : (
                  <div className="movie-scroll">
                    {movies.map((movie) => (
                      <MovieCard key={movie.tmdbId} movie={movie} />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
