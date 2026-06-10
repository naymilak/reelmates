import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <Link to="/" className="logo">
            ReelMates
          </Link>
          <nav className="nav" aria-label="Main navigation">
            <Link to="/search">Search</Link>
            {user ? (
              <>
                <Link to="/profile">@{user.handle}</Link>
                <button type="button" className="btn-link" onClick={() => logout()}>
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link to="/login">Sign in</Link>
                <Link to="/register" className="btn-nav">
                  Sign up
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="main">
        <Outlet />
      </main>

      <footer className="footer">
        <small>Track what you watch — search films via TMDB.</small>
      </footer>
    </div>
  );
}
