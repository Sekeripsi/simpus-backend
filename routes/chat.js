var express = require('express');
var http = require('http');
var https = require('https');
var jwt = require('jsonwebtoken');
var prisma = require('../lib/prisma');
var { JWT_SECRET } = require('../middleware/auth');

var router = express.Router();

function transformMessages(messages) {
  return messages.map(function (msg) {
    var content = '';
    if (Array.isArray(msg.parts)) {
      content = msg.parts
        .filter(function (p) { return p.type === 'text'; })
        .map(function (p) { return p.text; })
        .join('\n');
    } else if (typeof msg.content === 'string') {
      content = msg.content;
    }
    return { role: msg.role, content: content };
  });
}

// Verify post-visit token (same rules as GET /post-visit/verify/:token) and
// return the decoded payload so the chat request can carry patient context.
async function verifyPostVisitToken(token) {
  var decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return { error: 'Invalid or expired token' };
  }

  if (decoded.type !== 'post_visit') {
    return { error: 'Invalid token type' };
  }

  var postVisit = await prisma.postVisit.findUnique({
    where: { token: token },
  });

  if (!postVisit || !postVisit.isActive) {
    return { error: 'Token has been deactivated' };
  }

  if (new Date() > postVisit.expiresAt) {
    return { error: 'Token has expired' };
  }

  return { decoded: decoded };
}

router.post('/', async function (req, res, next) {
  try {
    var body = req.body || {};
    if (!Array.isArray(body.messages)) {
      return res.status(400).json({ message: 'messages array is required' });
    }

    if (!body.token || typeof body.token !== 'string') {
      return res.status(401).json({ message: 'No post-visit token provided' });
    }

    var verification = await verifyPostVisitToken(body.token);
    if (verification.error) {
      return res.status(401).json({ message: verification.error });
    }

    var transformed = transformMessages(body.messages);
    var postData = JSON.stringify({
      messages: transformed,
      token: body.token,
      patient_id: verification.decoded.pasienId,
      rekam_medis_id: verification.decoded.rekamMedisId,
    });

    var rawUrl = process.env.FASTAPI_URL || 'http://localhost:8000';
    var target = new URL(rawUrl.indexOf('://') === -1 ? 'http://' + rawUrl : rawUrl);
    var transport = target.protocol === 'https:' ? https : http;

    var options = {
      hostname: target.hostname,
      port: process.env.FASTAPI_PORT || target.port || (target.protocol === 'https:' ? 443 : 8000),
      path: '/chat',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    var proxyReq = transport.request(options, function (proxyRes) {
      res.status(proxyRes.statusCode);
      res.setHeader('Content-Type', proxyRes.headers['content-type'] || 'text/plain');
      proxyRes.on('error', function () {
        if (!res.headersSent) {
          res.status(502).json({ message: 'Bad Gateway' });
          return;
        }
        res.end();
      });
      proxyRes.pipe(res);
    });

    // Stop the upstream request when the client disconnects.
    res.on('close', function () {
      proxyReq.destroy();
    });

    proxyReq.on('error', function (err) {
      // Headers already streamed: can only close, a 502 would throw.
      if (res.headersSent) {
        res.end();
        return;
      }
      res.status(502).json({ message: 'Bad Gateway', error: err.message });
    });

    proxyReq.write(postData);
    proxyReq.end();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
