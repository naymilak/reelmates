const express = require('express');
const { collections } = require('../db/mongo');
const { listWithMovies } = require('../services/movies');

const router = express.Router();

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

router.get('/search', async (req, res, next) => {
  try {
    const q = String(req.query.q || '')
      .trim()
      .replace(/^@/, '')
      .toLowerCase();
    if (q.length < 2) return res.json({ users: [] });

    const users = await collections()
      .users.find({ handle: { $regex: `^${escapeRegex(q)}` } })
      .project({ handle: 1 })
      .sort({ handle: 1 })
      .limit(20)
      .toArray();

    res.json({ users: users.map((u) => ({ handle: u.handle })) });
  } catch (err) {
    next(err);
  }
});

router.get('/:handle', async (req, res, next) => {
  try {
    const handle = String(req.params.handle || '')
      .trim()
      .replace(/^@/, '')
      .toLowerCase();
    if (!handle) return res.status(400).json({ error: 'Invalid handle.' });

    const user = await collections().users.findOne({ handle });
    if (!user) return res.status(404).json({ error: 'User not found.' });

    const entries = await collections()
      .watched.find({ userId: user._id })
      .sort({ watchedAt: -1 })
      .toArray();

    const watched = await listWithMovies(entries, (e) => ({
      rating: e.rating,
      watchedAt: e.watchedAt,
    }));

    res.json({
      profile: {
        handle: user.handle,
        watchedCount: watched.length,
        ratedCount: watched.length,
        watched,
      },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
