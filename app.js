process.on('uncaughtException', function (err) {
  console.error(err);
  console.error(err.stack);
});

const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, './');
const envPath = path.join(rootDir, (process.env.NODE_ENV === 'test') ? '.env.test' : '.env');

if (fs.existsSync(envPath)) {
  console.log(`> read ${envPath}`);
  const result = require('dotenv').config({ path: envPath });
  if (result.error) {
    throw result.error;
  }
}

const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet');
const session = require('express-session');
const models = require('./app/models');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const passport = require('passport');
const methodOverride = require('method-override');
const csrf = require('csurf');

const store = new SequelizeStore({ db: models.sequelize });
store.sync();

const app = express();
app.use(helmet());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ 
  secret: process.env.SESSION_SECRET, 
  store: store,
  resave: false,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(csrf());
app.use((req, res, next) => {
  const csrfToken = req.csrfToken();
  res.locals.csrfToken = csrfToken;
  res.locals.csrf = () => { 
    return `<input type="hidden" name="_csrf" value="${csrfToken}" />`;
  };
  res.locals.method = (value) => {
    const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
    if(!methods.includes(value.toUpperCase())) {
      throw new Error(`指定できるのはHTTPメソッド(${methods.join(',')})です: ${value}`);
    }
    return `<input type="hidden" name="_method" value="${value}" />`;
  };
  next();
});

// @see http://expressjs.com/en/resources/middleware/method-override.html
app.use(methodOverride(function (req, _res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    const method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

app.use(methodOverride('_method', { methods: ['GET', 'POST'] })); // for GET Paramter

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
app.use('/', indexRouter);
app.use('/', authRouter);
//app.use('/users', ensureAuthenticated, usersRouter);

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, _next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
