import 'dotenv/config';

import app from './backend/app.js';
import { ENV } from './backend/config/env.js';
import connectDB from './backend/config/db.js';
import { verifyTransporter } from './backend/services/email.service.js';

const start = async () => {
  try {
    await connectDB();
    console.log('[SERVER] Database connected');
  } catch (err) {
    console.warn('[SERVER] Database connection failed:', err.message);
  }

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

  app.listen(ENV.PORT, () => {
    console.log(`Server running on http://localhost:${ENV.PORT} in ${ENV.NODE_ENV} mode`);
  });
};

start();