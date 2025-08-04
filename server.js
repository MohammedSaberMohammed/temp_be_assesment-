const dotenv = require('dotenv');
const app = require('./app');
const { connectDB } = require('./db/connectDB');

dotenv.config();
const PORT = process.env.PORT || 3000;

process.on('uncaughtException', (err, origin) => {
  console.log('Uncaught Exception at:', err, 'with origin:', origin);

  process.exit(1);
});

async function start() {
  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    process.on('unhandledRejection', (promise, reason) => {
      console.log('Unhandled Rejection at:', promise, 'reason:', reason);

      server.close(() => {
        process.exit(1);
      });
    });
  } catch (error) {
    console.log('Error starting server', error);
  }
}

start();
