import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';

export const signAdminToken = (payload) =>
  jwt.sign(payload, ENV.ADMIN_JWT_SECRET, { expiresIn: ENV.ADMIN_JWT_EXPIRES });

export const verifyAdminToken = (token) =>
  jwt.verify(token, ENV.ADMIN_JWT_SECRET);

export const issueAdminToken = () => {
  const payload = {
    id: 'admin',
    role: 'admin',
    email: ENV.ADMIN_EMAIL,
  };
  return signAdminToken(payload);
};
