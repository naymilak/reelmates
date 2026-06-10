import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, ApiError, type MovieDetail } from '../api/client';

export function MovieDetailPage() {
  const { id } = useParams();
  const tmdbId = Number(id);
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!Number.isInteger(tmdbId) || tmdbId <= 0) {
      setError('Invalid movie.');
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError('');

    api.movies
      .get(tmdbId)
      .then((data) => {
        if (!cancelled) setMovie(data.movie);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : 'Could not load movie.');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [tmdbId]);

  if (loading) return <p className="muted">Loading…</p>;
  if (error || !movie) return <p className="form-error">{error || 'Movie not found.'}</p>;

  return (
    <>
      <Link to="/search" className="back-link">
        ← Back to search
      </Link>
      <article className="movie-detail">
        {movie.posterUrl ? (
          <img src={movie.posterUrl} alt="" className="movie-detail-poster" />
        ) : (
          <div className="movie-detail-poster placeholder">No poster</div>
        )}
        <div>
          <h1>{movie.title}</h1>
          <p className="movie-meta">
            {[movie.releaseYear, movie.runtime ? `${movie.runtime} min` : null, movie.genres?.join(', ')]
              .filter(Boolean)
              .join(' · ')}
          </p>
          <p className="movie-overview">{movie.overview || 'No overview available.'}</p>
        </div>
      </article>
    </>
  );
}
