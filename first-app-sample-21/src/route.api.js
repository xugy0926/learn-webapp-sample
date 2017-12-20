var bcrypt = require('bcrypt');
var express = require('express');
var router = express.Router();
var PostModel = require('./models/post');
var UserModel = require('./models/user');
var config = require('./config');
var auth = require('./middlewares/auth');

/* GET users lists. */
router.get('/users', function(req, res, next) {
  res.send('respond with a resource');
});

/* GET posts lists */
router.get('/posts', function(req, res, next) {
  PostModel.find({}, {}, function(err, posts) {
    if (err) {
      next(err);
    } else {
      res.json({ postsList: posts });
    }
  });
});

/* GET one post */
router.get('/posts/:id', function(req, res, next) {
  var id = req.params.id;

  PostModel.findOne({ _id: id }, function(err, post) {
    if (err) {
      next(err);
    } else {
      res.json({ post });
    }
  });
});

/* POST create post */
router.post('/posts', auth.adminRequired, function (req, res, next) {
  var title = req.body.title;
  var content = req.body.content;

  var post = new PostModel();
  post.title = title;
  post.content = content;
  post.authorId = res.locals.currentUser._id;
  post.save(function(err, doc) {
    if (err) {
      next(err);
    } else {
      res.json({ post: doc });
    }
  });
});

/* PATCH edit post */
router.patch('/posts/:id', auth.adminRequired, function(req, res, next) {
  var id = req.params.id;
  var title = req.body.title;
  var content = req.body.content;

  PostModel.findOneAndUpdate({ _id: id }, { title, content }, function(err) {
    if (err) {
      next(err);
    } else {
      res.end();
    }
  });
});

/* POST signup user */
router.post('/signup', function(req, res, next) {
  var name = req.body.name;
  var pass = req.body.pass;
  var rePass = req.body.rePass;

  if (pass !== rePass) {
    return next(new Error('两次密码不对'));
  }

  var user = new UserModel();
  user.name = name;
  user.pass = bcrypt.hashSync(pass, 10);
  user.save(function(err) {
    if (err) {
      next(err);
    } else {
      res.end();
    }
  });
});

/* POST signin user */
router.post('/signin', function(req, res, next) {
  var name = req.body.name || '';
  var pass = req.body.pass || '';

  UserModel.findOne({ name }, function(err, user) {
    if (err || !user) {
      return next(new Error('找不到用户'));
    } else {
      var isOk = bcrypt.compareSync(pass, user.pass);
      if (!isOk) {
        return next(new Error('密码不对'));
      }

      var authToken = user._id;
      var opts = {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 30, // cookie 有效期30天
        signed: true,
        httpOnly: true
      };

      res.cookie(config.cookieName, authToken, opts);
      res.end();
    }
  });
});

module.exports = router;
