const debug = require('../../../lib/logger').extend('manager/teams_controller');

const Controller = require('../controller');
const models = require('../../models');

let index = 1;
const teams = [
  { id: index++, title: 'テスト1', body: 'テスト1' },
  { id: index++, title: 'テスト2', body: 'テスト2' },
];

class TeamsController extends Controller {
  // GET /
  index(req, res) {
    debug(req.params);
    res.render('manager/teams/index', { teams: teams });
  }

  // GET /create
  create(req, res) {
    debug(req.params);
    res.render('manager/teams/create', { team: { title: '', body: '' } });
  }

  // POST /
  store(req, res) {
    // TODO: 新規作成
    res.redirect('/manager/teams/');
  }

  // GET /:id
  async show(req, res) {
    const team = await this._team(req);
    const tasks = await team.getTasks({
      include: ['team', 'assignee'],
      where: {
        status: models.Task.activeStatuses()
      },
      order: [['status', 'DESC'], ['updatedAt', 'DESC']]
    });
    res.render('manager/teams/show', { team, tasks });
  }

  // GET /:id/edit
  edit(req, res) {
    debug(req.params);
    const team = teams[req.params.team - 1];
    res.render('manager/teams/edit', { team });
  }

  // PUT or PATCH /:id
  update(req, res) {
    debug(req.params);
    //const post = teams[req.params.post - 1];
    // TODO: 編集
    res.redirect(`/manager/teams/${req.params.team}`);
  }

  // DELETE /:id
  destroy(req, res) {
    debug(req.params);
    // TODO: 削除
    res.redirect('/manager/teams/');
  }

  async _team(req) {
    const team = await models.Team.findByPk(req.params.team);
    if (!team) {
      throw new Error('team not found');
    }
    return team;
  }
}

module.exports = TeamsController;