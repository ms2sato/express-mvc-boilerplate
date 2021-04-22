const { Route } = require('../lib/route')

const route = new Route();

route.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', user: req.user });
});

route.get('/posts', 'posts_controller@index');
route.get('/posts/:id', 'posts_controller@show');

module.exports = route.router;
