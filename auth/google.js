/**
 * Handling Google authentication with passport.js
 * https://github.com/jaredhanson/passport-google-oauth2
 */
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('mongoose').model('User');
const MockStrategy = require('./mock/mock-strategy').Strategy;


passport.use(strategyForEnvironment());

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

function strategyForEnvironment() {
  let strategy;
  switch(process.env.NODE_ENV) {
    case 'production':
      strategy = new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL
      }, strategyCallback);
    break;
    default:
    strategy = new MockStrategy('google', strategyCallback);
  }
  return strategy;
}

function strategyCallback(accessToken, refreshToken, profile, done){
  User.findOne({
    googleId: profile.id
  }).then((dbUserRecord, err) => {

    // check whether User exists
    if (dbUserRecord) {
      done(null, dbUserRecord);
    } else {
      // create a new user
      const newUser = new User({
        googleId: profile.id,
        fullName: profile.displayName
      });

      // Here we save the new user to our database
      newUser.save().then((newUser) => {
        done(null, newUser);
      }).catch(error => {
        done(error);
      });
    }
  }).catch(err => {
    done(err);
  });
}