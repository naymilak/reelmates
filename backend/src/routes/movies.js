const express = require('express');
const tmdb = require('../services/tmdb');

const router = express.Router();

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
    res.json({
      movie: {
        ...detail,
        posterUrl: tmdb.posterUrl(detail.posterPath, 'w500'),
      },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
