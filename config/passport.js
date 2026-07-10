const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists
        let user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
          // User exists - check if blocked
          if (user.isBlocked) {
            return done(null, false, { message: "blocked" });
          }

            if (!user.googleId) {
                await User.findByIdAndUpdate(user._id, { googleId: profile.id });
                user.googleId = profile.id;
          }
           return done(null, user);
        }

        // New user - create account
        user = await User.create({
          fullName: profile.displayName,
          email: profile.emails[0].value,
          username: profile.emails[0].value.split("@")[0] + Math.floor(Math.random() * 1000),
          profileImage: profile.photos[0]?.value || "",
          googleId : profile.id,
          isVerified: true,
          role: "USER",
        });


        return done(null, user);

      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;