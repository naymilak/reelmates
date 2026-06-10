import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, ApiError, type MovieSummary } from '../api/client';
import { useDebounce } from '../hooks/useDebounce';

export function SearchPage() {
  const [query, setQuery] = useState('');
  const debounced = useDebounce(query);
  const [results, setResults] = useState<MovieSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (debounced.trim().length < 2) {
      setResults([]);
      setError('');
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError('');

    api.movies
      .search(debounced)
      .then((data) => {
        if (!cancelled) setResults(data.results);
      })
      .catch((err) => {
        if (!cancelled) {
          setResults([]);
          setError(err instanceof ApiError ? err.message : 'Search failed.');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debounced]);

  return (
    <>
      <h1>Search movies</h1>
      <p className="lead">Start typing — results update as you search (TMDB).</p>
      <input
        type="search"
        className="search-input"
        placeholder="Movie title…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoFocus
      />
      {loading && <p className="muted">Searching…</p>}
      {error && <p className="form-error">{error}</p>}
      {!loading && debounced.length >= 2 && results.length === 0 && !error && (
        <p className="muted">No movies found.</p>
      )}
      <ul className="search-results">
        {results.map((movie) => (
          <li key={movie.tmdbId}>
            <Link to={`/movies/${movie.tmdbId}`} className="search-result">
              {movie.posterUrl ? (
                <img src={movie.posterUrl} alt="" className="search-thumb" loading="lazy" />
              ) : (
                <span className="search-thumb placeholder" />
              )}
              <span>
                <strong>{movie.title}</strong>
                {movie.releaseYear && <span className="muted"> ({movie.releaseYear})</span>}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
