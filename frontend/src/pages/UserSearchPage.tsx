import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, ApiError } from '../api/client';
import { useDebounce } from '../hooks/useDebounce';

export function UserSearchPage() {
  const [query, setQuery] = useState('');
  const debounced = useDebounce(query);
  const [users, setUsers] = useState<{ handle: string }[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (debounced.trim().length < 2) {
      setUsers([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError('');
    api.users
      .search(debounced)
      .then((data) => {
        if (!cancelled) setUsers(data.users);
      })
      .catch((err) => {
        if (!cancelled) {
          setUsers([]);
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
      <h1>Find users</h1>
      <p className="lead">Search by @handle — no friend lists, just public profiles.</p>
      <input
        type="search"
        className="search-input"
        placeholder="@handle…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {loading && <p className="muted">Searching…</p>}
      {error && <p className="form-error">{error}</p>}
      <ul className="user-results">
        {users.map((u) => (
          <li key={u.handle}>
            <Link to={`/u/${u.handle}`}>@{u.handle}</Link>
          </li>
        ))}
      </ul>
    </>
  );
}
