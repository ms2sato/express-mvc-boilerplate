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
    if(!task) {
      throw new Error('task not found');
    }

    try {

      if(req.body.finished) {
        await task.finish(req.body.message, req.user);
        await req.flash('info', '完了報告しました');
      } else {
        // TODO: もっと良い書き方はありそう
        const comment = models.Comment.build(req.body);
        comment.taskId = task.id;
        comment.creatorId = req.user.id;
        comment.status = models.Comment.statuses.normal;
        await comment.save( { fields: ['status', 'message', 'taskId', 'creatorId'] });
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