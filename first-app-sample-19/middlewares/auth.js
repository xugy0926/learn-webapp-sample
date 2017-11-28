var config = require('../config');
var UserModel = require('../models/user');

function authUser(req, res, next) {
  const authToken = req.signedCookies[config.cookieName] || '';
  res.locals.currentUser = null;

  if (authToken) {
    UserModel.findOne({ _id: authToken }, function(err, user) {
      if (err) {
        next();
      } else {
        res.locals.currentUser = user;
        next();
      }
    });
  } else {
    next();
  }
}

module.exports = { authUser };
