const Controller = require('./controller');
const models = require('../models');

class TasksController extends Controller {
  // GET /
  async index(req, res) {
    const tasks = await models.Task.findAll({ where: { assigneeId: req.user.id }, include: 'team' });
    res.render('tasks/index', { tasks: tasks });
  }

  // GET /:id
  async show(req, res) {
    const task = await this._task(req);
    const team = await task.getTeam();
    const comments = await task.getComments({ include: 'creator' });

    res.render('tasks/show', { task, team, comments });
  }

  // DELETE /:id
  destroy(req, res) {
    // TODO: 削除
    res.redirect('/tasks/');
  }

  async archive(req, res) {
    const task = await this._task(req);
    await task.archive();
    await req.flash('info', 'アーカイブしました');
    res.redirect(`/tasks/${task.id}`);
  }

  async _task(req) {
    const task = await models.Task.findByPk(req.params.task);
    if (!task) {
      throw new Error('task not found');
    }
    return task;
  }
}

module.exports = TasksController;