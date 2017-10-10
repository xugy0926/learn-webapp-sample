var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  // 修改title的值为'my first WebApp'
  res.render('index', { title: 'my first WebApp' });
});

module.exports = router;
