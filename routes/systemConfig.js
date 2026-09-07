var express = require('express');
var router = express.Router();
var prisma = require('../lib/prisma');
var { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.get('/', async function (req, res, next) {
  try {
    const items = await prisma.systemConfig.findMany();
    res.json(items);
  } catch (err) {
    next(err);
  }
});

router.get('/:key', async function (req, res, next) {
  try {
    const item = await prisma.systemConfig.findUnique({ where: { key: req.params.key } });
    if (!item) return res.status(404).json({ message: 'SystemConfig not found' });
    res.json(item);
  } catch (err) {
    next(err);
  }
});

router.post('/', async function (req, res, next) {
  try {
    const item = await prisma.systemConfig.create({ data: req.body });
    res.status(201).json(item);
  } catch (err) {
    if (err.code === 'P2002') return res.status(409).json({ message: 'Config key already exists' });
    next(err);
  }
});

router.put('/:key', async function (req, res, next) {
  try {
    const item = await prisma.systemConfig.update({
      where: { key: req.params.key },
      data: req.body,
    });
    res.json(item);
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ message: 'SystemConfig not found' });
    next(err);
  }
});

router.delete('/:key', async function (req, res, next) {
  try {
    await prisma.systemConfig.delete({ where: { key: req.params.key } });
    res.status(204).end();
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ message: 'SystemConfig not found' });
    next(err);
  }
});

module.exports = router;
