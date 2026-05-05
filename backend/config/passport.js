import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

import { ENV } from './env.js';
import { findOrCreateGoogleUser } from '../services/googleOAuth.service.js';

passport.use(
  new GoogleStrategy(
    {
      clientID: ENV.GOOGLE_CLIENT_ID,
      clientSecret: ENV.GOOGLE_CLIENT_SECRET,
      callbackURL: ENV.GOOGLE_CALLBACK_URL,
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

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  done(null, { id });
});
