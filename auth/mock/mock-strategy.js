/**
 * Mocking a passport strategy
 * https://github.com/jboxman/koa-passport-oauth2-testing/blob/master/util/mock-strategy.js
 * https://medium.com/chingu/mocking-passport-githubstrategy-for-functional-testing-33e7ed4f9aa3
 */
const passport = require('passport-strategy');
const util = require('util');

// The reply from Google OAuth2
const user = require('./mock_googleProfile');

function Strategy(name, cb) {
  if (!name || name.length === 0) { throw new TypeError('DevStrategy requires a Strategy name') ; }

  passport.Strategy.call(this);

  this.name = name;
  this._user = user;
  // Callback supplied to OAuth2 strategies handling verification
  this._cb = cb;
}

util.inherits(Strategy, passport.Strategy);

// Need 2 different users
Strategy.prototype.authenticate = function() {
  this._cb(null, null, this._user, (error, user) => {
    this.success(user);
  });
};

module.exports = {
  Strategy
};