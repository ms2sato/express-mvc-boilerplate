const { Route } = require('../lib/route');

const route = new Route();

async function forceLogin(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  await req.flash('alert', 'ログインしてください');
  res.redirect('/login');
}

async function forceAdmin(req, res, next) {
  if (req.user.isAdmin()) {
    return next();
  }
  await req.flash('alert', 'アクセスできません');
  res.redirect('/');
}

// function style
route.get('/', function (req, res, _next) {
  res.render('index', { title: 'Express', user: req.user });
});

// single style
route.get('/user/edit', forceLogin, 'users_controller@edit');
route.put('/user', forceLogin, 'users_controller@update');

// resource style
route.resource('examples', 'examples_controller');

// /adminのURL階層の作成。ログインチェック、管理者チェックが有効。
const adminRoute = route.sub('/admin', forceLogin, forceAdmin);
adminRoute.resource('users', 'admin/users_controller');

module.exports = route.router;
