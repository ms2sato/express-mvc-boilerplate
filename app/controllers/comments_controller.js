const debug = require('../../lib/logger').extend('examples_controller');

const Controller = require('./controller');

let index = 1;
const examples = [
  { id: index++, title: 'テスト1', body: 'テスト1' },
  { id: index++, title: 'テスト2', body: 'テスト2' },
];

class ExamplesController extends Controller {
  // GET /
  index(req, res) {
    debug(req.params);
    res.render('examples/index', { examples: examples });
  }

  // GET /create
  create(req, res) {
    debug(req.params);
    res.render('examples/create', { example: { title: '', body: '' } });
  }

  // POST /
  store(req, res) {
    // TODO: 新規作成
    res.redirect('/examples/');
  }

  // GET /:id
  show(req, res) {
    debug(req.params);
    const example = examples[req.params.example - 1];
    res.render('examples/show', { example });
  }

  // GET /:id/edit
  edit(req, res) {
    debug(req.params);
    const example = examples[req.params.example - 1];
    res.render('examples/edit', { example });
  }

  // PUT or PATCH /:id
  update(req, res) {
    debug(req.params);
    //const post = examples[req.params.post - 1];
    // TODO: 編集
    res.redirect(`/examples/${req.params.example}`);
  }

  // DELETE /:id
  destroy(req, res) {
    debug(req.params);
    // TODO: 削除
    res.redirect('/examples/');
  }
}

module.exports = ExamplesController;