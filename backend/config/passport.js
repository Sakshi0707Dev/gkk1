import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

import { ENV } from './env.js';
import { findOrCreateGoogleUser } from '../services/googleOAuth.service.js';
import User from '../models/user.model.js';

if (ENV.GOOGLE_CLIENT_ID && ENV.GOOGLE_CLIENT_SECRET) {
  const callbackURL = ENV.GOOGLE_CALLBACK_URL;
  console.log('[AUTH] Google OAuth callback URL:', callbackURL);
  
  passport.use(
    new GoogleStrategy(
      {
        clientID: ENV.GOOGLE_CLIENT_ID,
        clientSecret: ENV.GOOGLE_CLIENT_SECRET,
        callbackURL: callbackURL,
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const user = await findOrCreateGoogleUser({
            googleId: profile.id,
            email: profile.emails?.[0]?.value || '',
            name: profile.displayName || 'Google User',
            picture: profile.photos?.[0]?.value || null,
          });

          done(null, user);
        } catch (error) {
          done(error, null);
        }
      }
    )
  );
  console.log('[AUTH] Google OAuth configured');
} else {
  console.warn('[AUTH] Google OAuth NOT configured - missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET');
}

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
