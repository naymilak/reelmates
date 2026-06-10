import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function ProfilePage() {
  const { user, loading } = useAuth();

  if (loading) return <p className="muted">Loading…</p>;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <>
      <h1>@{user.handle}</h1>
      <p className="lead">You are signed in. Your public profile URL will be /u/{user.handle}.</p>
      <ul className="stats-row">
        <li>
          <strong>{user.email}</strong>
          <span>Email</span>
        </li>
        <li>
          <strong>@{user.handle}</strong>
          <span>Handle</span>
        </li>
      </ul>
    </>
  );
}
