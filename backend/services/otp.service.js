import twilio from 'twilio';
import { ENV } from '../config/env.js';

const isTwilioConfigured =
  ENV.TWILIO_ACCOUNT_SID &&
  ENV.TWILIO_AUTH_TOKEN &&
  ENV.TWILIO_PHONE &&
  ENV.TWILIO_ACCOUNT_SID !== 'your_twilio_sid';

const getClient = () => {
  if (!isTwilioConfigured) return null;
  return twilio(ENV.TWILIO_ACCOUNT_SID, ENV.TWILIO_AUTH_TOKEN);
};

/**
 * Send an OTP via SMS (Twilio) or log it in dev mode.
 * Returns true on success, throws on failure.
 */
export const sendOTPviaSMS = async (phone, otp) => {
  const client = getClient();

  if (!client) {
    // ── Development mock ─────────────────────────────────────────────────────
    console.log(`\n📱  [OTP MOCK] Phone: ${phone} | Code: ${otp}\n`);
    return true;
  }

  await client.messages.create({
    body: `Your Gawande Krushi Kendra verification code is: ${otp}. Valid for ${ENV.OTP_EXPIRES_MINUTES} minutes. Do not share.`,
    from: ENV.TWILIO_PHONE,
    to: phone,
  });

  return true;
};
