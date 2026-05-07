import 'dotenv/config';

const required = (key, fallback) => {
  const val = process.env[key]?.trim() || fallback;
  return val;
};

export const ENV = {
  NODE_ENV:               process.env.NODE_ENV || 'development',
  PORT:                   parseInt(process.env.PORT || '5000', 10),

  MONGO_URI:              required('MONGO_URI', 'mongodb://127.0.0.1:27017/gkk'),

  JWT_ACCESS_SECRET:      required('JWT_ACCESS_SECRET', 'gkk_access_super_secret_key_2026_abcdefgh'),
  JWT_REFRESH_SECRET:     required('JWT_REFRESH_SECRET', 'gkk_refresh_super_secret_key_2026_xyzwvuts'),
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
  GOOGLE_CLIENT_ID:       required('GOOGLE_CLIENT_ID', ''),
  GOOGLE_CLIENT_SECRET:   required('GOOGLE_CLIENT_SECRET', ''),
  GOOGLE_CALLBACK_URL:    required('GOOGLE_CALLBACK_URL', 'http://localhost:5000/api/auth/google/callback'),
  SESSION_SECRET:         required('SESSION_SECRET', 'gkk_session_secret_2026_change_me'),

  // Twilio OTP (optional)
  TWILIO_ACCOUNT_SID:     process.env.TWILIO_ACCOUNT_SID || '',
  TWILIO_AUTH_TOKEN:      process.env.TWILIO_AUTH_TOKEN  || '',
  TWILIO_PHONE:           process.env.TWILIO_PHONE       || '',

  OTP_EXPIRES_MINUTES:    parseInt(process.env.OTP_EXPIRES_MINUTES || '10', 10),

  // Razorpay
  RAZORPAY_KEY_ID:        process.env.RAZORPAY_KEY_ID || '',
  RAZORPAY_KEY_SECRET:    process.env.RAZORPAY_KEY_SECRET || '',

  // Shop Details (for Invoice)
  SHOP_NAME:              process.env.SHOP_NAME || 'Gawande Krushi Kendra',
  SHOP_ADDRESS:           process.env.SHOP_ADDRESS || '',
  SHOP_PHONE:             process.env.SHOP_PHONE || '',
  SHOP_EMAIL:             process.env.SHOP_EMAIL || '',
  SHOP_GSTIN:             process.env.SHOP_GSTIN || '',

  // Invoice GST Configuration
  INVOICE_GST_RATES:      {
    cgst: parseFloat(process.env.INVOICE_CGST_RATE || '9'),
    sgst: parseFloat(process.env.INVOICE_SGST_RATE || '9'),
    igst: parseFloat(process.env.INVOICE_IGST_RATE || '18'),
  },

  // Botbiz WhatsApp Configuration
  BOTBIZ_API_URL:         process.env.BOTBIZ_API_URL || 'https://api.botbiz.in',
  BOTBIZ_API_KEY:         process.env.BOTBIZ_API_KEY || '',
  BOTBIZ_DEVICE_ID:         process.env.BOTBIZ_DEVICE_ID || '',

  // Puppeteer Configuration
  PUPPETEER_EXECUTABLE_PATH: process.env.PUPPETEER_EXECUTABLE_PATH || '',

  // Invoice Automation
  AUTO_GENERATE_INVOICE: process.env.AUTO_GENERATE_INVOICE !== 'false',

  // Admin Configuration
  ADMIN_EMAILS: (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase()).filter(Boolean),
};

if (ENV.GOOGLE_CLIENT_ID) {
  console.log('[ENV] Google OAuth ID loaded:', ENV.GOOGLE_CLIENT_ID.substring(0, 20) + '...');
} else {
  console.warn('[ENV] Google OAuth NOT configured - missing GOOGLE_CLIENT_ID');
}

if (ENV.SMTP_USER && ENV.SMTP_PASS) {
  console.log('[ENV] Email configured:', ENV.SMTP_USER);
} else {
  console.warn('[ENV] Email NOT configured - missing SMTP_USER/SMTP_PASS');
  console.warn('[ENV] Add SMTP_USER and SMTP_PASS to .env for password reset emails');
}