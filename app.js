process.on('uncaughtException', function (err) {
  console.error(err)
  console.error(err.stack)
});

const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, './')
const envPath = path.join(rootDir, (process.env.NODE_ENV === 'test') ? '.env.test' : '.env')

if (fs.existsSync(envPath)) {
  console.log(`> read ${envPath}`)
  const result = require('dotenv').config({path: envPath})
  if (result.error) {
    throw result.error
  }
}

var createError = require('http-errors');
var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var helmet = require('helmet');
var session = require('express-session');
var passport = require('passport');
var methodOverride = require('method-override')

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

// @see http://expressjs.com/en/resources/middleware/method-override.html
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method
    delete req.body._method
    return method
  }
}));

app.use(methodOverride('_method', { methods: ['GET', 'POST'] })); // for GET Paramter

var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var usersRouter = require('./routes/users');
app.use('/', indexRouter);
app.use('/', authRouter);
app.use('/users', ensureAuthenticated, usersRouter);

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
