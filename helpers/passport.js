const passport = require("passport");
const FacebookTokenStrategy = require("passport-facebook-token");
const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(
  new FacebookTokenStrategy(
    {
      clientID: FACEBOOK_APP_ID,
      clientSecret: FACEBOOK_APP_SECRET,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        if (profile.emails && profile.emails[0].value) {
          // Extract the minimal profile information we need from the profile object
          const user = {
            name: profile.displayName,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            email: profile.emails[0].value,
            avatarUrl: profile.photos[0].value,
            provider: "facebook",
            id: profile.id,
          };
          return done(null, user);
        } else {
          done(null, false);
        }
      } catch (err) {
        console.log("FACEBOOK TOKEN STRATEGY", err);
        return done(err, null);
      }
    }
  )
);

module.exports = passport;
