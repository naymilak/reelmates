require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const { MongoStore } = require('connect-mongo');
const { connectMongo, getClient, getDb } = require('./db/mongo');
const { ensureIndexes } = require('./db/indexes');
const { errorHandler } = require('./middleware/error');

const authRoutes = require('./routes/auth');
const moviesRoutes = require('./routes/movies');
const usersRoutes = require('./routes/users');
const meRoutes = require('./routes/me');

const PORT = process.env.PORT || 3001;

async function createApp() {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is required. Copy backend/.env.example to backend/.env');
  }

  await connectMongo();
  await ensureIndexes();

  const app = express();

  app.use(
    cors({
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      credentials: true,
    })
  );
  app.use(express.json());
  app.use(cookieParser());

  app.use(
    session({
      store: MongoStore.create({
        client: getClient(),
        dbName: getDb().databaseName,
      }),
      secret: process.env.SESSION_SECRET || 'dev-only-change-me',
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      },
    })
  );

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, service: 'reelmates-api' });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/movies', moviesRoutes);
  app.use('/api/users', usersRoutes);
  app.use('/api/me', meRoutes);

  app.use(errorHandler);

  return app;
}

createApp()
  .then((app) => {
    app.listen(PORT, () => {
      console.log(`API: http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to start server', err);
    process.exit(1);
  });
