import nodemailer from 'nodemailer';
import { ENV } from '../config/env.js';

let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;

  if (!ENV.SMTP_USER || !ENV.SMTP_PASS) {
    console.warn('[MAIL] SMTP credentials not found - email disabled');
    return null;
  }

  console.log('[MAIL] Creating transporter for:', ENV.SMTP_HOST);

  transporter = nodemailer.createTransport({
    host: ENV.SMTP_HOST,
    port: ENV.SMTP_PORT,
    secure: ENV.SMTP_PORT === 465,
    requireTLS: ENV.SMTP_PORT !== 465,
    auth: {
      user: ENV.SMTP_USER,
      pass: ENV.SMTP_PASS,
    },
    connectionTimeout: 15000,
  });

  console.log('[MAIL] Transporter created with auth:', ENV.SMTP_USER);
  return transporter;
};

export const isEmailConfigured = () => {
  return Boolean(ENV.SMTP_USER && ENV.SMTP_PASS);
};

export const verifyTransporter = async () => {
  const transport = getTransporter();
  if (!transport) {
    return { verified: false, error: 'No transporter' };
  }

  try {
    await transport.verify();
    console.log('[MAIL] Transporter verified successfully');
    return { verified: true };
  } catch (err) {
    console.error('[MAIL] Transporter verification failed:', err.message);
    return { verified: false, error: err.message };
  }
};

export const sendPasswordResetEmail = async ({ to, name, resetURL }) => {
  const transport = getTransporter();
  if (!transport) {
    console.warn('[MAIL] No transporter - skipping send');
    return { skipped: true };
  }

  try {
    console.log('[MAIL] Sending password reset email to:', to);
    const result = await transport.sendMail({
      from: `"Gawande Krushi Kendra" <${ENV.EMAIL_FROM}>`,
      to,
      subject: 'Reset Your Password — Gawande Krushi Kendra',
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:32px;border:1px solid #e5e7eb;border-radius:12px;">
          <h2 style="color:#1f7e44;">Password Reset Request</h2>
          <p>Hi <strong>${name}</strong>,</p>
          <p>We received a request to reset your password. Click the button below to create a new one. This link expires in <strong>15 minutes</strong>.</p>
          <a href="${resetURL}"
             style="display:inline-block;margin:24px 0;padding:14px 28px;background:#f89a20;color:#fff;font-weight:700;border-radius:8px;text-decoration:none;">
            Reset My Password
          </a>
          <p style="color:#6b7280;font-size:13px;">If you didn't request this, you can safely ignore this email. Your password will not change.</p>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;" />
          <p style="color:#9ca3af;font-size:12px;">Gawande Krushi Kendra &bull; Maharashtra, India</p>
        </div>
      `,
    });
    console.log('[MAIL] Password reset email sent:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (err) {
    console.error('[MAIL] Send failed:', err.message);
    throw err;
  }
};

export const sendPasswordResetOTPEmail = async ({ to, name, otp }) => {
  const transport = getTransporter();
  if (!transport) {
    console.warn('[MAIL] No transporter - skipping OTP');
    return { skipped: true };
  }

  console.log('[MAIL] Sending OTP email to:', to);

  try {
    const result = await transport.sendMail({
      from: `"Gawande Krushi Kendra" <${ENV.EMAIL_FROM}>`,
      to,
      subject: 'Your Password Reset OTP — Gawande Krushi Kendra',
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:32px;border:1px solid #e5e7eb;border-radius:12px;background:#fff;">
          <div style="text-align:center;margin-bottom:24px;">
            <h2 style="color:#1f7e44;">Password Reset OTP</h2>
          </div>
          <p>Hi <strong>${name}</strong>,</p>
          <p>Your OTP for password reset is:</p>
          <div style="font-size:32px;font-weight:bold;text-align:center;letter-spacing:8px;padding:20px;background:#f3f4f6;border-radius:8px;margin:20px 0;">
            ${otp}
          </div>
          <p style="color:#6b7280;font-size:13px;">This OTP is valid for 5 minutes. Do not share it with anyone.</p>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;" />
          <p style="color:#9ca3af;font-size:12px;">Gawande Krushi Kendra &bull; Maharashtra, India</p>
        </div>
      `,
    });
    console.log('[MAIL] OTP email sent:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (err) {
    console.error('[MAIL] OTP send failed:', err.message);
    throw err;
  }
};

export const sendWelcomeEmail = async ({ to, name }) => {
  const transport = getTransporter();
  if (!transport) {
    console.warn('[MAIL] No transporter - skipping welcome');
    return { skipped: true };
  }

  console.log('[MAIL] Sending welcome email to:', to);

  try {
    const result = await transport.sendMail({
      from: `"Gawande Krushi Kendra" <${ENV.EMAIL_FROM}>`,
      to,
      subject: 'Welcome to Gawande Krushi Kendra!',
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:32px;border:1px solid #e5e7eb;border-radius:12px;">
          <h2 style="color:#1f7e44;">Welcome, ${name}!</h2>
          <p>Thank you for joining Gawande Krushi Kendra. We're excited to serve you with the best agricultural products.</p>
          <p>Happy Farming!</p>
          <p style="color:#9ca3af;font-size:12px;">Gawande Krushi Kendra &bull; Maharashtra, India</p>
        </div>
      `,
    });
    console.log('[MAIL] Welcome email sent:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (err) {
    console.error('[MAIL] Welcome send failed:', err.message);
    throw err;
  }
};