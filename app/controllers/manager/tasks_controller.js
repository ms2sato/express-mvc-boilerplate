const Controller = require('../controller');
const models = require('../../models');

class TasksController extends Controller {
  // // GET /
  // index(req, res) {
  //   debug(req.params);
  //   res.render('manager/tasks/index', { tasks: tasks });
  // }

  // // GET /create
  // create(req, res) {
  //   debug(req.params);
  //   res.render('manager/tasks/create', { task: { title: '', body: '' } });
  // }

  // POST /
  store(req, res) {
    // TODO: 新規作成
    res.redirect(`/tasks/${tasks[0].id}`);
  }

  // // GET /:id
  // show(req, res) {
  //   debug(req.params);
  //   const task = tasks[req.params.task - 1];
  //   res.render('manager/tasks/show', { task });
  // }

  // // GET /:id/edit
  // edit(req, res) {
  //   debug(req.params);
  //   const task = tasks[req.params.task - 1];
  //   res.render('manager/tasks/edit', { task });
  // }

  // // PUT or PATCH /:id
  // update(req, res) {
  //   debug(req.params);
  //   //const post = tasks[req.params.post - 1];
  //   // TODO: 編集
  //   res.redirect(`/manager/tasks/${req.params.task}`);
  // }

  // // DELETE /:id
  // destroy(req, res) {
  //   debug(req.params);
  //   // TODO: 削除
  //   res.redirect('/manager/tasks/');
  // }
}

module.exports = TasksController;