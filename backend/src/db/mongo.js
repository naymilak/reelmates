const { MongoClient, ObjectId } = require('mongodb');

let client;
let db;

async function connectMongo() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is required. Copy backend/.env.example to backend/.env');
  }
  client = new MongoClient(uri);
  await client.connect();
  db = client.db();
  return db;
}

function getDb() {
  if (!db) throw new Error('Database not connected');
  return db;
}

function getClient() {
  if (!client) throw new Error('Database not connected');
  return client;
}

function collections() {
  const database = getDb();
  return {
    users: database.collection('users'),
    movies: database.collection('movies'),
    watchlist: database.collection('watchlist'),
    watched: database.collection('watched'),
  };
}

function toObjectId(id) {
  if (!id) return null;
  try {
    return new ObjectId(String(id));
  } catch {
    return null;
  }
}

async function closeMongo() {
  if (client) await client.close();
}

module.exports = {
  connectMongo,
  getDb,
  getClient,
  collections,
  toObjectId,
  ObjectId,
  closeMongo,
};
