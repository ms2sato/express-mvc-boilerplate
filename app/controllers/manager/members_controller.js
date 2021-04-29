const Controller = require('../controller');
const models = require('../../models');

class MembersController extends Controller {
  // GET /
  async index(req, res) {
    const team = await this._team(req);
    const members = await team.getMembers({ include: 'user' });
    const users = await models.User.findAll();
    res.render('manager/members/index', { team, members, users });
  }

  // POST /
  async store(req, res) {
    const team = await this._team(req);
    await team.createMember({ userId: req.body.userId });
    res.redirect(`/manager/teams/${team.id}/members/`);
  }

  // DELETE /:id
  async destroy(req, res) {
    //TODO: 削除
    const team = this._team(req);
    res.redirect(`/manager/teams/${team.id}/members/`);
  }

  async _team(req) {
    const team = await models.Team.findByPk(req.params.team);
    if (!team) {
      throw new Error('team not found');
    }
    return team;
  }
}

module.exports = MembersController;