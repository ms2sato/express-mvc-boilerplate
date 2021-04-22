const express = require('express');
const router = express.Router();
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;

const models = require('../app/models');

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

const gitHubConfig = {
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: '/auth/github/callback'
};

passport.use(new GitHubStrategy(gitHubConfig, function (accessToken, refreshToken, profile, done) {
  process.nextTick(async function () {
    console.log(profile)
    await models.User.upsert({
      provider: profile.provider,
      uid: profile.id,
      username: profile.username,
      displayName: profile.displayName || profile.username,
      email: profile.emails[0].value
    })
    done(null, profile)
  })
}));

router.get('/auth/github',
  passport.authenticate('github', { scope: ['user:email'] }),
  function (req, res) {

  }
);

router.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: 'login' }),
  function (req, res) {
    res.redirect('/');
  }
);

router.get('/login', (req, res, next) => {
  res.render('login', { user: req.user });
});

router.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
