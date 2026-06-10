const TMDB_BASE = 'https://api.themoviedb.org/3';
const IMAGE_BASE = 'https://image.tmdb.org/t/p';

function getApiKey() {
  const key = process.env.TMDB_API_KEY;
  if (!key) {
    const err = new Error('TMDB API key is not configured on the server.');
    err.status = 503;
    throw err;
  }
  return key;
}

async function tmdbFetch(path, params = {}) {
  const url = new URL(`${TMDB_BASE}${path}`);
  url.searchParams.set('api_key', getApiKey());
  for (const [k, v] of Object.entries(params)) {
    if (v != null && v !== '') url.searchParams.set(k, String(v));
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (res.status === 429) {
      const err = new Error('Movie service is busy. Please try again in a moment.');
      err.status = 429;
      throw err;
    }
    if (!res.ok) {
      const err = new Error('Could not load movie data. Please try again.');
      err.status = res.status >= 500 ? 502 : 400;
      throw err;
    }
    return res.json();
  } catch (e) {
    clearTimeout(timeout);
    if (e.name === 'AbortError') {
      const err = new Error('Movie service timed out. Please try again.');
      err.status = 504;
      throw err;
    }
    throw e;
  }
}

function mapSearchResult(movie) {
  const year = movie.release_date ? Number(movie.release_date.slice(0, 4)) : null;
  return {
    tmdbId: movie.id,
    title: movie.title,
    posterPath: movie.poster_path,
    releaseYear: Number.isFinite(year) ? year : null,
    overview: movie.overview || '',
  };
}

function mapMovieDetail(movie) {
  const base = mapSearchResult(movie);
  return {
    ...base,
    runtime: movie.runtime ?? null,
    genres: (movie.genres || []).map((g) => g.name),
  };
}

function posterUrl(posterPath, size = 'w342') {
  if (!posterPath) return null;
  return `${IMAGE_BASE}/${size}${posterPath}`;
}

async function searchMovies(query) {
  const q = String(query || '').trim();
  if (q.length < 2) return [];
  const data = await tmdbFetch('/search/movie', { query: q, include_adult: 'false' });
  return (data.results || []).slice(0, 12).map(mapSearchResult);
}

async function getMovieDetails(tmdbId) {
  const data = await tmdbFetch(`/movie/${tmdbId}`);
  return mapMovieDetail(data);
}

async function discoverByGenre(genreId, page = 1) {
  const data = await tmdbFetch('/discover/movie', {
    with_genres: genreId,
    sort_by: 'popularity.desc',
    page,
  });
  return (data.results || []).slice(0, 8).map(mapSearchResult);
}

module.exports = {
  searchMovies,
  getMovieDetails,
  discoverByGenre,
  posterUrl,
  mapSearchResult,
};
