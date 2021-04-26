const debug = require('../../../lib/logger').extend('manager/members_controller');

const Controller = require('../controller');

let index = 1;
const members = [
  { id: index++, title: 'テスト1', body: 'テスト1' },
  { id: index++, title: 'テスト2', body: 'テスト2' },
];

class MembersController extends Controller {
  // GET /
  index(req, res) {
    debug(req.params);
    res.render('manager/members/index', { members: members });
  }

  // GET /create
  create(req, res) {
    debug(req.params);
    res.render('manager/members/create', { member: { title: '', body: '' } });
  }

  // POST /
  store(req, res) {
    // TODO: 新規作成
    res.redirect('/manager/members/');
  }

  // GET /:id
  show(req, res) {
    debug(req.params);
    const member = members[req.params.member - 1];
    res.render('manager/members/show', { member });
  }

  // GET /:id/edit
  edit(req, res) {
    debug(req.params);
    const member = members[req.params.member - 1];
    res.render('manager/members/edit', { member });
  }

  // PUT or PATCH /:id
  update(req, res) {
    debug(req.params);
    //const post = members[req.params.post - 1];
    // TODO: 編集
    res.redirect(`/manager/members/${req.params.member}`);
  }

  // DELETE /:id
  destroy(req, res) {
    debug(req.params);
    // TODO: 削除
    res.redirect('/manager/members/');
  }
}

module.exports = MembersController;