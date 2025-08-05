const fs = require('fs');
const mongoose = require('mongoose');
const { Invoice } = require('../models/v1/invoice.model');

require('dotenv').config();

const MONGO_URI = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(MONGO_URI)
  .then(() => console.log(`MongoDB Connected Successfully`));

// READ JSON FILE
const invoices = JSON.parse(
  fs.readFileSync(`${__dirname}/invoices.json`, 'utf-8'),
);

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await Invoice.create(invoices, { validateBeforeSave: false });
    console.log('Data successfully loaded');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    await Invoice.deleteMany();
    console.log('Data successfully deleted');
  } catch (err) {
    console.log(err);
  }

  process.exit();
};

// COMMAND LINE ARGS
if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

console.log(process.argv);
