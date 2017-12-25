var config = require('../config');
var UserModel = require('../models/user');

function authUser(req, res, next) {
  res.locals.currentUser = null;

  if (req.session && req.session.user) {
    const user = req.session.user;
    res.locals.currentUser = user;
    next();
  } else {
    const authToken = req.signedCookies[config.cookieName] || '';

    if (authToken) {
      UserModel.findOne({ _id: authToken }, function(err, user) {
        if (err) {
          next();
        } else {
          user = user.toObject();
          user.isAdmin = user.loginname === config.admin;

          req.session.user = user;
          res.locals.currentUser = user;
          next();
        }
      });
    } else {
      next();
    }
  }
}

function adminRequired(req, res, next) {
  if (!req.session || !req.session.user) {
    let err = new Error('需要登录');
    err.status = 403;
    next(err);
    return;
  }

  if (!req.session.user.isAdmin) {
    let err = new Error('需要管理员权限');
    err.status = 403;
    next(err);
    return;
  }

  next();
}

module.exports = { authUser, adminRequired };
