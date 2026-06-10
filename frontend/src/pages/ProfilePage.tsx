import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { api, ApiError, type MovieListItem, type ProfileStats } from '../api/client';
import { MovieCard } from '../components/MovieCard';
import { RatingModal } from '../components/RatingModal';
import { useAuth } from '../context/AuthContext';

export function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [watchlist, setWatchlist] = useState<MovieListItem[]>([]);
  const [watched, setWatched] = useState<MovieListItem[]>([]);
  const [error, setError] = useState('');
  const [ratingMovie, setRatingMovie] = useState<MovieListItem | null>(null);

  async function load() {
    setError('');
    try {
      const [profile, wl, wd] = await Promise.all([
        api.me.profile(),
        api.me.watchlist(),
        api.me.watched(),
      ]);
      setStats(profile.stats);
      setWatchlist(wl.items);
      setWatched(wd.items);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not load profile.');
    }
  }

  useEffect(() => {
    if (user) load();
  }, [user]);

  if (authLoading) return <p className="muted">Loading…</p>;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <>
      <h1>@{user.handle}</h1>
      <p className="lead">
        Your public profile: <Link to={`/u/${user.handle}`}>/u/{user.handle}</Link> (others see
        watched titles only).
      </p>

      {stats && (
        <ul className="stats-row">
          <li>
            <strong>{stats.watchedCount}</strong>
            <span>Watched</span>
          </li>
          <li>
            <strong>{stats.ratedCount}</strong>
            <span>Rated</span>
          </li>
          <li>
            <strong>{stats.watchlistCount}</strong>
            <span>Want to watch</span>
          </li>
        </ul>
      )}

      {error && <p className="form-error">{error}</p>}

      <section className="section">
        <h2>Watchlist</h2>
        {watchlist.length === 0 ? (
          <p className="muted">Nothing on your watchlist yet.</p>
        ) : (
          <div className="movie-grid">
            {watchlist.map((movie) => (
              <MovieCard
                key={movie.tmdbId}
                movie={movie}
                actions={
                  <button
                    type="button"
                    className="btn small primary"
                    onClick={() => setRatingMovie(movie)}
                  >
                    Mark watched
                  </button>
                }
              />
            ))}
          </div>
        )}
      </section>

      <section className="section">
        <h2>Watched</h2>
        {watched.length === 0 ? (
          <p className="muted">No watched movies yet.</p>
        ) : (
          <div className="movie-grid">
            {watched.map((movie) => (
              <MovieCard
                key={movie.tmdbId}
                movie={movie}
                rating={movie.rating}
                actions={
                  <button
                    type="button"
                    className="btn small secondary"
                    onClick={() => setRatingMovie(movie)}
                  >
                    Edit rating
                  </button>
                }
              />
            ))}
          </div>
        )}
      </section>

      {ratingMovie && (
        <RatingModal
          title={ratingMovie.title}
          initialRating={ratingMovie.rating}
          onConfirm={async (rating) => {
            if (ratingMovie.rating != null) {
              await api.me.updateRating(ratingMovie.tmdbId, rating);
            } else {
              await api.me.markWatched(ratingMovie.tmdbId, rating, true);
            }
            setRatingMovie(null);
            await load();
          }}
          onClose={() => setRatingMovie(null)}
        />
      )}
    </>
  );
}
