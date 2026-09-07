// Repro harness: fake FastAPI upstream + exact proxy pattern from routes/chat.js
'use strict';
var net = require('net');
var express = require('express');
var http = require('http');

// --- Fake FastAPI: sends SSE headers + one chunk, then kills socket mid-stream ---
var mode = process.argv[2] || 'destroy'; // 'destroy' (FIN) or 'reset' (RST)
var upstream = net.createServer(function (sock) {
  var buf = '';
  sock.on('data', function (d) {
    buf += d.toString();
    if (!buf.includes('\r\n\r\n')) return;
    sock.write('HTTP/1.1 200 OK\r\nContent-Type: text/event-stream\r\nTransfer-Encoding: chunked\r\nConnection: close\r\n\r\n');
    sock.write('7\r\ndata:a\n\r\n'); // one valid chunked piece
    setTimeout(function () {
      console.log('[upstream] killing socket mode=' + mode);
      if (mode === 'reset' && sock.resetAndDestroy) sock.resetAndDestroy();
      else sock.destroy();
    }, 300);
  });
  sock.on('error', function () {});
});
upstream.listen(8765, '127.0.0.1', function () { console.log('[upstream] ready'); });
upstream.on('error', function (e) { console.log('[upstream] listen error', e.message); process.exit(3); });

// --- Express proxy: EXACT pattern of simpus-backend/routes/chat.js lines 82-104 ---
var app = express();
app.use(express.json());
app.post('/chat', function (req, res) {
  var postData = JSON.stringify({ messages: req.body.messages });

  var options = {
    hostname: '127.0.0.1',
    port: 8765,
    path: '/chat',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData),
    },
  };

  var proxyReq = http.request(options, function (proxyRes) {
    res.status(proxyRes.statusCode);
    res.setHeader('Content-Type', proxyRes.headers['content-type'] || 'text/plain');
    proxyRes.pipe(res);
    proxyRes.on('close', function () {
      console.log('[proxy] proxyRes close: aborted=' + proxyRes.aborted + ' complete=' + proxyRes.complete);
    });
  });

  proxyReq.on('error', function (err) {
    // instrumentation only; the next line is verbatim production behavior
    console.log('[proxy] >>> proxyReq ERROR fired: code=' + err.code + ' headersSent=' + res.headersSent + ' writableEnded=' + res.writableEnded);
    res.status(502).json({ message: 'Bad Gateway', error: err.message });
  });

  proxyReq.write(postData);
  proxyReq.end();
});

app.listen(3999, '127.0.0.1', function () { console.log('[proxy] ready'); });
