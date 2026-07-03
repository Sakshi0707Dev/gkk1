import app from './backend/app.js';
import { ENV } from './backend/config/env.js';
import connectDB from './backend/config/db.js';
import { verifyTransporter } from './backend/services/email.service.js';

const start = async () => {
  const dbConnected = await connectDB();
  if (!dbConnected) {
    console.error('[SERVER] FATAL: MongoDB connection failed. Exiting.');
    process.exit(1);
  }
  console.log('[SERVER] Database connected');

  if (ENV.SMTP_USER && ENV.SMTP_PASS) {
    const emailCheck = await verifyTransporter();
    if (emailCheck.verified) {
      console.log('[SERVER] Email service ready');
    } else {
      console.warn('[SERVER] Email service error:', emailCheck.error);
    }
  } else {
    console.log('[SERVER] Email not configured');
  }

  console.log('[SERVER] ADMIN_EMAILS config:', ENV.ADMIN_EMAILS.length > 0 ? ENV.ADMIN_EMAILS : '⚠️  EMPTY - no users will have admin role');
  console.log('[SERVER] NODE_ENV:', ENV.NODE_ENV);
  console.log('[SERVER] CLIENT_URL:', ENV.CLIENT_URL);
  console.log('[SERVER] MONGO_URI:', ENV.MONGO_URI ? ENV.MONGO_URI.substring(0, 30) + '...' : 'NOT SET');

  app.listen(ENV.PORT, () => {
    console.log(`Server running on http://localhost:${ENV.PORT} in ${ENV.NODE_ENV} mode`);
  });
};

start();