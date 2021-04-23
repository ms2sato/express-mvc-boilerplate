const { Route } = require('../lib/route');

const route = new Route();

// function style
route.get('/', function (req, res, _next) {
  res.render('index', { title: 'Express', user: req.user });
});

// single style
// route.get('/posts', 'posts_controller@index');
// route.get('/posts/:id', 'posts_controller@show');

// resource style
route.resource('posts', 'posts_controller');

module.exports = route.router;
