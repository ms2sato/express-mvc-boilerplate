const debug = require('../../lib/logger').extend('comments_controller');

const Controller = require('./controller');
const models = require('../models');
const { ValidationError } = require('sequelize');

class CommentsController extends Controller {
  // POST /
  async store(req, res) {
    debug(req.params);
    debug(req.body);

    // TODO: ログインしていなければ投稿できない？
    const task = await models.Task.findByPk(req.params.task);
    if (!task) {
      throw new Error('task not found');
    }

    try {

      if (req.body.finished) {
        await task.finish(req.body.message, req.user);
        await req.flash('info', '完了報告しました');
      } else {
        const fields = ['kind', 'message', 'taskId', 'creatorId'];
        await models.Comment.create(
          { ...req.body, taskId: task.id, creatorId: req.user.id },
          { fields }
        );
        await req.flash('info', 'コメントしました');
      }
      res.redirect(`/tasks/${task.id}`);

    } catch (err) {
      if (err instanceof ValidationError) {
        const team = await task.getTeam();
        const comments = await task.getComments({ include: 'creator' });
        res.render(`tasks/show`, { task, team, comments, err: err });
      } else {
        throw err;
      }
    }
  }

  // DELETE /:id
  destroy(req, res) {
    debug(req.params);
    // TODO: 削除
    res.redirect('/comments/');
  }
}

module.exports = CommentsController;