const debug = require('../../lib/logger').extend('tasks_controller');

const Controller = require('./controller');

let index = 1;
const tasks = [
  { id: index++, title: 'テスト1', body: 'テスト1' },
  { id: index++, title: 'テスト2', body: 'テスト2' },
];

class TasksController extends Controller {
  // GET /
  index(req, res) {
    debug(req.params);
    res.render('tasks/index', { tasks: tasks });
  }

  // GET /create
  create(req, res) {
    debug(req.params);
    res.render('tasks/create', { task: { title: '', body: '' } });
  }

  // POST /
  store(req, res) {
    // TODO: 新規作成
    res.redirect('/tasks/');
  }

  // GET /:id
  show(req, res) {
    debug(req.params);
    const task = tasks[req.params.task - 1];
    const team = { id: 1, name: 'チーム1' };
    res.render('tasks/show', { task, team });
  }

  // GET /:id/edit
  edit(req, res) {
    debug(req.params);
    const task = tasks[req.params.task - 1];
    res.render('tasks/edit', { task });
  }

  // PUT or PATCH /:id
  update(req, res) {
    debug(req.params);
    //const post = tasks[req.params.post - 1];
    // TODO: 編集
    res.redirect(`/tasks/${req.params.task}`);
  }

  // DELETE /:id
  destroy(req, res) {
    debug(req.params);
    // TODO: 削除
    res.redirect('/tasks/');
  }

  finish(req, res) {
    debug(req.params);
    // TODO: 完了
    res.redirect('/tasks/');
  }
}

module.exports = TasksController;