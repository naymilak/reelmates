const express = require('express');
const { collections, toObjectId } = require('../db/mongo');
const { requireAuth } = require('../middleware/auth');
const { validateRating } = require('../utils/validate');
const { upsertMovieFromTmdb, listWithMovies } = require('../services/movies');

const router = express.Router();
router.use(requireAuth);

function currentUserId(req) {
  return toObjectId(req.session.userId);
}

async function getStats(userId) {
  const { watchlist, watched } = collections();
  const [watchlistCount, watchedCount] = await Promise.all([
    watchlist.countDocuments({ userId }),
    watched.countDocuments({ userId }),
  ]);
  return { watchlistCount, watchedCount };
}

router.get('/profile', async (req, res, next) => {
  try {
    const userId = currentUserId(req);
    const user = await collections().users.findOne(
      { _id: userId },
      { projection: { email: 1, handle: 1 } }
    );
    if (!user) return res.status(401).json({ error: 'You must be signed in.' });

    const stats = await getStats(userId);
    res.json({
      user: { id: user._id.toString(), email: user.email, handle: user.handle },
      stats: {
        watchedCount: stats.watchedCount,
        ratedCount: stats.watchedCount,
        watchlistCount: stats.watchlistCount,
      },
    });
  } catch (err) {
    next(err);
  }
});

router.get('/watchlist', async (req, res, next) => {
  try {
    const userId = currentUserId(req);
    const entries = await collections()
      .watchlist.find({ userId })
      .sort({ addedAt: -1 })
      .toArray();
    const items = await listWithMovies(entries, (e) => ({ addedAt: e.addedAt }));
    res.json({ items });
  } catch (err) {
    next(err);
  }
});

router.post('/watchlist/:tmdbId', async (req, res, next) => {
  try {
    const userId = currentUserId(req);
    const tmdbId = Number(req.params.tmdbId);
    if (!Number.isInteger(tmdbId) || tmdbId <= 0) {
      return res.status(400).json({ error: 'Invalid movie id.' });
    }

    await upsertMovieFromTmdb(tmdbId);

    const alreadyWatched = await collections().watched.findOne({ userId, tmdbId });
    if (alreadyWatched) {
      return res.status(409).json({ error: 'Movie is already in your watched list.' });
    }

    await collections().watchlist.updateOne(
      { userId, tmdbId },
      { $setOnInsert: { userId, tmdbId, addedAt: new Date() } },
      { upsert: true }
    );

    res.status(201).json({ ok: true });
  } catch (err) {
    next(err);
  }
});

router.delete('/watchlist/:tmdbId', async (req, res, next) => {
  try {
    const userId = currentUserId(req);
    const tmdbId = Number(req.params.tmdbId);
    await collections().watchlist.deleteOne({ userId, tmdbId });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

router.get('/watched', async (req, res, next) => {
  try {
    const userId = currentUserId(req);
    const entries = await collections()
      .watched.find({ userId })
      .sort({ watchedAt: -1 })
      .toArray();
    const items = await listWithMovies(entries, (e) => ({
      rating: e.rating,
      watchedAt: e.watchedAt,
    }));
    res.json({ items });
  } catch (err) {
    next(err);
  }
});

router.post('/watched/:tmdbId', async (req, res, next) => {
  try {
    const userId = currentUserId(req);
    const tmdbId = Number(req.params.tmdbId);
    const ratingErr = validateRating(req.body?.rating);
    if (!Number.isInteger(tmdbId) || tmdbId <= 0) {
      return res.status(400).json({ error: 'Invalid movie id.' });
    }
    if (ratingErr) return res.status(400).json({ error: ratingErr });

    const rating = Number(req.body.rating);
    const fromWatchlist = Boolean(req.body.fromWatchlist);

    await upsertMovieFromTmdb(tmdbId);

    const existing = await collections().watched.findOne({ userId, tmdbId });
    if (existing) {
      return res
        .status(409)
        .json({ error: 'You already rated this movie. Edit the rating instead.' });
    }

    await collections().watched.insertOne({
      userId,
      tmdbId,
      rating,
      watchedAt: new Date(),
    });

    if (fromWatchlist) {
      await collections().watchlist.deleteOne({ userId, tmdbId });
    }

    res.status(201).json({ ok: true });
  } catch (err) {
    next(err);
  }
});

router.patch('/watched/:tmdbId', async (req, res, next) => {
  try {
    const userId = currentUserId(req);
    const tmdbId = Number(req.params.tmdbId);
    const ratingErr = validateRating(req.body?.rating);
    if (ratingErr) return res.status(400).json({ error: ratingErr });

    const result = await collections().watched.findOneAndUpdate(
      { userId, tmdbId },
      { $set: { rating: Number(req.body.rating) } },
      { returnDocument: 'after' }
    );
    const doc = result?.value ?? result;
    if (!doc) {
      return res.status(404).json({ error: 'Movie is not in your watched list.' });
    }
    res.json({ rating: doc.rating });
  } catch (err) {
    next(err);
  }
});

router.delete('/watched/:tmdbId', async (req, res, next) => {
  try {
    const userId = currentUserId(req);
    const tmdbId = Number(req.params.tmdbId);
    await collections().watched.deleteOne({ userId, tmdbId });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
