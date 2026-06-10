function isDuplicateKeyError(err) {
  return err?.code === 11000;
}

function duplicateField(err) {
  const key = err?.keyPattern ? Object.keys(err.keyPattern)[0] : '';
  return key;
}

module.exports = { isDuplicateKeyError, duplicateField };
