import User from '../models/user.model.js';
import { ensureAdminRole, resolveRoleForEmail } from '../utils/admin.utils.js';

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
    if (shouldSave) {
      await user.save();
    }

    await ensureAdminRole(user);
    return user;
  }

  const userRole = resolveRoleForEmail(email);

  return User.create({
    name,
    email: email.toLowerCase(),
    googleId,
    avatar: picture || null,
    isVerified: true,
    role: userRole,
  });
};
