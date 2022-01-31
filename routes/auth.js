const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const models = require('../app/models');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (userId, done) => {
  const user = await models.User.findByPk(userId);
  if (!user) {
    return done(new Error('session data error'), null);
  }

  done(null, user);
});

passport.use(new LocalStrategy(
  async (username, password, done) => {
    // [caution!] あくまでダミーユーザー用なのでパスワードチェックはしない
    const user = await models.User.findOne({ where: { username: username } });
    if (!user) {
      return done(null, false, { message: 'Incorrect username.' });
    }
    return done(null, user);
  }
));

router.post('/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  })
);

router.get('/login', (req, res, _next) => {
  res.render('login', { user: req.user });
});

router.get('/logout', (req, res, _next) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
