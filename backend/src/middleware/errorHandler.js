const logger = require('../utils/logger');

function errorHandler(err, req, res, next) {
  logger.error(`${err.name}: ${err.message}`, { stack: err.stack, path: req.originalUrl, method: req.method });

  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      error: 'Validation error',
      details: err.errors?.map((e) => e.message),
    });
  }

  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({ error: 'Referenced record not found' });
  }

  if (err.name === 'MulterError') {
    return res.status(400).json({ error: err.message });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: err.message || 'Internal server error',
  });
}

module.exports = errorHandler;
