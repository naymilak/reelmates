const { collections } = require('./mongo');

async function ensureIndexes() {
  const { users, movies, watchlist, watched } = collections();

  await Promise.all([
    users.createIndex({ email: 1 }, { unique: true }),
    users.createIndex({ handle: 1 }, { unique: true }),
    movies.createIndex({ tmdbId: 1 }, { unique: true }),
    watchlist.createIndex({ userId: 1, tmdbId: 1 }, { unique: true }),
    watched.createIndex({ userId: 1, tmdbId: 1 }, { unique: true }),
  ]);

  console.log('MongoDB indexes ready.');
}

module.exports = { ensureIndexes };
