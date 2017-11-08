var config = require('../config');
var UserModel = require('../models/user');

function authUser(req, res, next) {
  const authToken = req.signedCookies[config.cookieName] || '';
  res.locals.currentUser = null;

  if (authToken) {
    const auth = authToken.split('$$$$');
    const userId = auth[0];
    if (userId) {
      UserModel.findOne({ _id: userId }, function(err, user) {
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
  } else {
    next();
  }
}

module.exports = { authUser };
