const { collections } = require('../db/mongo');
const tmdb = require('./tmdb');

async function upsertMovieFromTmdb(tmdbId) {
  const detail = await tmdb.getMovieDetails(tmdbId);
  const now = new Date();

  await collections().movies.updateOne(
    { tmdbId: detail.tmdbId },
    {
      $set: {
        tmdbId: detail.tmdbId,
        title: detail.title,
        posterPath: detail.posterPath,
        releaseYear: detail.releaseYear,
        overview: detail.overview,
        updatedAt: now,
      },
      $setOnInsert: { createdAt: now },
    },
    { upsert: true }
  );

  return detail;
}

function docToMovie(doc) {
  if (!doc) return null;
  return {
    tmdbId: doc.tmdbId,
    title: doc.title,
    posterPath: doc.posterPath ?? null,
    posterUrl: tmdb.posterUrl(doc.posterPath),
    releaseYear: doc.releaseYear ?? null,
    overview: doc.overview ?? '',
    rating: doc.rating ?? undefined,
    watchedAt: doc.watchedAt?.toISOString?.() ?? doc.watchedAt ?? undefined,
    addedAt: doc.addedAt?.toISOString?.() ?? doc.addedAt ?? undefined,
  };
}

async function listWithMovies(entries, pickExtra) {
  if (entries.length === 0) return [];

  const tmdbIds = entries.map((e) => e.tmdbId);
  const movies = await collections()
    .movies.find({ tmdbId: { $in: tmdbIds } })
    .toArray();
  const byId = new Map(movies.map((m) => [m.tmdbId, m]));

  return entries
    .map((entry) => {
      const movie = byId.get(entry.tmdbId);
      if (!movie) return null;
      return docToMovie({ ...movie, ...pickExtra(entry) });
    })
    .filter(Boolean);
}

module.exports = { upsertMovieFromTmdb, docToMovie, listWithMovies };
