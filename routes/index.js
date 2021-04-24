const { Route } = require('../lib/route');

const route = new Route();

// function style
route.get('/', function (req, res, _next) {
  res.render('index', { title: 'Express', user: req.user });
});

// single style
route.get('/user/edit', 'users_controller@edit');
route.put('/user', 'users_controller@update');

// resource style
route.resource('examples', 'examples_controller');

module.exports = route.router;
