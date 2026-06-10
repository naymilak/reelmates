const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const HANDLE_RE = /^[a-zA-Z0-9_]{3,30}$/;

function normalizeHandle(raw) {
  if (typeof raw !== 'string') return null;
  return raw.trim().replace(/^@/, '').toLowerCase();
}

function validateEmail(email) {
  if (typeof email !== 'string' || !EMAIL_RE.test(email.trim())) {
    return 'Valid email is required.';
  }
  return null;
}

function validatePassword(password) {
  if (typeof password !== 'string' || password.length < 8) {
    return 'Password must be at least 8 characters.';
  }
  return null;
}

function validateHandle(handle) {
  const normalized = normalizeHandle(handle);
  if (!normalized || !HANDLE_RE.test(normalized)) {
    return 'Handle must be 3–30 characters (letters, numbers, underscore).';
  }
  return null;
}

function validateRating(rating) {
  const n = Number(rating);
  if (!Number.isInteger(n) || n < 1 || n > 10) {
    return 'Rating must be an integer from 1 to 10.';
  }
  return null;
}

module.exports = {
  normalizeHandle,
  validateEmail,
  validatePassword,
  validateHandle,
  validateRating,
};
