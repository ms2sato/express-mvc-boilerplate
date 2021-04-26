const { Route } = require('../lib/route');

const route = new Route();

function forceLogin(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
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

// /adminのURL階層の作成。ログインチェックが有効。
const adminRoute = route.sub('/admin', forceLogin);
adminRoute.get('/test', 'users_controller@edit');

module.exports = route.router;
