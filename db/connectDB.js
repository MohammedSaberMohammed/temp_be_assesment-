const mongoose = require('mongoose');

async function connectDB() {
  try {
    const MONGO_URI = process.env.DATABASE.replace(
      '<PASSWORD>',
      process.env.DATABASE_PASSWORD,
    );

    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.log(error);
  }
}

module.exports = { connectDB };
