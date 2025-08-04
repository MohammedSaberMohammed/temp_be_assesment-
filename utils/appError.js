class AppError extends Error {
  constructor({ data, errors, httpCode }) {
    super();

    this.data = data || null;
    this.errors = errors || [];
    this.httpCode = httpCode;
    this.isSuccess = false;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = { AppError };
