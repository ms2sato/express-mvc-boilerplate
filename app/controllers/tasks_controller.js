const debug = require('../../lib/logger').extend('tasks_controller');

const Controller = require('./controller');
const models = require('../models');
const { ValidationError } = require('sequelize');

class TasksController extends Controller {
  // GET /
  async index(req, res) {
    debug(req.params);
    const tasks = await models.Task.findAll({ where: { assigneeId: req.user.id }, include: 'team' });
    res.render('tasks/index', { tasks: tasks });
  }

  // GET /create
  // create(req, res) {
  //   debug(req.params);
  //   res.render('tasks/create', { task: { title: '', body: '' } });
  // }

  // POST /
  // store(req, res) {
  //   // TODO: 新規作成
  //   res.redirect('/tasks/');
  // }

  // GET /:id
  async show(req, res) {
    debug(req.params);
    const task = await this._task(req);
    const team = await task.getTeam();
    const comments = await models.Comment.findAll({ where: { taskId: task.id }, include: 'creator' });

    res.render('tasks/show', { task, team, comments });
  }

  // GET /:id/edit
  async edit(req, res) {
    debug(req.params);
    const task = await this._task(req);
    res.render('tasks/edit', { task });
  }

  // PUT or PATCH /:id
  async update(req, res) {
    const task = await this._task(req);
    try {
      task.set(req.body);
      await task.save({ fields: ['title', 'body'] });
      await req.flash('info', '更新しました');
      res.redirect(`/tasks/${req.params.task}`);
    } catch (err) {
      if (err instanceof ValidationError) {
        res.render('tasks/edit', { task, err: err });
      } else {
        throw err;
      }
    }
  }

  // DELETE /:id
  destroy(req, res) {
    debug(req.params);
    // TODO: 削除
    res.redirect('/tasks/');
  }

  async finish(req, res) {
    const task = await this._task(req);

    try {
      await task.finish(req.body.message);
      await req.flash('info', '完了報告しました');
      res.redirect(`/tasks/${task.id}`);
    } catch (err) {
      if (err instanceof ValidationError) {
        res.render(`tasks/${task.id}`, { task, err: err });
      } else {
        throw err;
      }
    }
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