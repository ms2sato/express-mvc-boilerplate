const Controller = require('./controller')

class PostsController extends Controller {
  // GET /
  index(req, res) {
    res.redirect('/')
  }

  // GET /create
  create(req, res) {

  }

  // POST /
  store(req, res) {

  }

  // GET /:id
  show(req, res) {
    console.log(req.params)
    res.redirect('/')
  }

  // GET /:id/edit
  edit(req, res) {

  }

  // PUT or PATCH /:id
  update(req, res) {

  }

  // DELETE /:id
  destroy(req, res) {

  }
}

module.exports = PostsController