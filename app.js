const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const xss = require('xss-clean');
const express = require('express');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const { StatusCodes } = require('http-status-codes');
// Utils
const { AppError } = require('./utils/appError');
const { baseResponse } = require('./utils/baseResponse');
// Custom Middlewares
const { globalErrorMiddleware } = require('./middlewares/errorMiddleware');

const app = express();

app.enable('trust proxy');

// ? Global Middleware
// ? CORS
app.use(cors());
app.options('*', cors());

// ? Serving Static files
app.use(express.static(path.join(__dirname, 'public')));

// ? Set Security HTTP Headers
app.use(helmet());

// ? Rate Limiting
const limiter = rateLimit({
  limit: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});

app.use('/api', limiter);

// ? Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
// Todo: This will be removed if not used
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ? Data Sanitization against NoSQL query injection
app.use(mongoSanitize());

// ? Data sanitization against XSS
app.use(xss());

// ? compress all responses
app.use(compression());

// ? Test middleware
app.get('/', (req, res) => {
  res.status(StatusCodes.OK).json(
    baseResponse({
      data: {
        message: 'Welcome on board',
      },
    }),
  );
});

// ? Routes
// app.use('/api/v1/users', userRouter);

// ? Not Found Route
app.all('*', (req, res, next) => {
  next(
    new AppError({
      errors: [`Can't find ${req.originalUrl} on this server!`],
      httpCode: StatusCodes.NOT_FOUND,
    }),
  );
});

// ? Error handling middleware
app.use(globalErrorMiddleware);

module.exports = app;
