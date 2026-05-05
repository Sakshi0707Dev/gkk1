import 'dotenv/config';

const required = (key) => {
  const val = process.env[key];
  if (!val) throw new Error(`Missing required environment variable: ${key}`);
  return val;
};

export const ENV = {
  NODE_ENV:               process.env.NODE_ENV || 'development',
  PORT:                   parseInt(process.env.PORT || '5000', 10),

  MONGO_URI:              required('MONGO_URI'),

  JWT_ACCESS_SECRET:      required('JWT_ACCESS_SECRET'),
  JWT_REFRESH_SECRET:     required('JWT_REFRESH_SECRET'),
  JWT_ACCESS_EXPIRES:     process.env.JWT_ACCESS_EXPIRES  || '15m',
  JWT_REFRESH_EXPIRES:    process.env.JWT_REFRESH_EXPIRES || '7d',

  CLIENT_URL:             process.env.CLIENT_URL || 'http://localhost:5173',

  // Email (Nodemailer / Gmail)
  SMTP_HOST:              process.env.SMTP_HOST || 'smtp.gmail.com',
  SMTP_PORT:              parseInt(process.env.SMTP_PORT || '587', 10),
  SMTP_USER:              process.env.SMTP_USER || '',
  SMTP_PASS:              process.env.SMTP_PASS || '',
  EMAIL_FROM:             process.env.EMAIL_FROM || 'noreply@gawandekrushi.com',

  // Google OAuth
  GOOGLE_CLIENT_ID:       process.env.GOOGLE_CLIENT_ID || '',
  GOOGLE_CLIENT_SECRET:   process.env.GOOGLE_CLIENT_SECRET || '',
  GOOGLE_CALLBACK_URL:    process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback',
  SESSION_SECRET:         process.env.SESSION_SECRET || 'change-this-session-secret',

  // Twilio OTP (optional)
  TWILIO_ACCOUNT_SID:     process.env.TWILIO_ACCOUNT_SID || '',
  TWILIO_AUTH_TOKEN:      process.env.TWILIO_AUTH_TOKEN  || '',
  TWILIO_PHONE:           process.env.TWILIO_PHONE       || '',

  OTP_EXPIRES_MINUTES:    parseInt(process.env.OTP_EXPIRES_MINUTES || '10', 10),

  // Razorpay
  RAZORPAY_KEY_ID:        process.env.RAZORPAY_KEY_ID || '',
  RAZORPAY_KEY_SECRET:    process.env.RAZORPAY_KEY_SECRET || '',
};
