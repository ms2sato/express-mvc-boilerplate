const Controller = require('../controller');
const models = require('../../models');
const { ValidationError } = require('sequelize');

class TasksController extends Controller {
  // GET /create
  async create(req, res) {
    const team = req.team;
    const task = models.Task.build();
    const users = await team.getUsers({ order: [['id']] });
    res.render('manager/tasks/create', { team, task, users });
  }

  // POST /
  async store(req, res) {
    const team = req.team;
    const task = models.Task.build({ 
      ...req.body, 
      assigneeId: (req.body.assigneeId === '') ? null : req.body.assigneeId,
      teamId: team.id, 
      creatorId: req.user.id
    });
    try {
      await task.save({ fields: ['title', 'body', 'assigneeId', 'teamId', 'status', 'creatorId'] });
      await req.flash('info', '新規タスクを作成しました');
      res.redirect(`/manager/teams/${team.id}`);
    } catch (err) {
      if (err instanceof ValidationError) {
        const users = await team.getUsers({ order: [['id']] });
        res.render('manager/tasks/create', { team, task, users, err: err });
      } else {
        throw err;
      }
    }
  }

  // GET /:id/edit
  async edit(req, res) {
    const team = req.team;
    const task = await this._task(team, req.params.task);
    const users = await team.getUsers({ order: [['id']] });

    res.render('manager/tasks/edit', { team, task, users });
  }

  // PUT or PATCH /:id
  async update(req, res) {
    const team = req.team;
    const task = await this._task(team, req.params.task);

    try {
      task.set(req.body);
      task.assigneeId = (req.body.assigneeId === '') ? null : req.body.assigneeId;
      await task.save({ fields: ['title', 'body', 'assigneeId'] });
      await req.flash('info', '更新しました');
      res.redirect(`/manager/teams/${team.id}/tasks/${task.id}/edit`);
    } catch (err) {
      if (err instanceof ValidationError) {
        const users = await team.getUsers({ order: [['id']] });
        res.render('manager/tasks/edit', { team, task, users, err: err });
      } else {
        throw err;
      }
    }
  }

  // DELETE /:id
  destroy(req, res) {
    // TODO: 削除
    res.redirect('/tasks/');
  }

  async archive(req, res) {
    const team = req.team;
    const task = await this._task(team, req.params.task);
    await task.archive();
    await req.flash('info', 'アーカイブしました');
    res.redirect(`/tasks/${task.id}`);
  }

  async _task(team, id) {
    const tasks = await team.getTasks({ where: { id }, limit: 1 });
    if (tasks.length === 0) {
      throw new Error('task not found');
    }
    return tasks[0];
  }
}

module.exports = TasksController;