const debug = require('debug')('express-mvc:users_controller');

const Controller = require('./controller');

class UsersController extends Controller {
  edit(req, res) {
    debug(req.params);
    const user = req.user;
    res.render('users/edit', { user });
  }

  async update(req, res) {
    debug(req.body);

    const user = req.user;
    try {
      user.displayName = req.body.displayName;  
      await user.save();
      res.redirect(`/user/edit`);
    } catch (err) {
      res.render('users/edit', { user, errors: err.errors });
    }
  }
}

module.exports = UsersController;