import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, ApiError, type PublicProfile } from '../api/client';
import { MoviesByGenre } from '../components/MoviesByGenre';

export function PublicProfilePage() {
  const { handle } = useParams();
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!handle) return;
    setLoading(true);
    api.users
      .publicProfile(handle)
      .then((data) => setProfile(data.profile))
      .catch((err) => {
        setProfile(null);
        setError(err instanceof ApiError ? err.message : 'Profile not found.');
      })
      .finally(() => setLoading(false));
  }, [handle]);

  if (loading) return <p className="muted">Loading…</p>;
  if (error || !profile) return <p className="form-error">{error || 'User not found.'}</p>;

  return (
    <>
      <Link to="/users" className="back-link">
        ← Find users
      </Link>
      <h1>@{profile.handle}</h1>
      <p className="lead">Public profile — watched movies and ratings only.</p>
      <ul className="stats-row">
        <li>
          <strong>{profile.watchedCount}</strong>
          <span>Watched</span>
        </li>
        <li>
          <strong>{profile.ratedCount}</strong>
          <span>Rated</span>
        </li>
      </ul>
      <MoviesByGenre movies={profile.watched} emptyMessage="No watched movies yet." />
    </>
  );
}
