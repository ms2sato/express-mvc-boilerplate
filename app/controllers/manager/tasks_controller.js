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

  // GET /:id/edit
  async edit(req, res) {
    const team = await this._team(req);
    const task = await this._task(team, req.params.task);
    res.render('manager/tasks/edit', { team, task });
  }

  // PUT or PATCH /:id
  async update(req, res) {
    const team = await this._team(req);
    const task = await this._task(team, req.params.task);

    try {
      task.set(req.body);
      await task.save({ fields: ['title', 'body'] });
      await req.flash('info', '更新しました');
      res.redirect(`/manager/teams/${team.id}/tasks/${task.id}/edit`);
    } catch (err) {
      if (err instanceof ValidationError) {
        res.render('manager/tasks/edit', { team, task, err: err });
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

  async _task(team, id) {
    const tasks = await team.getTasks({ where: { id }, limit: 1 } );
    if(tasks.length === 0) {
      throw new Error('task not found')
    }
    return tasks[0];
  }
}

module.exports = TasksController;