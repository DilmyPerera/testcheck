const prisma = require('../lib/prisma');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

const create = asyncHandler(async (req, res) => {
  const data = req.body;

  const submission = await prisma.submission.create({
    data: {
      ...data,
      userCreated: req.user.email,
    },
  });

  res.status(201).json({ submission });
});

const VALID_GENDERS = ['MALE', 'FEMALE', 'OTHER'];

const list = asyncHandler(async (req, res) => {
  const { gender, search } = req.query;

  const where = {};
  if (gender) {
    if (!VALID_GENDERS.includes(gender)) {
      throw new AppError('Invalid gender filter', 400);
    }
    where.gender = gender;
  }
  if (search) {
    where.OR = [
      { firstName: { contains: search, mode: 'insensitive' } },
      { lastName: { contains: search, mode: 'insensitive' } },
    ];
  }

  const submissions = await prisma.submission.findMany({
    where,
    orderBy: { dateCreated: 'desc' },
  });

  res.json({ submissions });
});

const update = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    throw new AppError('Invalid submission id', 400);
  }

  const submission = await prisma.submission.update({
    where: { id },
    data: {
      ...req.body,
      userModified: req.user.email,
      dateModified: new Date(),
    },
  });

  res.json({ submission });
});

const remove = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    throw new AppError('Invalid submission id', 400);
  }

  await prisma.submission.delete({ where: { id } });

  res.status(204).send();
});

module.exports = { create, list, update, remove };
