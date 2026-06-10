const express = require('express');
const bcrypt = require('bcryptjs');
const { collections, toObjectId } = require('../db/mongo');
const {
  normalizeHandle,
  validateEmail,
  validatePassword,
  validateHandle,
} = require('../utils/validate');
const { isDuplicateKeyError, duplicateField } = require('../utils/mongo');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

function userPayload(user) {
  return {
    id: user._id.toString(),
    email: user.email,
    handle: user.handle,
  };
}

router.post('/register', async (req, res, next) => {
  try {
    const { email, password, handle: rawHandle } = req.body;
    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);
    const handleErr = validateHandle(rawHandle);
    if (emailErr || passErr || handleErr) {
      return res.status(400).json({ error: emailErr || passErr || handleErr });
    }

    const handle = normalizeHandle(rawHandle);
    const passwordHash = await bcrypt.hash(password, 12);

    const result = await collections().users.insertOne({
      email: email.trim().toLowerCase(),
      passwordHash,
      handle,
      createdAt: new Date(),
    });

    const user = {
      _id: result.insertedId,
      email: email.trim().toLowerCase(),
      handle,
    };
    req.session.userId = user._id.toString();
    res.status(201).json({ user: userPayload(user) });
  } catch (err) {
    if (isDuplicateKeyError(err)) {
      const field = duplicateField(err);
      const msg =
        field === 'email' ? 'Email is already registered.' : 'Handle is already taken.';
      return res.status(409).json({ error: msg });
    }
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);
    if (emailErr || passErr) {
      return res.status(400).json({ error: emailErr || passErr });
    }

    const user = await collections().users.findOne({
      email: email.trim().toLowerCase(),
    });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    req.session.userId = user._id.toString();
    res.json({ user: userPayload(user) });
  } catch (err) {
    next(err);
  }
});

router.post('/logout', requireAuth, (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ error: 'Could not sign out.' });
    res.clearCookie('connect.sid');
    res.json({ ok: true });
  });
});

router.get('/me', async (req, res, next) => {
  try {
    if (!req.session?.userId) return res.json({ user: null });

    const userId = toObjectId(req.session.userId);
    if (!userId) {
      req.session.destroy(() => {});
      return res.json({ user: null });
    }

    const user = await collections().users.findOne(
      { _id: userId },
      { projection: { email: 1, handle: 1 } }
    );
    if (!user) {
      req.session.destroy(() => {});
      return res.json({ user: null });
    }
    res.json({ user: userPayload(user) });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
