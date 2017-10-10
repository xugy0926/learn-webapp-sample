var express = require('express');
var router = express.Router();

/* GET posts page. */
router.get('/', function(req, res, next) {
  res.render('posts', { title: 'posts' });
});

/* GET 获取postsList数据 */
router.get('/list', function(req, res, next) {
  res.json({postsList: ['文章1', '文章2', '文章3'] });
});

module.exports = router;