const { Invoice } = require('../../models/v1/invoice.model');
const factory = require('../../services/handlerFactory');

const getInvoice = factory.getOne(Invoice);
const getAllInvoices = factory.getAll(Invoice);
const createInvoice = factory.createOne(Invoice);
const updateInvoice = factory.updateOne(Invoice);
const deleteInvoice = factory.deleteOne(Invoice);

module.exports = {
  getAllInvoices,
  createInvoice,
  getInvoice,
  updateInvoice,
  deleteInvoice,
};
