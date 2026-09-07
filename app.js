var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var pinoHttp = require('pino-http');
var logger = require('./lib/logger');
var apiLogger = require('./middleware/logger');

var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var usersRouter = require('./routes/users');
var patientsRouter = require('./routes/patients');
var pendaftaranRouter = require('./routes/pendaftaran');
var kajianAwalRouter = require('./routes/kajianAwal');
var anamnesisRouter = require('./routes/anamnesis');
var pemeriksaanRouter = require('./routes/pemeriksaan');
var diagnosisRouter = require('./routes/diagnosis');
var tindakanRouter = require('./routes/tindakan');
var pengobatanRouter = require('./routes/pengobatan');
var pulangRujukRouter = require('./routes/pulangRujuk');
var asuhanRouter = require('./routes/asuhan');
var labRouter = require('./routes/lab');
var rekamMedisRouter = require('./routes/rekamMedis');
var postVisitRouter = require('./routes/postVisit');
var systemConfigRouter = require('./routes/systemConfig');
var chatRouter = require('./routes/chat');

var app = express();

app.use(pinoHttp({ logger }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(apiLogger);

app.use('/api/patients', function(req, res) {
  res.redirect(307, '/patients' + (req.url === '/' ? '' : req.url));
});

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/patients', patientsRouter);
app.use('/pendaftaran', pendaftaranRouter);
app.use('/kajian-awal', kajianAwalRouter);
app.use('/anamnesis', anamnesisRouter);
app.use('/pemeriksaan', pemeriksaanRouter);
app.use('/diagnosis', diagnosisRouter);
app.use('/tindakan', tindakanRouter);
app.use('/pengobatan', pengobatanRouter);
app.use('/pulang-rujuk', pulangRujukRouter);
app.use('/asuhan', asuhanRouter);
app.use('/lab', labRouter);
app.use('/rekam-medis', rekamMedisRouter);
app.use('/post-visit', postVisitRouter);
app.use('/system-config', systemConfigRouter);
app.use('/chat', chatRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  var status = err.status || 500;
  var message = err.message || 'Internal Server Error';

  logger.error({ method: req.method, url: req.originalUrl || req.url, status, message, error: err });

  res.status(status).json({ message: message });
});

module.exports = app;
