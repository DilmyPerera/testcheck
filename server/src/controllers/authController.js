const prisma = require('../lib/prisma');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const { hashPassword, comparePassword, generateRandomPassword } = require('../utils/password');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../utils/jwt');

function toTokens(user) {
  return {
    accessToken: signAccessToken(user),
    refreshToken: signRefreshToken(user),
  };
}

function toPublicUser(user) {
  return { id: user.id, email: user.email, role: user.role };
}

const register = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const hashed = await hashPassword(password);
  const user = await prisma.user.create({
    data: { email, password: hashed, role: 'CUSTOMER' },
  });

  res.status(201).json({ user: toPublicUser(user) });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.role !== 'CUSTOMER') {
    throw new AppError('Invalid email or password', 401);
  }

  const valid = await comparePassword(password, user.password);
  if (!valid) {
    throw new AppError('Invalid email or password', 401);
  }

  res.json({ user: toPublicUser(user), ...toTokens(user) });
});

const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.role !== 'ADMIN') {
    throw new AppError('Invalid email or password', 401);
  }

  const valid = await comparePassword(password, user.password);
  if (!valid) {
    throw new AppError('Invalid email or password', 401);
  }

  res.json({ user: toPublicUser(user), ...toTokens(user) });
});

const refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch (err) {
    throw new AppError('Invalid or expired refresh token', 401);
  }

  const user = await prisma.user.findUnique({ where: { id: payload.sub } });
  if (!user) {
    throw new AppError('Invalid or expired refresh token', 401);
  }

  res.json({ user: toPublicUser(user), ...toTokens(user) });
});

const createAdmin = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const generatedPassword = generateRandomPassword();
  const hashed = await hashPassword(generatedPassword);

  const admin = await prisma.user.create({
    data: { email, password: hashed, role: 'ADMIN' },
  });

  res.status(201).json({
    user: toPublicUser(admin),
    generatedPassword,
  });
});

module.exports = { register, login, adminLogin, refresh, createAdmin };
