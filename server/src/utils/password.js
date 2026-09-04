const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 10;

function hashPassword(plainText) {
  return bcrypt.hash(plainText, SALT_ROUNDS);
}

function comparePassword(plainText, hash) {
  return bcrypt.compare(plainText, hash);
}

function generateRandomPassword(length = 12) {
  const chars =
    'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%';
  const bytes = require('crypto').randomBytes(length);
  let result = '';
  for (let i = 0; i < length; i += 1) {
    result += chars[bytes[i] % chars.length];
  }
  return result;
}

module.exports = { hashPassword, comparePassword, generateRandomPassword };
