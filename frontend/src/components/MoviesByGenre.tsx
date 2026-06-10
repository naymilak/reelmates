import type { ReactNode } from 'react';
import type { MovieListItem } from '../api/client';
import { groupMoviesByGenre } from '../utils/groupByGenre';
import { MovieCard } from './MovieCard';

type MoviesByGenreProps = {
  movies: MovieListItem[];
  emptyMessage: string;
  renderActions?: (movie: MovieListItem) => ReactNode;
};

export function MoviesByGenre({ movies, emptyMessage, renderActions }: MoviesByGenreProps) {
  if (movies.length === 0) {
    return <p className="muted">{emptyMessage}</p>;
  }

  const groups = groupMoviesByGenre(movies);

  return (
    <div className="genre-groups">
      {groups.map(({ genre, movies: genreMovies }) => ( //izpis
        <div key={genre} className="genre-group">
          <h3 className="genre-heading">
            {genre} <span className="genre-count">({genreMovies.length})</span>
          </h3>
          <div className="movie-scroll">
            {genreMovies.map((movie) => (
              <MovieCard
                key={`${genre}-${movie.tmdbId}`}
                movie={movie}
                rating={movie.rating}
                actions={renderActions?.(movie)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}