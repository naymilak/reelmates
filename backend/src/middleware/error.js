function errorHandler(err, _req, res, _next) {
  const status = err.status || 500;
  const message =
    status >= 500 ? 'Something went wrong. Please try again.' : err.message || 'Request failed.';
  if (status >= 500) console.error(err);
  res.status(status).json({ error: message });
}

module.exports = { errorHandler };
