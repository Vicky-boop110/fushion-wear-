const mongoose = require('mongoose');

const connectDB = async (mongoUri) => {
  if (!mongoUri) {
    throw new Error('Missing MongoDB connection string (MONGODB_URI)');
  }

  try {
    await mongoose.connect(mongoUri);
    console.log(`🗄️  MongoDB connected: ${mongoose.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;

