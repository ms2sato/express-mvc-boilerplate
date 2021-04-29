const Controller = require('../controller');
const models = require('../../models');
const { ValidationError } = require('sequelize');

class TasksController extends Controller {
  // GET /create
  async create(req, res) {
    const team = await this._team(req);
    const task = models.Task.build();
    res.render('manager/tasks/create', { team, task });
  }

  // POST /
  async store(req, res) {
    const team = await this._team(req);
    const task = models.Task.build({ ...req.body, teamId: team.id, creatorId: req.user.id });    
    try {
      await task.save({ fields: ['title', 'body', 'assigneeId', 'teamId', 'status', 'creatorId'] });
      await req.flash('info', '新規タスクを作成しました');
      res.redirect(`/manager/teams/${team.id}`);
    } catch (err) {
      if (err instanceof ValidationError) {
        res.render('manager/tasks/create', { team, task, err: err });
      } else {
        throw err;
      }
    }
  }

  async _team(req) {
    const team = await models.Team.findByPk(req.params.team);
    if (!team) {
      throw new Error('team not found');
    }
    return team;
  }
}

module.exports = TasksController;