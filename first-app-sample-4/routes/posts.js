var express = require('express');
var router = express.Router();

/* GET posts page. */
router.get('/', function(req, res, next) {
  res.render('posts', { title: 'posts', postsList: ['文章1', '文章2', '文章3'] });
});

module.exports = router;