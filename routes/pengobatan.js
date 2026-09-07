var express = require('express');
var router = express.Router();
var prisma = require('../lib/prisma');
var { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.get('/', async function (req, res, next) {
  try {
    const items = await prisma.pengobatan.findMany();
    res.json(items);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async function (req, res, next) {
  try {
    const item = await prisma.pengobatan.findUnique({ where: { id: req.params.id } });
    if (!item) return res.status(404).json({ message: 'Pengobatan not found' });
    res.json(item);
  } catch (err) {
    next(err);
  }
});

router.post('/', async function (req, res, next) {
  try {
    const item = await prisma.pengobatan.create({ data: req.body });
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async function (req, res, next) {
  try {
    const item = await prisma.pengobatan.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(item);
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ message: 'Pengobatan not found' });
    next(err);
  }
});

router.delete('/:id', async function (req, res, next) {
  try {
    await prisma.pengobatan.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ message: 'Pengobatan not found' });
    next(err);
  }
});

module.exports = router;
