const { StatusCodes } = require('http-status-codes');
const { AppError } = require('../utils/appError');
const { catchAsync } = require('../utils/catchAsync');
const { baseResponse } = require('../utils/baseResponse');
const { APIFeatures } = require('../utils/apiFeatures');

const deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(
        new AppError({
          errors: [`No document found with that id: ${req.params.id}`],
          httpCode: StatusCodes.NOT_FOUND,
        }),
      );
    }

    res.status(StatusCodes.OK).json(baseResponse({ data: true }));
  });

const updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(
        new AppError({
          errors: [`No document found with that id: ${req.params.id}`],
          httpCode: StatusCodes.NOT_FOUND,
        }),
      );
    }

    res.status(StatusCodes.OK).json(baseResponse({ data: doc }));
  });

const createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(StatusCodes.OK).json(baseResponse({ data: doc }));
  });

const getOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const query = await Model.findById(id);

    // Todo: Populate fields

    const doc = await query;

    if (!doc) {
      return next(
        new AppError({
          errors: [`No document found with that id: ${id}`],
          httpCode: StatusCodes.NOT_FOUND,
        }),
      );
    }

    res.status(StatusCodes.OK).json(baseResponse({ data: doc }));
  });

const getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Model.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const docs = await features.query;
    const totalCount = await Model.countDocuments(features.query.getQuery());

    res.status(StatusCodes.OK).json(
      baseResponse({
        data: {
          items: docs,
          totalCount,
        },
      }),
    );
  });

module.exports = {
  getOne,
  getAll,
  createOne,
  updateOne,
  deleteOne,
};
