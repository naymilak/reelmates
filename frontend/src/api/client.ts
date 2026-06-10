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
};

export type User = { id: string; email: string; handle: string };

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
};
