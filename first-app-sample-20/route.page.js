var marked = require('marked');
var express = require('express');
var router = express.Router();
var config = require('./config');
var PostModel = require('./models/post');
var auth = require('./middlewares/auth');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

/* GET posts page. */
router.get('/posts', function(req, res, next) {
  res.render('posts', { title: '我的文章' });
});

/* GET posts create page. */
router.get('/posts/create', auth.adminRequired, function(req, res, next) {
  res.render('create');
});

/* GET posts edit page. */
router.get('/posts/edit', auth.adminRequired, function(req, res, next) {
  var id = req.query.id;

  res.render('edit', { id });
});

/* GET posts show page. */
router.get('/posts/show', function(req, res, next) {
  var id = req.query.id;

  PostModel.findOne({ _id: id }, function(err, post) {
    post.mkContent = marked(post.content);
    res.render('show', { post });
  });
});

/* GET signup page. */
router.get('/signup', function(req, res, next) {
  res.render('signup');
});

/* GET signin page. */
router.get('/signin', function (req, res, next) {
  res.render('signin');
});

/* GET signout */
router.get('/signout', function (req, res, next) {
  req.session.user = null;
  res.clearCookie(config.cookieName, { path: '/' });
  res.redirect('/');
});

module.exports = router;
