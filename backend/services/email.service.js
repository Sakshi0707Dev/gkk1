import nodemailer from 'nodemailer';
import { ENV } from '../config/env.js';

const createTransporter = () =>
  nodemailer.createTransport({
    host: ENV.SMTP_HOST,
    port: ENV.SMTP_PORT,
    secure: ENV.SMTP_PORT === 465,
    requireTLS: ENV.SMTP_PORT !== 465,
    auth: { user: ENV.SMTP_USER, pass: ENV.SMTP_PASS },
    family: 4,
    tls: {
      servername: ENV.SMTP_HOST,
    },
  });

if (ENV.NODE_ENV !== 'production') {
  console.log('[MAIL DEBUG] SMTP user loaded:', Boolean(ENV.SMTP_USER));
  console.log('[MAIL DEBUG] SMTP host/port:', ENV.SMTP_HOST, ENV.SMTP_PORT);
}

/**
 * Send a password-reset email with a tokenised link.
 */
export const sendPasswordResetEmail = async ({ to, name, resetURL }) => {
  const transporter = createTransporter();

  await transporter.sendMail({
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
};

export const sendPasswordResetOTPEmail = async ({ to, name, otp }) => {
  const transporter = createTransporter();
  try {
    if (ENV.NODE_ENV !== 'production') {
      console.log('[MAIL DEBUG] Sending OTP to:', to);
    }

    await transporter.sendMail({
      from: `"Gawande Krushi Kendra" <${ENV.EMAIL_FROM}>`,
      to,
      subject: 'Password Reset OTP',
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:32px;border:1px solid #e5e7eb;border-radius:12px;">
          <h2 style="color:#1f7e44;">Password Reset OTP</h2>
          <p>Hi <strong>${name}</strong>,</p>
          <p>Your OTP is: <strong style="font-size:24px;letter-spacing:4px;">${otp}</strong></p>
          <p>This OTP is valid for <strong>5 minutes</strong>.</p>
        </div>
      `,
      text: `Your OTP is: ${otp} (valid for 5 minutes)`,
    });
  } catch (error) {
    console.error('[MAIL ERROR] Failed to send OTP email:', error);
    throw error;
  }
};

/**
 * Send a welcome/verification email after registration.
 */
export const sendWelcomeEmail = async ({ to, name }) => {
  const transporter = createTransporter();

  await transporter.sendMail({
    from: `"Gawande Krushi Kendra" <${ENV.EMAIL_FROM}>`,
    to,
    subject: 'Welcome to Gawande Krushi Kendra!',
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:32px;border:1px solid #e5e7eb;border-radius:12px;">
        <h2 style="color:#1f7e44;">Welcome, ${name}! 🌱</h2>
        <p>Your account has been created successfully. Start exploring high-quality seeds, fertilizers, and expert farming advice.</p>
        <p style="color:#9ca3af;font-size:12px;margin-top:32px;">Gawande Krushi Kendra &bull; Maharashtra, India</p>
      </div>
    `,
  });
};
