const Controller = require('./controller');

let index = 1;
const examples = [
  { id: index++, title: 'テスト1', body: 'テスト1' },
  { id: index++, title: 'テスト2', body: 'テスト2' },
];

class ExamplesController extends Controller {
  // GET /
  async index(req, res) {
    res.render('examples/index', { examples: examples });
  }

  // GET /create
  async create(req, res) {
    res.render('examples/create', { example: { title: '', body: '' } });
  }

  // POST /
  async store(req, res) {
    // TODO: 新規作成
    res.redirect('/examples/');
  }

  // GET /:id
  async show(req, res) {
    const example = examples[req.params.example - 1];
    res.render('examples/show', { example });
  }

  // GET /:id/edit
  async edit(req, res) {
    const example = examples[req.params.example - 1];
    res.render('examples/edit', { example });
  }

  // PUT or PATCH /:id
  async update(req, res) {
    //const post = examples[req.params.post - 1];
    // TODO: 編集
    res.redirect(`/examples/${req.params.example}`);
  }

  // DELETE /:id
  async destroy(req, res) {
    // TODO: 削除
    res.redirect('/examples/');
  }
}

module.exports = ExamplesController;