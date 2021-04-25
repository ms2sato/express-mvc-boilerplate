const { Route } = require('../lib/route');

const route = new Route();

function ensureAuthenticated(req, res, next) {
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
route.get('/user/edit', ensureAuthenticated, 'users_controller@edit');
route.put('/user', ensureAuthenticated, 'users_controller@update');

// resource style
route.resource('examples', 'examples_controller');

module.exports = route.router;
