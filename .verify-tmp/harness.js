// Orchestrator: spawns the repro server as a child so a crash is observable.
'use strict';
var spawn = require('child_process').spawn;

var mode = process.argv[2] || 'destroy';
var child = spawn(process.execPath, [__dirname + '/proxy-server.js', mode], { stdio: ['ignore', 'pipe', 'pipe'] });
var exited = false;
child.stdout.on('data', function (d) { process.stdout.write(String(d)); });
child.stderr.on('data', function (d) { process.stdout.write('[server-stderr] ' + String(d)); });
child.on('exit', function (code, sig) {
  exited = true;
  console.log('\nRESULT(mode=' + mode + '): SERVER PROCESS EXITED code=' + code + ' signal=' + sig + ' => CRASHED');
  process.exit(0);
});

setTimeout(function () {
  fetch('http://127.0.0.1:3999/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: [{ role: 'user', content: 'hi' }] }),
  }).then(async function (res) {
    console.log('[client] status=' + res.status);
    try {
      var t = await res.text();
      console.log('[client] body=' + JSON.stringify(t.slice(0, 120)));
    } catch (e) {
      console.log('[client] body read failed: ' + e.message);
    }
  }).catch(function (e) {
    console.log('[client] request failed: ' + e.message + (e.cause ? ' / ' + e.cause.message : ''));
  });

  setTimeout(function () {
    if (!exited) {
      console.log('\nRESULT(mode=' + mode + '): server still alive after mid-stream failure => NO CRASH');
      child.kill();
      setTimeout(function () { process.exit(0); }, 500);
    }
  }, 3000);
}, 800);
