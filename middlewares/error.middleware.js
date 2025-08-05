// const { isDevelopment } = require('../utils/env');

const { StatusCodes } = require('http-status-codes');
const { AppError } = require('../utils/appError');

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  return new AppError({
    errors,
    httpCode: StatusCodes.BAD_REQUEST,
  });
};

const handleDuplicateFieldDB = (err) => {
  const message = `Duplicate field value: ${Object.keys(err.keyValue)[0]}. Please use another value!`;

  return new AppError({
    errors: [message],
    httpCode: StatusCodes.BAD_REQUEST,
  });
};

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;

  return new AppError({
    errors: [message],
    httpCode: StatusCodes.BAD_REQUEST,
  });
};

const globalErrorMiddleware = (err, req, res, next) => {
  console.log('err', err);

  let error = { ...err };

  if (err.name === 'CastError') {
    error = handleCastErrorDB(err);
  }

  // ? Validation Error
  if (err.name === 'ValidationError') {
    error = handleValidationErrorDB(err);
  }

  // ? Duplications
  if (err.code === 11000) {
    error = handleDuplicateFieldDB(error, res);
  }

  res.status(error.httpCode).json(error);
};

module.exports = { globalErrorMiddleware };
