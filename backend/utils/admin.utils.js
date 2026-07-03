import { ENV } from '../config/env.js';

/**
 * Returns true when the email is configured as an admin in ADMIN_EMAILS.
 */
export const isAdminEmail = (email) => {
  if (!email) {
    console.log('[ADMIN] isAdminEmail: false (no email provided)');
    return false;
  }
  const normalized = String(email).trim().toLowerCase();
  const result = ENV.ADMIN_EMAILS.includes(normalized);
  console.log('[ADMIN] isAdminEmail:', email, '| normalized:', normalized, '| adminList:', ENV.ADMIN_EMAILS, '| result:', result);
  return result;
};


/**
 * Resolves the role for a new user based on email.
 */
export const resolveRoleForEmail = (email) => (isAdminEmail(email) ? 'admin' : 'user');

/**
 * Ensures configured admin emails always carry the admin role (e.g. on login).
 */
export const ensureAdminRole = async (user) => {
  const isAdmin = isAdminEmail(user.email);
  console.log('[ADMIN] ensureAdminRole: user.email:', user.email, '| current role:', user.role, '| isAdminEmail:', isAdmin);

  if (isAdmin && user.role !== 'admin') {
    console.log('[ADMIN] promoteUser: changing role from', user.role, 'to admin');
    user.role = 'admin';
    await user.save();
    console.log('[ADMIN] promoteUser: saved successfully');
  } else if (isAdmin && user.role === 'admin') {
    console.log('[ADMIN] promoteUser: already admin, no change needed');
  } else {
    console.log('[ADMIN] promoteUser: not an admin email, role stays as', user.role);
  }
  return user;
};
