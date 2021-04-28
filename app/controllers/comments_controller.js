const debug = require('../../lib/logger').extend('comments_controller');

const Controller = require('./controller');
const models = require('../models');

let index = 1;
const comments = [
  { id: index++, title: 'テスト1', body: 'テスト1' },
  { id: index++, title: 'テスト2', body: 'テスト2' },
];

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

    // TODO: もっと良い書き方はありそう
    const comment = models.Comment.build(req.body);
    comment.taskId = task.id;
    comment.creatorId = req.user.id;
    comment.status = models.Comment.statuses.normal;
    await comment.save( { fields: ['status', 'message', 'taskId', 'creatorId'] });
    
    res.redirect(`/tasks/${task.id}`);
  }

  // GET /:id/edit
  edit(req, res) {
    debug(req.params);
    const comment = comments[req.params.comment - 1];
    res.render('comments/edit', { comment });
  }

  // PUT or PATCH /:id
  update(req, res) {
    debug(req.params);
    //const post = comments[req.params.post - 1];
    // TODO: 編集
    res.redirect(`/comments/${req.params.comment}`);
  }

  // DELETE /:id
  destroy(req, res) {
    debug(req.params);
    // TODO: 削除
    res.redirect('/comments/');
  }
}

module.exports = CommentsController;