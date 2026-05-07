import User from '../models/user.model.js';
import { ENV } from '../config/env.js';

const isAdminEmail = (email) => {
  const lowerEmail = email.toLowerCase();
  return ENV.ADMIN_EMAILS.includes(lowerEmail);
};

export const findOrCreateGoogleUser = async ({ googleId, email, name, picture }) => {
  let user = await User.findOne({ $or: [{ googleId }, { email: email.toLowerCase() }] });

  if (user) {
    let shouldSave = false;

    if (!user.googleId) {
      user.googleId = googleId;
      shouldSave = true;
    }
    if (!user.isVerified) {
      user.isVerified = true;
      shouldSave = true;
    }
    if (picture && !user.avatar) {
      user.avatar = picture;
      shouldSave = true;
    }
    if (isAdminEmail(email) && user.role !== 'admin') {
      user.role = 'admin';
      shouldSave = true;
    }
    if (shouldSave) {
      await user.save();
    }

    return user;
  }

  const userRole = isAdminEmail(email) ? 'admin' : 'user';

  return User.create({
    name,
    email: email.toLowerCase(),
    googleId,
    avatar: picture || null,
    isVerified: true,
    role: userRole,
  });
};
