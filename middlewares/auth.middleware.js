const { promisify } = require('node:util');
const jwt = require('jsonwebtoken');
// Helpers
const { StatusCodes } = require('http-status-codes');
const { AppError } = require('../utils/appError');
const { catchAsync } = require('../utils/catchAsync');
// Models
const { User } = require('../models/v1/user.model');

const authenticateUser = catchAsync(async (req, res, next) => {
  let token;

  // ?  1) Getting token and check of it's there
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError({
        errors: ['You are not logged in! Please log in to get access.'],
        httpCode: StatusCodes.UNAUTHORIZED,
      }),
    );
  }

  // ? 2) Verification of token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // ? 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(
      new AppError({
        errors: ['User no longer exists'],
        httpCode: StatusCodes.UNAUTHORIZED,
      }),
    );
  }

  req.user = currentUser;

  next();
});

const restrictTo = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(
      new AppError({
        errors: ['You do not have permission to perform this action'],
        httpCode: StatusCodes.FORBIDDEN,
      }),
    );
  }

  next();
};

module.exports = { authenticateUser, restrictTo };
