const debug = require('../../lib/logger').extend('users_controller');

const { ValidationError } = require('sequelize');
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
      await req.flash('info', '更新しました');
      res.redirect(`/user/edit`);
    } catch (err) {
      if(err instanceof ValidationError) {
        res.render('users/edit', { user, err: err });
      } else{
        throw err;
      }
    }
  }
}

module.exports = UsersController;