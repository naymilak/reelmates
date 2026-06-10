const { collections } = require('./mongo');

async function ensureIndexes() {
  const { users } = collections();

  await Promise.all([
    users.createIndex({ email: 1 }, { unique: true }),
    users.createIndex({ handle: 1 }, { unique: true }),
  ]);

  console.log('MongoDB indexes ready.');
}

module.exports = { ensureIndexes };
