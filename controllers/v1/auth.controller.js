const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const { User } = require('../../models/v1/user.model');
const { catchAsync } = require('../../utils/catchAsync');
const { baseResponse } = require('../../utils/baseResponse');
const { AppError } = require('../../utils/appError');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  // Todo: Send token via cookie

  user.password = undefined;
  user.passwordChangedAt = undefined;

  res.status(statusCode).json(
    baseResponse({
      data: {
        user,
        token,
      },
      httpCode: statusCode,
    }),
  );
};

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(
      new AppError({
        errors: ['Please provide email and password'],
        httpCode: StatusCodes.BAD_REQUEST,
      }),
    );
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(
      new AppError({
        errors: ['Incorrect email or password'],
        httpCode: StatusCodes.UNAUTHORIZED,
      }),
    );
  }

  createSendToken(user, StatusCodes.OK, res);
});

const signup = catchAsync(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  createSendToken(user, StatusCodes.CREATED, res);
});

module.exports = { login, signup };
