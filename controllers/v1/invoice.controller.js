const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const { User } = require('../../models/v1/user.model');
const { catchAsync } = require('../../utils/catchAsync');
const { baseResponse } = require('../../utils/baseResponse');
const { AppError } = require('../../utils/appError');

const getAllInvoices = catchAsync(async (req, res, next) => {
  const invoices = await Invoice.find();
  res.status(StatusCodes.OK).json(invoices);
});

const createInvoice = catchAsync(async (req, res, next) => {
  const invoice = await Invoice.create(req.body);
  res.status(StatusCodes.CREATED).json(invoice);
});

const getInvoice = catchAsync(async (req, res, next) => {
  const invoice = await Invoice.findById(req.params.id);
  res.status(StatusCodes.OK).json(invoice);
});

const updateInvoice = catchAsync(async (req, res, next) => {
  const invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.status(StatusCodes.OK).json(invoice);
});

const deleteInvoice = catchAsync(async (req, res, next) => {
  await Invoice.findByIdAndDelete(req.params.id);
  res.status(StatusCodes.NO_CONTENT).json();
});

module.exports = {
  getAllInvoices,
  createInvoice,
  getInvoice,
  updateInvoice,
  deleteInvoice,
};
