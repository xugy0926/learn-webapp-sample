
var errorHandle = function (err, next) {
  err.status = 500;
  next(err);
}

module.exports = errorHandle;