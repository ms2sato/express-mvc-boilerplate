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
const i18n = require('i18n');
const { flash } = require('express-flash-message');

i18n.configure({
  locales: ['ja', 'en'],
  directory: path.join(__dirname, 'config', 'locales'),
  objectNotation: true
});

const store = new SequelizeStore({ db: models.sequelize });
store.sync();

const overridableMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

const app = express();
app.use(helmet());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
const walk = require('pug-walk');
app.use((req, res, next) => {
  res.locals.plugins = [
    {
      preCodeGen: (ast, _options) => {
        return walk(ast, null, (node, replace) => {
          if (node.name === '_method') {
            if (node.attrs.length !== 1) {
              throw new Error('method() の引数は一つだけです。');
            }
            const method = node.attrs[0].name;
            if (!overridableMethods.includes(method.toUpperCase())) {
              throw new Error(`methodの引数は${overridableMethods.join(',')}のうちの一つです`);
            }

            replace({
              ...node, type: 'Tag', name: 'input', attrs: [
                { name: 'type', val: '"hidden"', mustEscape: true },
                { name: 'name', val: '"_method"', mustEscape: true },
                { name: 'value', val: `"${method}"`, mustEscape: true }
              ]
            });
          }

          if (node.name === '_csrf') {
            replace({
              ...node, type: 'Tag', name: 'input', attrs: [
                { name: 'type', val: '"hidden"', mustEscape: true },
                { name: 'name', val: '"_csrf"', mustEscape: true },
                { name: 'value', val: 'csrfToken', mustEscape: false }
              ]
            });
          }
        });
      },
    },
  ];
  next();
});

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
app.use(i18n.init);

// @see http://expressjs.com/en/resources/middleware/method-override.html
app.use(methodOverride(function (req, _res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    const method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

app.use(methodOverride('_method', { methods: ['GET', 'POST'] })); // for GET Parameter

app.use(csrf());
app.use((req, res, next) => {
  const csrfToken = req.csrfToken();
  res.locals.csrfToken = csrfToken;
  next();
});

app.use(flash({ sessionKeyName: '_flashMessage' }));
app.use(async (req, res, next) => {
  res.locals.flashMessages = {
    info: await req.consumeFlash('info'),
    alert: await req.consumeFlash('alert')
  };
  next();
});


const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
app.use('/', indexRouter);
app.use('/', authRouter);

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
