const { StatusCodes } = require('http-status-codes');
const axios = require('axios');
const { Invoice } = require('../../models/v1/invoice.model');
const factory = require('../../services/handlerFactory');
const { catchAsync } = require('../../utils/catchAsync');
const { baseResponse } = require('../../utils/baseResponse');
const cache = require('../../config/cache');
const { AppError } = require('../../utils/appError');

const getInvoice = factory.getOne(Invoice);
const getAllInvoices = factory.getAll(Invoice);
const createInvoice = factory.createOne(Invoice);
const updateInvoice = factory.updateOne(Invoice);
const deleteInvoice = factory.deleteOne(Invoice);

const convertCurrency = catchAsync(async (req, res, next) => {
  const targetCurrency = req.params.currency;

  if (!targetCurrency) {
    return res.status(StatusCodes.BAD_REQUEST).json(
      new AppError({
        errors: ['Target currency is required'],
        httpCode: StatusCodes.BAD_REQUEST,
      }),
    );
  }

  try {
    // Check if rates are cached
    let rates = cache.get('exchangeRates') || {};

    if (!rates[targetCurrency]) {
      // ?Fetch the exchange rate if not cached
      const response = await axios.get(
        `${process.env.EXCHANGE_RATE_API_URL}/${targetCurrency}`,
      );

      rates = { ...rates, [targetCurrency]: response.data.rates };
      // ? Cache the rates
      cache.set('exchangeRates', rates);
    }

    const cashedRates = rates[targetCurrency];

    if (!cashedRates) {
      return res.status(StatusCodes.BAD_REQUEST).json(
        new AppError({
          errors: ['Currency not supported'],
          httpCode: StatusCodes.BAD_REQUEST,
        }),
      );
    }

    const invoices = await Invoice.find();

    const convertedInvoices = invoices.map((invoice) => ({
      ...invoice.toObject(),
      budgetAmount: invoice.budgetAmount * cashedRates[invoice.currency],
      invoiceAmount: invoice.invoiceAmount * cashedRates[invoice.currency],
      paymentAmount: invoice.paymentAmount * cashedRates[invoice.currency],
      currency: targetCurrency,
    }));

    return res
      .status(StatusCodes.OK)
      .json(baseResponse({ data: convertedInvoices }));
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
      new AppError({
        errors: ['Failed to fetch exchange rates'],
        httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
      }),
    );
  }
});

module.exports = {
  getAllInvoices,
  createInvoice,
  getInvoice,
  updateInvoice,
  deleteInvoice,
  convertCurrency,
};
