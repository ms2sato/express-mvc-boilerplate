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
    try {
      const user = await models.User.authenticate({ username, password });
      done(null, user, { message: 'ログインしました' });
    } catch (err) {
      if(err.errors) {
        const message = `${err.message}: ${err.errors.map(error => error.message).join(' ')}`;
        return done(null, false, { message });
      } else {
        return done(err, null);
      }
    }
  }
));

router.post('/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    successFlash: { type: 'info' }, // req.flash('info', message) if success
    failureFlash: { type: 'alert' }, // req.flash('alert', message) if fail
    badRequestMessage: 'ユーザ名、パスワードを入力してください' // unless username || password
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
