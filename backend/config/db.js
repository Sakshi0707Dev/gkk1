import mongoose from 'mongoose';
import { ENV } from './env.js';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(ENV.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅  MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error('❌  MongoDB connection error:', err.message);
    process.exit(1);
  }
};

export default connectDB;
