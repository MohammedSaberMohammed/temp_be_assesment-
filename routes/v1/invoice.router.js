const express = require('express');
const {
  getAllInvoices,
  getInvoice,
  updateInvoice,
  deleteInvoice,
  createInvoice,
  convertCurrency,
} = require('../../controllers/v1/invoice.controller');

const invoicesRouter = express.Router();

invoicesRouter.route('/').get(getAllInvoices).post(createInvoice);
invoicesRouter
  .route('/:id')
  .get(getInvoice)
  .patch(updateInvoice)
  .delete(deleteInvoice);

invoicesRouter.route('/convert/currency/:currency').get(convertCurrency);

module.exports = { invoicesRouter };
