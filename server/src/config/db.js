const mongoose = require('mongoose');
const config = require('./env');

let mongoMemoryServer = null;

const connectDB = async () => {
  try {
    // Attempt connecting to specified MONGO_URI
    console.log(`[DB] Attempting connection to MongoDB at ${config.mongoUri}...`);
    await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`[DB] MongoDB Connected successfully: ${mongoose.connection.host}`);
  } catch (err) {
    console.warn(`[DB] Primary MongoDB connection failed (${err.message}). Starting in-memory MongoDB fallback...`);
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongoMemoryServer = await MongoMemoryServer.create();
      const memUri = mongoMemoryServer.getUri();
      console.log(`[DB] In-memory MongoDB instance started at ${memUri}`);
      await mongoose.connect(memUri);
      console.log('[DB] Connected to in-memory MongoDB successfully.');
    } catch (memErr) {
      console.error('[DB] Failed to initialize in-memory MongoDB fallback:', memErr);
      throw memErr;
    }
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
};

module.exports = { connectDB, disconnectDB };
