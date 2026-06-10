import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api, ApiError, type MovieDetail } from '../api/client';
import { RatingModal } from '../components/RatingModal';
import { useAuth } from '../context/AuthContext';

export function MovieDetailPage() {
  const { id } = useParams();
  const tmdbId = Number(id);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [showRating, setShowRating] = useState(false);
  const [actionMsg, setActionMsg] = useState('');

  async function load() {
    setLoading(true);
    setError('');
    try {
      const { movie: data } = await api.movies.get(tmdbId);
      setMovie(data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not load movie.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!Number.isInteger(tmdbId) || tmdbId <= 0) {
      setError('Invalid movie.');
      setLoading(false);
      return;
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tmdbId]);

  async function addToWatchlist() {
    if (!user) return navigate('/login');
    await api.me.addWatchlist(tmdbId);
    setActionMsg('Added to watchlist.');
    await load();
  }

  async function removeFromWatchlist() {
    await api.me.removeWatchlist(tmdbId);
    setActionMsg('Removed from watchlist.');
    await load();
  }

  async function saveRating(rating: number) {
    if (!user) return navigate('/login');
    if (movie?.watched) {
      await api.me.updateRating(tmdbId, rating);
      setActionMsg('Rating updated.');
    } else {
      await api.me.markWatched(tmdbId, rating, Boolean(movie?.onWatchlist));
      setActionMsg('Marked as watched.');
    }
    await load();
  }

  if (loading) return <p className="muted">Loading…</p>;
  if (error || !movie) return <p className="form-error">{error || 'Movie not found.'}</p>;

  const isWatched = Boolean(movie.watched);

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
          {isWatched && (
            <p className="movie-rating large">Your rating: ★ {movie.watched!.rating}/10</p>
          )}
          <p className="movie-overview">{movie.overview || 'No overview available.'}</p>

          {!user && (
            <p className="muted">
              <Link to="/login">Sign in</Link> to add this movie to your lists.
            </p>
          )}

          {user && (
            <div className="action-row">
              {!isWatched && !movie.onWatchlist && (
                <>
                  <button type="button" className="btn secondary" onClick={addToWatchlist}>
                    Add to watchlist
                  </button>
                  <button type="button" className="btn primary" onClick={() => setShowRating(true)}>
                    Mark as watched
                  </button>
                </>
              )}
              {movie.onWatchlist && !isWatched && (
                <>
                  <button type="button" className="btn secondary" onClick={removeFromWatchlist}>
                    Remove from watchlist
                  </button>
                  <button type="button" className="btn primary" onClick={() => setShowRating(true)}>
                    Mark as watched
                  </button>
                </>
              )}
              {isWatched && (
                <button type="button" className="btn primary" onClick={() => setShowRating(true)}>
                  Edit rating
                </button>
              )}
            </div>
          )}
          {actionMsg && <p className="success-msg">{actionMsg}</p>}
        </div>
      </article>

      {showRating && (
        <RatingModal
          title={movie.title}
          initialRating={movie.watched?.rating}
          onConfirm={saveRating}
          onClose={() => setShowRating(false)}
        />
      )}
    </>
  );
}
