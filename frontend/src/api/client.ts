const API_BASE = import.meta.env.VITE_API_URL || '/api';

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError(data.error || 'Request failed', res.status);
  }
  return data as T;
}

export const api = {
  auth: {
    me: () => request<{ user: User | null }>('/auth/me'),
    login: (body: { email: string; password: string }) =>
      request<{ user: User }>('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
    register: (body: { email: string; password: string; handle: string }) =>
      request<{ user: User }>('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
    logout: () => request<{ ok: boolean }>('/auth/logout', { method: 'POST' }),
  },
  movies: {
    search: (q: string) =>
      request<{ results: MovieSummary[] }>(`/movies/search?q=${encodeURIComponent(q)}`),
    get: (tmdbId: number) => request<{ movie: MovieDetail }>(`/movies/${tmdbId}`),
  },
  me: {
    profile: () => request<{ user: User; stats: ProfileStats }>('/me/profile'),
    watchlist: () => request<{ items: MovieListItem[] }>('/me/watchlist'),
    addWatchlist: (tmdbId: number) =>
      request<{ ok: boolean }>(`/me/watchlist/${tmdbId}`, { method: 'POST' }),
    removeWatchlist: (tmdbId: number) =>
      request<{ ok: boolean }>(`/me/watchlist/${tmdbId}`, { method: 'DELETE' }),
    watched: () => request<{ items: MovieListItem[] }>('/me/watched'),
    markWatched: (tmdbId: number, rating: number, fromWatchlist = false) =>
      request<{ ok: boolean }>(`/me/watched/${tmdbId}`, {
        method: 'POST',
        body: JSON.stringify({ rating, fromWatchlist }),
      }),
    updateRating: (tmdbId: number, rating: number) =>
      request<{ rating: number }>(`/me/watched/${tmdbId}`, {
        method: 'PATCH',
        body: JSON.stringify({ rating }),
      }),
    removeWatched: (tmdbId: number) =>
      request<{ ok: boolean }>(`/me/watched/${tmdbId}`, { method: 'DELETE' }),
  },
  users: {
    search: (q: string) =>
      request<{ users: { handle: string }[] }>(`/users/search?q=${encodeURIComponent(q)}`),
    publicProfile: (handle: string) =>
      request<{ profile: PublicProfile }>(`/users/${encodeURIComponent(handle)}`),
  },
};

export type User = { id: string; email: string; handle: string };

export type ProfileStats = {
  watchedCount: number;
  ratedCount: number;
  watchlistCount: number;
};

export type MovieSummary = {
  tmdbId: number;
  title: string;
  posterPath: string | null;
  posterUrl: string | null;
  releaseYear: number | null;
  overview: string;
};

export type MovieDetail = MovieSummary & {
  runtime: number | null;
  genres: string[];
  onWatchlist?: boolean;
  watched?: { rating: number } | null;
};

export type MovieListItem = MovieSummary & {
  rating?: number;
  watchedAt?: string;
  addedAt?: string;
};

export type PublicProfile = {
  handle: string;
  watchedCount: number;
  ratedCount: number;
  watched: MovieListItem[];
};
