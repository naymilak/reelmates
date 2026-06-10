import { Link } from 'react-router-dom';
import type { MovieListItem, MovieSummary } from '../api/client';

type Props = {
  movie: MovieSummary | MovieListItem;
  rating?: number;
  actions?: React.ReactNode;
};

export function MovieCard({ movie, rating, actions }: Props) {
  return (
    <article className="movie-card">
      <Link to={`/movies/${movie.tmdbId}`} className="movie-poster-link">
        {movie.posterUrl ? (
          <img src={movie.posterUrl} alt="" className="movie-poster" loading="lazy" />
        ) : (
          <div className="movie-poster placeholder">No poster</div>
        )}
      </Link>
      <div className="movie-body">
        <Link to={`/movies/${movie.tmdbId}`} className="movie-title">
          {movie.title}
        </Link>
        {movie.releaseYear && <p className="movie-year">{movie.releaseYear}</p>}
        {rating != null && <p className="movie-rating">★ {rating}/10</p>}
        {actions && <div className="movie-actions">{actions}</div>}
      </div>
    </article>
  );
}
