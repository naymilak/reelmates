require('dotenv').config();
const { connectMongo, closeMongo } = require('./mongo');
const { ensureIndexes } = require('./indexes');

async function setup() {
  await connectMongo();
  await ensureIndexes();
}

setup()
  .then(() => closeMongo())
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
