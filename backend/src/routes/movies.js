const express = require('express');
const tmdb = require('../services/tmdb');
const { attachUserId } = require('../middleware/auth');
const { collections, toObjectId } = require('../db/mongo');

const router = express.Router();

router.use(attachUserId);

const HOME_GENRES = [
  { name: 'Action', id: 28 },
  { name: 'Comedy', id: 35 },
  { name: 'Drama', id: 18 },
  { name: 'Horror', id: 27 },
  { name: 'Science Fiction', id: 878 },
  { name: 'Romance', id: 10749 },
];

router.get('/home-by-genre', async (_req, res, next) => {
  try {
    const sections = await Promise.all(
      HOME_GENRES.map(async ({ name, id }) => {
        const page = Math.floor(Math.random() * 5) + 1;
        const movies = await tmdb.discoverByGenre(id, page);
        return {
          genre: name,
          movies: movies.map((m) => ({
            ...m,
            posterUrl: tmdb.posterUrl(m.posterPath),
          })),
        };
      })
    );
    res.json({ sections });
  } catch (err) {
    next(err);
  }
});

router.get('/search', async (req, res, next) => {
  try {
    const q = String(req.query.q || '').trim();
    if (q.length < 2) return res.json({ results: [] });
    const results = await tmdb.searchMovies(q);
    const enriched = results.map((m) => ({
      ...m,
      posterUrl: tmdb.posterUrl(m.posterPath),
    }));
    res.json({ results: enriched });
  } catch (err) {
    next(err);
  }
});

router.get('/:tmdbId', async (req, res, next) => {
  try {
    const tmdbId = Number(req.params.tmdbId);
    if (!Number.isInteger(tmdbId) || tmdbId <= 0) {
      return res.status(400).json({ error: 'Invalid movie id.' });
    }

    const detail = await tmdb.getMovieDetails(tmdbId);
    const payload = {
      ...detail,
      posterUrl: tmdb.posterUrl(detail.posterPath, 'w500'),
    };

    const userId = toObjectId(req.userId);
    if (userId) {
      const { watchlist, watched } = collections();
      const [onWatchlist, watchedDoc] = await Promise.all([
        watchlist.findOne({ userId, tmdbId }),
        watched.findOne({ userId, tmdbId }, { projection: { rating: 1 } }),
      ]);
      payload.onWatchlist = Boolean(onWatchlist);
      payload.watched = watchedDoc ? { rating: watchedDoc.rating } : null;
    }

    res.json({ movie: payload });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
