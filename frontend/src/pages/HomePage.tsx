import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function HomePage() {
  const { user } = useAuth();

  return (
    <>
      <h1>Your movie tracker</h1>
      <p className="lead">
        Create an account with email and password, pick a unique @handle, and sign in with a
        server-side session. Movie search and lists come in a later step.
      </p>
      <ul className="pill-row">
        <li className="pill">Sign up</li>
        <li className="pill">Sign in</li>
        <li className="pill">@handle</li>
      </ul>
      <section className="grid">
        <article className="card">
          <h2>Sign up</h2>
          <p>Register with email, password, and a public @handle.</p>
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
          <h2>Sign in</h2>
          <p>Return with your email and password. Sessions are stored in MongoDB.</p>
          <Link to="/login" className="card-link">
            Sign in →
          </Link>
        </article>
        <article className="card">
          <h2>Your profile</h2>
          <p>After signing in, view your account and @handle on your profile page.</p>
          <Link to={user ? '/profile' : '/register'} className="card-link">
            {user ? 'Open profile →' : 'Get started →'}
          </Link>
        </article>
      </section>
    </>
  );
}
