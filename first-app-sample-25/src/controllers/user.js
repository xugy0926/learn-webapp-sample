import bcrypt from 'bcrypt';
import PostModel from '../models/post';
import UserModel from '../models/user';
import config from '../config';
import jwt from 'jwt-simple';
import moment from 'moment';
import { sendActiveMail } from '../common/mail';
import utility from 'utility';

export const signup = function (req, res, next) {
  const { name, email, pass, rePass } = req.body;

  if (pass !== rePass) {
    return next(new Error('两次密码不对'));
  }

  const user = new UserModel();
  user.name = name;
  user.email = email;
  user.pass = bcrypt.hashSync(pass, 10);
  user.save(function (err) {
    if (err) {
      next(err);
    } else {
      sendActiveMail(
        email,
        utility.md5(user.email + user.pass),
        name
      );

      res.json({
        message: `欢迎加入${
          config.name
          }！我们已给您的注册邮箱发送了一封邮件, 请点击里面的链接来激活您的帐号。`
      });
    }
  });
};

export const signin = function (req, res, next) {
  const { name, pass } = req.body;

  UserModel.findOne({ name }, function (err, user) {
    if (err || !user) {
      return next(new Error('找不到用户'));
    } else {
      const isOk = bcrypt.compareSync(pass, user.pass);
      if (!isOk) {
        return next(new Error('密码不对'));
      }

      const token = jwt.encode(
        {
          _id: user._id,
          name: user.name,
          isAdmin: user.name === config.admin,
          exp: moment()
            .add('days', 30)
            .valueOf()
        },
        config.jwtSecret
      );

      const opts = {
        path: '/',
        maxAge: moment()
          .add('days', 30)
          .valueOf(),
        signed: true,
        httpOnly: true
      };

      res.cookie(config.cookieName, token, opts);
      res.json({ token });
    }
  });
};

export const more = function (req, res, next) {
  res.send('respond with a resource');
};

export const activeAccount = function (req, res, next) {
  const { key, name } = req.query;

  UserModel.findOne({ name }, function (err, user) {
    if (err || !user) {
      return next(new Error('找不到用户'));
    } else {

      const key2 = utility.md5(user.email + user.pass);
      if (key !== key2) {
        return next(new Error('激活失败'));
      }

      user.active = true;
      user.save();

      const token = jwt.encode(
        {
          _id: user._id,
          name: user.name,
          isAdmin: user.name === config.admin,
          active: user.active,
          exp: moment()
            .add('days', 30)
            .valueOf()
        },
        config.jwtSecret
      );

      const opts = {
        path: '/',
        maxAge: moment()
          .add('days', 30)
          .valueOf(),
        signed: true,
        httpOnly: true
      };

      res.cookie(config.cookieName, token, opts);
      res.send('active successed!');
    }
  });
};
