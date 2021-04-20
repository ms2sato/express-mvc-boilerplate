const fs = require('fs')

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var helmet = require('helmet');
var session = require('express-session');
var passport = require('passport');

process.on('uncaughtException', function (err) {
  console.error(err)
  console.error(err.stack)
})

const rootDir = path.join(__dirname, './')
const envPath = path.join(rootDir, (process.env.NODE_ENV === 'test') ? '.env.test' : '.env')

if (fs.existsSync(envPath)) {
  console.log(`> read ${envPath}`)
  const result = require('dotenv').config({path: envPath})
  if (result.error) {
    throw result.error
  }
}

var GitHubStrategy = require('passport-github2').Strategy;

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

const gitHubConfig = {
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: '/auth/github/callback'
};

passport.use(new GitHubStrategy(gitHubConfig, function(accessToken, refreshToken, profile, done) {
  process.nextTick(function() {
    return done(null, profile)
  })
}));

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
app.use(helmet());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session( { secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false} ));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', ensureAuthenticated, usersRouter);

app.get('/auth/github', 
  passport.authenticate('github', { scope: ['user:email'] }), 
  function(req, res) {

  }
);

app.get('/auth/github/callback',
  passport.authenticate('github', {failureRedirect: 'login'}),
  function(req, res) {
    res.redirect('/');
  }
);

app.get('/login', (req, res, next) => {
  res.render('login', { user: req.user });
});

app.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/');
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
