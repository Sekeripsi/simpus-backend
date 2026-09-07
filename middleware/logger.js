var logger = require('../lib/logger');

function sanitizeBody(body) {
  if (!body) return {};
  var sanitized = Object.assign({}, body);
  ['password', 'token', 'authorization'].forEach(function (key) {
    if (sanitized[key]) sanitized[key] = '***';
  });
  return sanitized;
}

function apiLogger(req, res, next) {
  var start = Date.now();
  var method = req.method;
  var url = req.originalUrl || req.url;
  var query = Object.keys(req.query).length ? req.query : undefined;
  var body = ['GET', 'HEAD', 'DELETE'].includes(method) ? undefined : sanitizeBody(req.body);
  var user = req.user ? { id: req.user.id, username: req.user.username, role: req.user.role } : undefined;

  var logData = { method, url };
  if (query) logData.query = query;
  if (body) logData.body = body;
  if (user) logData.user = user;

  logger.info(logData, '[REQ]');

  var originalJson = res.json.bind(res);
  res.json = function (data) {
    res._responseBody = data;
    return originalJson(data);
  };

  var originalEnd = res.end.bind(res);
  res.end = function (data) {
    var duration = Date.now() - start;
    var responseLog = {
      method,
      url,
      status: res.statusCode,
      duration: duration + 'ms',
    };
    if (res.statusCode >= 400 && res._responseBody) {
      responseLog.error = res._responseBody;
    }
    logger.info(responseLog, '[RES]');
    return originalEnd(data);
  };

  next();
}

module.exports = apiLogger;
