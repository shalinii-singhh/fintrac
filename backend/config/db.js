const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGODB_URI;

    // Use in-memory DB if standard local connection is used (so it works out-of-the-box)
    if (mongoUri.includes('127.0.0.1') || mongoUri.includes('localhost')) {
      const mongod = await MongoMemoryServer.create();
      mongoUri = mongod.getUri();
      console.log('Using in-memory MongoDB server for testing out-of-the-box.');
    }

    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
