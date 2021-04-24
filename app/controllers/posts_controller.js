const debug = require('debug')('express-mvc:posts_controller');

const Controller = require('./controller');

let index = 1;
const posts = [
  { id: index++, title: 'テスト1', body: 'テスト1' },
  { id: index++, title: 'テスト2', body: 'テスト2' },
];

class PostsController extends Controller {
  // GET /
  index(req, res) {
    debug(req.params);
    res.render('posts/index', { posts: posts });
  }

  // GET /create
  create(req, res) {
    debug(req.params);
    res.render('posts/create', { post: { title: '', body: '' } });
  }

  // POST /
  store(req, res) {
    // TODO: 新規作成
    res.redirect('/posts/');
  }

  // GET /:id
  show(req, res) {
    debug(req.params);
    const post = posts[req.params.post - 1];
    res.render('posts/show', { post });
  }

  // GET /:id/edit
  edit(req, res) {
    debug(req.params);
    const post = posts[req.params.post - 1];
    res.render('posts/edit', { post });
  }

  // PUT or PATCH /:id
  update(req, res) {
    debug(req.params);
    //const post = posts[req.params.post - 1];
    // TODO: 編集
    res.redirect(`/posts/${req.params.post}`);
  }

  // DELETE /:id
  destroy(req, res) {
    debug(req.params);
    // TODO: 削除
    res.redirect('/posts/');
  }
}

module.exports = PostsController;