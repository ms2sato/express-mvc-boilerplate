const express = require('express');
const router = express.Router();
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;

const models = require('../app/models');

const gitHubConfig = {
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: '/auth/github/callback'
};

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (userId, done) => {
  const user = await models.User.findByPk(userId);
  if(!user) {
    return done(new Error('session data error'), null);
  }

  done(null, user);
});

passport.use(new GitHubStrategy(gitHubConfig, async (accessToken, refreshToken, profile, done) => {
  const user = await models.User.signIn({
    provider: profile.provider,
    uid: profile.id,
    username: profile.username,
    displayName: profile.displayName || profile.username,
    email: profile.emails[0].value,
    accessToken, 
    refreshToken
  })
  done(null, user)
}));

router.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get(gitHubConfig.callbackURL,
  passport.authenticate('github', { failureRedirect: 'login' }),
  (req, res) => {
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
