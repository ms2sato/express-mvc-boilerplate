const Controller = require('../controller');
const models = require('../../models');

class MembersController extends Controller {
  // GET /
  async index(req, res) {
    const team = req.team;
    const members = await team.getMembers({ include: 'user' });
    const users = await models.User.findAll();
    res.render('manager/members/index', { team, members, users });
  }

  // POST /
  async store(req, res) {
    const team = req.team;
    await team.createMember({ userId: req.body.userId });
    res.redirect(`/manager/teams/${team.id}/members/`);
  }

  // DELETE /:id
  async destroy(req, res) {
    //TODO: 削除
    const team = req.team;
    res.redirect(`/manager/teams/${team.id}/members/`);
  }
}

module.exports = MembersController;