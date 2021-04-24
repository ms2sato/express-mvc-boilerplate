const debug = require('debug')('express-mvc:users_controller');

const Controller = require('./controller');

class UsersController extends Controller {
  // GET /:id/edit
  edit(req, res) {
    debug(req.params);
    const user = req.user;
    res.render('users/edit', { user });
  }

  // PUT or PATCH /:id
  async update(req, res) {
    debug(req.params);

    const user = req.user;
    try {
      user.displayName = req.body.displayName;  
      await user.save();
      res.redirect(`/user/edit`);
    } catch (e) {
      console.log(e.message);
      res.render('users/edit', { user });
    }
  }
}

module.exports = UsersController;