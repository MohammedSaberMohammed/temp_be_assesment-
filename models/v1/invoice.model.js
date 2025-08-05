const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema(
  {
    purchaseOrderNumber: {
      type: String,
      required: [true, 'purchaseOrderNumber field is required'],
      trim: true,
      maxlength: [200, 'purchaseOrderNumber must be less than 200 characters'],
      // e.g., PO-00890, CO-00140, SO-00304
      match: [
        /^[A-Z]{2,3}-\d{5}$/,
        'Purchase order number must contain only uppercase letters, numbers, hyphens and forward slashes',
      ],
    },
    budgetCode: {
      type: String,
      required: [true, 'budgetCode field is required'],
      trim: true,
      maxlength: [200, 'budgetCode must be less than 200 characters'],
      match: [
        /^[A-Z0-9\-/]+$/,
        'Budget code must contain only uppercase letters, numbers, hyphens and forward slashes',
      ],
    },
    budgetAmount: {
      type: Number,
      required: [true, 'budgetAmount field is required'],
      min: [0, 'budgetAmount cannot be negative'],
    },
    projectName: {
      type: String,
      required: [true, 'projectName field is required'],
      trim: true,
      maxlength: [200, 'projectName must be less than 200 characters'],
    },
    invoiceNumber: {
      type: String,
      required: [true, 'invoiceNumber field is required'],
      unique: true,
      trim: true,
      maxlength: [200, 'invoiceNumber must be less than 200 characters'],
      // Covers formats like INV-10262, KSA-/SAJ/2022/2863
      match: [
        /^[A-Z0-9\-/]+$/,
        'Invoice number must contain only uppercase letters, numbers, hyphens and forward slashes',
      ],
    },
    invoiceDate: {
      type: Date,
      default: Date.now(),
    },
    invoiceAmount: {
      type: Number,
      min: [0, 'Invoice amount cannot be negative'],
      required: [true, 'invoiceAmount field is required'],
    },
    paymentAmount: {
      type: Number,
      min: [0, 'Payment amount cannot be negative'],
      validate: {
        validator: function (value) {
          return !value || value <= this.invoiceAmount;
        },
        message: 'Payment amount cannot exceed invoice amount.',
      },
      default: 0,
    },
    paid: {
      type: Boolean,
      default: false,
    },
    paidDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

invoiceSchema.pre('save', function (next) {
  this.paid = this.paymentAmount === this.invoiceAmount;
  this.paidDate = this.paid ? Date.now() : null;

  next();
});

const Invoice = mongoose.model('Invoice', invoiceSchema);

module.exports = { Invoice };
