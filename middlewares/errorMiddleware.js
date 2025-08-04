// const { isDevelopment } = require('../utils/env');

const globalErrorMiddleware = (err, req, res, next) => {
  console.log('err', err);
  res.status(err.httpCode).json(err);
};

module.exports = { globalErrorMiddleware };
