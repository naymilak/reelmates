function requireAuth(req, res, next) {
  if (!req.session?.userId) {
    return res.status(401).json({ error: 'You must be signed in.' });
  }
  next();
}

function attachUserId(req, _res, next) {
  req.userId = req.session?.userId ?? null;
  next();
}

module.exports = { requireAuth, attachUserId };
