import mongoose from 'mongoose';
import { ENV } from './env.js';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(ENV.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[DB] MongoDB connected: ${conn.connection.host}`);
    return true;
  } catch (err) {
    console.warn(`[DB] MongoDB not available: ${err.message}`);
    console.warn('[DB] Server starting without database - auth features disabled');
    return false;
  }
};

export default connectDB;
