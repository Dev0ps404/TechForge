const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.BACKEND_URL 
        ? `${process.env.BACKEND_URL.replace(/\/+$/, '')}/api/auth/google/callback` 
        : (process.env.NODE_ENV === 'production' 
            ? 'https://techforge-w677.onrender.com/api/auth/google/callback'
            : 'http://localhost:5000/api/auth/google/callback'),
      proxy: true
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
        const name = profile.displayName || 'Google User';
        const picture = profile.photos && profile.photos[0] ? profile.photos[0].value : null;
        const googleId = profile.id;

        if (!email) {
          return done(new Error('No email found in Google profile'), null);
        }

        let user = await User.findOne({ googleId });

        if (!user) {
          user = await User.findOne({ email });

          if (user) {
            user.googleId = googleId;
            if (!user.profilePicture || user.profilePicture.includes('unsplash')) {
              user.profilePicture = picture;
            }
            await user.save();
          } else {
            user = await User.create({
              name,
              email,
              googleId,
              profilePicture: picture || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150',
            });
          }
        }
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
