import type { MovieListItem } from '../api/client';     

export type GenreGroup = {
  genre: string;
  movies: MovieListItem[];
};

export function groupMoviesByGenre(movies: MovieListItem[]): GenreGroup[] { // map -> kljuc - vrednost
    const byGenre = new Map<string, MovieListItem[]>();
    const uncategorized: MovieListItem[] = [];

    for (const movie of movies) {
        const genres = movie.genres?.filter(Boolean) ?? [];

        if (genres.length === 0) { // ce film nima zanrov ga damo v nekategorizirane
            uncategorized.push(movie);
            continue;
        }
    

        for(const genre of genres) { // ce ima film vec zanrov ga damo pod vse zanre
            const list = byGenre.get(genre) ?? [];
            list.push(movie);
            byGenre.set(genre,list);
        }
    }
    const group = [...byGenre.entries()]
        .sort(([a], [b]) =>a.localeCompare(b))
        .map(([genre, genreMovies]) =>({genre: genre, movies: genreMovies}));
    if(uncategorized.length > 0) {
        group.push({genre: 'Uncategorized', movies: uncategorized});
    }
    return group;
}

