var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var prisma = require('../lib/prisma');
var { JWT_SECRET, authenticate } = require('../middleware/auth');

router.post('/register', async function (req, res, next) {
  try {
    var { username, password, name, role } = req.body;
    if (!username || !password || !name) {
      return res.status(400).json({ message: 'username, password, and name are required' });
    }

    var existing = await prisma.user.findUnique({ where: { username } });
    if (existing) return res.status(409).json({ message: 'Username already exists' });

    var hashedPassword = await bcrypt.hash(password, 10);
    var user = await prisma.user.create({
      data: { username, password: hashedPassword, name, role },
      select: { id: true, username: true, name: true, role: true, createdAt: true },
    });

    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});

router.post('/login', async function (req, res, next) {
  try {
    var { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'username and password are required' });
    }

    var user = await prisma.user.findUnique({ where: { username } });
    if (!user) return res.status(401).json({ message: 'User not found' });

    var valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

    var token = jwt.sign(
      { id: user.id, username: user.username, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: { id: user.id, username: user.username, name: user.name, role: user.role },
    });
  } catch (err) {
    next(err);
  }
});

router.get('/me', authenticate, async function (req, res, next) {
  try {
    var user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, username: true, name: true, role: true, createdAt: true },
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
