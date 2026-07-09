import mongoose from 'mongoose';
import dns from 'node:dns';
import { ENV } from './env.js';

const connectDB = async () => {
  try {
    const servers = dns.getServers();
    if (servers.length === 1 && servers[0] === '127.0.0.1') {
      dns.setServers(['8.8.8.8', '8.8.4.4']);
    }

    const conn = await mongoose.connect(ENV.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[DB] MongoDB connected: ${conn.connection.host}`);
    return true;
  } catch (err) {
    console.error(err);
    console.warn('[DB] Server starting without database - auth features disabled');
    return false;
  }
};

export default connectDB;
