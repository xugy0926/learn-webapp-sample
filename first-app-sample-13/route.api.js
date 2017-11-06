var express = require('express');
var router = express.Router();
var PostModel = require('./models/post');

/* GET users lists. */
router.get('/users', function(req, res, next) {
  res.send('respond with a resource');
});

/* GET posts lists */
router.get('/posts', function(req, res, next) {
  PostModel.find({}, {}, function(err, posts) {
    if (err) {
      res.json({ success: false });
    } else {
      res.json({ success: true, postsList: posts });
    }
  });
});

/* GET one post */
router.get('/posts/one', function(req, res, next) {
  var id = req.query.id;

  PostModel.findOne({ _id: id }, function(err, post) {
    if (err) {
      res.json({ success: false });
    } else {
      res.json({ success: true, post });
    }
  });
});

/* POST create post */
router.post('/posts/create', function(req, res, next) {
  var title = req.body.title;
  var content = req.body.content;

  var post = new PostModel();
  post.title = title;
  post.content = content;
  post.save(function(err) {
    if (err) {
      res.json({ success: false });
    } else {
      res.json({ success: true });
    }
  });
});

/* POST edit post */
router.post('/posts/edit', function(req, res, next) {
  var id = req.body.id;
  var title = req.body.title;
  var content = req.body.content;

  PostModel.findOneAndUpdate({ _id: id }, { title, content }, function(err) {
    if (err) {
      res.json({ success: false });
    } else {
      res.json({ success: true });
    }
  });
});

module.exports = router;
